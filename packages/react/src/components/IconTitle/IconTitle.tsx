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
   * 中文的字号：1.25rem / 1.5rem / 3.375rem。图标、英文和间距都跟着它一起变。
   * `lg` 是官网更多内容屏的实测值，另外两档是按比例缩的估计。
   * @default 'md'
   */
  size?: IconTitleSize
  /**
   * 图标挂到文字列左边的外面，不占位置：组件的左缘就是标题文字的左缘。
   * 官网的条带就是这样排的。左边要留出放图标的地方（约 1.4 个字宽）。
   * @default false
   */
  hang?: boolean
}

const mainSize: Record<IconTitleSize, string> = {
  sm: 'text-ark-body-lg',
  md: 'text-ark-h2',
  lg: 'text-[3.375rem]',
}

/**
 * 入口的固定组合：图标 + 中文粗字 + 英文小字。取值出自官网更多内容屏（实测）。
 *
 * 图标在标题左边，是一个竖长的槽（宽 1.1 字、高 1.4 字），图形在里面完整显示；
 * 英文另起一行，是宽体，和标题同色，从**标题文字**的左缘写起——图标不占文字这一列。
 *
 * 所有尺寸都按根元素的字号走：用 `className` 换一个字号（比如按容器宽度算的），
 * 图标、英文、间距会一起等比缩放。英文最小不低于 0.75rem。
 *
 * 它只是一组标题，不带交互——整块能不能点、点了去哪，由包着它的链接或卡片决定。
 */
export function IconTitle({
  as = 'div',
  icon,
  sub,
  size = 'md',
  hang = false,
  className,
  children,
  ...rest
}: IconTitleProps) {
  // 可选元素共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  const hasIcon = icon != null && icon !== false
  // 图标占第一列时，文字都排到第二列
  const column = hasIcon && !hang ? 'col-start-2' : undefined
  return (
    <Comp
      data-ark="icon-title"
      {...rest}
      className={cn(
        'm-0 box-border grid justify-items-start font-ark-cjk-sans leading-ark-solid font-ark-bold text-ark-fg',
        mainSize[size],
        hasIcon && (hang ? 'relative' : 'grid-cols-[auto_minmax(0,1fr)]'),
        className,
      )}
    >
      {hasIcon && (
        // 槽的字号放大到 1.1 倍：里面的 Icon（1em 见方）正好占满槽的宽度
        <span
          aria-hidden="true"
          data-ark="icon-title-icon"
          className={cn(
            'mr-[0.2357em] grid h-[1.2727em] w-[1em] shrink-0 place-items-center text-[1.1em] [&>svg]:block [&>svg]:size-[1em]',
            hang ? 'absolute top-0 right-full' : 'col-start-1 row-start-1',
          )}
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          // 有图标时这一行和图标的槽等高，标题在里面居中
          hasIcon && 'flex min-h-[1.4em] items-center',
          // 官网：中文 3.375rem 时英文上距 1.5rem，也就是 0.4444 个字高。写在标题上才是按标题的字号算
          sub != null && 'mb-[0.4444em]',
          column,
        )}
      >
        {children}
      </span>
      {sub != null && (
        // 官网：中文 3.375rem 时英文 1rem，也就是 0.2963 倍
        <span
          className={cn(
            'font-ark-latin-wide text-[length:max(0.75rem,0.2963em)] leading-ark-solid font-ark-medium',
            column,
          )}
        >
          {sub}
        </span>
      )}
    </Comp>
  )
}
