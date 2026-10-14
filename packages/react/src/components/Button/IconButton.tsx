import type { ComponentProps, ReactNode } from 'react'
import {
  type ControlSize,
  colorTransition,
  controlSquare,
  focusRing,
  hitAreaCoarse,
} from '../../utils/classes'
import { cn } from '../../utils/cn'
import type { ButtonVariant } from './Button'

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** 按钮的名称，读屏会念出来。只有图形的按钮必须有它。 */
  label: string
  /** 图形：一个 `<svg>` 或 `Icon`。它对读屏隐藏。 */
  children: ReactNode
  /**
   * 层级，取值与 `Button` 相同。
   * @default 'ghost'
   */
  variant?: ButtonVariant
  /**
   * 边长：`xs` 1.5rem、`sm` 2rem、`md` 2.5rem、`lg` 3rem、`xl` 3.75rem。
   * @default 'md'
   */
  size?: ControlSize
  /** 选中态：整块明暗对调，同时输出 `aria-pressed`。 */
  selected?: boolean
}

const pressed =
  'aria-pressed:border-ark-invert aria-pressed:bg-ark-invert aria-pressed:text-ark-on-invert'

const surfaces: Record<ButtonVariant, string> = {
  primary: 'bg-ark-signal text-ark-on-signal hover:bg-ark-invert hover:text-ark-on-invert',
  secondary: cn(
    'border border-ark-rule-strong bg-ark-fg/5 text-ark-fg hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
    pressed,
  ),
  // 没有底的方块悬停时同样整块反色：只有一个图形，变淡一点看不出来
  ghost: cn(
    'bg-transparent text-ark-fg hover:bg-ark-invert hover:text-ark-on-invert disabled:bg-transparent',
    pressed,
  ),
  subtle: cn('bg-ark-control text-ark-fg hover:bg-ark-invert hover:text-ark-on-invert', pressed),
  inverse: 'bg-ark-invert text-ark-on-invert hover:bg-ark-signal hover:text-ark-on-signal',
  danger: 'bg-ark-danger text-ark-on-danger hover:bg-ark-invert hover:text-ark-on-invert',
}

const glyph: Record<ControlSize, string> = {
  xs: '[&>svg]:size-3',
  sm: '[&>svg]:size-4',
  md: '[&>svg]:size-5',
  lg: '[&>svg]:size-5',
  xl: '[&>svg]:size-6',
}

/**
 * 只有图形的方形按钮：关闭、翻页、工具栏里的操作。名称由 `label` 给出。
 *
 * 能写出字的地方优先用 `Button`：图形的含义不如文字确定。
 */
export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  selected,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      data-ark="icon-button"
      type="button"
      aria-label={label}
      aria-pressed={selected}
      {...rest}
      className={cn(
        'relative m-0 box-border inline-grid shrink-0 cursor-pointer appearance-none place-items-center border-0 p-0 select-none',
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-ark-disabled disabled:text-ark-on-disabled',
        '[&>svg]:block',
        controlSquare[size],
        glyph[size],
        surfaces[variant],
        (size === 'xs' || size === 'sm' || size === 'md') && hitAreaCoarse,
        colorTransition,
        focusRing,
        className,
      )}
    >
      {children}
    </button>
  )
}
