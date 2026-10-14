import { type ComponentProps, createContext, type ReactNode, useContext } from 'react'
import { handleRadioGroupKeyDown, RadioGroupContext, useRadioItem } from '../../internal/radioGroup'
import { brighterMuted, colorTransition, focusRing, thinScrollbar } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type ClassFilterOrientation = 'horizontal' | 'vertical'

const IconOnlyContext = createContext(false)

export interface ClassFilterProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  /** 选中项。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始的选中项（非受控）。通常是“全部”。 */
  defaultValue?: string
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
  /**
   * 排列方向。
   * - `horizontal`：横排，放在列表的上方
   * - `vertical`：竖排，贴在列表的右边——实机干员列表里的那一列
   * @default 'horizontal'
   */
  orientation?: ClassFilterOrientation
  /**
   * 只显示图标，名称只读给读屏。实机的那一列只有图标；每一项都给了 `icon` 时才用它。
   * @default false
   */
  iconOnly?: boolean
}

// 四周留 4px：滚动的容器会裁掉溢出的部分，焦点轮廓要落在这圈留白里
const layouts: Record<ClassFilterOrientation, string> = {
  horizontal: 'max-w-full overflow-x-auto',
  vertical: 'max-h-full flex-col overflow-y-auto',
}

/**
 * 干员列表的职业筛选：图标排成一排（或贴在右边的一竖列），当前项是信号色的实底。
 *
 * 子元素是若干个 `ClassFilterItem`，同一时刻只选中一个。它是一个单选组：
 * Tab 进到选中项，方向键移动并立即切换，Home / End 跳到首尾。
 * 请用 `aria-label` 说明筛选的是什么。放不下时滚动，而不是把图标缩小。
 *
 * 排序方式、升降序这些并列的操作不在里面，和它并排放在同一行就行。
 */
export function ClassFilter({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  iconOnly = false,
  className,
  onKeyDown,
  ...rest
}: ClassFilterProps) {
  const [current, select] = useControllableState<string | undefined>(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  return (
    <RadioGroupContext value={{ value: current, select }}>
      <IconOnlyContext value={iconOnly}>
        <div
          data-ark="class-filter"
          data-ark-tone="dark"
          role="radiogroup"
          aria-orientation={orientation}
          {...rest}
          onKeyDown={event => {
            onKeyDown?.(event)
            handleRadioGroupKeyDown(event)
          }}
          className={cn(
            'box-border inline-flex gap-ark-1 bg-ark-neutral-black/65 p-ark-1 font-ark-cjk-sans text-ark-fg',
            layouts[orientation],
            brighterMuted,
            thinScrollbar,
            className,
          )}
        />
      </IconOnlyContext>
    </RadioGroupContext>
  )
}

export interface ClassFilterItemProps extends Omit<ComponentProps<'button'>, 'value'> {
  /** 这一项的标识。 */
  value: string
  /** 职业图标，通常是一个 `Icon`。组件库不带图标，请自备；它对读屏隐藏，含义由文字给出。 */
  icon?: ReactNode
}

/**
 * 筛选里的一项：图标在上，名称在下——图标要配文字，不要只放一个图标让人猜。
 * `children` 是名称；`ClassFilter` 开了 `iconOnly` 时名称只读给读屏。只能放在 `ClassFilter` 里。
 */
export function ClassFilterItem({
  value,
  icon,
  className,
  onClick,
  children,
  ...rest
}: ClassFilterItemProps) {
  const { radioProps } = useRadioItem(value, 'ClassFilterItem', 'ClassFilter', onClick)
  const iconOnly = useContext(IconOnlyContext)
  return (
    <button
      data-ark="class-filter-item"
      {...rest}
      {...radioProps}
      className={cn(
        'relative m-0 box-border inline-grid h-12 min-w-12 shrink-0 cursor-pointer appearance-none content-center justify-items-center gap-ark-1 border-0 bg-transparent px-ark-2 text-ark-fg-secondary select-none',
        // 当前项整块换成信号色的实底：颜色之外，底也变了。悬停只给没选中的项
        'not-aria-checked:hover:text-ark-signal-fg aria-checked:bg-ark-signal aria-checked:text-ark-on-signal',
        'disabled:cursor-not-allowed disabled:text-ark-neutral-gray-600',
        colorTransition,
        focusRing,
        className,
      )}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          iconOnly
            ? 'sr-only'
            : 'text-ark-caption leading-ark-solid font-ark-bold whitespace-nowrap',
        )}
      >
        {children}
      </span>
    </button>
  )
}
