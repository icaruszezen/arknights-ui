import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type IconFrame = 'none' | 'square' | 'triangle'

interface GlyphSource {
  /**
   * 图形：一个内联 `<svg>`，或开源图标库里的图标组件。
   * 用 `currentColor` 上色的图形才会跟着文字换色。
   */
  children?: ReactNode
  /**
   * 图片地址。只取它的透明通道当剪影，填成当前文字色——
   * 任何带透明底的图都能变成单色图标。给了它就忽略 `children`。
   */
  src?: string
}

// 图形放进一个方格里。内联 SVG 铺满方格，并把端点、转角统一成平头和尖角：
// 文档要求线性图标“线宽统一、端点平头”“转角不做圆角”，开源图标库默认多是圆头。
// CSS 规则的优先级高于 SVG 的展示属性，所以写在后代上就能盖过 stroke-linecap="round"
function Glyph({ src, className, children }: GlyphSource & { className?: string }) {
  const image = src === undefined ? undefined : `url(${JSON.stringify(src)})`
  return (
    <span
      className={cn(
        'grid place-items-center',
        image === undefined
          ? '[&_*]:[stroke-linecap:butt] [&_*]:[stroke-linejoin:miter] [&>svg]:block [&>svg]:size-full'
          : 'bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]',
        className,
      )}
      style={image === undefined ? undefined : { maskImage: image, WebkitMaskImage: image }}
    >
      {image === undefined && children}
    </span>
  )
}

export interface IconProps extends Omit<ComponentProps<'span'>, 'children'>, GlyphSource {
  /**
   * 外框。同一组图标用同一种。
   * - `square`：方框，图形缩到画板的 70%
   * - `triangle`：三角框（阵营徽记那种），图形缩到 40% 并落在三角形的重心附近
   * @default 'none'
   */
  frame?: IconFrame
  /**
   * 图标的名称。图标通常配着文字，默认对读屏隐藏；
   * 单独出现、需要被读到时给它一个名称。
   */
  label?: string
}

const glyphSize: Record<IconFrame, string> = {
  none: 'size-full',
  square: 'size-[70%]',
  triangle: 'size-[40%] translate-y-[30%]',
}

/**
 * 图标的画板：正方形、单色、可选统一的外框。它不带任何图形——
 * 功能图标请用开源图标库，类别符号按同样的画板规则自己画，不要描摹官方图标。
 *
 * 默认 `1em` 见方，约等于旁边中文的字高；颜色跟随文字。大小用字号或 `size-*` 调。
 * 图标要配文字，不要只放一个图标让人猜。
 */
export function Icon({ frame = 'none', label, src, className, children, ...rest }: IconProps) {
  const semantics =
    label === undefined
      ? ({ 'aria-hidden': true } as const)
      : ({ role: 'img', 'aria-label': label } as const)
  return (
    <span
      data-ark="icon"
      {...semantics}
      {...rest}
      className={cn(
        'relative box-border inline-grid size-[1em] shrink-0 place-items-center align-[-0.125em]',
        // 线宽随字号走，最细 1px
        frame === 'square' && 'border-[length:max(1px,0.0625em)] border-current',
        className,
      )}
    >
      {frame === 'triangle' && (
        // 近等边的三角形，沿用示意图的画法；线宽与方框一致（1.5 / 24 = 0.0625em）
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0 block size-full"
        >
          <path d="M12 2.6 22.4 20.6H1.6z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
      <Glyph src={src} className={glyphSize[frame]}>
        {children}
      </Glyph>
    </span>
  )
}

export type WatermarkPosition = 'right' | 'left' | 'center'

export interface WatermarkProps extends Omit<ComponentProps<'span'>, 'children'>, GlyphSource {
  /**
   * 压在面板的哪一边。
   * @default 'right'
   */
  position?: WatermarkPosition
}

const positions: Record<WatermarkPosition, string> = {
  right: 'right-ark-4',
  left: 'left-ark-4',
  center: 'left-1/2 -translate-x-1/2',
}

/**
 * 水印：把一个标识放大、压低不透明度，垫在面板留白的地方。
 *
 * 默认高度是面板的 90%（文档的范围是 60–120%，用 `h-*` 改；超过 100% 时给面板加
 * `overflow-hidden`），不透明度 10%（范围 5–15%，用 `opacity-*` 改）。
 * 它垫在内容下面，需要父元素是定位元素并且自成层叠上下文——`Panel` 已经是。
 *
 * 一块面板里只放一个水印。
 */
export function Watermark({
  position = 'right',
  src,
  className,
  children,
  ...rest
}: WatermarkProps) {
  return (
    <span
      data-ark="watermark"
      aria-hidden="true"
      {...rest}
      className={cn(
        'pointer-events-none absolute top-1/2 -z-1 box-border grid aspect-square h-[90%] -translate-y-1/2 text-ark-fg opacity-10 select-none',
        positions[position],
        className,
      )}
    >
      <Glyph src={src} className="size-full">
        {children}
      </Glyph>
    </span>
  )
}
