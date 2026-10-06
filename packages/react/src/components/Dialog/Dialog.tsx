import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { Button } from '../Button'

export interface DialogProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /** 弹窗请求关闭时调用（点了按钮、按 Esc、点遮罩）。 */
  onOpenChange?: (open: boolean) => void
  /** 加粗的标题行。可省略，此时用正文作为弹窗的名称。 */
  title?: ReactNode
  /** 正文下方的补充数值，数据体小字，如 `SANITY 12/135 → 92/135`。 */
  detail?: ReactNode
  /**
   * 右侧浅色块上的文字。
   * @default '确认'
   */
  confirmText?: ReactNode
  /**
   * 左侧深色块上的文字。
   * @default '取消'
   */
  cancelText?: ReactNode
  /** 点确认时调用，随后以 `onOpenChange(false)` 请求关闭。 */
  onConfirm?: () => void
  /** 点取消、按 Esc 或点遮罩时调用，随后以 `onOpenChange(false)` 请求关闭。 */
  onCancel?: () => void
  /** 只留一个确认按钮（纯告知）。 */
  hideCancel?: boolean
}

/**
 * 确认弹窗是横贯屏幕的一条带，不是悬在中间的一个盒子：上下露出被压暗的原页面。
 *
 * 按钮对开、位置固定：取消在左（深色块），确认在右（浅色块）。
 * 基于原生 `<dialog>`：自带焦点圈定、Esc 关闭，关闭后焦点回到触发元素。
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  detail,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  hideCancel = false,
  ref,
  className,
  onClick,
  children,
  ...rest
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const setRef = useMemo(() => mergeRefs(dialogRef, ref), [ref])
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // 关闭由 open 状态驱动：这里只回调，真正的 close() 交给上面的 effect。
  // 不等原生 close 事件来回写状态——Chromium 把它排到下一帧才派发，页面不渲染时会一直不来。
  const requestClose = (reason: 'confirm' | 'cancel') => {
    // 退场过渡期间 <dialog> 仍留在顶层，此时的点击不应再触发一次回调
    if (!open) return
    if (reason === 'confirm') onConfirm?.()
    else onCancel?.()
    onOpenChange?.(false)
  }
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    // 内容铺满了 <dialog>，目标是它自身时只可能点在遮罩上
    if (!event.defaultPrevented && event.target === event.currentTarget) requestClose('cancel')
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 点遮罩关闭的键盘等价操作是 Esc，由 onCancel 处理
    <dialog
      data-ark="dialog"
      data-ark-tone="dark"
      aria-labelledby={title != null ? titleId : bodyId}
      aria-describedby={title != null ? bodyId : undefined}
      {...rest}
      ref={setRef}
      // Esc：拦下浏览器的默认关闭，改走同一条状态驱动的路径
      onCancel={event => {
        event.preventDefault()
        requestClose('cancel')
      }}
      // 兜底：浏览器绕过 cancel 直接关掉时（如连按两次 Esc），把状态同步回去
      onClose={() => {
        if (open) onOpenChange?.(false)
      }}
      onClick={handleClick}
      className={cn(
        'm-0 my-auto box-border w-full max-w-none border-0 bg-transparent p-0 text-ark-fg',
        'backdrop:bg-ark-overlay-scrim backdrop:backdrop-blur-ark-backdrop',
        // 退场过渡期间不拦截点击，下层页面立刻可用
        'pointer-events-none open:pointer-events-auto',
        // 入场：内容带纵向展开并淡入；减少动效时只保留透明度
        'opacity-0 open:opacity-100 starting:open:opacity-0',
        'motion-safe:scale-y-75 motion-safe:open:scale-y-100 motion-safe:starting:open:scale-y-75',
        'transition-[opacity,scale,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
        className,
      )}
    >
      <div className="box-border border-t-2 border-ark-neutral-white/20 bg-ark-neutral-graphite-deep/95 px-ark-6 py-ark-6 text-center font-ark-cjk-sans">
        {title != null && (
          <h2 id={titleId} className="m-0 mb-ark-3 text-ark-body-lg leading-ark-snug font-ark-bold">
            {title}
          </h2>
        )}
        <div id={bodyId} className="text-ark-body leading-ark-body font-ark-regular">
          {children}
        </div>
        {detail != null && (
          <p className="m-0 mt-ark-2 font-ark-data text-ark-caption leading-ark-solid text-ark-fg-muted">
            {detail}
          </p>
        )}
      </div>
      <div className={cn('grid', hideCancel ? 'grid-cols-1' : 'grid-cols-2')}>
        {!hideCancel && (
          <Button variant="graphite" block onClick={() => requestClose('cancel')}>
            {cancelText}
          </Button>
        )}
        <Button variant="paper" block onClick={() => requestClose('confirm')}>
          {confirmText}
        </Button>
      </div>
    </dialog>
  )
}
