import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type PatternVariant = 'halftone' | 'grain' | 'hazard' | 'grid' | 'scanline'
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
   * - `halftone`：半调网点，压在角落或面板底部，朝一个方向渐疏
   * - `grain`：噪点，整面铺、极淡，让大面积留白不发飘
   * - `hazard`：45° 警戒条纹，只做窄窄的一条边
   * - `grid`：方格加对角线的斜线网格，铺在最底层
   * - `scanline`：细密的水平线，叠在“投影”性质的面板上
   * @default 'halftone'
   */
  variant?: PatternVariant
  /**
   * 朝哪个方向渐疏。半调默认 `top-right`（左下最密），其余默认不渐隐。
   */
  fade?: PatternFade
  /** 仅 `hazard`：不用黄黑，改成同色深浅相间，颜色跟随文字。 */
  mono?: boolean
}

const shapes: Record<PatternVariant, string> = {
  halftone: 'ark-pattern-halftone',
  grain: 'ark-pattern-grain',
  hazard: 'ark-pattern-hazard',
  grid: 'ark-pattern-grid',
  scanline: 'ark-pattern-scanline',
}

// 渐隐是叠在形状上的一张遮罩：从全显到 60% 处消失，取值同文档的示例
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

/**
 * 底纹：平涂的色面上盖一层很轻的颗粒，留白就不会发飘。
 *
 * 它永远在内容之下、底色之上，一个面上最多叠两种。除了黄黑的警戒条纹，
 * 颜色都取当前文字色，所以放进纸白面板会自动变深，也可以用 `text-*` 换成信号色。
 *
 * 纯装饰，对读屏隐藏，不接收点击。默认铺满父元素给它的盒子（警戒条纹是一条 0.5rem 的窄边），
 * 位置由使用方决定，通常是 `absolute inset-0 -z-1`。
 */
export function Pattern({
  variant = 'halftone',
  fade = variant === 'halftone' ? 'top-right' : 'none',
  mono = false,
  className,
  ...rest
}: PatternProps) {
  return (
    <span
      data-ark="pattern"
      data-variant={variant}
      aria-hidden="true"
      {...rest}
      className={cn(
        'pointer-events-none box-border block text-ark-fg',
        // 警戒条纹只做窄边，绝不铺满整个面
        variant === 'hazard' ? 'h-2 w-full' : 'size-full',
        variant === 'hazard' && mono ? 'ark-pattern-hazard-mono' : shapes[variant],
        fade !== 'none' && fades[fade],
        className,
      )}
    />
  )
}
