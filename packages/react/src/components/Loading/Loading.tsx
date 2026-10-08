import { type ComponentProps, type ReactNode, useId } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'

export interface LoadingProps extends ComponentProps<'div'> {
  /**
   * 当前进度。给了就是细进度条加百分比；不给就是旋转指示加闪烁光标，表示“不知道还要多久”。
   */
  value?: number
  /**
   * 上限。
   * @default 100
   */
  max?: number
  /** 状态文字后面的闪烁光标。默认只在没有 `value` 时显示。 */
  cursor?: boolean
  /**
   * 进度条下面靠右的一行小字，官网写的是品牌名和网址。只在有 `value` 时显示，对读屏隐藏。
   */
  aside?: ReactNode
  /**
   * 状态文字，数据体大写，如 `LOADING ASSETS`。传 `null` 可以去掉，此时请给 `aria-label`。
   * @default 'LOADING'
   */
  children?: ReactNode
}

/**
 * 短加载。有进度时照官网的加载屏排（实测）：一条 2px 的灰线，两端各一个 6px 的方块，
 * 信号色的进度段 6px 高、压在线上；下面一行粗体的数据体，写“状态文字 - 百分比”。
 * 不知道进度时换成旋转指示和闪烁的光标。
 * 长加载应当铺满内容（插画、提示），而不是让人盯着一个进度条。
 *
 * 状态文字同时是进度的可访问名称。旋转和闪烁在“减少动效”下停住。
 */
export function Loading({
  value,
  max = 100,
  cursor = value === undefined,
  aside,
  className,
  children = 'LOADING',
  'aria-label': ariaLabel,
  ...rest
}: LoadingProps) {
  const statusId = useId()
  const hasStatus = children != null && children !== false
  // 名称优先用 aria-label，否则指向可见的状态文字
  const labelling =
    ariaLabel !== undefined
      ? { 'aria-label': ariaLabel }
      : hasStatus
        ? { 'aria-labelledby': statusId }
        : undefined

  const blink = cursor && (
    // 光标 1s 逐帧：没有缓动，是“机器在工作”而不是“东西在飘”
    <span
      aria-hidden="true"
      className="ml-[0.25em] inline-block h-[1em] w-[0.5em] bg-current align-[-0.125em] motion-safe:animate-ark-blink"
    />
  )

  if (value === undefined) {
    return (
      <div
        data-ark="loading"
        {...rest}
        className={cn('box-border inline-flex items-center gap-ark-2 text-ark-fg', className)}
      >
        {/* 没有 aria-valuenow 的 progressbar 表示进度未知 */}
        <span
          role="progressbar"
          {...labelling}
          className="box-border block size-4 shrink-0 rounded-full border-2 border-ark-rule border-t-ark-signal motion-safe:animate-ark-spin"
        />
        {hasStatus && (
          <span
            id={statusId}
            className="font-ark-data text-ark-caption leading-ark-solid font-ark-regular text-ark-fg-muted uppercase"
          >
            {children}
            {blink}
          </span>
        )}
      </div>
    )
  }

  const { clamped, percent } = clampProgress(value, max)
  return (
    <div
      data-ark="loading"
      {...rest}
      className={cn('box-border grid w-full gap-ark-3 text-ark-fg-muted', className)}
    >
      {/* 左右两条 6px 的边就是两端的方块；线在中间，进度段铺满整个高度 */}
      <div
        data-ark="loading-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        {...labelling}
        className="relative box-content flex h-[0.375rem] items-center border-x-[0.375rem] border-solid border-current"
      >
        <span aria-hidden="true" className="block h-0.5 w-full bg-current" />
        <span
          aria-hidden="true"
          data-ark="loading-fill"
          className="absolute inset-y-0 left-0 bg-ark-signal"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-ark-4 font-ark-data text-[1rem] leading-ark-solid">
        <span className="font-ark-bold uppercase">
          {hasStatus && <span id={statusId}>{children}</span>}
          {/* 百分比已经在进度条的 aria-valuenow 里，不必再读一遍 */}
          <span aria-hidden="true" data-ark="loading-percent">
            {hasStatus && ' - '}
            {Math.round(percent)}%
          </span>
          {blink}
        </span>
        {aside != null && aside !== false && (
          <span aria-hidden="true" className="font-ark-regular whitespace-nowrap">
            {aside}
          </span>
        )}
      </div>
    </div>
  )
}
