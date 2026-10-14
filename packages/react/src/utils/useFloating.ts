import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
  size,
} from '@floating-ui/dom'
import { type CSSProperties, useEffect, useLayoutEffect, useRef } from 'react'

export type FloatingPlacement = Placement

export interface FloatingOptions {
  /** 浮层是否开着。浮层按这个值条件渲染，这里只负责开着的时候把它放对地方。 */
  open: boolean
  /** 点了浮层和锚点以外的地方、或按了 Esc 时调用。 */
  onDismiss?: () => void
  /**
   * 浮层相对锚点的位置。放不下时自动翻到对面，贴边时沿边挪回视口里。
   * @default 'bottom-start'
   */
  placement?: FloatingPlacement
  /**
   * 浮层与锚点之间的距离，像素。
   * @default 4
   */
  gap?: number
  /** 浮层至少和锚点一样宽（下拉的选项）。 */
  matchWidth?: boolean
}

/**
 * 定位浮层（提示、菜单、下拉的选项）的共用逻辑。
 *
 * - 浮层带 `popover="manual"`，打开时进浏览器的顶层：不会被 `overflow: hidden` 裁掉，
 *   也能盖在模态的 `<dialog>` 上面（挂到 `<body>` 下的传送门做不到这一点）。
 * - 位置由 floating-ui 算，锚点滚动、改变大小时跟着更新。
 * - 开合由状态驱动：浮层只在 `open` 时渲染，关闭就是卸载。
 *
 * 把 `anchorRef` 给锚点，把 `floatingRef` 和 `floatingProps` 给浮层。
 */
export function useFloating<Anchor extends HTMLElement, Floating extends HTMLElement>({
  open,
  onDismiss,
  placement = 'bottom-start',
  gap = 4,
  matchWidth = false,
}: FloatingOptions) {
  const anchorRef = useRef<Anchor>(null)
  const floatingRef = useRef<Floating>(null)
  // 回调不进依赖：每次渲染都是新函数，不该让监听反复重挂
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const floating = floatingRef.current
    if (!open || !anchor || !floating) return
    // 有的环境（测试用的 happy-dom、很旧的浏览器）没有 popover，这时它就是一个普通的定位元素
    try {
      floating.showPopover?.()
    } catch {
      // 已经在顶层里了
    }
    const update = () => {
      void computePosition(anchor, floating, {
        strategy: 'fixed',
        placement,
        middleware: [
          offset(gap),
          flip(),
          shift({ padding: 8 }),
          matchWidth &&
            size({
              apply({ rects, elements }) {
                elements.floating.style.minWidth = `${rects.reference.width}px`
              },
            }),
        ],
      }).then(({ x, y, placement: resolved }) => {
        floating.style.left = `${x}px`
        floating.style.top = `${y}px`
        floating.dataset.placement = resolved
      })
    }
    const stop = autoUpdate(anchor, floating, update)
    return () => {
      stop()
      try {
        floating.hidePopover?.()
      } catch {
        // 元素已经不在文档里
      }
    }
  }, [open, placement, gap, matchWidth])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (anchorRef.current?.contains(target) || floatingRef.current?.contains(target)) return
      dismiss.current?.()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // 浮层开在弹窗里时，Esc 先关浮层：拦下这一次，不让弹窗跟着关
      event.preventDefault()
      event.stopPropagation()
      dismiss.current?.()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open])

  return {
    anchorRef,
    floatingRef,
    /** 展开到浮层元素上。位置算出来之前先放在视口外，免得在左上角闪一下。 */
    floatingProps: {
      popover: 'manual' as const,
      style: { position: 'fixed', left: '-9999px', top: 0 } as CSSProperties,
    },
  }
}

/**
 * 浮层元素要带的类：把浏览器给 `[popover]` 的默认样式（居中、描边、内边距、底色）清掉。
 * 位置由行内样式给。
 */
export const floatingReset =
  'inset-auto m-0 box-border overflow-visible border-0 bg-transparent p-0 text-ark-fg'
