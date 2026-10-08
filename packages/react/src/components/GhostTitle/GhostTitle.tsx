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
  /**
   * 裁掉字的上缘：大写高的 16%，像被一条水平线切过。官网每一屏左下角的巨字都是这样，
   * 它正好挂在骨架的底线下面。打开后根元素的上缘就是那条裁切线。
   * @default false
   */
  clip?: boolean
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
 *
 * `clip` 的做法同 `Counter` 的大数字：字和一个空的占位块按基线对齐，占位块高 0.84 个大写高，
 * 容器的上缘就落在大写字母顶端往下 16% 的地方，换什么字体都一样。
 * 官网是把字装进一个高 0.95em 的框里贴底放，裁掉多少取决于 Oswald 的度量。
 */
export function GhostTitle({
  tone = 'neutral',
  clip = false,
  className,
  children,
  ...rest
}: GhostTitleProps) {
  return (
    <div
      data-ark="ghost-title"
      aria-hidden="true"
      {...rest}
      className={cn(
        'pointer-events-none box-border font-ark-latin-condensed text-ark-ghost leading-ark-solid font-ark-medium tracking-ark-tight whitespace-nowrap uppercase select-none',
        tones[tone],
        // 基线以下留 0.27em（Oswald 的下行高度），逗号、Q 的尾巴不会被裁
        clip && 'flex items-baseline overflow-hidden pb-[0.27em]',
        className,
      )}
    >
      {clip ? (
        <>
          <span className="leading-[0]">{children}</span>
          <span className="h-[0.68em] w-0 supports-[height:1cap]:h-[0.84cap]" />
        </>
      ) : (
        children
      )}
    </div>
  )
}
