import type { ComponentProps, CSSProperties } from 'react'
import { halftoneMask } from '../../internal/halftone'
import { cn } from '../../utils/cn'

export type PatternVariant = 'halftone' | 'dots' | 'grain' | 'hazard' | 'grid' | 'scanline'
export type PatternFade =
  | 'none'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

export interface PatternProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * 哪一种底纹。
   * - `halftone`：半调网点，压在角落或面板底部。由密到疏不是变淡，而是点越来越小
   * - `dots`：点阵，等大的小方点排成稀疏的方阵，放在角落当标记
   * - `grain`：噪点，整面铺、极淡，让大面积留白不发飘
   * - `hazard`：45° 警戒条纹，只做窄窄的一条边
   * - `grid`：方格加对角线的斜线网格，铺在最底层
   * - `scanline`：细密的水平线，叠在“投影”性质的面板上
   * @default 'halftone'
   */
  variant?: PatternVariant
  /**
   * 朝哪个方向渐疏。半调默认 `top-right`（左下最密），其余默认不渐隐。
   * 半调的 `none` 是一片等大的点。
   */
  fade?: PatternFade
  /** 仅 `hazard`：不用黄黑，改成同色深浅相间，颜色跟随文字。 */
  mono?: boolean
}

const shapes: Record<PatternVariant, string> = {
  halftone: 'ark-pattern-halftone',
  dots: 'ark-pattern-dots',
  grain: 'ark-pattern-grain',
  hazard: 'ark-pattern-hazard',
  grid: 'ark-pattern-grid',
  scanline: 'ark-pattern-scanline',
}

// 渐隐是叠在形状上的一张遮罩：从全显到 60% 处消失
const fades: Record<Exclude<PatternFade, 'none'>, string> = {
  top: '[--ark-pattern-fade:linear-gradient(to_top,#000,transparent_60%)]',
  right: '[--ark-pattern-fade:linear-gradient(to_right,#000,transparent_60%)]',
  bottom: '[--ark-pattern-fade:linear-gradient(to_bottom,#000,transparent_60%)]',
  left: '[--ark-pattern-fade:linear-gradient(to_left,#000,transparent_60%)]',
  'top-right': '[--ark-pattern-fade:linear-gradient(to_top_right,#000,transparent_60%)]',
  'top-left': '[--ark-pattern-fade:linear-gradient(to_top_left,#000,transparent_60%)]',
  'bottom-right': '[--ark-pattern-fade:linear-gradient(to_bottom_right,#000,transparent_60%)]',
  'bottom-left': '[--ark-pattern-fade:linear-gradient(to_bottom_left,#000,transparent_60%)]',
}

// 主题层里 --ark-pattern-halftone 的默认值就是这个方向
const HALFTONE_DEFAULT: PatternFade = 'top-right'

/**
 * 底纹：平涂的色面上盖一层很轻的颗粒，留白就不会发飘。
 *
 * 它永远在内容之下、底色之上，一个面上最多叠两种。除了黄黑的警戒条纹，
 * 颜色都取当前文字色，所以放进纸白面板会自动变深，也可以用 `text-*` 换成信号色。
 *
 * 半调的渐疏和别的底纹不一样：别的是整体变淡，半调是点变小（官网的半调图就是这样）。
 * 它的点距固定 16px，不随根字号缩放。
 *
 * 纯装饰，对读屏隐藏，不接收点击。默认铺满父元素给它的盒子（警戒条纹是一条 0.5rem 的窄边），
 * 位置由使用方决定，通常是 `absolute inset-0 -z-1`。
 */
export function Pattern({
  variant = 'halftone',
  fade = variant === 'halftone' ? HALFTONE_DEFAULT : 'none',
  mono = false,
  className,
  style,
  ...rest
}: PatternProps) {
  const halftone = variant === 'halftone'
  // 半调的方向烘在遮罩图里：默认方向用主题层的值，其余的换掉变量
  const mask: CSSProperties | undefined =
    halftone && fade !== HALFTONE_DEFAULT
      ? ({ '--ark-pattern-halftone': halftoneMask(fade) } as CSSProperties)
      : undefined
  return (
    <span
      data-ark="pattern"
      data-variant={variant}
      data-fade={fade}
      aria-hidden="true"
      {...rest}
      className={cn(
        'pointer-events-none box-border block text-ark-fg',
        // 警戒条纹只做窄边，绝不铺满整个面
        variant === 'hazard' ? 'h-2 w-full' : 'size-full',
        variant === 'hazard' && mono ? 'ark-pattern-hazard-mono' : shapes[variant],
        !halftone && fade !== 'none' && fades[fade],
        className,
      )}
      style={mask || style ? { ...mask, ...style } : undefined}
    />
  )
}
