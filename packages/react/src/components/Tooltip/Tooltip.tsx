import {
  cloneElement,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { type FloatingPlacement, floatingReset, useFloating } from '../../utils/useFloating'

// 有的环境不认识 :focus-visible（很旧的浏览器、测试用的 DOM），那就当作是键盘聚焦
const focusVisible = (element: Element) => {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

interface TriggerProps {
  ref?: Ref<HTMLElement>
  'aria-describedby'?: string
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void
  onFocus?: (event: FocusEvent<HTMLElement>) => void
  onBlur?: (event: FocusEvent<HTMLElement>) => void
}

export interface TooltipProps {
  /** 提示的内容：一句短话。不要放链接、按钮这类要操作的东西。 */
  content: ReactNode
  /**
   * 被提示的元素，只放一个。它要能接收 `ref` 和指针 / 焦点事件：原生元素和本库的组件都可以。
   */
  children: ReactElement<TriggerProps>
  /**
   * @default 'top'
   */
  placement?: FloatingPlacement
  /**
   * 指针停多久才出现，毫秒。键盘聚焦时不等。
   * @default 300
   */
  delay?: number
  /** 不显示。内容为空时也不显示。 */
  disabled?: boolean
  className?: string
}

/**
 * 提示：指针停在元素上、或键盘聚焦到它时，旁边出现的一小块反色的说明。
 * 移开、失焦、按下或按 Esc 就消失。
 *
 * 它是对元素的补充描述（`aria-describedby`），不是名称：只有图形的按钮仍然要有自己的 `label`。
 * 触屏上没有悬停，不要把必须看到的信息只放在提示里。
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  disabled = false,
  className,
}: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const active = open && !disabled && content != null && content !== false && content !== ''
  const { anchorRef, floatingRef, floatingProps } = useFloating<HTMLElement, HTMLDivElement>({
    open: active,
    onDismiss: () => setOpen(false),
    placement,
    gap: 6,
  })

  const cancel = () => clearTimeout(timer.current)
  // 卸载时把还没到点的定时器清掉
  useEffect(() => () => clearTimeout(timer.current), [])

  const show = (wait: number) => {
    cancel()
    if (wait > 0) timer.current = setTimeout(() => setOpen(true), wait)
    else setOpen(true)
  }
  const hide = () => {
    cancel()
    setOpen(false)
  }

  const child = children.props
  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(anchorRef, child.ref),
        'aria-describedby':
          [child['aria-describedby'], active ? id : undefined].filter(Boolean).join(' ') ||
          undefined,
        onPointerEnter: event => {
          child.onPointerEnter?.(event)
          // 触屏上的“进入”紧跟着就是点击，不出提示
          if (event.pointerType !== 'touch') show(delay)
        },
        onPointerLeave: event => {
          child.onPointerLeave?.(event)
          hide()
        },
        onPointerDown: event => {
          child.onPointerDown?.(event)
          hide()
        },
        onFocus: event => {
          child.onFocus?.(event)
          // 只在键盘聚焦时出：点一下得到的焦点不算
          if (focusVisible(event.currentTarget)) show(0)
        },
        onBlur: event => {
          child.onBlur?.(event)
          hide()
        },
      })}
      {active && (
        <div
          {...floatingProps}
          ref={floatingRef}
          id={id}
          role="tooltip"
          data-ark="tooltip"
          className={cn(
            floatingReset,
            // 不挡指针：移到提示上不会让它自己把自己留住
            'pointer-events-none max-w-64 bg-ark-invert px-ark-2 py-ark-1 font-ark-cjk-sans text-ark-caption leading-ark-snug font-ark-medium text-ark-on-invert',
            'animate-ark-fade-in',
            className,
          )}
        >
          {content}
        </div>
      )}
    </>
  )
}
