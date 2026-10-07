import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import { CloseButton } from '../../internal/CloseButton'
import { MenuIcon } from '../../internal/icons'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useModalDialog } from '../../utils/useModalDialog'

export type NavCollapse = 'portrait' | 'always' | 'never'

interface NavContextValue {
  layout: 'bar' | 'menu'
  indicator: boolean
  /** 在全屏菜单里点了某一项之后，把菜单关掉。 */
  close?: () => void
}

const NavContext = createContext<NavContextValue | null>(null)

export interface NavProps extends ComponentProps<'nav'> {
  /**
   * 什么时候把横排收成一个菜单按钮。
   * - `portrait`：竖屏时（官网的做法：按方向切换，不按宽度）
   * - `always`：始终只有菜单按钮
   * - `never`：始终横排
   * @default 'portrait'
   */
  collapse?: NavCollapse
  /** 给当前项补一条 4px 的条。当前项默认只变色，这是颜色之外的第二种标记。 */
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
 * 顶部一排双语导航：英文窄体是视觉主体，中文小字是说明。当前项只变颜色。
 *
 * 竖屏时折叠为菜单按钮，展开后是全屏菜单：一项一行，英文贴左、中文贴右，逐项自右滑入——
 * 窄屏重新编排，而不是把横排缩小到看不清。
 *
 * 子元素是若干个 `NavItem`。请用 `aria-label` 说明这是哪一组导航。
 * 它不自己定位，固定在顶部交给使用方。按方向折叠时，横排和菜单里各渲染一份子元素，
 * 同一时刻只有一份可见，所以不要给 `NavItem` 传 `id`。
 */
export function Nav({
  collapse = 'portrait',
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
  const byOrientation = collapse === 'portrait'

  // 菜单开着的时候转回横屏：横排已经回来了，把菜单关掉，否则页面会一直被模态挡着
  useEffect(() => {
    // 有的测试环境（jsdom）没有 matchMedia
    if (!open || !byOrientation || typeof window.matchMedia !== 'function') return
    const landscape = window.matchMedia('(orientation: landscape)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    landscape.addEventListener('change', onChange)
    return () => landscape.removeEventListener('change', onChange)
  }, [open, byOrientation])

  return (
    <nav data-ark="nav" {...rest} className={cn('box-border flex items-center', className)}>
      {collapse !== 'always' && (
        <NavContext value={{ layout: 'bar', indicator }}>
          <ul
            className={cn(
              'm-0 list-none items-stretch gap-ark-6 p-0',
              byOrientation ? 'flex portrait:hidden' : 'flex',
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
              byOrientation ? 'hidden portrait:grid' : 'grid',
            )}
          >
            <MenuIcon className="size-6" />
          </button>

          <dialog
            id={menuId}
            data-ark="nav-menu"
            data-ark-tone="dark"
            aria-label={menuLabel}
            {...dialogProps}
            className={cn(
              // 铺满屏幕；黑 80% 加模糊，下层仍然隐约可见
              'fixed inset-0 m-0 box-border h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-ark-overlay-scrim-strong p-0 font-ark-cjk-sans text-ark-fg backdrop-blur-ark-backdrop',
              'backdrop:bg-transparent',
              'pointer-events-none open:pointer-events-auto',
              'opacity-0 open:opacity-100 starting:open:opacity-0',
              'transition-[opacity,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
            )}
          >
            <div className="box-border flex min-h-full flex-col p-ark-5">
              <CloseButton label={closeLabel} onClick={() => requestClose()} className="self-end" />
              <NavContext value={{ layout: 'menu', indicator, close: () => requestClose() }}>
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

export interface NavItemProps extends Omit<ComponentProps<'a'>, 'aria-current'> {
  /** 跳到哪里。 */
  href: string
  /** 英文下面的中文小字。 */
  sub?: ReactNode
  /**
   * 当前项。`true` 输出 `aria-current="page"`；单页站点里按锚点切换时用 `'location'`。
   */
  current?: boolean | 'page' | 'location'
}

const layouts = {
  // 横排：上下两行，英文 1.375rem、中文 0.875rem
  bar: {
    root: 'grid min-h-11 min-w-11 content-center',
    main: 'text-ark-nav leading-[1.3]',
    sub: 'text-ark-label leading-ark-snug',
    indicator:
      'after:absolute after:inset-x-0 after:bottom-0 after:h-(--ark-line-strong) after:bg-ark-signal',
  },
  // 全屏菜单（官网实测）：一行 7.5rem 高、底部一条细线，英文 2.25rem 贴左、中文 1.75rem 贴右；
  // 中文下面压一条 0.375rem 的粗条，骑在这一行的底线上，颜色跟着文字走
  menu: {
    root: 'flex h-30 items-center justify-between gap-ark-4 border-b border-ark-rule',
    main: 'text-[2.25rem] leading-ark-solid',
    sub: 'relative flex h-full items-center text-[1.75rem] leading-ark-solid after:absolute after:inset-x-0 after:-bottom-[0.1875rem] after:h-1.5 after:bg-current',
    indicator:
      'after:absolute after:inset-y-0 after:-left-ark-4 after:w-(--ark-line-strong) after:bg-ark-signal',
  },
}

/** 一个导航项：`children` 是英文主行，`sub` 是中文小字。只能放在 `Nav` 里。 */
export function NavItem({
  href,
  sub,
  current = false,
  className,
  onClick,
  children,
  ...rest
}: NavItemProps) {
  const nav = useContext(NavContext)
  if (!nav) throw new Error('<NavItem> 必须放在 <Nav> 里')
  const layout = layouts[nav.layout]
  const isCurrent = current !== false
  return (
    <a
      data-ark="nav-item"
      href={href}
      aria-current={current === true ? 'page' : current || undefined}
      {...rest}
      onClick={event => {
        onClick?.(event)
        nav.close?.()
      }}
      className={cn(
        'relative box-border no-underline',
        layout.root,
        // 英文与中文同时变色
        isCurrent ? 'text-ark-signal-fg' : 'text-ark-fg hover:text-ark-signal-fg',
        isCurrent && nav.indicator && layout.indicator,
        colorTransition,
        focusRing,
        className,
      )}
    >
      <span
        className={cn('font-ark-latin-condensed font-ark-medium whitespace-nowrap', layout.main)}
      >
        {children}
      </span>
      {sub != null && (
        <span className={cn('font-ark-cjk-sans font-ark-medium whitespace-nowrap', layout.sub)}>
          {sub}
        </span>
      )}
    </a>
  )
}
