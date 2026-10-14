import {
  type ComponentProps,
  cloneElement,
  createContext,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useId,
} from 'react'
import { handleRovingKeyDown } from '../../internal/roving'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useControllableState } from '../../utils/useControllableState'
import { type FloatingPlacement, floatingReset, useFloating } from '../../utils/useFloating'

interface MenuContextValue {
  /** 选了一项之后关掉菜单，焦点回到触发元素。 */
  close: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

interface TriggerProps {
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void
  'aria-haspopup'?: 'menu'
  'aria-expanded'?: boolean
  'aria-controls'?: string
}

export interface MenuProps extends ComponentProps<'div'> {
  /** 点了会展开菜单的元素，通常是一个 `Button` 或 `IconButton`。它要能接收 `ref` 和 `onClick`。 */
  trigger: ReactElement<TriggerProps>
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open?: boolean
  /** 一开始是否打开（非受控）。 */
  defaultOpen?: boolean
  /** 开合变化时调用。 */
  onOpenChange?: (open: boolean) => void
  /**
   * @default 'bottom-start'
   */
  placement?: FloatingPlacement
}

const ITEMS = '[role="menuitem"]:not([aria-disabled="true"])'

/**
 * 菜单：点一下触发元素，展开一列操作。子元素是若干个 `MenuItem`，可以用 `MenuSeparator` 分组。
 *
 * 键盘：上下方向键在各项之间移动，Home / End 跳到首尾，按一个字符跳到以它开头的那一项；
 * Enter 或空格执行，Esc 或 Tab 关闭。选了任何一项都会关闭，焦点回到触发元素。
 */
export function Menu({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  className,
  onKeyDown,
  children,
  ...rest
}: MenuProps) {
  const id = useId()
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const { anchorRef, floatingRef, floatingProps } = useFloating<HTMLElement, HTMLDivElement>({
    open: isOpen,
    onDismiss: () => close(),
    placement,
  })
  const close = () => {
    setOpen(false)
    anchorRef.current?.focus()
  }

  // 打开后焦点落在第一项上
  useEffect(() => {
    if (isOpen) floatingRef.current?.querySelector<HTMLElement>(ITEMS)?.focus()
  }, [isOpen, floatingRef])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (handleRovingKeyDown(event, ITEMS, 'vertical', false)) return
    if (event.key === 'Tab') {
      // Tab 离开菜单：关掉，让焦点从触发元素接着往下走
      setOpen(false)
      return
    }
    // 按一个字符：跳到当前项之后第一个以它开头的
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEMS))
    const start = items.indexOf(document.activeElement as HTMLElement)
    const ordered = [...items.slice(start + 1), ...items.slice(0, start + 1)]
    const key = event.key.toLowerCase()
    ordered.find(item => item.textContent?.trim().toLowerCase().startsWith(key))?.focus()
  }

  const props = trigger.props
  return (
    <>
      {cloneElement(trigger, {
        ref: mergeRefs(anchorRef, props.ref),
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? id : undefined,
        onClick: event => {
          props.onClick?.(event)
          if (!event.defaultPrevented) setOpen(!isOpen)
        },
        onKeyDown: event => {
          props.onKeyDown?.(event)
          // 触发元素上按下方向键也打开
          if (event.key === 'ArrowDown' && !isOpen) {
            event.preventDefault()
            setOpen(true)
          }
        },
      })}
      {isOpen && (
        <MenuContext value={{ close }}>
          <div
            {...floatingProps}
            {...rest}
            style={{ ...floatingProps.style, ...rest.style }}
            ref={floatingRef}
            id={id}
            role="menu"
            data-ark="menu"
            onKeyDown={handleKeyDown}
            className={cn(
              floatingReset,
              'grid w-max max-w-[min(20rem,100vw-1rem)] min-w-40 border border-ark-rule bg-ark-surface-raised py-ark-1 font-ark-cjk-sans drop-shadow-ark-panel',
              'animate-ark-fade-in',
              className,
            )}
          >
            {children}
          </div>
        </MenuContext>
      )}
    </>
  )
}

interface MenuItemOwnProps {
  /** 选了这一项时调用（点击、Enter、空格）。随后菜单关闭；调用 `event.preventDefault()` 可以让它留着。 */
  onSelect?: (event: MouseEvent<HTMLElement>) => void
  /** 文字前面的图标，对读屏隐藏。 */
  icon?: ReactNode
  /** 贴右的灰色小字：快捷键、当前的值。 */
  shortcut?: ReactNode
  /** 危险的操作（删除）：文字是红色。 */
  danger?: boolean
  /** 不可用：方向键会跳过它，点了也不执行。读屏仍然读得到。 */
  disabled?: boolean
}

type MenuItemAsButton = MenuItemOwnProps &
  Omit<ComponentProps<'button'>, keyof MenuItemOwnProps | 'onSelect'> & {
    href?: undefined
    as?: undefined
  }
type MenuItemAsAnchor = MenuItemOwnProps &
  Omit<ComponentProps<'a'>, keyof MenuItemOwnProps | 'onSelect'> & {
    href: string
    /**
     * 用来渲染链接的组件，接路由库的 `Link`。
     * @default 'a'
     */
    as?: ElementType
  }

/** 传入 `href` 时渲染为链接，否则渲染为按钮。 */
export type MenuItemProps = MenuItemAsButton | MenuItemAsAnchor

/** 菜单里的一项。悬停和聚焦都是整行反色。只能放在 `Menu` 里。 */
export function MenuItem(props: MenuItemProps) {
  const {
    onSelect,
    icon,
    shortcut,
    danger = false,
    disabled = false,
    className,
    children,
    onClick,
    ...rest
  } = props
  const menu = useContext(MenuContext)
  if (!menu) throw new Error('<MenuItem> 必须放在 <Menu> 里')

  const classes = cn(
    'm-0 box-border flex min-h-9 w-full cursor-pointer appearance-none items-center gap-ark-2 border-0 bg-transparent px-ark-3 py-ark-1 text-left font-ark-cjk-sans text-ark-label leading-ark-snug no-underline outline-none',
    danger ? 'text-ark-danger-fg' : 'text-ark-fg',
    // 悬停与键盘聚焦是同一种反馈：整行反色
    'hover:bg-ark-invert hover:text-ark-on-invert focus-visible:bg-ark-invert focus-visible:text-ark-on-invert',
    'aria-disabled:cursor-not-allowed aria-disabled:text-ark-on-disabled aria-disabled:hover:bg-transparent aria-disabled:hover:text-ark-on-disabled',
    'transition-colors duration-(--ark-motion-duration-fast) ease-ark-standard',
    className,
  )
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    ;(onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event)
    onSelect?.(event)
    if (!event.defaultPrevented) menu.close()
  }
  const content = (
    <>
      {icon != null && (
        <span
          aria-hidden="true"
          className="grid size-4 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 grow">{children}</span>
      {shortcut != null && (
        <span className="shrink-0 pl-ark-4 font-ark-data text-ark-caption opacity-70">
          {shortcut}
        </span>
      )}
    </>
  )

  if (rest.href !== undefined) {
    const { as: Link = 'a', ...anchor } = rest
    return (
      <Link
        data-ark="menu-item"
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        {...anchor}
        onClick={handleClick}
        className={classes}
      >
        {content}
      </Link>
    )
  }
  const { as: _, ...button } = rest
  return (
    <button
      data-ark="menu-item"
      type="button"
      role="menuitem"
      tabIndex={-1}
      // 用 aria-disabled 而不是 disabled：禁用的项仍然留在无障碍树里，读屏读得到
      aria-disabled={disabled || undefined}
      {...button}
      onClick={handleClick}
      className={classes}
    >
      {content}
    </button>
  )
}

/** 菜单里的一条细线，把操作分成几组。 */
export function MenuSeparator({ className, ...rest }: ComponentProps<'hr'>) {
  return (
    <hr
      data-ark="menu-separator"
      {...rest}
      className={cn('m-0 my-ark-1 h-px border-0 bg-ark-rule', className)}
    />
  )
}

/** 菜单里一组操作上面的小标题：窄体的灰色小字，不能选。 */
export function MenuLabel({ className, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      data-ark="menu-label"
      {...rest}
      className={cn(
        'box-border px-ark-3 pt-ark-2 pb-ark-1 font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase',
        className,
      )}
    />
  )
}
