import type { ComponentProps } from 'react'
import { colorTransition, focusRing } from '../utils/classes'
import { cn } from '../utils/cn'
import { CloseIcon } from './icons'

export interface CloseButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** 按钮的名称，读屏会念出来。 */
  label: string
}

/** 44 × 44 的关闭按钮，悬停整块反白。Drawer、Sheet 和 Nav 的全屏菜单共用。 */
export function CloseButton({ label, className, ...rest }: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      className={cn(
        'm-0 box-border grid size-11 shrink-0 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-ark-fg',
        'hover:bg-ark-invert hover:text-ark-on-invert',
        colorTransition,
        focusRing,
        className,
      )}
    >
      <CloseIcon className="size-5" />
    </button>
  )
}
