import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type ProgressVariant = 'thin' | 'thick' | 'meter'
export type ProgressTone = 'signal' | 'action' | 'neutral'

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前值，会被限制在 `0`–`max` 之间。 */
  value: number
  /**
   * 上限。
   * @default 100
   */
  max?: number
  /**
   * - `thin`：1px 轨道 + 4px 进度（轮播、加载）
   * - `thick`：0.5rem 高，可分段（经验、制造进度）
   * - `meter`：2px 相对值条，不读数字也能比较高低
   * @default 'thin'
   */
  variant?: ProgressVariant
  /** 进度的颜色。默认 `thin`、`thick` 用信号色，`meter` 用前景色。 */
  tone?: ProgressTone
  /** 用 2px 细缝切成几段。仅 `thick`。 */
  segments?: number
}

const track: Record<ProgressVariant, string> = {
  thin: 'h-(--ark-line-strong)',
  thick: 'h-2 bg-ark-neutral-ink-700',
  meter: 'h-0.5 bg-ark-fg/25',
}

const fill: Record<ProgressTone, string> = {
  signal: 'bg-ark-signal',
  action: 'bg-ark-signal-action',
  neutral: 'bg-ark-fg',
}

const defaultTone: Record<ProgressVariant, ProgressTone> = {
  thin: 'signal',
  thick: 'signal',
  meter: 'neutral',
}

/**
 * 进度条是直角的细条：没有圆头、渐变和流光动画。
 *
 * 需要可访问名称：请传 `aria-label` 或 `aria-labelledby`。
 */
export function Progress({
  value,
  max = 100,
  variant = 'thin',
  tone = defaultTone[variant],
  segments,
  className,
  style,
  ...rest
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0
  const segmented = variant === 'thick' && segments !== undefined && segments > 1
  return (
    <div
      data-ark="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      {...rest}
      className={cn('relative box-border w-full', track[variant], className)}
      style={
        segmented
          ? {
              // 每格末尾留 2px 透明缝；总宽多算 2px，最后一道缝落在条外
              maskImage: 'linear-gradient(90deg, #000 calc(100% - 2px), transparent 0)',
              maskSize: `calc((100% + 2px) / ${segments}) 100%`,
              ...style,
            }
          : style
      }
    >
      {variant === 'thin' && (
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ark-rule" />
      )}
      <span
        className={cn(
          'absolute inset-y-0 left-0 transition-[width] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none',
          fill[tone],
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
