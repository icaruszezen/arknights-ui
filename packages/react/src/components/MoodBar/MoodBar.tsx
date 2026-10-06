import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'

export interface MoodBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前心情，会被限制在 `0`–`max` 之间。 */
  value: number
  /**
   * 上限。
   * @default 24
   */
  max?: number
  /**
   * 低于这个值就算“低”：细条转红并换成斜纹。
   * @default 上限的四分之一
   */
  threshold?: number
}

// 低的时候不只换颜色：填充从平涂变成 45° 斜纹，色觉障碍的用户也看得出来
const lowFill =
  'bg-[repeating-linear-gradient(-45deg,var(--ark-color-signal-danger)_0_0.1875rem,color-mix(in_srgb,var(--ark-color-signal-danger)_45%,black)_0.1875rem_0.375rem)]'

/**
 * 心情条：一条 4px 的直角细条，表示干员还能工作多久。低于阈值时转红。
 * 贴在头像底边（`OperatorAvatar` 的 `mood`），或者单独放在名字旁边。
 *
 * 红色是固定语义，不跟随可替换的信号色。默认的名称是“心情”，用 `aria-label` 改。
 */
export function MoodBar({
  value,
  max = 24,
  threshold = max / 4,
  className,
  ...rest
}: MoodBarProps) {
  const { clamped, percent } = clampProgress(value, max)
  const low = clamped < threshold
  return (
    <div
      data-ark="mood-bar"
      data-low={low ? '' : undefined}
      role="progressbar"
      aria-label="心情"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      {...rest}
      className={cn('relative box-border h-1 w-full bg-ark-neutral-black/60', className)}
    >
      <span
        className={cn(
          'absolute inset-y-0 left-0 transition-[width] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none',
          low ? lowFill : 'bg-ark-fg',
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
