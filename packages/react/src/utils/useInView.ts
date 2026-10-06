import { type RefObject, useEffect, useState } from 'react'

/**
 * 元素是否已经进入过视口。只记第一次：进入之后就断开观察，不会再变回 `false`。
 *
 * `enabled` 为 `false` 时不观察，直接返回 `true`——“挂载就开始”的组件走这条路。
 * 浏览器不支持 `IntersectionObserver` 时也视为已进入，内容不会一直藏着。
 */
export function useInView(ref: RefObject<Element | null>, enabled: boolean): boolean {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (!enabled || seen) return
    const element = ref.current
    if (!element || typeof IntersectionObserver !== 'function') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setSeen(true)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, enabled, seen])

  return seen || !enabled
}
