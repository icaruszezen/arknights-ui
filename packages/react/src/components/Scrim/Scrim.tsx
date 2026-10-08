import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type ScrimSide = 'bottom' | 'top' | 'left' | 'right'
export type ScrimVariant = 'solid' | 'soft'

export interface ScrimProps extends ComponentProps<'div'> {
  /**
   * 文字在图片的哪一侧，就压哪一侧。
   * @default 'bottom'
   */
  side?: ScrimSide
  /**
   * - `solid`：贴边一段是实黑，再渐隐到透明。官网情报屏底部压字的写法（实测），文字多时用
   * - `soft`：从 70% 的黑渐隐到透明。官网干员屏上半幅底缘的写法（实测），只是让文字从图里浮出来
   *
   * 上下默认 `solid`，左右默认 `soft`。
   */
  variant?: ScrimVariant
}

// solid 是官网实测的 linear-gradient(0deg, #000 5rem, transparent 20rem)，两个长度可以用变量调。
// soft 是 linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent)。
// 原先 soft 取的 50% 出自轮播库 Swiper 自带的侧影，不是官网的设计（2026-10-08 重读样式表）
const gradients: Record<ScrimVariant, Record<ScrimSide, string>> = {
  solid: {
    bottom:
      'bg-[linear-gradient(to_top,var(--ark-color-neutral-black)_var(--ark-scrim-solid,5rem),transparent_var(--ark-scrim-extent,20rem))]',
    top: 'bg-[linear-gradient(to_bottom,var(--ark-color-neutral-black)_var(--ark-scrim-solid,5rem),transparent_var(--ark-scrim-extent,20rem))]',
    left: 'bg-[linear-gradient(to_right,var(--ark-color-neutral-black)_var(--ark-scrim-solid,5rem),transparent_var(--ark-scrim-extent,20rem))]',
    right:
      'bg-[linear-gradient(to_left,var(--ark-color-neutral-black)_var(--ark-scrim-solid,5rem),transparent_var(--ark-scrim-extent,20rem))]',
  },
  soft: {
    bottom: 'bg-linear-to-t from-ark-neutral-black/70 to-transparent',
    top: 'bg-linear-to-b from-ark-neutral-black/70 to-transparent',
    left: 'bg-linear-to-r from-ark-neutral-black/70 to-transparent',
    right: 'bg-linear-to-l from-ark-neutral-black/70 to-transparent',
  },
}

/**
 * 图上压字的遮罩：只在文字所在的一侧加黑色到透明的渐变，图片其余部分保持原样，
 * 而不是给整张图蒙一层半透明的黑。
 *
 * 默认铺满父元素（父元素需要是定位元素），用 `className` 可以只盖住一部分，如 `w-3/4`。
 * 两种用法：
 * - 不放内容：它是一层不接收点击的遮罩。它是定位元素，会盖在没有定位的兄弟元素上面，
 *   所以要么给它 `-z-1`，要么给文字加 `relative`。
 * - 把文字作为子元素放进来：它就是压在图上的文字容器，里面是深色上下文。
 *
 * `solid` 的两个长度由 `--ark-scrim-solid`（默认 5rem）和 `--ark-scrim-extent`（默认 20rem）决定。
 */
export function Scrim({
  side = 'bottom',
  variant = side === 'bottom' || side === 'top' ? 'solid' : 'soft',
  className,
  children,
  ...rest
}: ScrimProps) {
  const empty = children == null || children === false
  return (
    <div
      data-ark="scrim"
      data-ark-tone="dark"
      aria-hidden={empty ? true : undefined}
      {...rest}
      className={cn(
        'absolute inset-0 box-border text-ark-fg',
        empty && 'pointer-events-none',
        gradients[variant][side],
        className,
      )}
    >
      {children}
    </div>
  )
}
