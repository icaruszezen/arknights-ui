import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing, triangleRight } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { DateText, type DateTextValue } from '../DateText'

interface ListRowOwnProps {
  /** 分类：信号色的中文粗体，如“活动”“公告”。 */
  category?: ReactNode
  /** 日期，写作 `2026 // 10 / 03`。取值见 `DateText`。 */
  date?: DateTextValue
}

type ListRowAsDiv = ListRowOwnProps &
  Omit<ComponentProps<'div'>, keyof ListRowOwnProps> & { href?: undefined }
type ListRowAsAnchor = ListRowOwnProps &
  Omit<ComponentProps<'a'>, keyof ListRowOwnProps> & { href: string }

/** 传入 `href` 时整行渲染为 `<a>`，否则渲染为 `<div>`。`children` 是标题。 */
export type ListRowProps = ListRowAsDiv | ListRowAsAnchor

const base = cn(
  'group relative m-0 box-border grid min-h-ark-8 content-center items-center gap-x-ark-4 gap-y-ark-2 border-b border-ark-rule py-ark-4 font-ark-cjk-sans text-ark-fg',
  // 竖屏：排成一行，日期移到标题右侧
  'portrait:min-h-ark-7 portrait:py-ark-3',
)

// 有没有分类一栏，决定了网格的列和竖屏时各格的位置
const layouts = {
  withCategory: {
    root: 'grid-cols-[4rem_minmax(0,1fr)] portrait:grid-cols-[auto_minmax(0,1fr)_auto]',
    date: 'portrait:col-start-3',
    title: 'portrait:col-start-2',
  },
  plain: {
    root: 'grid-cols-[minmax(0,1fr)] portrait:grid-cols-[minmax(0,1fr)_auto]',
    date: 'portrait:col-start-2',
    title: 'portrait:col-start-1',
  },
}

/**
 * 新闻行是三栏：分类、日期、标题，各有自己的字体。行与行之间只有一条 1px 的细线，
 * 不给每一行套一张带底色的卡片。
 *
 * 作为链接时右端带一个方向三角：可点击的东西要看得出来。
 * 多行并排时请放进列表（`<ul>` / `<li>`）里。
 */
export function ListRow(props: ListRowProps) {
  const { category, date, className, children, ...rest } = props
  const layout = category != null ? layouts.withCategory : layouts.plain
  const linked = rest.href !== undefined

  const content = (
    <>
      {category != null && (
        <span className="row-span-2 text-ark-body leading-ark-solid font-ark-bold text-ark-signal-fg portrait:row-span-1 portrait:text-[1rem]">
          {category}
        </span>
      )}
      {date !== undefined && (
        <DateText
          value={date}
          className={cn(
            'text-ark-fg-muted portrait:row-start-1 portrait:text-ark-caption',
            layout.date,
          )}
        />
      )}
      <span
        className={cn(
          'line-clamp-2 text-ark-body leading-ark-snug tracking-[2px] text-ark-fg-secondary portrait:row-start-1 portrait:text-[1rem]',
          linked && ['group-hover:text-ark-fg', colorTransition],
          layout.title,
        )}
      >
        {children}
      </span>
      {linked && (
        <span
          aria-hidden="true"
          className={cn(
            triangleRight,
            'absolute top-1/2 right-ark-2 -translate-y-1/2 text-ark-fg-muted portrait:hidden',
            'transition-[color,translate] duration-(--ark-motion-duration-base) ease-ark-standard',
            'group-hover:text-ark-signal-fg motion-safe:group-hover:translate-x-1',
          )}
        />
      )}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a
        data-ark="list-row"
        {...rest}
        className={cn(
          base,
          layout.root,
          // 右侧给方向三角让出位置；竖屏不显示三角
          'cursor-pointer pr-ark-6 no-underline portrait:pr-0',
          focusRing,
          className,
        )}
      >
        {content}
      </a>
    )
  }
  return (
    <div data-ark="list-row" {...rest} className={cn(base, layout.root, className)}>
      {content}
    </div>
  )
}
