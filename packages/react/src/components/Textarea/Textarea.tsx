import { type ComponentProps, useState } from 'react'
import { useFieldControl } from '../../internal/field'
import { cn } from '../../utils/cn'
import { inputFrame } from '../Input/Input'

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** 不合法：底边换成红色，并输出 `aria-invalid`。放在带 `error` 的 `Field` 里时不用传。 */
  invalid?: boolean
  /**
   * 右下角显示“已输入 / 上限”，如 `12 / 200`，数据体。需要同时给 `maxLength`。
   */
  showCount?: boolean
}

const length = (value: unknown) => (value == null ? 0 : String(value).length)

/**
 * 多行输入：和 `Input` 是同一块色块，可以向下拉高。
 *
 * `className` 和 `style` 作用在外面那一层，其余属性和 `ref` 交给里面的 `<textarea>`。
 */
export function Textarea({
  invalid,
  showCount = false,
  className,
  style,
  onChange,
  ...rest
}: TextareaProps) {
  const control = useFieldControl(rest, invalid)
  // 非受控时自己数；受控时直接读 value
  const [typed, setTyped] = useState(() => length(rest.defaultValue))
  const count = rest.value !== undefined ? length(rest.value) : typed
  const counted = showCount && rest.maxLength !== undefined

  return (
    <span data-ark="textarea" className={cn(inputFrame, 'relative block', className)} style={style}>
      <textarea
        rows={3}
        {...control}
        onChange={event => {
          setTyped(event.currentTarget.value.length)
          onChange?.(event)
        }}
        className={cn(
          'm-0 box-border block min-h-20 w-full resize-y appearance-none border-0 bg-transparent px-ark-3 py-ark-2 font-[inherit] text-ark-label leading-ark-body text-inherit outline-none placeholder:text-ark-fg-muted disabled:cursor-not-allowed',
          counted && 'pb-ark-5',
        )}
      />
      {counted && (
        // 字数是对输入的第二次表述，maxLength 自己会拦；不必每敲一个字读一遍
        <span
          aria-hidden="true"
          data-ark="textarea-count"
          className="pointer-events-none absolute right-ark-3 bottom-ark-1 font-ark-data text-ark-caption leading-ark-solid text-ark-fg-muted"
        >
          <b className="font-ark-bold text-ark-fg-secondary">{count}</b> / {rest.maxLength}
        </span>
      )}
    </span>
  )
}
