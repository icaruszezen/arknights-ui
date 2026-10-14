import { type ComponentProps, type ReactNode, useEffect, useRef } from 'react'
import { useFieldControl } from '../../internal/field'
import { CheckIcon, MinusIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'children'> {
  /** 旁边的文字，同时是这个勾选框的名称。不给时请传 `aria-label`。 */
  children?: ReactNode
  /** 文字下面的一行灰色小字。 */
  description?: ReactNode
  /** 半选：一组里只选了一部分。它只是外观，点一下之后由 `checked` 决定。 */
  indeterminate?: boolean
  /** 勾选状态变化时调用。 */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * 勾选框：一个直角的小方块，选中时整块换成信号色，里面一道对勾。
 *
 * 底下是原生的 `<input type="checkbox">`，只隐藏不移除：键盘、表单提交、读屏都走它。
 * `className` 作用在最外层的 `<label>`，其余属性和 `ref` 交给 `<input>`。
 */
export function Checkbox({
  children,
  description,
  indeterminate = false,
  onCheckedChange,
  onChange,
  className,
  style,
  ref,
  ...rest
}: CheckboxProps) {
  const control = useFieldControl(rest)
  const inputRef = useRef<HTMLInputElement>(null)
  // indeterminate 没有对应的 HTML 属性，只能写在元素上
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label
      data-ark="checkbox"
      className={cn(
        'box-border inline-flex cursor-pointer items-start gap-ark-2 font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
        'has-disabled:cursor-not-allowed has-disabled:text-ark-on-disabled',
        className,
      )}
      style={style}
    >
      <span className="relative grid size-5 shrink-0 place-items-center">
        <input
          type="checkbox"
          {...control}
          ref={mergeRefs(inputRef, ref)}
          onChange={event => {
            onChange?.(event)
            onCheckedChange?.(event.currentTarget.checked)
          }}
          className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none grid size-4.5 place-items-center border border-solid border-ark-rule-strong bg-ark-control text-ark-on-signal',
            'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
            // 选中和半选都是整块换色
            'peer-checked:border-ark-signal peer-checked:bg-ark-signal peer-indeterminate:border-ark-signal peer-indeterminate:bg-ark-signal',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ark-fg',
            'peer-aria-[invalid=true]:border-ark-signal-danger',
            'peer-disabled:border-transparent peer-disabled:bg-ark-disabled peer-disabled:text-ark-on-disabled',
            // 两个图形叠在一起，各看各的状态；半选优先
            '[&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:size-3.5 [&>svg]:opacity-0',
            'peer-checked:[&>[data-glyph=check]]:opacity-100',
            'peer-indeterminate:[&>[data-glyph=check]]:opacity-0 peer-indeterminate:[&>[data-glyph=dash]]:opacity-100',
          )}
        >
          <CheckIcon data-glyph="check" />
          <MinusIcon data-glyph="dash" />
        </span>
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
