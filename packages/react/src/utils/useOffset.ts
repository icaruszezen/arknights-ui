import { type RefObject, useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * 视点跟着什么走。
 * - `window`：指针在整个窗口里的位置
 * - `pointer`：指针在元素里的位置，离开元素后回到正中
 * - `scroll`：元素滚过视口的进度（只有纵向）
 */
export type OffsetSource = 'window' | 'pointer' | 'scroll'

export interface OffsetOptions {
  source: OffsetSource
  /** 为 `false` 时不挂任何监听。 */
  enabled: boolean
  /**
   * 视点变化时调用，每帧最多一次。`x`、`y` 都在 -1 到 1 之间，0 是正中，
   * 正方向是右和下。停止跟踪时会再以 `(0, 0)` 调用一次。
   */
  onChange: (element: HTMLElement, x: number, y: number) => void
}

// 指针驱动的效果只给有精确指针的设备：触屏上拖动时的 pointermove 不该让画面跟着晃
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

const clamp = (value: number) => Math.min(Math.max(value, -1), 1)

/**
 * 把指针位置或滚动进度归一化成一个“视点”，交给回调去写 CSS 变量。
 * TiltGroup 的摆动和 Parallax 的位移共用。
 *
 * 不经过 React 状态：回调直接改样式，移动指针不会触发重渲染。
 * 用户要求减少动效时不启动（文档：陀螺仪 / 鼠标驱动的摆动必须可以关闭）。
 */
export function useOffset(
  ref: RefObject<HTMLElement | null>,
  { source, enabled, onChange }: OffsetOptions,
): void {
  const reduced = useReducedMotion()
  const active = enabled && !reduced

  // 回调每次渲染都是新的，放进 ref 里，免得每次都重新挂监听
  const latest = useRef(onChange)
  useEffect(() => {
    latest.current = onChange
  })

  useEffect(() => {
    const element = ref.current
    if (!active || !element) return
    if (source !== 'scroll') {
      if (typeof window.matchMedia !== 'function') return
      if (!window.matchMedia(FINE_POINTER).matches) return
    }

    let x = 0
    let y = 0
    let frame = 0
    const flush = () => {
      frame = 0
      latest.current(element, x, y)
    }
    const set = (nextX: number, nextY: number) => {
      x = clamp(nextX)
      y = clamp(nextY)
      // 一帧里来多少次事件都只写一次样式
      if (frame === 0) frame = requestAnimationFrame(flush)
    }

    const cleanups: (() => void)[] = []
    const listen = (
      target: EventTarget,
      type: string,
      listener: EventListener,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, listener, options)
      cleanups.push(() => target.removeEventListener(type, listener, options))
    }

    if (source === 'window') {
      listen(window, 'pointermove', event => {
        const { clientX, clientY } = event as PointerEvent
        if (window.innerWidth === 0 || window.innerHeight === 0) return
        set((clientX / window.innerWidth) * 2 - 1, (clientY / window.innerHeight) * 2 - 1)
      })
    } else if (source === 'pointer') {
      listen(element, 'pointermove', event => {
        const { clientX, clientY } = event as PointerEvent
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        set(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          ((clientY - rect.top) / rect.height) * 2 - 1,
        )
      })
      listen(element, 'pointerleave', () => set(0, 0))
    } else {
      // 视口中心相对元素中心的位置：元素还在下方时为负，滚过去之后为正
      const update = () => {
        const rect = element.getBoundingClientRect()
        const half = window.innerHeight / 2
        const reach = half + rect.height / 2
        if (reach === 0) return
        set(0, (half - (rect.top + rect.height / 2)) / reach)
      }
      // capture：元素可能在某个内部滚动容器里，scroll 事件不冒泡
      listen(window, 'scroll', update, { passive: true, capture: true })
      listen(window, 'resize', update)
      update()
    }

    return () => {
      for (const cleanup of cleanups) cleanup()
      if (frame !== 0) cancelAnimationFrame(frame)
      latest.current(element, 0, 0)
    }
  }, [ref, active, source])
}
