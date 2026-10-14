import {
  type ComponentProps,
  createContext,
  type ElementType,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import { CloseButton } from '../../internal/CloseButton'
import { MenuIcon } from '../../internal/icons'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRing, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useModalDialog } from '../../utils/useModalDialog'

export type NavCollapse = 'narrow' | 'always' | 'never'
export type NavOrientation = 'horizontal' | 'vertical'
export type NavSize = 'md' | 'lg'

type NavLayout = 'bar' | 'menu' | 'side'

interface NavContextValue {
  layout: NavLayout
  size: NavSize
  indicator: boolean
  /** 在全屏菜单里点了某一项之后，把菜单关掉。 */
  close?: () => void
}

const NavContext = createContext<NavContextValue | null>(null)

export interface NavProps extends ComponentProps<'nav'> {
  /**
   * - `horizontal`：顶部的一排，中英两行
   * - `vertical`：侧栏的一列，图标加名称；不折叠
   * @default 'horizontal'
   */
  orientation?: NavOrientation
  /**
   * 横排什么时候收成一个菜单按钮。
   * - `narrow`：视口窄于 48rem 时
   * - `always`：始终只有菜单按钮
   * - `never`：始终横排
   * @default 'narrow'
   */
  collapse?: NavCollapse
  /**
   * 字号。`lg` 是官网顶栏的写法（英文 1.375rem、中文 0.875rem），`md` 给应用的页头和侧栏。
   * 横排默认 `lg`，竖排默认 `md`。
   */
  size?: NavSize
  /** 给横排的当前项补一条 4px 的条。当前项默认只变色，这是颜色之外的第二种标记。 */
  indicator?: boolean
  /**
   * 菜单按钮和全屏菜单的名称。
   * @default '菜单'
   */
  menuLabel?: string
  /**
   * 全屏菜单里关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

/**
 * 导航永远在同一个地方。
 *
 * 横排是顶部一排双语标签：上面一行是视觉主体，下面一行小字是说明，当前项只变颜色。
 * 窄屏时折叠为菜单按钮，展开后是全屏菜单：一项一行，主行贴左、小字贴右，逐项自右滑入——
 * 窄屏重新编排，而不是把横排缩小到看不清。
 *
 * 竖排是侧栏的一列：图标加名称，当前项左缘一条信号色的边。可以用 `NavGroup` 分组。
 *
 * 子元素是若干个 `NavItem`。请用 `aria-label` 说明这是哪一组导航。
 * 它不自己定位，固定在哪里交给使用方。按宽度折叠时，横排和菜单里各渲染一份子元素，
 * 同一时刻只有一份可见，所以不要给 `NavItem` 传 `id`。
 */
export function Nav({
  orientation = 'horizontal',
  collapse = 'narrow',
  size = orientation === 'vertical' ? 'md' : 'lg',
  indicator = false,
  menuLabel = '菜单',
  closeLabel = '关闭',
  className,
  children,
  ...rest
}: NavProps) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const items = toItems(children)
  const { requestClose, dialogProps } = useModalDialog({ open, onOpenChange: setOpen })
  const byWidth = collapse === 'narrow'

  // 菜单开着的时候视口变宽：横排已经回来了，把菜单关掉，否则页面会一直被模态挡着
  useEffect(() => {
    // 有的测试环境（jsdom）没有 matchMedia
    if (!open || !byWidth || typeof window.matchMedia !== 'function') return
    const wide = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [open, byWidth])

  if (orientation === 'vertical') {
    return (
      <nav
        data-ark="nav"
        data-orientation="vertical"
        {...rest}
        className={cn('box-border font-ark-cjk-sans', className)}
      >
        <NavContext value={{ layout: 'side', size, indicator }}>
          <ul className="m-0 grid list-none p-0">
            {items.map(({ key, child }) => (
              <li key={key}>{child}</li>
            ))}
          </ul>
        </NavContext>
      </nav>
    )
  }

  return (
    <nav
      data-ark="nav"
      data-orientation="horizontal"
      {...rest}
      className={cn('box-border flex items-center', className)}
    >
      {collapse !== 'always' && (
        <NavContext value={{ layout: 'bar', size, indicator }}>
          <ul
            className={cn(
              'm-0 list-none items-stretch p-0',
              size === 'lg' ? 'gap-ark-6' : 'gap-ark-5',
              byWidth ? 'hidden md:flex' : 'flex',
            )}
          >
            {items.map(({ key, child }) => (
              <li key={key} className="flex">
                {child}
              </li>
            ))}
          </ul>
        </NavContext>
      )}

      {collapse !== 'never' && (
        <>
          <button
            type="button"
            aria-label={menuLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(true)}
            className={cn(
              'm-0 box-border size-11 shrink-0 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-ark-fg',
              'hover:bg-ark-invert hover:text-ark-on-invert',
              colorTransition,
              focusRing,
              byWidth ? 'grid md:hidden' : 'grid',
            )}
          >
            <MenuIcon className="size-6" />
          </button>

          <dialog
            id={menuId}
            data-ark="nav-menu"
            aria-label={menuLabel}
            {...dialogProps}
            className={cn(
              // 铺满屏幕；底色九成不透明加模糊，下层仍然隐约可见
              'fixed inset-0 m-0 box-border h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-ark-canvas/90 p-0 font-ark-cjk-sans text-ark-fg backdrop-blur-ark-backdrop',
              'backdrop:bg-transparent',
              'pointer-events-none open:pointer-events-auto',
              'opacity-0 open:opacity-100 starting:open:opacity-0',
              'transition-[opacity,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
            )}
          >
            <div className="box-border flex min-h-full flex-col p-ark-5">
              <CloseButton label={closeLabel} onClick={() => requestClose()} className="self-end" />
              <NavContext value={{ layout: 'menu', size, indicator, close: () => requestClose() }}>
                {/* 一项一行，行与行之间只有底部的一条细线，不留空隙 */}
                <ul className="m-0 grid list-none p-0 pt-ark-4 pl-ark-4">
                  {items.map(({ key, child, index }) => (
                    <li
                      key={key}
                      // 逐项自右滑入并淡入（官网实测 200ms），每一项比前一项晚 70ms；
                      // 减少动效时只淡入
                      className="motion-safe:animate-ark-enter-right motion-safe:[animation-duration:var(--ark-motion-duration-fast)] motion-reduce:animate-ark-fade-in"
                      style={{ animationDelay: `calc(var(--ark-motion-stagger) * ${index})` }}
                    >
                      {child}
                    </li>
                  ))}
                </ul>
              </NavContext>
            </div>
          </dialog>
        </>
      )}
    </nav>
  )
}

export interface NavGroupProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 这一组的名称：窄体的灰色小字。 */
  label: ReactNode
}

/** 竖排导航里的一组：一行小标题，下面是这一组的 `NavItem`。只用在 `orientation="vertical"` 里。 */
export function NavGroup({ label, className, children, ...rest }: NavGroupProps) {
  const labelId = useId()
  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset 是表单分组，这里是一组链接
    <div
      data-ark="nav-group"
      role="group"
      aria-labelledby={labelId}
      {...rest}
      className={cn('box-border pt-ark-4', className)}
    >
      <div
        id={labelId}
        className="box-border px-ark-4 pb-ark-2 font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase"
      >
        {label}
      </div>
      <ul className="m-0 grid list-none p-0">
        {toItems(children).map(({ key, child }) => (
          <li key={key}>{child}</li>
        ))}
      </ul>
    </div>
  )
}

export interface NavItemProps extends Omit<ComponentProps<'a'>, 'aria-current'> {
  /** 跳到哪里。 */
  href: string
  /**
   * 用来渲染链接的组件，接路由库的 `Link`。它要能接收 `href`、`className` 和子元素。
   * @default 'a'
   */
  as?: ElementType
  /** 主行之外的小字。横排时在主行下面，全屏菜单里贴右，竖排时跟在名称后面。 */
  sub?: ReactNode
  /** 名称前面的图标，对读屏隐藏。只在竖排时显示。 */
  icon?: ReactNode
  /**
   * 当前项。`true` 输出 `aria-current="page"`；单页站点里按锚点切换时用 `'location'`。
   */
  current?: boolean | 'page' | 'location'
}

interface Layout {
  root: string
  main: string
  sub: string
  indicator: string
}

const bar: Record<NavSize, Layout> = {
  // 官网实测：上下两行，英文 1.375rem、中文 0.875rem
  lg: {
    root: 'grid min-h-11 min-w-11 content-center',
    main: 'font-ark-latin-condensed text-ark-nav leading-[1.3]',
    sub: 'text-ark-label leading-ark-snug',
    indicator:
      'after:absolute after:inset-x-0 after:bottom-0 after:h-(--ark-line-strong) after:bg-ark-signal',
  },
  // 应用页头：比例照旧，整体小一档
  md: {
    root: 'grid min-h-10 min-w-10 content-center',
    main: 'font-ark-latin-condensed text-ark-base leading-[1.3]',
    sub: 'text-ark-caption leading-ark-snug',
    indicator:
      'after:absolute after:inset-x-0 after:bottom-0 after:h-(--ark-line-strong) after:bg-ark-signal',
  },
}

// 全屏菜单：一行一项、底部一条细线，主行贴左、小字贴右；小字下面压一条粗条，骑在这一行的底线上，
// 颜色跟着文字走。取值是官网竖屏菜单折到 375 宽以后的大小（行高 3.75rem，字 1.125rem / 0.875rem），
// 宽屏上（collapse="always"）放大到约 1.3 倍
const menu: Layout = {
  root: 'flex h-15 items-center justify-between gap-ark-4 border-b border-ark-rule md:h-20',
  main: 'font-ark-latin-condensed text-[1.125rem] leading-ark-solid md:text-ark-h2',
  sub: 'relative flex h-full items-center text-ark-label leading-ark-solid after:absolute after:inset-x-0 after:-bottom-[0.09375rem] after:h-[0.1875rem] after:bg-current md:text-ark-body',
  indicator:
    'after:absolute after:inset-y-0 after:-left-ark-4 after:w-(--ark-line-strong) after:bg-ark-signal',
}

// 竖排：左缘一条 4px 的边，当前项连边带字一起换成信号色（官网阵营切换的写法）
const side: Record<NavSize, Layout> = {
  md: {
    root: 'flex min-h-10 items-center gap-ark-3 border-l-(length:--ark-line-strong) border-l-transparent px-ark-4 py-ark-2',
    main: 'text-ark-label leading-ark-snug',
    sub: 'ml-auto font-ark-data text-ark-caption leading-ark-solid text-ark-fg-muted',
    indicator: '',
  },
  lg: {
    root: 'flex min-h-12 items-center gap-ark-3 border-l-(length:--ark-line-strong) border-l-transparent px-ark-5 py-ark-2',
    main: 'text-ark-base leading-ark-snug',
    sub: 'ml-auto font-ark-data text-ark-label leading-ark-solid text-ark-fg-muted',
    indicator: '',
  },
}

/**
 * 一个导航项：`children` 是主行，`sub` 是小字。横排时主行用窄体（官网放的是英文），
 * 竖排时主行用正文字体。只能放在 `Nav` 里。
 */
export function NavItem({
  href,
  as: Link = 'a',
  sub,
  icon,
  current = false,
  className,
  onClick,
  children,
  ...rest
}: NavItemProps) {
  const nav = useContext(NavContext)
  if (!nav) throw new Error('<NavItem> 必须放在 <Nav> 里')
  const layout =
    nav.layout === 'menu' ? menu : nav.layout === 'side' ? side[nav.size] : bar[nav.size]
  const isCurrent = current !== false
  const vertical = nav.layout === 'side'
  return (
    <Link
      data-ark="nav-item"
      href={href}
      aria-current={current === true ? 'page' : current || undefined}
      {...rest}
      onClick={(event: Parameters<NonNullable<typeof onClick>>[0]) => {
        onClick?.(event)
        nav.close?.()
      }}
      className={cn(
        'relative box-border no-underline',
        layout.root,
        vertical
          ? [
              isCurrent
                ? 'border-l-ark-signal bg-ark-fg/5 text-ark-signal-fg'
                : 'text-ark-fg-secondary hover:bg-ark-fg/10 hover:text-ark-fg',
              focusRingInset,
            ]
          : [
              // 主行与小字同时变色
              isCurrent ? 'text-ark-signal-fg' : 'text-ark-fg hover:text-ark-signal-fg',
              isCurrent && nav.indicator && layout.indicator,
              focusRing,
            ],
        colorTransition,
        className,
      )}
    >
      {vertical && icon != null && (
        <span
          aria-hidden="true"
          className="grid size-5 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon}
        </span>
      )}
      <span className={cn('font-ark-medium whitespace-nowrap', layout.main)}>{children}</span>
      {sub != null && (
        <span
          className={cn(
            'font-ark-medium whitespace-nowrap',
            !vertical && 'font-ark-cjk-sans',
            layout.sub,
          )}
        >
          {sub}
        </span>
      )}
    </Link>
  )
}
