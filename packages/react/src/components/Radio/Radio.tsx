import { type ComponentProps, createContext, type ReactNode, useContext, useId } from 'react'
import { useFieldGroup } from '../../internal/field'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  select: (value: string) => void
  disabled: boolean
  invalid: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** 表单里的字段名。不给时自动生成一个，只用来把这一组单选框连在一起。 */
  name?: string
  /** 选中的值。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始选中的值（非受控）。 */
  defaultValue?: string
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
  /** 整组禁用。 */
  disabled?: boolean
  /**
   * 排的方向。
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'
}

/**
 * 单选组：一列（或一排）互斥的选项，每项一个 `Radio`。
 *
 * 只有两三个选项、每个都很短时，用 `SegmentedControl` 把它们摆成色块更合这套界面的习惯；
 * 选项带说明、或者有四五个以上时用这个。请用 `aria-label` 说明这一组选的是什么，放在 `Field` 里则不用。
 */
export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  orientation = 'vertical',
  className,
  ...rest
}: RadioGroupProps) {
  const generated = useId()
  const [current, select] = useControllableState(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  const group = useFieldGroup({ ...rest, disabled })
  const { disabled: groupDisabled, ...attributes } = group
  return (
    <RadioGroupContext
      value={{
        name: name ?? generated,
        value: current,
        select,
        disabled: groupDisabled ?? false,
        invalid: attributes['aria-invalid'] === true || attributes['aria-invalid'] === 'true',
      }}
    >
      <div
        data-ark="radio-group"
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={groupDisabled || undefined}
        {...attributes}
        className={cn(
          'box-border flex font-ark-cjk-sans',
          orientation === 'vertical' ? 'flex-col gap-ark-3' : 'flex-wrap gap-x-ark-5 gap-y-ark-3',
          className,
        )}
      />
    </RadioGroupContext>
  )
}

export interface RadioProps
  extends Omit<
    ComponentProps<'input'>,
    'type' | 'name' | 'checked' | 'defaultChecked' | 'children'
  > {
  /** 这一项的值。 */
  value: string
  /** 旁边的文字，同时是这一项的名称。 */
  children?: ReactNode
  /** 文字下面的一行灰色小字。 */
  description?: ReactNode
}

/**
 * 单选框：一个菱形，选中时中间填一块信号色。菱形把它和方形的勾选框区分开。
 * 底下是原生的 `<input type="radio">`：方向键在同一组里移动并选中。只能放在 `RadioGroup` 里。
 */
export function Radio({
  value,
  children,
  description,
  disabled,
  onChange,
  className,
  style,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext)
  if (!group) throw new Error('<Radio> 必须放在 <RadioGroup> 里')
  return (
    <label
      data-ark="radio"
      className={cn(
        'box-border inline-flex cursor-pointer items-start gap-ark-2 text-ark-label leading-ark-snug text-ark-fg',
        'has-disabled:cursor-not-allowed has-disabled:text-ark-on-disabled',
        className,
      )}
      style={style}
    >
      <span className="relative grid size-5 shrink-0 place-items-center">
        <input
          type="radio"
          name={group.name}
          value={value}
          checked={group.value === value}
          disabled={disabled ?? (group.disabled || undefined)}
          aria-invalid={group.invalid || undefined}
          {...rest}
          onChange={event => {
            onChange?.(event)
            if (event.currentTarget.checked) group.select(value)
          }}
          className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none grid size-3.5 rotate-45 place-items-center border border-solid border-ark-rule-strong bg-ark-control',
            'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
            'peer-checked:border-ark-signal',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ark-fg',
            'peer-aria-[invalid=true]:border-ark-signal-danger',
            'peer-disabled:border-transparent peer-disabled:bg-ark-disabled',
            // 中间的那一块：平时缩到没有，选中时放出来
            'after:size-1.5 after:scale-0 after:bg-ark-signal after:transition-[scale] after:duration-(--ark-motion-duration-fast)',
            'peer-checked:after:scale-100 peer-disabled:after:bg-ark-on-disabled',
          )}
        />
      </span>
      {(children != null || description != null) && (
        <span className="grid min-w-0 gap-0.5 pt-px">
          {children != null && <span>{children}</span>}
          {description != null && (
            <span className="text-ark-caption text-ark-fg-muted">{description}</span>
          )}
        </span>
      )}
    </label>
  )
}
