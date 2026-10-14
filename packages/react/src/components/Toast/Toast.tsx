import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { Notice, type NoticeLevel } from '../Notice'

export type ToastPlacement = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export interface ToastOptions {
  /** 加粗的首行。 */
  title?: ReactNode
  /** 正文。 */
  description?: ReactNode
  /**
   * 级别，同 `Notice`。警示和错误会打断读屏。
   * @default 'info'
   */
  level?: NoticeLevel
  /**
   * 多久之后自己消失，毫秒。`0` 表示一直留着，直到被关掉。
   * @default 5000
   */
  duration?: number
  /** 右侧的操作，通常是一个小按钮（“撤销”）。 */
  action?: ReactNode
}

interface ToastEntry extends ToastOptions {
  id: number
}

export interface ToastApi {
  /** 弹出一条提示，返回它的编号。 */
  (options: ToastOptions): number
  /** 关掉一条；不给编号就全部关掉。 */
  dismiss: (id?: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

/** 弹出提示用的函数。要放在 `ToastProvider` 里面。 */
export function useToast(): ToastApi {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast() 必须在 <ToastProvider> 里使用')
  return toast
}

export interface ToastProviderProps extends Omit<ComponentProps<'section'>, 'children'> {
  children?: ReactNode
  /**
   * 提示出现在视口的哪个角。
   * @default 'bottom-right'
   */
  placement?: ToastPlacement
  /**
   * 同时最多显示几条，再多的把最早的挤掉。
   * @default 3
   */
  max?: number
  /**
   * 这一栏的名称，读屏用。
   * @default '通知'
   */
  label?: string
  /**
   * 每条提示上关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

const placements: Record<ToastPlacement, string> = {
  'top-right': 'top-0 right-0 items-end',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'right-0 bottom-0 flex-col-reverse items-end',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse items-center',
}

/**
 * 轻提示：一会儿就消失的提示条，叠在视口的一角。外观就是 `Notice`，底下多一条走时的细线。
 * 指针停在上面、或焦点在里面时不走时；最多同时显示三条。
 *
 * 把它包在应用的最外层，里面用 `useToast()` 拿到弹出的函数。
 * 它只用来告知结果；需要表态的事用 `Dialog`，要一直留在页面上的用 `Notice`。
 */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  max = 3,
  label = '通知',
  closeLabel = '关闭',
  className,
  ...rest
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<readonly ToastEntry[]>([])
  const nextId = useRef(1)
  const viewport = useRef<HTMLElement>(null)

  const dismiss = useCallback((id?: number) => {
    setToasts(list => (id === undefined ? [] : list.filter(toast => toast.id !== id)))
  }, [])
  const api = useMemo(() => {
    const show = (options: ToastOptions) => {
      const id = nextId.current++
      // 超过上限时，最早的那几条让位
      setToasts(list => [...list, { ...options, id }].slice(-max))
      return id
    }
    return Object.assign(show, { dismiss }) as ToastApi
  }, [dismiss, max])

  const shown = toasts.length > 0
  // 有提示时把这一栏放进浏览器的顶层，这样它能盖在模态的弹窗上面
  useLayoutEffect(() => {
    const element = viewport.current
    if (!shown || !element) return
    try {
      element.showPopover?.()
    } catch {
      // 已经在顶层里了
    }
    return () => {
      try {
        element.hidePopover?.()
      } catch {
        // 元素已经不在文档里
      }
    }
  }, [shown])

  return (
    <ToastContext value={api}>
      {children}
      {/* 这一栏一直在：读屏要先“认识”一个 live 区域，之后往里加的内容才会被读出来 */}
      <section
        ref={viewport}
        popover="manual"
        aria-label={label}
        data-ark="toast-viewport"
        data-placement={placement}
        {...rest}
        className={cn(
          // 清掉浏览器给 [popover] 的默认样式；没有提示时它不显示
          'pointer-events-none fixed inset-auto m-0 box-border hidden w-[min(24rem,100vw)] max-w-none flex-col gap-ark-2 overflow-visible border-0 bg-transparent p-ark-4 text-ark-fg',
          shown && 'flex',
          placements[placement],
          className,
        )}
      >
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            closeLabel={closeLabel}
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </section>
    </ToastContext>
  )
}

interface ToastItemProps {
  toast: ToastEntry
  closeLabel: string
  onClose: () => void
}

function ToastItem({ toast, closeLabel, onClose }: ToastItemProps) {
  const { title, description, level = 'info', duration = 5000, action } = toast
  const [paused, setPaused] = useState(false)
  // 剩下的时间：暂停时记下来，继续时从这里接着走
  const remaining = useRef(duration)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (duration <= 0 || paused) return
    const started = Date.now()
    const timer = setTimeout(() => close.current(), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current -= Date.now() - started
    }
  }, [duration, paused])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 悬停和聚焦只是让它暂停走时，不是一个可操作的控件
    <div
      data-ark="toast"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto relative w-full drop-shadow-ark-panel motion-safe:animate-ark-enter-right motion-safe:[animation-duration:var(--ark-motion-duration-base)] motion-reduce:animate-ark-fade-in"
    >
      <Notice
        level={level}
        title={title}
        action={action}
        onClose={onClose}
        closeLabel={closeLabel}
        className="bg-ark-surface-raised"
      >
        {description}
      </Notice>
      {duration > 0 && (
        // 走时的细线：从满到空，匀速。减少动效时不动，提示照样到时间消失
        <span
          aria-hidden="true"
          data-ark="toast-timer"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ark-fg-muted motion-safe:animate-ark-toast-timer"
          style={
            {
              '--ark-toast-duration': `${duration}ms`,
              animationPlayState: paused ? 'paused' : 'running',
            } as CSSProperties
          }
        />
      )}
    </div>
  )
}
