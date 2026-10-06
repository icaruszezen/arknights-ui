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
}

const step = 'var(--ark-ticks-step, 0.5rem)'
const majorStep = `calc(${step} * var(--ark-ticks-major))`
// 一条 1px 的线之后空到下一格
const ticks = (angle: string, period: string) =>
  `repeating-linear-gradient(${angle}, currentColor 0 1px, transparent 1px ${period})`

// 三层背景，从上到下：基线、长刻度（满高）、短刻度（半高）
const layers: Record<TicksOrientation, CSSProperties> = {
  horizontal: {
    backgroundImage: [
      'linear-gradient(currentColor, currentColor)',
      ticks('90deg', majorStep),
      ticks('90deg', step),
    ].join(', '),
    backgroundSize: '100% 1px, 100% 100%, 100% 50%',
    backgroundPosition: 'left bottom',
    backgroundRepeat: 'no-repeat',
  },
  vertical: {
    backgroundImage: [
      'linear-gradient(currentColor, currentColor)',
      ticks('180deg', majorStep),
      ticks('180deg', step),
    ].join(', '),
    backgroundSize: '1px 100%, 100% 100%, 50% 100%',
    backgroundPosition: 'left top',
    backgroundRepeat: 'no-repeat',
  },
}

/**
 * 标尺刻度：一条基线，上面是等距的短刻度，每隔几格一条长的。铺满可用的宽度。
 * 和条码一样只在沉浸型页面里偶尔出现，强化“工程图”的语感。
 *
 * 纯装饰，默认对读屏隐藏。格距由 `--ark-ticks-step` 决定（默认 0.5rem），
 * 刻度的长度就是元素的高度（竖向是宽度），默认 8px。
 */
export function Ticks({
  orientation = 'horizontal',
  major = 5,
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
        orientation === 'vertical' ? 'w-2 self-stretch' : 'h-2 w-full',
        className,
      )}
      style={{ '--ark-ticks-major': major, ...layers[orientation], ...style } as CSSProperties}
    />
  )
}
