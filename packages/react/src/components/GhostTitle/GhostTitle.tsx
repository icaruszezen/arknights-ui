import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type GhostTitleTone = 'neutral' | 'signal'

export interface GhostTitleProps extends ComponentProps<'div'> {
  /**
   * - `neutral`：只比底色亮一档，黑底上是 `#242424`
   * - `signal`：25% 的信号色，条目悬停时在背后浮现的那种
   * @default 'neutral'
   */
  tone?: GhostTitleTone
}

// 都用不透明度而不是写死的色值：换到别的底色、换信号色之后，仍然“只比底色亮一档”
const tones: Record<GhostTitleTone, string> = {
  neutral: 'text-ark-fg/14',
  signal: 'text-ark-signal/25',
}

/**
 * 背景巨字：垫在内容背后的巨型英文，被内容切掉一部分。
 * 它把栏目名再写一遍，既是标题也是纹理。
 *
 * 对比度极低，只能当装饰，所以默认对读屏隐藏；真正的标题请另用 `Heading`。
 * 定位交给使用方，通常是 `absolute` 加一个负的 `z-index`。
 */
export function GhostTitle({ tone = 'neutral', className, ...rest }: GhostTitleProps) {
  return (
    <div
      data-ark="ghost-title"
      aria-hidden="true"
      {...rest}
      className={cn(
        'pointer-events-none box-border font-ark-latin-condensed text-ark-ghost leading-ark-solid font-ark-medium tracking-ark-tight whitespace-nowrap uppercase select-none',
        tones[tone],
        className,
      )}
    />
  )
}
