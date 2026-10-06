import type { ComponentProps, ReactNode } from 'react'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Progress } from '../Progress'
import { formatStatValue } from '../Stat'

export interface CostMeterProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前费用。 */
  value: number
  /** 下一点费用回复到哪了，0 到 1。给了就在底板上方画一条 4px 的细条。 */
  progress?: number
  /**
   * 数字旁边的小标签。
   * @default 'COST'
   */
  label?: ReactNode
  /** 剩余可部署数，写在细条上方的一行小字里。 */
  deployable?: number
  /**
   * 剩余可部署数前面的文字。
   * @default '剩余可部署'
   */
  deployableLabel?: ReactNode
  /**
   * 回复进度条的名称，读屏会念出来。
   * @default '费用回复进度'
   */
  progressLabel?: string
}

/**
 * 作战界面右下角的费用：整屏最大的一个数字。费用决定下一步能做什么，所以它最大——
 * 约为其他 HUD 数字的 2.5 倍。上方的细条表示下一点费用的回复进度。
 *
 * 底板是半透明的黑，左边一条 45° 的斜边。定位交给使用方（通常是 `absolute right-0 bottom-0`）。
 */
export function CostMeter({
  value,
  progress,
  label = 'COST',
  deployable,
  deployableLabel = '剩余可部署',
  progressLabel = '费用回复进度',
  className,
  ...rest
}: CostMeterProps) {
  return (
    <div
      data-ark="cost-meter"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        // --ark-slant 等于底板的高度：45° 的斜边，水平偏移和高度一样
        'box-border inline-grid min-w-48 font-ark-cjk-sans text-ark-fg [--ark-slant:4.5rem]',
        brighterMuted,
        className,
      )}
    >
      {deployable !== undefined && (
        <p className="m-0 mb-ark-1 pr-ark-3 text-right text-ark-caption leading-ark-solid">
          {deployableLabel}{' '}
          <b className="font-ark-data font-ark-bold">{formatStatValue(deployable)}</b>
        </p>
      )}
      {progress !== undefined && (
        // 细条从底板上缘的起点画起，不伸到斜边切掉的那一段上面
        <Progress
          aria-label={progressLabel}
          variant="thick"
          tone="neutral"
          value={progress}
          max={1}
          className="ml-(--ark-slant) h-1 w-auto"
        />
      )}
      <div
        className={cn(
          'relative isolate box-border flex h-18 items-end justify-between gap-ark-4 pr-ark-3 pb-ark-2 pl-ark-6',
          // 底板画在 ::before 上再裁出斜边，根元素不裁
          'before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-black/65 before:ark-slant-l',
        )}
      >
        <span className="pb-ark-1 font-ark-latin-condensed text-ark-label leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
          {label}
        </span>
        <b className="font-ark-data text-ark-display leading-ark-solid font-ark-bold tabular-nums">
          {formatStatValue(value)}
        </b>
      </div>
    </div>
  )
}
