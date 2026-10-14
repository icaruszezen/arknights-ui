import type { ComponentProps, ReactNode } from 'react'
import { useFieldControl } from '../../internal/field'
import { cn } from '../../utils/cn'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<ComponentProps<'input'>, 'size' | 'prefix'> {
  /**
   * 高度：2rem / 2.5rem / 3rem。
   * @default 'md'
   */
  size?: InputSize
  /** 输入框前面的内容：图标、单位、固定的前缀。它不是输入的一部分。 */
  prefix?: ReactNode
  /** 输入框后面的内容：单位、清除按钮。 */
  suffix?: ReactNode
  /** 不合法：底边换成红色，并输出 `aria-invalid`。放在带 `error` 的 `Field` 里时不用传。 */
  invalid?: boolean
}

/** 输入框外面那一层的写法，`Textarea`、`Select` 的触发行共用。 */
export const inputFrame = cn(
  'box-border flex w-full items-center border-0 border-b border-solid border-ark-rule-strong bg-ark-control font-ark-cjk-sans text-ark-fg',
  'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
  // 聚焦：底边换成信号色；键盘聚焦时再加一圈轮廓
  'focus-within:border-ark-signal',
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ark-fg',
  'has-[[aria-invalid=true]]:border-ark-signal-danger',
  'has-disabled:cursor-not-allowed has-disabled:border-transparent has-disabled:bg-ark-disabled has-disabled:text-ark-on-disabled',
)

export const inputSizes: Record<InputSize, string> = {
  sm: 'h-(--ark-size-control-sm) gap-ark-2 px-ark-2 text-ark-label',
  md: 'h-(--ark-size-control-md) gap-ark-2 px-ark-3 text-ark-label',
  lg: 'h-(--ark-size-control-lg) gap-ark-3 px-ark-4 text-ark-base',
}

/**
 * 输入框是一块直角的色块，底边一条线；聚焦时这条线换成信号色。
 *
 * `className` 和 `style` 作用在外面那一层，其余属性和 `ref` 交给里面的 `<input>`。
 * 放进 `Field` 时自动接上项名、注释和报错。
 */
export function Input({
  size = 'md',
  prefix,
  suffix,
  invalid,
  className,
  style,
  ...rest
}: InputProps) {
  const control = useFieldControl(rest, invalid)
  return (
    <span data-ark="input" className={cn(inputFrame, inputSizes[size], className)} style={style}>
      {prefix != null && (
        <span className="flex shrink-0 items-center text-ark-fg-muted">{prefix}</span>
      )}
      <input
        {...control}
        className="m-0 box-border h-full min-w-0 grow appearance-none border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] text-inherit outline-none placeholder:text-ark-fg-muted disabled:cursor-not-allowed"
      />
      {suffix != null && (
        <span className="flex shrink-0 items-center text-ark-fg-muted">{suffix}</span>
      )}
    </span>
  )
}
