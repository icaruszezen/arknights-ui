import type { ComponentProps, ElementType } from 'react'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type BreadcrumbProps = ComponentProps<'nav'>

/**
 * 面包屑：从哪里一路走到这一页。子元素是若干个 `BreadcrumbItem`，最后一个是当前页。
 *
 * 分隔的斜杠有节奏：第一级后面是双斜杠，往后是单斜杠——和日期 `2026 // 10 / 03`、
 * 计数 `01 // 01 / 05` 是同一种写法。斜杠是装饰，对读屏隐藏。
 * 请用 `aria-label` 说明这是面包屑。
 */
export function Breadcrumb({ className, children, ...rest }: BreadcrumbProps) {
  const items = toItems(children)
  return (
    <nav
      data-ark="breadcrumb"
      aria-label="面包屑"
      {...rest}
      className={cn('box-border font-ark-cjk-sans text-ark-label leading-ark-snug', className)}
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-ark-2 gap-y-ark-1 p-0">
        {items.map(({ key, child, index }) => (
          <li key={key} className="flex items-center gap-ark-2">
            {index > 0 && (
              <span aria-hidden="true" className="font-ark-data text-ark-fg-muted select-none">
                {index === 1 ? '//' : '/'}
              </span>
            )}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface BreadcrumbItemOwnProps {
  /** 当前页：不是链接，输出 `aria-current="page"`。通常是最后一项。 */
  current?: boolean
}

type BreadcrumbItemAsLink = BreadcrumbItemOwnProps &
  Omit<ComponentProps<'a'>, keyof BreadcrumbItemOwnProps> & {
    href: string
    /**
     * 用来渲染链接的组件，接路由库的 `Link`。
     * @default 'a'
     */
    as?: ElementType
  }
type BreadcrumbItemAsText = BreadcrumbItemOwnProps &
  Omit<ComponentProps<'span'>, keyof BreadcrumbItemOwnProps> & { href?: undefined; as?: undefined }

/** 给了 `href` 是链接，否则是一段文字。 */
export type BreadcrumbItemProps = BreadcrumbItemAsLink | BreadcrumbItemAsText

/** 面包屑里的一级。只能放在 `Breadcrumb` 里。 */
export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const { current = false, className, ...rest } = props
  if (rest.href !== undefined && !current) {
    const { as: Link = 'a', ...anchor } = rest
    return (
      <Link
        data-ark="breadcrumb-item"
        {...anchor}
        className={cn(
          'text-ark-fg-muted no-underline hover:text-ark-fg',
          colorTransition,
          focusRing,
          className,
        )}
      />
    )
  }
  const {
    as: _,
    href: __,
    ...span
  } = rest as ComponentProps<'span'> & {
    as?: unknown
    href?: unknown
  }
  return (
    <span
      data-ark="breadcrumb-item"
      aria-current={current ? 'page' : undefined}
      {...span}
      className={cn(current ? 'font-ark-bold text-ark-fg' : 'text-ark-fg-muted', className)}
    />
  )
}
