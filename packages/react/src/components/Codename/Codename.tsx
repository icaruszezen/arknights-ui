import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type CodenameSize = 'sm' | 'md' | 'lg'
export type CodenameElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'

export interface CodenameProps extends ComponentProps<'h2'> {
  /**
   * 渲染成哪个元素。放进链接或按钮里时用 `span`。
   * @default 'h2'
   */
  as?: CodenameElement
  /** 英文名，写在代号上方，字号约为代号的三分之一。 */
  sub?: ReactNode
  /**
   * 代号的字号：1.25rem（卡片）/ 2.5rem / 3.75rem（详情页、官网干员屏）。
   * @default 'md'
   */
  size?: CodenameSize
  /**
   * 换成游戏内干员详情页的写法：中文代号用宋体 Heavy、不收字距，
   * 英文名是大小写混排的常规字重，不强制大写。
   * @default false
   */
  serif?: boolean
}

const mainSize: Record<CodenameSize, string> = {
  sm: 'text-ark-body-lg',
  md: 'text-ark-h1',
  lg: 'text-ark-display',
}

// 英文约为中文的 1/3；最小的一档停在字号阶里可读的最小值 0.75rem
const subSize: Record<CodenameSize, string> = {
  sm: 'text-ark-caption',
  md: 'text-ark-label',
  lg: 'text-ark-body-lg',
}

const gap: Record<CodenameSize, string> = {
  sm: 'gap-ark-1',
  md: 'gap-ark-1',
  lg: 'gap-ark-2',
}

/**
 * 干员代号的排版：英文名小字在上，中文代号在下。同一个名字在三处有三种写法——
 *
 * - 默认：思源黑体 Heavy，字距收紧到 -0.1em。干员介绍图和卡片上的写法，
 *   这条约定自开服以来没有变过
 * - `serif`：宋体 Heavy、不收字距，英文大小写混排。游戏内干员详情页的写法
 * - 官网干员屏：黑体 Bold、不收字距，用 `className="font-ark-bold tracking-ark-normal"` 覆盖
 */
export function Codename({
  as = 'h2',
  sub,
  size = 'md',
  serif = false,
  className,
  children,
  ...rest
}: CodenameProps) {
  // 各级标题与 p、div、span 共用同一组属性，这里按 h2 处理类型
  const Comp = as as 'h2'
  return (
    <Comp
      data-ark="codename"
      {...rest}
      className={cn(
        // DOM 里代号在前，读屏先读到它；视觉上英文在上，用 flex 方向调
        'm-0 box-border flex flex-col-reverse font-ark-heavy text-ark-fg',
        serif
          ? 'font-ark-cjk-serif tracking-ark-normal'
          : 'font-ark-cjk-sans tracking-ark-cjk-tight',
        gap[size],
        className,
      )}
    >
      <span className={cn('leading-ark-solid', mainSize[size])}>{children}</span>
      {sub != null && (
        <span
          className={cn(
            'leading-ark-solid tracking-ark-normal',
            serif
              ? 'font-ark-cjk-sans font-ark-regular'
              : 'font-ark-latin-wide font-ark-bold uppercase',
            subSize[size],
          )}
        >
          {sub}
        </span>
      )}
    </Comp>
  )
}
