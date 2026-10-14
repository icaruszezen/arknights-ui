import { createContext, useContext } from 'react'

// 表单项（Field）和它里面的控件之间的接线：项名、注释、报错各有一个 id，
// 控件拿去填 id / aria-labelledby / aria-describedby，不用使用方逐个手写。

export interface FieldContextValue {
  /** 给控件用的 id，`<label htmlFor>` 指向它。 */
  controlId: string
  /** 项名元素的 id。一组控件（单选组、分段选项）没有单个的 id 可指，用它做 `aria-labelledby`。 */
  labelId: string
  /** 注释和报错的 id，拼成 `aria-describedby`；都没有时是 undefined。 */
  describedBy: string | undefined
  invalid: boolean
  required: boolean
  disabled: boolean
}

export const FieldContext = createContext<FieldContextValue | null>(null)

interface ControlProps {
  id?: string
  disabled?: boolean
  required?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling'
}

/**
 * 单个控件（输入框、开关、滑条…）从所在的 `Field` 拿默认的 id、描述、报错和禁用状态。
 * 使用方显式传的属性优先。不在 `Field` 里时原样返回。
 */
export function useFieldControl<T extends ControlProps>(props: T, invalid?: boolean): T {
  const field = useContext(FieldContext)
  const isInvalid = invalid ?? (props['aria-invalid'] !== undefined ? undefined : field?.invalid)
  return {
    ...props,
    id: props.id ?? field?.controlId,
    disabled: props.disabled ?? (field?.disabled || undefined),
    required: props.required ?? (field?.required || undefined),
    'aria-describedby':
      [props['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': isInvalid === undefined ? props['aria-invalid'] : isInvalid || undefined,
  }
}

interface GroupProps {
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling'
}

/** 一组控件（单选组、分段选项）：名称指向 `Field` 的项名，除非使用方自己给了名称。 */
export function useFieldGroup<T extends GroupProps>(props: T): T {
  const field = useContext(FieldContext)
  const named = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined
  return {
    ...props,
    disabled: props.disabled ?? (field?.disabled || undefined),
    'aria-labelledby': named ? props['aria-labelledby'] : field?.labelId,
    'aria-describedby':
      [props['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': props['aria-invalid'] ?? (field?.invalid || undefined),
  }
}
