import type { ComponentProps, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRingInset, thinScrollbar } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type QuickNavProps = ComponentProps<'nav'>

/**
 * 快捷导航：一条黑色半透明的带，上面一根轴线串着一排圆形节点，每个节点是一个系统。
 * 从任意页面直接跳到任何一个系统，不必先回到主界面。
 * 通常放进 `BackHome`，由主页按钮展开，平时不占空间；也可以单独常驻。
 *
 * 子元素是若干个 `QuickNavItem`，名称上下交错地挂在轴线两侧。
 * 请用 `aria-label` 说明这是哪一组导航。
 */
export function QuickNav({ className, children, ...rest }: QuickNavProps) {
  return (
    <nav
      data-ark="quick-nav"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        'box-border inline-block max-w-full bg-ark-neutral-black/85 font-ark-cjk-sans text-ark-fg',
        className,
      )}
    >
      {/* 放不下时横向滚动，而不是把每一项缩小到看不清 */}
      <ul className={cn('m-0 flex list-none overflow-x-auto p-0', thinScrollbar)}>
        {toItems(children).map(({ key, child }) => (
          // group：每一项按自己排第几个，决定名称挂在轴线的上面还是下面
          <li key={key} className="group/quick-nav flex shrink-0">
            {child}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export interface QuickNavItemProps extends Omit<ComponentProps<'a'>, 'aria-current'> {
  /** 跳到哪里。 */
  href: string
  /** 名称旁边的图标。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
  /** 名称下面的一行小字。实机里没有，需要时才给。 */
  sub?: ReactNode
  /** 当前所在的系统。`true` 输出 `aria-current="page"`，也可以指定 `'location'`。 */
  current?: boolean | 'page' | 'location'
}

// 节点：圆环套一个圆点，压在轴线上。当前项在外面再套两圈同心圆
const node = cn(
  'relative row-start-2 box-border grid size-4 place-items-center rounded-full border border-current bg-ark-neutral-black',
  'after:size-1 after:rounded-full after:bg-current',
)
const rings = cn(
  'before:absolute before:top-1/2 before:left-1/2 before:box-border before:size-9 before:-translate-1/2 before:rounded-full before:border before:border-current',
  'outline-1 outline-offset-[1.25rem] outline-current/40',
)

// 名称挂在轴线的一侧：单数项在下面，双数项在上面。靠近轴线的永远是名称，图标在外侧
const label = cn(
  'relative row-start-3 mt-5 flex flex-col items-center gap-ark-1 self-start text-center',
  'group-even/quick-nav:row-start-1 group-even/quick-nav:mt-0 group-even/quick-nav:mb-5 group-even/quick-nav:flex-col-reverse group-even/quick-nav:self-end',
  // 节点到名称之间的一小段虚线
  'before:absolute before:-top-4 before:left-1/2 before:h-3 before:border-l before:border-dashed before:border-current/60',
  'group-even/quick-nav:before:top-auto group-even/quick-nav:before:-bottom-4',
)

/**
 * 快捷导航里的一项：轴线上的一个节点，加名称和图标。
 * 当前项是信号色，节点外面多两圈同心圆，不只靠颜色区分。
 */
export function QuickNavItem({
  icon,
  sub,
  current = false,
  className,
  children,
  ...rest
}: QuickNavItemProps) {
  const isCurrent = current !== false
  return (
    <a
      data-ark="quick-nav-item"
      aria-current={current === true ? 'page' : current || undefined}
      {...rest}
      className={cn(
        // 上下两格等高，节点所在的中间一格因此正好落在半高处
        'relative box-border grid h-44 min-w-24 grid-rows-[1fr_auto_1fr] justify-items-center px-ark-3 no-underline',
        // 轴线画在每一项自己身上，连起来是一整条；横向滚动时不会断
        'before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-ark-rule',
        isCurrent ? 'text-ark-signal-fg' : 'text-ark-fg hover:text-ark-signal-fg',
        colorTransition,
        // 横条会裁掉溢出的部分，轮廓画在内侧
        focusRingInset,
        className,
      )}
    >
      <span aria-hidden="true" className={cn(node, isCurrent && rings)} />
      <span className={label}>
        <span className="grid justify-items-center gap-ark-1">
          <span className="text-[1rem] leading-ark-solid font-ark-bold whitespace-nowrap">
            {children}
          </span>
          {sub != null && (
            <span className="font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide whitespace-nowrap uppercase">
              {sub}
            </span>
          )}
        </span>
        {icon != null && (
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
          >
            {icon}
          </span>
        )}
      </span>
    </a>
  )
}
