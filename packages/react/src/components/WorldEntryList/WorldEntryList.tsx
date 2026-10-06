import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { GhostTitle } from '../GhostTitle'
import { Heading } from '../Heading'

export type WorldEntryListProps = ComponentProps<'ul'>

/**
 * 条目列表：官网“设定”屏那几个名词条目。纵向排列，左缩进逐条递增，形成阶梯；
 * 每条下方一条细线。这是内容最少的一种编排，留白很多。
 *
 * 子元素是若干个 `WorldEntry`，各自包进一个列表项。每一级缩进由 `--ark-entry-step` 决定，
 * 默认 2rem；竖屏时取消缩进。
 */
export function WorldEntryList({ className, children, ...rest }: WorldEntryListProps) {
  return (
    <ul
      data-ark="world-entry-list"
      {...rest}
      className={cn('m-0 box-border grid list-none p-0 font-ark-cjk-sans text-ark-fg', className)}
    >
      {toItems(children).map(({ key, child, index }) => (
        <li
          key={key}
          className="ml-[calc(var(--ark-entry-step,2rem)*var(--ark-entry-index))] portrait:ml-0"
          style={{ '--ark-entry-index': index } as CSSProperties}
        >
          {child}
        </li>
      ))}
    </ul>
  )
}

interface WorldEntryOwnProps {
  /** 中文下面的英文。 */
  sub?: ReactNode
  /**
   * 悬停时在背后浮现的巨型英文。默认用 `sub`（它是字符串时）；传 `null` 去掉。
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

/**
 * 一个条目：中文粗黑 2.5rem 加英文副标，下方一条细线。
 *
 * 是链接时，悬停（或键盘聚焦）文字变成信号色并向右位移，背后浮现一行 25% 信号色的巨型英文——
 * 悬停时至少改变两样东西。巨字只是装饰，横向超出这一行的部分会被裁掉。
 */
export function WorldEntry(props: WorldEntryProps) {
  const { sub, ghost = typeof sub === 'string' ? sub : null, className, children, ...rest } = props
  const linked = rest.href !== undefined

  const classes = cn(
    // overflow-x-clip：巨字横向不撑出滚动条，纵向仍然可以越过这一行
    'group relative isolate box-border block overflow-x-clip border-b border-ark-rule py-ark-4 text-ark-fg no-underline',
    linked && focusRing,
    className,
  )

  const content = (
    <>
      {linked && ghost != null && (
        <GhostTitle
          tone="signal"
          className={cn(
            'absolute top-1/2 left-0 -z-1 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
            'portrait:text-[3.5rem]',
            hoverTransition,
          )}
        >
          {ghost}
        </GhostTitle>
      )}
      <Heading
        as="div"
        size="md"
        sub={sub}
        className={cn(
          linked && [
            'transition-[color,translate] group-hover:text-ark-signal-fg group-focus-visible:text-ark-signal-fg',
            'motion-safe:group-hover:translate-x-ark-4 motion-safe:group-focus-visible:translate-x-ark-4',
            hoverTransition,
          ],
        )}
      >
        {children}
      </Heading>
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
