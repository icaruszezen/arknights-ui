import { type ComponentProps, type ReactNode, useId } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import { Progress } from '../Progress'

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
   * 状态文字，数据体大写，如 `LOADING ASSETS`。传 `null` 可以去掉，此时请给 `aria-label`。
   * @default 'LOADING'
   */
  children?: ReactNode
}

/**
 * 短加载：一条细进度条，加百分比和英文状态文字；不知道进度时换成旋转指示和闪烁的光标。
 * 长加载应当铺满内容（插画、提示），而不是让人盯着一个进度条。
 *
 * 状态文字同时是进度的可访问名称。旋转和闪烁在“减少动效”下停住。
 */
export function Loading({
  value,
  max = 100,
  cursor = value === undefined,
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

  const status = hasStatus && (
    <span
      id={statusId}
      className="font-ark-data text-ark-caption leading-ark-solid font-ark-regular text-ark-fg-muted uppercase"
    >
      {children}
      {cursor && (
        // 光标 1s step-end：没有缓动，是“机器在工作”而不是“东西在飘”
        <span
          aria-hidden="true"
          className="ml-[0.25em] inline-block h-[1em] w-[0.5em] bg-current align-[-0.125em] motion-safe:animate-ark-blink"
        />
      )}
    </span>
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
        {status}
      </div>
    )
  }

  const { percent } = clampProgress(value, max)
  return (
    <div
      data-ark="loading"
      {...rest}
      className={cn('box-border grid w-full gap-ark-2 text-ark-fg', className)}
    >
      <Progress value={value} max={max} {...labelling} />
      <div className="flex items-baseline justify-between gap-ark-4">
        {status}
        {/* 百分比已经在进度条的 aria-valuenow 里，不必再读一遍 */}
        <span
          aria-hidden="true"
          className="ml-auto font-ark-data text-ark-caption leading-ark-solid font-ark-regular"
        >
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  )
}
