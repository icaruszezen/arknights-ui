import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type StatSize = 'sm' | 'md' | 'lg'

export interface StatProps extends Omit<ComponentProps<'dl'>, 'children'> {
  /** 标签。英文会显示为窄体大写小字。 */
  label: ReactNode
  /**
   * 当前值。数字自动加千分位逗号，字符串原样输出。
   * 也可以放一个节点，比如 `<CountUp value={131} />`，它会原样渲染在主数值的位置。
   */
  value: ReactNode
  /** 上限。写成 `131/135`：当前值大而亮，分母小而灰。 */
  max?: number | string
  /** 单位，跟在数值后面。 */
  unit?: ReactNode
  /** 补前导零到几位，用于编号、序号（`01`、`0147`）。设置后不再加千分位。 */
  pad?: number
  /**
   * 主数值字号：1.5rem / 3rem / 3.75rem。
   * @default 'md'
   */
  size?: StatSize
  /**
   * - `vertical`：上标签、下数值（统计块）
   * - `horizontal`：左标签、右数值（属性表）
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'
  /**
   * 数值颜色。`signal` 用于计数这类需要点睛的数字。
   * @default 'default'
   */
  tone?: 'default' | 'signal'
}

const thousands = new Intl.NumberFormat('en-US')

/** 数字加千分位逗号；指定 `pad` 时改为补前导零。字符串原样返回。 */
export function formatStatValue(value: number | string, pad?: number): string {
  if (typeof value === 'string') return value
  if (pad === undefined) return thousands.format(value)
  return `${value < 0 ? '-' : ''}${String(Math.abs(value)).padStart(pad, '0')}`
}

const valueSize: Record<StatSize, string> = {
  sm: 'text-ark-h2',
  md: 'text-[3rem]',
  lg: 'text-ark-display',
}

// 分母与单位取主数值的 40–50%
const restSize: Record<StatSize, string> = {
  sm: 'text-ark-caption',
  md: 'text-ark-body-lg',
  lg: 'text-ark-h2',
}

/** 数字是主角：数据体、明显大于旁边的标签，带分母和单位。 */
export function Stat({
  label,
  value,
  max,
  unit,
  pad,
  size = 'md',
  orientation = 'vertical',
  tone = 'default',
  className,
  ...rest
}: StatProps) {
  const horizontal = orientation === 'horizontal'
  return (
    <dl
      data-ark="stat"
      {...rest}
      className={cn(
        'm-0 box-border grid',
        horizontal ? 'grid-cols-[1fr_auto] items-baseline gap-ark-4' : 'gap-ark-2',
        className,
      )}
    >
      {/* 文档写的是 gray-500，但它在石墨面板上对比度不够；这里用高一档的 muted */}
      <dt className="font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
        {label}
      </dt>
      <dd className="m-0 flex items-baseline font-ark-data leading-ark-solid">
        <b
          className={cn(
            'font-ark-bold',
            valueSize[size],
            tone === 'signal' ? 'text-ark-signal-fg' : 'text-ark-fg',
          )}
        >
          {typeof value === 'number' || typeof value === 'string'
            ? formatStatValue(value, pad)
            : value}
        </b>
        {max !== undefined && (
          <span className={cn('font-ark-regular text-ark-fg-muted', restSize[size])}>
            /{formatStatValue(max, pad)}
          </span>
        )}
        {unit != null && (
          <span className={cn('ml-ark-1 font-ark-regular text-ark-fg-muted', restSize[size])}>
            {unit}
          </span>
        )}
      </dd>
    </dl>
  )
}
