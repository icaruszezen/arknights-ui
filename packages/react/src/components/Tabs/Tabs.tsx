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
import { ChevronRightIcon } from '../../internal/icons'
import { handleRovingKeyDown } from '../../internal/roving'
import { colorTransition, focusRing, hitAreaCoarse, thinScrollbar } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type TabsVariant = 'block' | 'underline' | 'segment'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsSize = 'sm' | 'md'

interface TabsContextValue {
  value: string | undefined
  select: (value: string) => void
  variant: TabsVariant
  orientation: TabsOrientation
  size: TabsSize
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
   * - `block`：选中项变成信号色实心块、右端一个折线箭头，其余只留文字（官网新闻分类）
   * - `underline`：选中项信号色文字 + 4px 的条，其余文字变灰。竖排时条在左缘
   * - `segment`：每一项都有底块，选中项明暗对调。横排连成一条，竖排各自成块、留一道缝
   * @default 'underline'
   */
  variant?: TabsVariant
  /**
   * 排的方向。项数不多、每项要配图标时竖着排在一侧（设置页的分类）。
   * 竖排时 `Tabs` 自己是左右两栏：标签一栏，面板一栏。
   * @default 'horizontal'
   */
  orientation?: TabsOrientation
  /**
   * @default 'md'
   */
  size?: TabsSize
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
 * 键盘：方向键在标签间移动并立即切换（横排左右、竖排上下），Home / End 跳到首尾。
 */
export function Tabs({
  variant = 'underline',
  orientation = 'horizontal',
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  className,
  ...rest
}: TabsProps) {
  const [current, select] = useControllableState(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
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
  // id 不能含空白，否则 aria-controls 会被拆成多个引用
  const idFor = (kind: string, tab: string) => `${baseId}-${kind}-${tab.replace(/\s+/g, '_')}`

  const context: TabsContextValue = {
    value: current,
    variant,
    orientation,
    size,
    select,
    tabId: tab => idFor('tab', tab),
    panelId: tab => idFor('panel', tab),
    hasPanel: tab => panels.includes(tab),
    registerPanel,
  }

  return (
    <TabsContext value={context}>
      <div
        data-ark="tabs"
        data-orientation={orientation}
        {...rest}
        className={cn(
          orientation === 'vertical' && 'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-ark-5',
          className,
        )}
      />
    </TabsContext>
  )
}

export type TabListProps = ComponentProps<'div'>

// 放不下时：实心块折行（官网的新闻分类本来就是一行行的块）；底条和分段块在自己的一行里横向滚动
const horizontalLists: Record<TabsVariant, string> = {
  block: 'flex-wrap items-center gap-x-ark-4 gap-y-ark-3',
  // 底下那条细线画成内阴影：滚动的容器会裁掉画在边框上的东西，选中项的条要能压在线上
  underline: cn(
    'relative max-w-full items-center gap-ark-5 overflow-x-auto shadow-[inset_0_-1px_0_var(--ark-rule)]',
    thinScrollbar,
  ),
  // 连成一条，项与项之间靠一条短竖线分开（画在 Tab 上）
  segment: cn('relative max-w-full items-center gap-0 overflow-x-auto', thinScrollbar),
}
const verticalLists: Record<TabsVariant, string> = {
  block: 'flex-col items-stretch gap-ark-3',
  underline: 'flex-col items-stretch border-l border-ark-rule',
  // 各自成块，块与块之间留一道缝（实机设置页的写法）
  segment: 'flex-col items-stretch gap-ark-2',
}

/** 一排标签。请用 `aria-label` 说明这组标签切换的是什么。 */
export function TabList({ className, onKeyDown, ...rest }: TabListProps) {
  const { variant, orientation } = useTabs('TabList')

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    handleRovingKeyDown(event, '[role="tab"]:not(:disabled)', orientation)
  }

  return (
    <div
      data-ark="tab-list"
      role="tablist"
      aria-orientation={orientation}
      {...rest}
      onKeyDown={handleKeyDown}
      className={cn(
        'box-border flex',
        orientation === 'vertical' ? verticalLists[variant] : horizontalLists[variant],
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
  'relative m-0 box-border inline-flex cursor-pointer appearance-none items-center gap-ark-2 border-0 bg-transparent',
  'font-ark-cjk-sans leading-ark-solid font-ark-bold whitespace-nowrap select-none',
  'disabled:cursor-not-allowed disabled:text-ark-on-disabled',
  colorTransition,
  focusRing,
)

const selectedSignal =
  'aria-selected:bg-ark-signal aria-selected:text-ark-on-signal aria-selected:hover:text-ark-on-signal'
const selectedInvert =
  'aria-selected:border-ark-invert aria-selected:bg-ark-invert aria-selected:text-ark-on-invert aria-selected:hover:bg-ark-invert aria-selected:hover:text-ark-on-invert'

const horizontalTabs: Record<TabsVariant, Record<TabsSize, string>> = {
  // 官网实测：5.625rem × 1.25rem 的块，文字贴左、箭头贴右，选中是信号色底加黑字。
  // 可见高度只有 20px，触屏上用 ::after 把点击区撑到 44px
  block: {
    md: cn(
      'h-5 min-w-[5.625rem] justify-start pr-ark-2 pl-0.5 text-ark-base text-ark-fg hover:text-ark-signal-fg',
      selectedSignal,
      hitAreaCoarse,
    ),
    sm: cn(
      'h-4 min-w-18 justify-start pr-ark-1 pl-0.5 text-ark-label text-ark-fg hover:text-ark-signal-fg',
      selectedSignal,
      hitAreaCoarse,
    ),
  },
  segment: {
    md: cn(
      'h-9 justify-center bg-ark-control px-ark-4 text-ark-base text-ark-fg-secondary hover:bg-ark-fg/20 hover:text-ark-fg',
      selectedInvert,
      // 项与项之间一条半高的短竖线；选中项和它右边那一项不画
      'not-first:before:absolute not-first:before:top-1/4 not-first:before:left-0 not-first:before:h-1/2 not-first:before:w-px not-first:before:bg-ark-fg/40',
      'aria-selected:before:hidden [[aria-selected=true]+&]:before:hidden',
      hitAreaCoarse,
    ),
    sm: cn(
      'h-7 justify-center bg-ark-control px-ark-3 text-ark-label text-ark-fg-secondary hover:bg-ark-fg/20 hover:text-ark-fg',
      selectedInvert,
      'not-first:before:absolute not-first:before:top-1/4 not-first:before:left-0 not-first:before:h-1/2 not-first:before:w-px not-first:before:bg-ark-fg/40',
      'aria-selected:before:hidden [[aria-selected=true]+&]:before:hidden',
      hitAreaCoarse,
    ),
  },
  underline: {
    md: cn(
      'h-11 min-w-11 justify-center px-ark-1 text-ark-label text-ark-fg-muted hover:text-ark-fg aria-selected:text-ark-signal-fg',
      // 条压在 TabList 的细线上（那条线画在列表的最下面一像素里）
      'before:absolute before:inset-x-0 before:bottom-0 before:h-(--ark-line-strong) before:bg-ark-signal before:opacity-0',
      'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
      'aria-selected:before:opacity-100',
    ),
    sm: cn(
      'h-9 min-w-9 justify-center px-ark-1 text-ark-caption text-ark-fg-muted hover:text-ark-fg aria-selected:text-ark-signal-fg',
      'before:absolute before:inset-x-0 before:bottom-0 before:h-(--ark-line-strong) before:bg-ark-signal before:opacity-0',
      'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
      'aria-selected:before:opacity-100',
      hitAreaCoarse,
    ),
  },
}

const verticalTabs: Record<TabsVariant, Record<TabsSize, string>> = {
  block: {
    md: cn(
      'h-6 justify-start pr-ark-2 pl-ark-1 text-ark-base text-ark-fg hover:text-ark-signal-fg',
      selectedSignal,
      hitAreaCoarse,
    ),
    sm: cn(
      'h-5 justify-start pr-ark-1 pl-ark-1 text-ark-label text-ark-fg hover:text-ark-signal-fg',
      selectedSignal,
      hitAreaCoarse,
    ),
  },
  // 实机设置页：每一块是控件的底加一圈细边，图标加文字，选中反白
  segment: {
    md: cn(
      'min-h-12 justify-start border border-ark-rule bg-ark-control px-ark-4 text-ark-base text-ark-fg hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
      selectedInvert,
    ),
    sm: cn(
      'min-h-10 justify-start border border-ark-rule bg-ark-control px-ark-3 text-ark-label text-ark-fg hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
      selectedInvert,
    ),
  },
  // 官网阵营切换：左缘一条粗边，当前项连边带字一起换成信号色
  underline: {
    md: cn(
      'min-h-11 justify-start px-ark-4 text-ark-label text-ark-fg-muted hover:text-ark-fg aria-selected:text-ark-signal-fg',
      'before:absolute before:inset-y-0 before:-left-px before:w-(--ark-line-strong) before:bg-ark-signal before:opacity-0',
      'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
      'aria-selected:before:opacity-100',
    ),
    sm: cn(
      'min-h-9 justify-start px-ark-3 text-ark-caption text-ark-fg-muted hover:text-ark-fg aria-selected:text-ark-signal-fg',
      'before:absolute before:inset-y-0 before:-left-px before:w-(--ark-line-strong) before:bg-ark-signal before:opacity-0',
      'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
      'aria-selected:before:opacity-100',
      hitAreaCoarse,
    ),
  },
}

export function Tab({ value, className, onClick, children, ...rest }: TabProps) {
  const tabs = useTabs('Tab')
  const selected = tabs.value === value
  const styles = tabs.orientation === 'vertical' ? verticalTabs : horizontalTabs
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
      className={cn(tabBase, styles[tabs.variant][tabs.size], className)}
    >
      {children}
      {tabs.variant === 'block' && selected && (
        // 箭头跟着文字的颜色，贴在块的右端
        <ChevronRightIcon className="ml-auto h-3.5 w-[0.4375rem] shrink-0" />
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
