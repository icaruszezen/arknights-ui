import { type MouseEvent, type Ref, type SyntheticEvent, useEffect, useMemo, useRef } from 'react'
import { mergeRefs } from './mergeRefs'

export interface ModalDialogOptions {
  /** 是否打开。受控：关闭由这个值驱动。 */
  open: boolean
  /** 请求关闭时调用。 */
  onOpenChange?: (open: boolean) => void
  /** 按 Esc 或点遮罩时，在 `onOpenChange(false)` 之前调用。 */
  onDismiss?: () => void
  /** 使用方传给 `<dialog>` 的 ref。 */
  ref?: Ref<HTMLDialogElement>
  /** 使用方传给 `<dialog>` 的 onClick；它调用 `preventDefault()` 可以阻止点遮罩关闭。 */
  onClick?: (event: MouseEvent<HTMLDialogElement>) => void
}

/**
 * 原生 `<dialog>` 的模态行为，Dialog、Drawer、Sheet 和 Nav 的全屏菜单共用：
 * 自带焦点圈定、Esc 关闭，关闭后焦点回到触发元素。
 *
 * 把返回的 `dialogProps` 展开到 `<dialog>` 上（放在其余属性之后）。
 * 点遮罩靠“事件目标是 `<dialog>` 自身”来判断，所以内容必须铺满 `<dialog>`：
 * 它自己不留内边距和边框。
 */
export function useModalDialog({
  open,
  onOpenChange,
  onDismiss,
  ref,
  onClick,
}: ModalDialogOptions) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const setRef = useMemo(() => mergeRefs(dialogRef, ref), [ref])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // 关闭由 open 状态驱动：这里只回调，真正的 close() 交给上面的 effect。
  // 不等原生 close 事件来回写状态——Chromium 把它排到下一帧才派发，页面不渲染时会一直不来。
  const requestClose = (before?: () => void) => {
    // 退场过渡期间 <dialog> 仍留在顶层，此时的点击不应再触发一次回调
    if (!open) return
    before?.()
    onOpenChange?.(false)
  }

  return {
    /** 请求关闭：先调用 `before`，再 `onOpenChange(false)`。已经关闭时什么都不做。 */
    requestClose,
    dialogProps: {
      ref: setRef,
      // Esc：拦下浏览器的默认关闭，改走同一条状态驱动的路径
      onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault()
        requestClose(onDismiss)
      },
      // 兜底：浏览器绕过 cancel 直接关掉时（如连按两次 Esc），把状态同步回去
      onClose: () => {
        if (open) onOpenChange?.(false)
      },
      // 点遮罩关闭的键盘等价操作是 Esc，由 onCancel 处理
      onClick: (event: MouseEvent<HTMLDialogElement>) => {
        onClick?.(event)
        // 内容铺满了 <dialog>，目标是它自身时只可能点在遮罩上
        if (!event.defaultPrevented && event.target === event.currentTarget) requestClose(onDismiss)
      },
    },
  }
}
