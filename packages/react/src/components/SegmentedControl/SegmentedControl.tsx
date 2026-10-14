import { type ComponentProps, createContext, type ReactNode, useContext, useId } from 'react'
import { useFieldGroup } from '../../internal/field'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type SegmentedControlVariant = 'linked' | 'joined'
export type SegmentedControlSize = 'sm' | 'md' | 'lg'

interface SegmentedContextValue {
  name: string
  value: string | undefined
  select: (value: string) => void
  disabled: boolean
  variant: SegmentedControlVariant
  size: SegmentedControlSize
  block: boolean
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null)

export interface SegmentedControlProps
  extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** 表单里的字段名。不给时自动生成一个，只用来把这一组连在一起。 */
  name?: string
  /** 选中的值。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始选中的值（非受控）。 */
  defaultValue?: string
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
  /**
   * - `linked`：块与块之间留一道缝，缝的正中一条细线把它们串起来，像一根轴上的几个档位（实机设置页）
   * - `joined`：连成一条，只留很窄的缝，省地方
   * @default 'linked'
   */
  variant?: SegmentedControlVariant
  /**
   * 高度：2rem / 2.5rem / 3rem。
   * @default 'md'
   */
  size?: SegmentedControlSize
  /** 撑满容器宽度，各块等宽。 */
  block?: boolean
  /** 整组禁用。 */
  disabled?: boolean
}

/**
 * 分段选项：两三个选项直接摆出来，不收进下拉框。每块写一个选项，选中的那块整块换成信号色。
 *
 * 语义是单选组，每块底下是一个原生的 `<input type="radio">`：方向键在选项间移动并选中。
 * 它和 `Tabs` 的分段块长得像，但那是页签（切换的是下面的内容），这里是表单里的一个值。
 * 请用 `aria-label` 说明选的是什么，放在 `Field` 里则不用。
 */
export function SegmentedControl({
  name,
  value,
  defaultValue,
  onValueChange,
  variant = 'linked',
  size = 'md',
  block = false,
  disabled,
  className,
  ...rest
}: SegmentedControlProps) {
  const generated = useId()
  const [current, select] = useControllableState(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  const { disabled: groupDisabled, ...attributes } = useFieldGroup({ ...rest, disabled })
  return (
    <SegmentedContext
      value={{
        name: name ?? generated,
        value: current,
        select,
        disabled: groupDisabled ?? false,
        variant,
        size,
        block,
      }}
    >
      <div
        data-ark="segmented-control"
        data-variant={variant}
        role="radiogroup"
        aria-disabled={groupDisabled || undefined}
        {...attributes}
        className={cn(
          'box-border items-stretch font-ark-cjk-sans',
          block ? 'flex w-full' : 'inline-flex',
          variant === 'linked' ? 'gap-ark-4' : 'gap-0.5',
          className,
        )}
      />
    </SegmentedContext>
  )
}

export interface SegmentProps
  extends Omit<ComponentProps<'input'>, 'type' | 'name' | 'checked' | 'defaultChecked' | 'size'> {
  /** 这一项的值。 */
  value: string
  /** 文字前面的图标，对读屏隐藏。 */
  icon?: ReactNode
}

const sizes: Record<SegmentedControlSize, string> = {
  sm: 'h-(--ark-size-control-sm) min-w-12 px-ark-3 text-ark-caption',
  md: 'h-(--ark-size-control-md) min-w-16 px-ark-4 text-ark-label',
  lg: 'h-(--ark-size-control-lg) min-w-[8.5rem] px-ark-5 text-ark-base',
}

/** 分段选项里的一块。`children` 是这一项的名称。只能放在 `SegmentedControl` 里。 */
export function Segment({
  value,
  icon,
  disabled,
  onChange,
  className,
  style,
  children,
  ...rest
}: SegmentProps) {
  const group = useContext(SegmentedContext)
  if (!group) throw new Error('<Segment> 必须放在 <SegmentedControl> 里')
  return (
    <label
      data-ark="segment"
      className={cn(
        'relative box-border',
        group.block ? 'flex min-w-0 flex-1' : 'inline-flex',
        // 块与块之间的那条线，画在后一块的左边
        group.variant === 'linked' &&
          'not-first:before:absolute not-first:before:top-1/2 not-first:before:right-full not-first:before:h-px not-first:before:w-ark-4 not-first:before:bg-ark-rule-strong',
        className,
      )}
      style={style}
    >
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        disabled={disabled ?? (group.disabled || undefined)}
        {...rest}
        onChange={event => {
          onChange?.(event)
          if (event.currentTarget.checked) group.select(value)
        }}
        className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      />
      <span
        className={cn(
          'pointer-events-none box-border flex grow items-center justify-center gap-ark-2 bg-ark-control leading-ark-solid font-ark-medium whitespace-nowrap text-ark-fg',
          'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
          sizes[group.size],
          // 未选的块悬停时整块反色；选中的不动
          'peer-[:not(:checked):not(:disabled):hover]:bg-ark-invert peer-[:not(:checked):not(:disabled):hover]:text-ark-on-invert',
          'peer-checked:bg-ark-signal peer-checked:font-ark-bold peer-checked:text-ark-on-signal',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ark-fg',
          'peer-disabled:bg-ark-disabled peer-disabled:text-ark-on-disabled',
          // 禁用的组里，选中的那一块仍然看得出是哪一块
          'peer-checked:peer-disabled:bg-ark-on-disabled peer-checked:peer-disabled:text-ark-disabled',
        )}
      >
        {icon != null && (
          <span
            aria-hidden="true"
            className="grid size-4 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
          >
            {icon}
          </span>
        )}
        {children}
      </span>
    </label>
  )
}
