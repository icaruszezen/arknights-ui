import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import type { ProgressTone } from '../Progress'

export type RingProgressSize = 'sm' | 'md' | 'lg'

export interface RingProgressProps extends ComponentProps<'div'> {
  /** 当前值，会被限制在 `0`–`max` 之间。 */
  value: number
  /**
   * 上限。
   * @default 100
   */
  max?: number
  /**
   * 进度的颜色。等级环、经验这类用 `action`（黄）。
   * @default 'signal'
   */
  tone?: ProgressTone
  /**
   * 直径 3rem / 4.5rem / 6rem，线宽 4 / 5 / 6px。
   * @default 'md'
   */
  size?: RingProgressSize
  /** 数字旁边的小标签，如 `LV`。 */
  label?: ReactNode
  /**
   * 标签在数字的上面还是下面。干员卡片和详情页在上，主界面的等级在下。
   * @default 'above'
   */
  labelPosition?: 'above' | 'below'
  /** 环内压一块半透明黑的圆底。压在立绘、场景上时用，数字才读得清（干员卡片上的等级环）。 */
  filled?: boolean
  /** 居中的内容，通常是一个数字。它不一定等于进度：等级环中间写的是等级，环表示的是经验。 */
  children?: ReactNode
}

// stroke 是 viewBox（边长 100）里的线宽，换算回来分别是 4、5、6px
const sizes: Record<RingProgressSize, { box: string; stroke: number; value: string }> = {
  sm: { box: 'size-12', stroke: 400 / 48, value: 'text-ark-body' },
  md: { box: 'size-18', stroke: 500 / 72, value: 'text-ark-h2' },
  lg: { box: 'size-24', stroke: 600 / 96, value: 'text-ark-h1' },
}

const fill: Record<ProgressTone, string> = {
  signal: 'stroke-ark-signal',
  action: 'stroke-ark-signal-action',
  neutral: 'stroke-ark-fg',
}

/**
 * 环形进度：等级这类“圆满”的概念用环来表示，数字居中。
 * 起点在 12 点方向，顺时针走，端点是平的。它是整套界面里少数允许出现圆形的地方。
 *
 * 需要可访问名称：请传 `aria-label` 或 `aria-labelledby`，它们会交给里面的进度环。
 */
export function RingProgress({
  value,
  max = 100,
  tone = 'signal',
  size = 'md',
  label,
  labelPosition = 'above',
  filled = false,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: RingProgressProps) {
  const { clamped, percent } = clampProgress(value, max)
  const { box, stroke, value: valueSize } = sizes[size]
  const radius = 50 - stroke / 2
  return (
    <div
      data-ark="ring-progress"
      {...rest}
      className={cn(
        'relative box-border inline-grid shrink-0 place-items-center text-ark-fg',
        box,
        className,
      )}
    >
      {/* progressbar 的子内容对读屏不可见，所以环与中间的数字是兄弟节点 */}
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        className="absolute inset-0"
      >
        {/* 圆的起点在 3 点方向，转 -90° 挪到 12 点 */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          fill="none"
          className="block size-full -rotate-90"
        >
          {filled && <circle cx="50" cy="50" r={radius} className="fill-ark-neutral-black/60" />}
          <circle cx="50" cy="50" r={radius} strokeWidth={stroke} className="stroke-ark-fg/25" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={stroke}
            // 把周长归一成 100，虚线的偏移量就是没走完的百分比
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 - percent}
            className={cn(
              'transition-[stroke-dashoffset] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none',
              fill[tone],
            )}
          />
        </svg>
      </div>
      {(label != null || children != null) && (
        <div
          className={cn(
            'relative flex items-center gap-0.5 leading-ark-solid',
            // DOM 里标签始终在前；放到下面时只调视觉顺序
            labelPosition === 'below' ? 'flex-col-reverse' : 'flex-col',
          )}
        >
          {label != null && (
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {label}
            </span>
          )}
          {children != null && (
            <span className={cn('font-ark-data font-ark-bold', valueSize)}>{children}</span>
          )}
        </div>
      )}
    </div>
  )
}
