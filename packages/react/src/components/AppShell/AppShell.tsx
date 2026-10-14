import { type ComponentProps, type ReactNode, useEffect, useState } from 'react'
import { MenuIcon } from '../../internal/icons'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Drawer } from '../Drawer'

export interface AppShellProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 内容区。 */
  children?: ReactNode
  /** 页头里的内容：标识、搜索、账号。窄屏时它前面多一个菜单按钮。 */
  header?: ReactNode
  /** 侧栏里的内容，通常是一个竖排的 `Nav`。窄屏时它收进从左边滑出来的抽屉。 */
  sidebar?: ReactNode
  /**
   * 窄屏抽屉的标题，也是菜单按钮的名称。
   * @default '导航'
   */
  sidebarLabel?: string
  /**
   * 内容区渲染成哪个元素。一页只能有一个 `<main>`。
   * @default 'main'
   */
  contentAs?: 'main' | 'div' | 'section'
}

/**
 * 应用的固定骨架：顶上一条页头，左边一条侧栏，其余是内容区。换页只换内容区，
 * 页头和侧栏原地不动——导航永远在同一个地方。区与区之间只有 1px 的细线。
 *
 * 默认铺满视口，内容区自己滚动。窄屏（窄于 48rem）时侧栏收起，页头最左出现一个菜单按钮，
 * 点开是从左边滑出来的抽屉；点了里面的链接抽屉就关上。
 *
 * 侧栏的内容在页面里和抽屉里各渲染一份，同一时刻只有一份可见，所以不要给里面的元素写死 `id`。
 */
export function AppShell({
  header,
  sidebar,
  sidebarLabel = '导航',
  contentAs: Content = 'main',
  className,
  children,
  ...rest
}: AppShellProps) {
  const [open, setOpen] = useState(false)

  // 抽屉开着的时候视口变宽：侧栏已经回来了，把抽屉关掉
  useEffect(() => {
    if (!open || typeof window.matchMedia !== 'function') return
    const wide = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [open])

  const hasSidebar = sidebar != null && sidebar !== false
  return (
    <div
      data-ark="app-shell"
      {...rest}
      className={cn(
        'box-border grid h-dvh grid-rows-[auto_minmax(0,1fr)] bg-ark-canvas font-ark-cjk-sans text-ark-fg',
        hasSidebar ? 'grid-cols-[minmax(0,1fr)] md:grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-1',
        className,
      )}
    >
      <header className="col-span-full box-border flex min-h-14 items-center gap-ark-3 border-b border-ark-rule px-ark-4">
        {hasSidebar && (
          <button
            type="button"
            aria-label={sidebarLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cn(
              '-ml-ark-2 box-border grid size-10 shrink-0 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-ark-fg md:hidden',
              'hover:bg-ark-invert hover:text-ark-on-invert',
              colorTransition,
              focusRing,
            )}
          >
            <MenuIcon className="size-5" />
          </button>
        )}
        {header}
      </header>
      {hasSidebar && (
        <aside
          data-ark="app-shell-sidebar"
          aria-label={sidebarLabel}
          className="box-border hidden w-60 overflow-y-auto border-r border-ark-rule py-ark-3 md:block"
        >
          {sidebar}
        </aside>
      )}
      <Content data-ark="app-shell-content" className="box-border min-w-0 overflow-y-auto">
        {children}
      </Content>
      {hasSidebar && (
        <Drawer
          side="left"
          size="sm"
          open={open}
          onOpenChange={setOpen}
          title={sidebarLabel}
          // 点了里面的链接：要去别的页了，把抽屉关上
          onClick={event => {
            if ((event.target as Element).closest('a')) setOpen(false)
          }}
          className="[&_[data-ark=nav]]:-mx-ark-5"
        >
          {sidebar}
        </Drawer>
      )}
    </div>
  )
}
