import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type HeadingSize = 'sm' | 'md' | 'lg'
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'

export interface HeadingProps extends ComponentProps<'h2'> {
  /**
   * 渲染成哪个元素。视觉大小由 `size` 决定，与标题级别无关。
   * @default 'h2'
   */
  as?: HeadingElement
  /**
   * - `sm`：卡片标题，1.375rem + 窄体英文小字
   * - `md`：条目标题，2.5rem + 宽体英文副标
   * - `lg`：屏标题，3.75rem + 宽体英文 3.125rem
   * @default 'md'
   */
  size?: HeadingSize
  /** 配对的另一行，通常是英文。它不是翻译，是版式结构的一部分。 */
  sub?: ReactNode
  /** 副行在主行的上方还是下方。默认 `lg` 在上，其余在下。 */
  subPosition?: 'above' | 'below'
  /** 主行改用中文衬线重磅字（游戏主界面入口的告示牌气质）。 */
  serif?: boolean
}

const gap: Record<HeadingSize, string> = {
  sm: 'gap-ark-1',
  md: 'gap-ark-2',
  lg: 'gap-ark-2',
}

const mainSize: Record<HeadingSize, string> = {
  sm: 'text-ark-nav',
  md: 'text-ark-h1',
  lg: 'text-ark-display',
}

// 两行的字号永远不相等：一主一辅
const subText: Record<HeadingSize, string> = {
  sm: 'font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted',
  md: 'font-ark-latin-wide text-ark-body-lg font-ark-medium text-ark-fg-secondary',
  lg: 'font-ark-latin-wide text-ark-display-latin font-ark-bold',
}

/**
 * 中英成对的标题：中文粗黑做主体，英文做骨架。行高压到 1，块间距离交给间距。
 */
export function Heading({
  as = 'h2',
  size = 'md',
  sub,
  subPosition = size === 'lg' ? 'above' : 'below',
  serif = false,
  className,
  children,
  ...rest
}: HeadingProps) {
  // 各级标题与 p、div 共用同一组属性，这里按 h2 处理类型
  const Comp = as as 'h2'
  return (
    <Comp
      data-ark="heading"
      {...rest}
      className={cn(
        'm-0 box-border flex text-ark-fg',
        // DOM 里主行始终在前，读屏先读到主标题；视觉顺序用 flex 方向调
        subPosition === 'above' ? 'flex-col-reverse' : 'flex-col',
        gap[size],
        className,
      )}
    >
      <span
        className={cn(
          'leading-ark-solid',
          mainSize[size],
          serif ? 'font-ark-cjk-serif font-ark-heavy' : 'font-ark-cjk-sans font-ark-bold',
        )}
      >
        {children}
      </span>
      {sub != null && <span className={cn('leading-ark-solid', subText[size])}>{sub}</span>}
    </Comp>
  )
}
