import { type ComponentProps, type ReactNode, useState } from 'react'
import { useFieldControl } from '../../internal/field'
import { MinusIcon, PlusIcon } from '../../internal/icons'
import { colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type NumberStepperSize = 'sm' | 'md' | 'lg'

export interface NumberStepperProps
  extends Omit<
    ComponentProps<'input'>,
    'type' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'onChange'
  > {
  /** 当前值。受控：请在 `onValueChange` 里更新它。 */
  value?: number
  /** 一开始的值（非受控）。默认是下限，没有下限时是 0。 */
  defaultValue?: number
  /** 下限。 */
  min?: number
  /** 上限。 */
  max?: number
  /**
   * 每按一次加减的量。
   * @default 1
   */
  step?: number
  /** 值变化时调用。 */
  onValueChange?: (value: number) => void
  /**
   * 两端的“最少”“最多”：一步到头，大数量不必连点。默认在上下限都给了的时候显示。
   */
  bounds?: boolean
  /**
   * 高度：2rem / 2.5rem / 3rem。
   * @default 'md'
   */
  size?: NumberStepperSize
  /**
   * @default '最少'
   */
  minLabel?: ReactNode
  /**
   * @default '最多'
   */
  maxLabel?: ReactNode
  /**
   * 减号按钮的名称。
   * @default '减少'
   */
  decrementLabel?: string
  /**
   * 加号按钮的名称。
   * @default '增加'
   */
  incrementLabel?: string
}

const heights: Record<NumberStepperSize, string> = {
  sm: 'h-(--ark-size-control-sm) text-ark-caption',
  md: 'h-(--ark-size-control-md) text-ark-label',
  lg: 'h-(--ark-size-control-lg) text-ark-base',
}
const squares: Record<NumberStepperSize, string> = {
  sm: 'w-(--ark-size-control-sm)',
  md: 'w-(--ark-size-control-md)',
  lg: 'w-(--ark-size-control-lg)',
}

const cell = cn(
  'm-0 box-border inline-grid shrink-0 cursor-pointer appearance-none place-items-center border-0 p-0 font-ark-cjk-sans leading-ark-solid font-ark-medium select-none',
  'hover:bg-ark-invert hover:text-ark-on-invert',
  'disabled:cursor-not-allowed disabled:bg-ark-disabled disabled:text-ark-on-disabled',
  colorTransition,
  focusRingInset,
)

/**
 * 数量步进器：五格连成一条——最少、减、数值、加、最多。数值在正中，用数据体；
 * “最少”“最多”让人一步到头。数值到了下限或上限，对应的两格变成禁用。
 *
 * 做决定要用的数（单价、已有多少、还剩多少）摆在步进器旁边，不要让人退出去查。
 * 数值格是原生的 `<input type="number">`，可以直接键入；失焦时收回到上下限以内。
 * `className` 作用在最外层，其余属性和 `ref` 交给 `<input>`。请用 `aria-label` 命名，放在 `Field` 里则不用。
 */
export function NumberStepper({
  value,
  defaultValue,
  min,
  max,
  step = 1,
  onValueChange,
  bounds = min !== undefined && max !== undefined,
  size = 'md',
  minLabel = '最少',
  maxLabel = '最多',
  decrementLabel = '减少',
  incrementLabel = '增加',
  className,
  style,
  onBlur,
  ...rest
}: NumberStepperProps) {
  const control = useFieldControl(rest)
  const clamp = (next: number) =>
    Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY)
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min ?? 0, onValueChange)
  // 键入的过程中允许空着、允许越界，失焦时再收回来；点两边的格子时丢掉键入到一半的内容
  const [draft, setDraft] = useState<string | null>(null)

  const disabled = control.disabled === true
  const atMin = min !== undefined && current <= min
  const atMax = max !== undefined && current >= max
  const set = (next: number) => {
    setDraft(null)
    setCurrent(clamp(next))
  }

  return (
    <span
      data-ark="number-stepper"
      className={cn('box-border inline-flex items-stretch gap-0.5', heights[size], className)}
      style={style}
    >
      {bounds && min !== undefined && (
        <button
          type="button"
          disabled={disabled || atMin}
          onClick={() => set(min)}
          className={cn(cell, 'bg-ark-fg/20 px-ark-3 text-ark-fg')}
        >
          {minLabel}
        </button>
      )}
      <button
        type="button"
        aria-label={decrementLabel}
        disabled={disabled || atMin}
        onClick={() => set(current - step)}
        className={cn(cell, squares[size], 'bg-ark-control text-ark-fg')}
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        {...control}
        value={draft ?? String(current)}
        onChange={event => {
          const text = event.currentTarget.value
          setDraft(text)
          const parsed = event.currentTarget.valueAsNumber
          // 键入中的值只要在范围里就立刻生效；越界的等失焦再收
          if (!Number.isNaN(parsed) && parsed === clamp(parsed)) setCurrent(parsed)
        }}
        onBlur={event => {
          onBlur?.(event)
          const parsed = event.currentTarget.valueAsNumber
          if (Number.isNaN(parsed)) setDraft(null)
          else set(parsed)
        }}
        className={cn(
          'm-0 box-border w-16 min-w-0 border-0 bg-ark-control p-0 text-center font-ark-data text-[length:inherit] leading-ark-solid font-ark-bold text-ark-fg outline-none',
          // 自带的上下小箭头不要：加减在两边的格子里
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ark-fg',
          'aria-[invalid=true]:text-ark-danger-fg',
          'disabled:cursor-not-allowed disabled:bg-ark-disabled disabled:text-ark-on-disabled',
        )}
      />
      <button
        type="button"
        aria-label={incrementLabel}
        disabled={disabled || atMax}
        onClick={() => set(current + step)}
        className={cn(cell, squares[size], 'bg-ark-control text-ark-fg')}
      >
        <PlusIcon className="size-4" />
      </button>
      {bounds && max !== undefined && (
        <button
          type="button"
          disabled={disabled || atMax}
          onClick={() => set(max)}
          className={cn(cell, 'bg-ark-fg/20 px-ark-3 text-ark-fg')}
        >
          {maxLabel}
        </button>
      )}
    </span>
  )
}
