import {
  type ComponentProps,
  cloneElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
} from 'react'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useControllableState } from '../../utils/useControllableState'
import { type FloatingPlacement, floatingReset, useFloating } from '../../utils/useFloating'

interface TriggerProps {
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
  'aria-haspopup'?: 'dialog'
  'aria-expanded'?: boolean
  'aria-controls'?: string
}

export interface PopoverProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 点了会打开浮层的元素，通常是一个 `Button`。它要能接收 `ref` 和 `onClick`。 */
  trigger: ReactElement<TriggerProps>
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open?: boolean
  /** 一开始是否打开（非受控）。 */
  defaultOpen?: boolean
  /** 开合变化时调用。 */
  onOpenChange?: (open: boolean) => void
  /** 浮层顶上的一行标题，同时是它的名称。不给时请传 `aria-label`。 */
  title?: ReactNode
  /**
   * @default 'bottom-start'
   */
  placement?: FloatingPlacement
}

/**
 * 浮层：点一下触发元素，在它旁边展开一小块内容——筛选条件、补充说明、几个设置项。
 * 点外面或按 Esc 关闭，焦点回到触发元素。
 *
 * 它不是模态的：下面的页面仍然可以操作。内容多、需要表态时用 `Modal` 或 `Dialog`。
 */
export function Popover({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  placement = 'bottom-start',
  className,
  children,
  ...rest
}: PopoverProps) {
  const id = useId()
  const titleId = useId()
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const { anchorRef, floatingRef, floatingProps } = useFloating<HTMLElement, HTMLDivElement>({
    open: isOpen,
    onDismiss: () => {
      setOpen(false)
      anchorRef.current?.focus()
    },
    placement,
  })

  // 打开后焦点进到浮层里：键盘用户不用再从页面顶上一路 Tab 过来
  useEffect(() => {
    if (isOpen) floatingRef.current?.focus()
  }, [isOpen, floatingRef])

  const props = trigger.props
  return (
    <>
      {cloneElement(trigger, {
        ref: mergeRefs(anchorRef, props.ref),
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? id : undefined,
        onClick: event => {
          props.onClick?.(event)
          if (!event.defaultPrevented) setOpen(!isOpen)
        },
      })}
      {isOpen && (
        <div
          {...floatingProps}
          {...rest}
          style={{ ...floatingProps.style, ...rest.style }}
          ref={floatingRef}
          id={id}
          role="dialog"
          aria-labelledby={title != null ? titleId : rest['aria-labelledby']}
          tabIndex={-1}
          data-ark="popover"
          className={cn(
            floatingReset,
            'w-max max-w-[min(24rem,100vw-1rem)] border border-ark-rule bg-ark-surface-raised p-ark-4 font-ark-cjk-sans text-ark-label leading-ark-snug drop-shadow-ark-panel outline-none',
            'animate-ark-fade-in',
            className,
          )}
        >
          {title != null && (
            <div id={titleId} className="mb-ark-3 text-ark-base leading-ark-snug font-ark-bold">
              {title}
            </div>
          )}
          {children}
        </div>
      )}
    </>
  )
}
