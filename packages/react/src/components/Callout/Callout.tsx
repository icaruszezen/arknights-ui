import type { ComponentProps } from 'react'
import { colorTransition, focusRing, hitArea } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type CalloutDirection = 'up-right' | 'down-right' | 'up-left' | 'down-left'

export interface CalloutProps extends ComponentProps<'span'> {
  /**
   * 标签在方点的哪个方向。
   * @default 'up-right'
   */
  direction?: CalloutDirection
  /** 给了就把标签渲染成链接：标注点本身可以是导航入口。 */
  href?: string
  /** 链接的 `target`，仅在有 `href` 时有效。 */
  target?: string
  /** 链接的 `rel`，仅在有 `href` 时有效。 */
  rel?: string
}

// 根节点的盒子就是折线的外接矩形（4rem × 1.5rem）：方点压在折线起点那个角上，标签挂在终点那一侧。
// 根节点再按方向平移，让起点那个角落在使用方定位的坐标上——写 left / top 定的就是方点的位置。
const placements: Record<
  CalloutDirection,
  { root: string; leader: string; dot: string; label: string }
> = {
  'up-right': {
    root: '-translate-y-full',
    leader: '',
    dot: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    label: 'top-0 left-full -translate-y-1/2',
  },
  'down-right': {
    root: '',
    leader: '-scale-y-100',
    dot: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    label: 'bottom-0 left-full translate-y-1/2',
  },
  'up-left': {
    root: '-translate-x-full -translate-y-full',
    leader: '-scale-x-100',
    dot: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
    label: 'top-0 right-full -translate-y-1/2',
  },
  'down-left': {
    root: '-translate-x-full',
    leader: '-scale-100',
    dot: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    label: 'right-full bottom-0 translate-y-1/2',
  },
}

// 标签是固定的黑底信号色字，不随明暗上下文翻转
const labelBase =
  'absolute box-border bg-ark-neutral-black pr-ark-2 pl-ark-1 font-ark-latin-condensed text-ark-body-lg leading-ark-snug font-ark-medium whitespace-nowrap text-ark-signal'

/**
 * 在图片或场景上做标注：一个空心小方块（内嵌实心点）标出位置，
 * 引一条先水平后 45° 斜向的折线，末端是一个黑底信号色文字的小标签。
 *
 * 用 `className` 定位（如 `absolute left-1/3 top-1/2`），定的是方点中心的位置。
 * 标签挂在根节点的盒子之外，不占布局空间。
 */
export function Callout({
  direction = 'up-right',
  href,
  target,
  rel,
  className,
  children,
  ...rest
}: CalloutProps) {
  const placement = placements[direction]
  return (
    <span
      data-ark="callout"
      {...rest}
      className={cn('relative box-border inline-block h-6 w-16', placement.root, className)}
    >
      {/* 折线从方点的边缘出发：水平 → 45° → 水平。坐标落在半像素上，1px 的线才是实的 */}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 24"
        fill="none"
        className={cn('block size-full text-ark-fg/60', placement.leader)}
      >
        <polyline points="5,23.5 24,23.5 47,0.5 64,0.5" stroke="currentColor" />
      </svg>
      <span
        aria-hidden="true"
        className={cn(
          'absolute box-border grid size-2.5 place-items-center border border-ark-fg',
          placement.dot,
        )}
      >
        <span className="size-1 bg-ark-signal" />
      </span>
      {href !== undefined ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(
            labelBase,
            'no-underline hover:bg-ark-signal hover:text-ark-on-signal',
            colorTransition,
            focusRing,
            // 标签只有 28px 高，点击区撑到 44px
            hitArea,
            placement.label,
          )}
        >
          {children}
        </a>
      ) : (
        <span className={cn(labelBase, placement.label)}>{children}</span>
      )}
    </span>
  )
}
