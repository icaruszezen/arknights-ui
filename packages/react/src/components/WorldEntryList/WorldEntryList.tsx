import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { GhostTitle } from '../GhostTitle'

export interface WorldEntryListProps extends ComponentProps<'ul'> {
  /**
   * 入场：条目逐条自左滑入，每条比前一条晚 200ms。减少动效时只淡入。
   * @default true
   */
  stagger?: boolean
}

// 官网实测：每条 0.8s，逐条晚 200ms。0.8s 不在五档时长里，直接写在这里
const entrance = cn(
  'motion-safe:animate-ark-enter-left motion-safe:[animation-duration:0.8s] motion-safe:[animation-delay:calc(var(--ark-entry-index)*200ms)]',
  'motion-reduce:animate-ark-fade-in',
)

/**
 * 条目列表：官网“设定”屏那几个名词条目。纵向排列，左缘对齐，每条下方一条实线；
 * 入场时逐条自左滑入。这是内容最少的一种编排，留白很多。
 *
 * 子元素是若干个 `WorldEntry`，各自包进一个列表项。
 */
export function WorldEntryList({
  stagger = true,
  className,
  children,
  ...rest
}: WorldEntryListProps) {
  return (
    <ul
      data-ark="world-entry-list"
      {...rest}
      className={cn('m-0 box-border grid list-none p-0 font-ark-cjk-sans text-ark-fg', className)}
    >
      {toItems(children).map(({ key, child, index }) => (
        <li
          key={key}
          className={cn(stagger && entrance)}
          style={stagger ? ({ '--ark-entry-index': index } as CSSProperties) : undefined}
        >
          {child}
        </li>
      ))}
    </ul>
  )
}

interface WorldEntryOwnProps {
  /** 中文后面的英文，和中文排在同一行。 */
  sub?: ReactNode
  /**
   * 悬停时在背后浮现的巨型英文，贴在这一行的右端。默认用 `sub`（它是字符串时）；传 `null` 去掉。
   * 仅在有 `href` 时出现。
   */
  ghost?: ReactNode
}

type WorldEntryAsAnchor = WorldEntryOwnProps &
  Omit<ComponentProps<'a'>, keyof WorldEntryOwnProps> & { href: string }
type WorldEntryAsBlock = WorldEntryOwnProps &
  Omit<ComponentProps<'div'>, keyof WorldEntryOwnProps> & { href?: undefined }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<div>`。`children` 是中文条目名。 */
export type WorldEntryProps = WorldEntryAsAnchor | WorldEntryAsBlock

const hoverTransition = 'duration-(--ark-motion-duration-base) ease-ark-standard'

// 悬停（或键盘聚焦）：文字从灰变成前景色，并向右位移 2rem
const hover = cn(
  'transition-[color,translate] group-hover:text-ark-fg group-focus-visible:text-ark-fg',
  'motion-safe:group-hover:translate-x-ark-6 motion-safe:group-focus-visible:translate-x-ark-6',
  hoverTransition,
)

/**
 * 一个条目：6rem 高，中文粗黑 2.5rem 和英文宽体 1.25rem 排在同一行、贴底，下方一条 1px 的实线。
 * 默认是灰的。
 *
 * 是链接时，悬停（或键盘聚焦）文字变成前景色并向右位移，背后贴着右端浮现一行 25% 信号色的
 * 巨型英文——悬停时至少改变两样东西。巨字只是装饰，横向超出这一行的部分会被裁掉。
 */
export function WorldEntry(props: WorldEntryProps) {
  const { sub, ghost = typeof sub === 'string' ? sub : null, className, children, ...rest } = props
  const linked = rest.href !== undefined

  const classes = cn(
    // overflow-x-clip：巨字横向不撑出滚动条，纵向仍然可以越过这一行。
    // 底线官网是实白，这里取前景色，放进纸白面板时跟着换
    'group relative isolate box-border flex h-24 items-end overflow-x-clip border-0 border-b border-solid border-ark-fg pb-ark-3 leading-ark-solid text-ark-fg-muted no-underline',
    linked && focusRing,
    className,
  )

  const content = (
    <>
      {linked && ghost != null && (
        <GhostTitle
          tone="signal"
          className={cn(
            'absolute right-ark-3 bottom-ark-3 -z-1 font-ark-latin-wide text-[4.5rem] font-ark-bold tracking-ark-normal opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
            'portrait:text-[3rem]',
            hoverTransition,
          )}
        >
          {ghost}
        </GhostTitle>
      )}
      <span className={cn('text-ark-h1 font-ark-bold', linked && hover)}>{children}</span>
      {sub != null && (
        <span
          className={cn(
            'ml-ark-5 font-ark-latin-wide text-ark-body-lg font-ark-bold',
            linked && hover,
          )}
        >
          {sub}
        </span>
      )}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a data-ark="world-entry" {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <div data-ark="world-entry" {...rest} className={classes}>
      {content}
    </div>
  )
}
