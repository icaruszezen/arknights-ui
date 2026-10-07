import type { ComponentProps, ReactNode } from 'react'
import { CostIcon } from '../../internal/icons'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Progress } from '../Progress'
import { formatStatValue } from '../Stat'

export interface CostMeterProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前费用。 */
  value: number
  /** 下一点费用回复到哪了，0 到 1。给了就在底板下缘画一条 4px 的细条。 */
  progress?: number
  /** 数字前面的图标，默认是菱形里一个 C。它对读屏隐藏，含义由 `label` 给出。 */
  icon?: ReactNode
  /**
   * 这个数字是什么。只给读屏：画面上由图标表达。
   * @default '费用'
   */
  label?: ReactNode
  /** 剩余可部署数，写在下面单独的一条深色带里。 */
  deployable?: number
  /**
   * 剩余可部署数前面的文字，冒号写在里面。
   * @default '剩余可放置角色：'
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
 * 是顶部战况数字的 2 倍。前面是费用的图标，底板下缘的细条表示下一点费用的回复进度，
 * 再下面一条深色带写剩余可部署数。
 *
 * 底板是半透明黑的直角矩形，贴着画面的右边。定位交给使用方（通常是 `absolute right-0 bottom-*`）。
 */
export function CostMeter({
  value,
  progress,
  icon,
  label = '费用',
  deployable,
  deployableLabel = '剩余可放置角色：',
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
        'box-border inline-grid min-w-40 font-ark-cjk-sans text-ark-fg',
        brighterMuted,
        className,
      )}
    >
      {/* 2.625rem 高：实机的底板折到 1280 宽约 42px */}
      <div className="box-border flex h-[2.625rem] items-center justify-end gap-ark-3 bg-ark-neutral-black/65 pr-ark-4 pl-ark-5">
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon ?? <CostIcon />}
        </span>
        <span className="sr-only">{label}</span>
        <b className="font-ark-data text-ark-h1 leading-ark-solid font-ark-regular tabular-nums">
          {formatStatValue(value)}
        </b>
      </div>
      {progress !== undefined && (
        <Progress
          aria-label={progressLabel}
          variant="thick"
          tone="neutral"
          value={progress}
          max={1}
          className="h-1"
        />
      )}
      {deployable !== undefined && (
        <p className="m-0 box-border flex h-[1.875rem] items-center justify-end bg-ark-neutral-black/65 px-ark-3 text-ark-label leading-ark-solid whitespace-nowrap">
          {deployableLabel}
          <b className="font-ark-data font-ark-regular">{formatStatValue(deployable)}</b>
        </p>
      )}
    </div>
  )
}
