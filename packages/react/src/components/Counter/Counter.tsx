import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type CounterSize = 'sm' | 'md'

export interface CounterProps extends Omit<ComponentProps<'p'>, 'children'> {
  /** 当前是第几个。 */
  value: number
  /** 一共几个。编号永远带总数，不写一个孤零零的 `01`。 */
  total: number
  /**
   * 补前导零到几位。
   * @default 2
   */
  pad?: number
  /** 跟在后面的名称，通常是栏目的英文名（`INFORMATION`）。 */
  label?: ReactNode
  /**
   * - `md`：大数字 3.5rem，右侧上下两行（官网右栏的写法）
   * - `sm`：大数字 1.5rem，全部排成一行（轮播、列表项）
   * @default 'md'
   */
  size?: CounterSize
}

const bigSize: Record<CounterSize, string> = {
  sm: 'text-ark-h2',
  md: 'text-[3.5rem]',
}

const restSize: Record<CounterSize, string> = {
  sm: 'text-ark-label',
  md: 'text-[1rem]',
}

const restLayout: Record<CounterSize, string> = {
  sm: 'flex items-baseline gap-ark-2',
  md: 'grid gap-ark-3',
}

/**
 * 计数写作 `01 // 01 / 05`：一个大号数字，后面跟“当前 / 总数”。
 * 任何可以数的东西（分屏、轮播、列表项、章节）都可以这样标，它相当于纵向的面包屑。
 */
export function Counter({
  value,
  total,
  pad = 2,
  label,
  size = 'md',
  className,
  ...rest
}: CounterProps) {
  const current = formatStatValue(value, pad)
  return (
    <p
      data-ark="counter"
      {...rest}
      className={cn(
        'm-0 box-border inline-flex items-baseline-last gap-ark-3 text-ark-fg',
        className,
      )}
    >
      {/* 读屏只需要“第几个 / 共几个”：视觉上的写法会被念成两遍 01 和一串斜杠 */}
      <span className="sr-only">
        {value} / {total}
      </span>
      <b
        aria-hidden="true"
        className={cn(
          'font-ark-data leading-ark-solid font-ark-bold text-ark-signal-fg',
          bigSize[size],
        )}
      >
        {current}
      </b>
      <span className={restLayout[size]}>
        <span
          aria-hidden="true"
          className={cn(
            'font-ark-data leading-ark-solid font-ark-regular whitespace-nowrap',
            restSize[size],
          )}
        >
          {`// ${current} / ${formatStatValue(total, pad)}`}
        </span>
        {label != null && (
          // 文档取值是 Novecento Sans Wide DemiBold；token 里没有 600 这一档，用 Tailwind 自带的
          <span className="font-ark-latin-wide text-ark-caption leading-ark-solid font-semibold tracking-ark-wide whitespace-nowrap uppercase">
            {label}
          </span>
        )}
      </span>
    </p>
  )
}

export interface SerialProps extends Omit<ComponentProps<'span'>, 'children' | 'prefix'> {
  /** 前缀，如 `NO.`、`VOL.`。 */
  prefix?: ReactNode
  /** 序号。数字按 `pad` 补前导零，字符串原样输出。 */
  value: number | string
  /** 补前导零到几位（`NO.0147` 是 4）。不设就不补。 */
  pad?: number
}

/**
 * 序号：`NO.0147`、`VOL.69`。像设备铭牌上的编号，写的应当是真的编号。
 * 颜色继承自所在的文字。
 */
export function Serial({ prefix, value, pad, className, ...rest }: SerialProps) {
  return (
    <span
      data-ark="serial"
      {...rest}
      className={cn(
        'font-ark-data text-ark-label leading-ark-solid font-ark-regular whitespace-nowrap',
        className,
      )}
    >
      {prefix}
      {/* 序号不加千分位 */}
      {pad === undefined ? String(value) : formatStatValue(value, pad)}
    </span>
  )
}
