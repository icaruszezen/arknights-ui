import type { ComponentProps } from 'react'
import { DiamondIcon, StarIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'

export type RatingShape = 'star' | 'diamond'
export type RatingSize = 'sm' | 'md' | 'lg'

export interface RatingProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 星级。取整数部分，负数按 0 算。 */
  value: number
  /** 满级是几星。给了之后，没点亮的位置画成暗的；不给就只画 `value` 颗（游戏里的写法）。 */
  max?: number
  /**
   * 图形。同一处星级在不同位置会写成五角星或菱形。
   * @default 'star'
   */
  shape?: RatingShape
  /**
   * 图形的边长：0.75rem / 1rem / 1.5rem。
   * @default 'md'
   */
  size?: RatingSize
}

const shapes = { star: StarIcon, diamond: DiamondIcon }

const sizes: Record<RatingSize, string> = {
  sm: 'text-ark-caption',
  md: 'text-[1rem]',
  lg: 'text-ark-h2',
}

/**
 * 星级。稀有度用颜色和数量双重编码：这里是“数量”那一半，
 * 另一半通常是卡片底边的稀有度色条。任何一种单独拿掉，信息仍然完整。
 *
 * 读屏读到的是“5 星”这样一句话，可以用 `aria-label` 改写。
 */
export function Rating({
  value,
  max,
  shape = 'star',
  size = 'md',
  className,
  ...rest
}: RatingProps) {
  const total = Math.max(0, Math.floor(max ?? value))
  const lit = Math.min(Math.max(0, Math.floor(value)), total)
  const Shape = shapes[shape]
  return (
    <span
      data-ark="rating"
      role="img"
      aria-label={max === undefined ? `${lit} 星` : `${lit} / ${total} 星`}
      {...rest}
      className={cn(
        // 间距取图形宽度的 25%
        'box-border inline-flex items-center gap-[0.25em] align-middle',
        // 金色是固定语义。纸白面上金色对比度不够，和信号色文字一样按上下文压暗
        'text-[color:color-mix(in_srgb,var(--ark-color-tier-5)_var(--ark-signal-fg-mix),black)]',
        sizes[size],
        className,
      )}
    >
      {Array.from({ length: total }, (_, index) => index + 1).map(position => (
        <Shape
          key={position}
          className={cn('size-[1em] shrink-0', position > lit && 'opacity-25')}
        />
      ))}
    </span>
  )
}
