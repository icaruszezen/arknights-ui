import {
  Children,
  type ComponentProps,
  createContext,
  Fragment,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'
import { useFieldControl } from '../../internal/field'
import { CheckIcon, ChevronDownIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useControllableState } from '../../utils/useControllableState'
import { floatingReset, useFloating } from '../../utils/useFloating'

export type SelectSize = 'sm' | 'md' | 'lg'

interface SelectContextValue {
  value: string | undefined
  active: string | undefined
  optionId: (value: string) => string
  select: (value: string) => void
  setActive: (value: string) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

export interface SelectProps
  extends Omit<ComponentProps<'button'>, 'value' | 'defaultValue' | 'onChange' | 'children'> {
  /** 若干个 `SelectOption`，直接写在里面（可以包一层 Fragment）。 */
  children: ReactNode
  /** 选中的值。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始选中的值（非受控）。 */
  defaultValue?: string
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
  /** 还没有选的时候显示的灰字。 */
  placeholder?: ReactNode
  /** 表单里的字段名。给了就带一个隐藏的输入框，表单提交时带上选中的值。 */
  name?: string
  /**
   * 高度：2rem / 2.5rem / 3rem。
   * @default 'md'
   */
  size?: SelectSize
  /** 不合法：底边换成红色。放在带 `error` 的 `Field` 里时不用传。 */
  invalid?: boolean
}

interface OptionData {
  value: string
  label: ReactNode
  text: string
  disabled: boolean
}

const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

const sizes: Record<SelectSize, string> = {
  sm: 'h-(--ark-size-control-sm) gap-ark-2 pr-ark-2 pl-ark-2 text-ark-label',
  md: 'h-(--ark-size-control-md) gap-ark-2 pr-ark-3 pl-ark-3 text-ark-label',
  lg: 'h-(--ark-size-control-lg) gap-ark-3 pr-ark-4 pl-ark-4 text-ark-base',
}

/**
 * 下拉：选项多到摆不开时才用。两三个选项请直接摆出来（`SegmentedControl`）。
 *
 * 当前项是一块深色的底，左缘一条 4px 的信号色边；展开的选项用与主题相反的面——
 * “已选的”和“可选的”在明暗上是反的（官网语音下拉的写法）。
 *
 * 键盘：上下方向键打开并移动，Home / End 跳到首尾，按字符跳到以它开头的那一项，
 * Enter 或空格选中，Esc 关闭。请用 `aria-label` 命名，放在 `Field` 里则不用。
 */
export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  name,
  size = 'md',
  invalid,
  className,
  ref,
  onClick,
  onKeyDown,
  ...rest
}: SelectProps) {
  const control = useFieldControl(rest, invalid)
  const listId = useId()
  const [current, setCurrent] = useControllableState(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>()
  const typed = useRef({ text: '', at: 0 })

  // 选项的清单从子元素上读：触发行要显示当前项的文字，键盘要知道有哪些可以到。
  // Fragment 会展开；包在别的组件里的选项读不到
  const options: OptionData[] = []
  const collect = (nodes: ReactNode) => {
    Children.forEach(nodes, child => {
      if (!isValidElement<SelectOptionProps>(child)) return
      if (child.type === Fragment) {
        collect(child.props.children)
        return
      }
      if (child.props.value === undefined) return
      options.push({
        value: child.props.value,
        label: child.props.children,
        text: textOf(child.props.children),
        disabled: child.props.disabled === true,
      })
    })
  }
  collect(children)
  const enabled = options.filter(option => !option.disabled)
  const selected = options.find(option => option.value === current)

  const { anchorRef, floatingRef, floatingProps } = useFloating<HTMLButtonElement, HTMLDivElement>({
    open,
    onDismiss: () => setOpen(false),
    matchWidth: true,
  })
  const optionId = (option: string) => `${listId}-${option.replace(/\s+/g, '_')}`

  const show = (start?: string) => {
    setActive(start ?? selected?.value ?? enabled[0]?.value)
    setOpen(true)
  }
  const choose = (next: string) => {
    setCurrent(next)
    setOpen(false)
    anchorRef.current?.focus()
  }
  const move = (delta: number | 'first' | 'last') => {
    if (enabled.length === 0) return
    const index = enabled.findIndex(option => option.value === active)
    const next =
      delta === 'first'
        ? 0
        : delta === 'last'
          ? enabled.length - 1
          : Math.min(Math.max(index + delta, 0), enabled.length - 1)
    setActive(enabled[next]?.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const { key } = event
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      if (!open) show()
      else move(key === 'ArrowDown' ? 1 : -1)
    } else if (key === 'Home' || key === 'End') {
      if (!open) return
      event.preventDefault()
      move(key === 'Home' ? 'first' : 'last')
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (!open) show()
      else if (active !== undefined) choose(active)
    } else if (key === 'Tab') {
      setOpen(false)
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // 连着敲的字符拼成一个前缀；停半秒重新开始
      const now = Date.now()
      const text = (now - typed.current.at > 500 ? '' : typed.current.text) + key.toLowerCase()
      typed.current = { text, at: now }
      const match = enabled.find(option => option.text.toLowerCase().startsWith(text))
      if (!match) return
      if (open) setActive(match.value)
      else setCurrent(match.value)
    }
  }

  return (
    <>
      <button
        type="button"
        role="combobox"
        data-ark="select"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active !== undefined ? optionId(active) : undefined}
        {...control}
        ref={mergeRefs(anchorRef, ref)}
        onClick={event => {
          onClick?.(event)
          if (event.defaultPrevented) return
          if (open) setOpen(false)
          else show()
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'm-0 box-border flex w-full cursor-pointer appearance-none items-center border-0 border-b border-solid border-b-ark-rule-strong bg-ark-control text-left font-ark-cjk-sans text-ark-fg',
          // 当前项左缘的那条信号色边
          'border-l-(length:--ark-line-strong) border-l-ark-signal',
          'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ark-fg',
          'aria-expanded:border-b-ark-signal aria-[invalid=true]:border-b-ark-signal-danger',
          'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-ark-disabled disabled:text-ark-on-disabled',
          sizes[size],
          className,
        )}
      >
        <span
          className={cn('min-w-0 grow truncate', selected === undefined && 'text-ark-fg-muted')}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            'h-1.5 w-3 shrink-0 transition-[rotate] duration-(--ark-motion-duration-base) motion-reduce:transition-none',
            open && 'rotate-180',
          )}
        />
      </button>
      {name !== undefined && <input type="hidden" name={name} value={current ?? ''} />}
      {open && (
        <SelectContext value={{ value: current, active, optionId, select: choose, setActive }}>
          <div
            {...floatingProps}
            ref={floatingRef}
            id={listId}
            role="listbox"
            // 展开的选项是反色的面：暗色主题里是白底深字
            data-ark-tone="inverse"
            data-ark="select-list"
            className={cn(
              floatingReset,
              'grid max-h-[min(20rem,60dvh)] overflow-y-auto bg-ark-surface py-ark-1 font-ark-cjk-sans drop-shadow-ark-panel',
              'animate-ark-fade-in',
            )}
          >
            {children}
          </div>
        </SelectContext>
      )}
    </>
  )
}

export interface SelectOptionProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  /** 这一项的值。 */
  value: string
  /** 不可选。 */
  disabled?: boolean
}

/**
 * 下拉里的一项，`children` 是它显示的文字。指到或用方向键移到的那一项，文字变成信号色、左缘出一条色边；
 * 已选的那一项加粗并带一个对勾。只能直接放在 `Select` 里。
 */
export function SelectOption({
  value,
  disabled = false,
  className,
  children,
  ...rest
}: SelectOptionProps) {
  const select = useContext(SelectContext)
  // 不在展开的列表里（Select 只是从它身上读值和文字）时不渲染
  if (!select) return null
  const selected = select.value === value
  const active = select.active === value
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 焦点留在触发按钮上，键盘操作由它处理（aria-activedescendant）
    // biome-ignore lint/a11y/useFocusableInteractive: 同上，选项本身不进焦点序列
    <div
      data-ark="select-option"
      role="option"
      id={select.optionId(value)}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      {...rest}
      onPointerMove={() => {
        if (!disabled && !active) select.setActive(value)
      }}
      onClick={() => {
        if (!disabled) select.select(value)
      }}
      className={cn(
        'box-border flex min-h-9 cursor-pointer items-center gap-ark-2 border-l-(length:--ark-line-strong) border-l-transparent px-ark-3 py-ark-1 text-ark-label leading-ark-snug text-ark-fg-secondary',
        'transition-colors duration-(--ark-motion-duration-fast) ease-ark-standard',
        'data-active:border-l-ark-signal data-active:bg-ark-fg/10 data-active:text-ark-signal-fg',
        'aria-selected:font-ark-bold aria-selected:text-ark-fg aria-selected:data-active:text-ark-signal-fg',
        'aria-disabled:cursor-not-allowed aria-disabled:text-ark-on-disabled',
        className,
      )}
    >
      <span className="min-w-0 grow">{children}</span>
      {selected && <CheckIcon className="size-4 shrink-0" />}
    </div>
  )
}
