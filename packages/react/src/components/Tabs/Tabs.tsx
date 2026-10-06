import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import { colorTransition, focusRing, triangleRight } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type TabsVariant = 'block' | 'underline'

interface TabsContextValue {
  value: string | undefined
  select: (value: string) => void
  variant: TabsVariant
  tabId: (value: string) => string
  panelId: (value: string) => string
  // Tabs 也可以不配 TabPanel（纯筛选）。只有面板真的存在时，Tab 才输出 aria-controls
  hasPanel: (value: string) => boolean
  registerPanel: (value: string) => () => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`<${component}> 必须放在 <Tabs> 里`)
  return context
}

interface TabsOwnProps {
  /**
   * - `block`：选中项变成实心反白块，其余只留文字
   * - `underline`：选中项信号色文字 + 4px 底条，其余文字变灰
   * @default 'block'
   */
  variant?: TabsVariant
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
}

/** 受控用 `value`，非受控用 `defaultValue`，二者必须给一个。 */
export type TabsProps = TabsOwnProps &
  Omit<ComponentProps<'div'>, 'defaultValue'> &
  ({ value: string; defaultValue?: undefined } | { value?: undefined; defaultValue: string })

/**
 * 标签页。`Tabs` 管状态，`TabList` 放一排 `Tab`，`TabPanel` 放对应内容。
 *
 * 键盘：左右方向键在标签间移动并立即切换，Home / End 跳到首尾。
 */
export function Tabs({
  variant = 'block',
  value,
  defaultValue,
  onValueChange,
  ...rest
}: TabsProps) {
  const [inner, setInner] = useState(defaultValue)
  const [panels, setPanels] = useState<readonly string[]>([])
  const registerPanel = useCallback((panel: string) => {
    setPanels(list => [...list, panel])
    return () =>
      setPanels(list => {
        const index = list.indexOf(panel)
        return index === -1 ? list : list.filter((_, i) => i !== index)
      })
  }, [])
  const baseId = useId()
  const current = value ?? inner
  // id 不能含空白，否则 aria-controls 会被拆成多个引用
  const idFor = (kind: string, tab: string) => `${baseId}-${kind}-${tab.replace(/\s+/g, '_')}`

  const context: TabsContextValue = {
    value: current,
    variant,
    select: next => {
      if (value === undefined) setInner(next)
      if (next !== current) onValueChange?.(next)
    },
    tabId: tab => idFor('tab', tab),
    panelId: tab => idFor('panel', tab),
    hasPanel: tab => panels.includes(tab),
    registerPanel,
  }

  return (
    <TabsContext value={context}>
      <div data-ark="tabs" {...rest} />
    </TabsContext>
  )
}

export type TabListProps = ComponentProps<'div'>

/** 一排标签。请用 `aria-label` 说明这组标签切换的是什么。 */
export function TabList({ className, onKeyDown, ...rest }: TabListProps) {
  const { variant } = useTabs('TabList')

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    )
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (index === -1) return
    const last = tabs.length - 1
    let next: number
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    tabs[next]?.focus()
    tabs[next]?.click()
  }

  return (
    <div
      data-ark="tab-list"
      role="tablist"
      {...rest}
      onKeyDown={handleKeyDown}
      className={cn(
        'box-border flex items-center',
        variant === 'underline' ? 'gap-ark-5 border-b border-ark-rule' : 'gap-ark-1',
        className,
      )}
    />
  )
}

export interface TabProps extends Omit<ComponentProps<'button'>, 'value'> {
  /** 与对应 `TabPanel` 相同的标识。 */
  value: string
}

const tabBase = cn(
  'relative m-0 box-border inline-flex cursor-pointer appearance-none items-center justify-center gap-ark-2 border-0 bg-transparent',
  'font-ark-cjk-sans text-ark-label leading-ark-solid font-ark-bold whitespace-nowrap select-none',
  'disabled:cursor-not-allowed disabled:text-ark-neutral-gray-600',
  colorTransition,
  focusRing,
)

const tabVariants: Record<TabsVariant, string> = {
  // 反白块可见高度 28px，用 ::after 把点击区撑到 44px
  block: cn(
    'h-7 px-ark-3 text-ark-fg hover:text-ark-signal-fg',
    'aria-selected:bg-ark-invert aria-selected:text-ark-on-invert',
    'after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2',
  ),
  underline: cn(
    'h-11 min-w-11 px-ark-1 text-ark-fg-muted hover:text-ark-fg aria-selected:text-ark-signal-fg',
    // 底条压在 TabList 的细线上
    'before:absolute before:inset-x-0 before:-bottom-px before:h-(--ark-line-strong) before:bg-ark-signal before:opacity-0',
    'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
    'aria-selected:before:opacity-100',
  ),
}

export function Tab({ value, className, onClick, children, ...rest }: TabProps) {
  const tabs = useTabs('Tab')
  const selected = tabs.value === value
  return (
    <button
      data-ark="tab"
      type="button"
      role="tab"
      id={tabs.tabId(value)}
      aria-selected={selected}
      // 未选中项的面板不在 DOM 里，引用它会成为悬空的 id
      aria-controls={selected && tabs.hasPanel(value) ? tabs.panelId(value) : undefined}
      // 只有选中项在 Tab 键序列里，其余用方向键到达
      tabIndex={selected ? 0 : -1}
      {...rest}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) tabs.select(value)
      }}
      className={cn(tabBase, tabVariants[tabs.variant], className)}
    >
      {children}
      {tabs.variant === 'block' && selected && (
        <span aria-hidden="true" className={cn(triangleRight, 'text-ark-signal')} />
      )}
    </button>
  )
}

export interface TabPanelProps extends ComponentProps<'div'> {
  /** 与对应 `Tab` 相同的标识。 */
  value: string
}

/** 只渲染选中项对应的面板。 */
export function TabPanel({ value, className, ...rest }: TabPanelProps) {
  const tabs = useTabs('TabPanel')
  const { registerPanel } = tabs
  useEffect(() => registerPanel(value), [registerPanel, value])
  if (tabs.value !== value) return null
  return (
    <div
      data-ark="tab-panel"
      role="tabpanel"
      id={tabs.panelId(value)}
      aria-labelledby={tabs.tabId(value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA 标签页模式要求面板可聚焦，键盘用户才能从标签直接进入内容
      tabIndex={0}
      {...rest}
      className={cn('box-border', focusRing, className)}
    />
  )
}
