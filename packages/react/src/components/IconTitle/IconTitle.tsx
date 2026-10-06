import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type IconTitleSize = 'sm' | 'md' | 'lg'
export type IconTitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'

export interface IconTitleProps extends ComponentProps<'div'> {
  /**
   * 渲染成哪个元素。放进链接里时用 `span`。
   * @default 'div'
   */
  as?: IconTitleElement
  /** 标题左边的图标，通常是一个 `Icon`。它对读屏隐藏：含义由旁边的文字给出。 */
  icon?: ReactNode
  /** 下一行的英文小字。 */
  sub?: ReactNode
  /**
   * 中文的字号：1.25rem / 1.5rem / 2.5rem。图标跟着它一起变。
   * @default 'md'
   */
  size?: IconTitleSize
}

const mainSize: Record<IconTitleSize, string> = {
  sm: 'text-ark-body-lg',
  md: 'text-ark-h2',
  lg: 'text-ark-h1',
}

const subSize: Record<IconTitleSize, string> = {
  sm: 'text-ark-caption',
  md: 'text-ark-caption',
  lg: 'text-ark-label',
}

/**
 * 入口的固定组合：图标 + 中文粗字 + 英文小字。图标在左，大小约等于中文的字高；
 * 英文另起一行，从图标的左缘写起。
 *
 * 它只是一组标题，不带交互——整块能不能点、点了去哪，由包着它的链接或卡片决定。
 */
export function IconTitle({
  as = 'div',
  icon,
  sub,
  size = 'md',
  className,
  children,
  ...rest
}: IconTitleProps) {
  // 可选元素共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  return (
    <Comp
      data-ark="icon-title"
      {...rest}
      className={cn('m-0 box-border grid justify-items-start gap-ark-2 text-ark-fg', className)}
    >
      <span
        className={cn(
          // 间距取字号的一半，落在文档的 0.5–0.75rem 上
          'flex items-center gap-[0.5em] font-ark-cjk-sans leading-ark-solid font-ark-bold',
          mainSize[size],
        )}
      >
        {icon != null && (
          <span
            aria-hidden="true"
            className="grid size-[1em] shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
      {sub != null && (
        <span
          className={cn(
            'font-ark-latin-condensed leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase',
            subSize[size],
          )}
        >
          {sub}
        </span>
      )}
    </Comp>
  )
}
