import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '../../utils/cn'

export type TicksOrientation = 'horizontal' | 'vertical'

export interface TicksProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * 方向。横向的基线在下、刻度朝上；竖向的基线在左、刻度朝右，
   * 并且需要父容器给出高度（如放在一行 flex 里）。
   * @default 'horizontal'
   */
  orientation?: TicksOrientation
  /**
   * 每隔几格画一条长刻度。
   * @default 5
   */
  major?: number
  /** 再画一条贯穿的基线，像一把尺。官网的刻度没有这条线。 */
  baseline?: boolean
}

const step = 'var(--ark-ticks-step, 0.5rem)'
const majorStep = `calc(${step} * var(--ark-ticks-major))`
// 一条 1px 的线之后空到下一格
const ticks = (angle: string, period: string) =>
  `repeating-linear-gradient(${angle}, currentColor 0 1px, transparent 1px ${period})`

// 三层背景，从上到下：基线、长刻度（满高）、短刻度（半高）。不要基线时第一层的尺寸是 0
const layers = (orientation: TicksOrientation, baseline: boolean): CSSProperties =>
  orientation === 'horizontal'
    ? {
        backgroundImage: [
          'linear-gradient(currentColor, currentColor)',
          ticks('90deg', majorStep),
          ticks('90deg', step),
        ].join(', '),
        backgroundSize: `${baseline ? '100% 1px' : '0 0'}, 100% 100%, 100% 50%`,
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundImage: [
          'linear-gradient(currentColor, currentColor)',
          ticks('180deg', majorStep),
          ticks('180deg', step),
        ].join(', '),
        backgroundSize: `${baseline ? '1px 100%' : '0 0'}, 100% 100%, 50% 100%`,
        backgroundPosition: 'left top',
        backgroundRepeat: 'no-repeat',
      }

/**
 * 刻度：等距的短线，每隔几格一条长的。铺满可用的宽度。
 * 出处是官网图集页的时间轴（实测）：长刻度 `1rem × 1px`，两格之间夹着一半长的分格，
 * 颜色是次要文字的灰，没有贯穿的基线。带数字、可以选的那种用 `Timeline`。
 *
 * 纯装饰，默认对读屏隐藏。格距由 `--ark-ticks-step` 决定（默认 0.5rem），
 * 长刻度的长度就是元素的高度（竖向是宽度），默认 1rem。
 */
export function Ticks({
  orientation = 'horizontal',
  major = 5,
  baseline = false,
  className,
  style,
  ...rest
}: TicksProps) {
  return (
    <div
      data-ark="ticks"
      aria-hidden="true"
      {...rest}
      className={cn(
        'box-border text-ark-fg-muted',
        orientation === 'vertical' ? 'w-4 self-stretch' : 'h-4 w-full',
        className,
      )}
      style={
        { '--ark-ticks-major': major, ...layers(orientation, baseline), ...style } as CSSProperties
      }
    />
  )
}
