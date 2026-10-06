import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import type { HeadingElement } from '../Heading'
import { formatStatValue } from '../Stat'

export type ChapterTitleSize = 'md' | 'lg'
export type ChapterTitleAlign = 'left' | 'center'

export interface ChapterTitleProps extends ComponentProps<'h2'> {
  /**
   * 渲染成哪个元素。
   * @default 'h2'
   */
  as?: HeadingElement
  /** 中文标题，较小，字重低于英文。 */
  sub?: ReactNode
  /** 章节编号。数字补前导零到两位，字符串和节点原样输出。 */
  number?: ReactNode
  /**
   * 编号前面的英文小字。
   * @default 'EPISODE'
   */
  numberLabel?: ReactNode
  /**
   * 最下面的一行：与这一章的势力对应的另一种文字，或一句题记。
   * 多种文字并置能丰富版面、暗示地域。它是对标题的再一次表述，对读屏隐藏。
   */
  caption?: ReactNode
  /**
   * 英文标题的字号：3.75rem / 5.5rem。
   * @default 'lg'
   */
  size?: ChapterTitleSize
  /**
   * 对齐。
   * @default 'left'
   */
  align?: ChapterTitleAlign
}

const titleSize: Record<ChapterTitleSize, string> = {
  md: 'text-ark-display',
  lg: 'text-ark-hero portrait:text-ark-display',
}

const subSize: Record<ChapterTitleSize, string> = {
  md: 'text-ark-body-lg',
  lg: 'text-ark-h2',
}

const aligns: Record<ChapterTitleAlign, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
}

/**
 * 章节标题：每一章的“电影片头”。巨大的英文标题用拉丁衬线大写、收紧字距，
 * 下面是较小、较轻的中文标题，上面是章节编号。`children` 是英文标题。
 *
 * 剧情界面把控件藏到最少，把字体的表现力放到最大：同一套骨架，换一款标题字就换了一种气质。
 * 英文标题的字体由 `--ark-chapter-font` 决定，默认是英文衬线的字体栈——
 * 选字要看具体的字型和这一章题材的气质是否一致，不是“衬线就等于古典”。
 *
 * 它只是这组文字，叠在哪张气氛图上、要不要遮罩由使用方决定。入场时以 1 秒淡入。
 */
export function ChapterTitle({
  as = 'h2',
  sub,
  number,
  numberLabel = 'EPISODE',
  caption,
  size = 'lg',
  align = 'left',
  className,
  children,
  ...rest
}: ChapterTitleProps) {
  // 各级标题与 p、div 共用同一组属性，这里按 h2 处理类型
  const Comp = as as 'h2'
  return (
    <Comp
      data-ark="chapter-title"
      {...rest}
      className={cn(
        // 标题与幽灵字的淡入取 slower 档；只动透明度，减少动效时也保留
        'm-0 box-border flex animate-ark-fade-in flex-col gap-ark-4 font-ark-regular text-ark-fg [animation-duration:var(--ark-motion-duration-slower)]',
        aligns[align],
        className,
      )}
    >
      {/* DOM 里英文标题在最前，读屏先读到它；编号在视觉上排到上面去 */}
      <span
        className={cn(
          'order-2 font-[family-name:var(--ark-chapter-font,var(--ark-font-family-latin-serif))] leading-[0.95] font-ark-bold tracking-ark-tight uppercase',
          titleSize[size],
        )}
      >
        {children}
      </span>
      {sub != null && (
        <span className="order-3 flex flex-col gap-ark-4 [align-items:inherit]">
          <span aria-hidden="true" className="h-px w-ark-8 bg-ark-rule-strong" />
          <span
            className={cn(
              'font-ark-cjk-serif leading-ark-solid font-ark-medium tracking-ark-wide',
              subSize[size],
            )}
          >
            {sub}
          </span>
        </span>
      )}
      {number != null && (
        <span className="order-1 flex items-baseline gap-ark-2 leading-ark-solid">
          {numberLabel != null && (
            <span className="font-ark-latin-condensed text-ark-label font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {numberLabel}
            </span>
          )}
          <span className="font-ark-data text-ark-h2 font-ark-bold text-ark-signal-fg">
            {typeof number === 'number' ? formatStatValue(number, 2) : number}
          </span>
        </span>
      )}
      {caption != null && (
        <span
          aria-hidden="true"
          className="order-4 font-ark-latin-serif text-ark-label leading-ark-solid tracking-[0.3em] text-ark-fg-muted"
        >
          {caption}
        </span>
      )}
    </Comp>
  )
}
