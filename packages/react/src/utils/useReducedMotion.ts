import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// 有的环境（服务端、jsdom）没有 matchMedia
const getList = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY)
    : null

function subscribe(onChange: () => void) {
  const list = getList()
  if (!list) return () => {}
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

/**
 * 用户是否要求减少动效。
 *
 * 写在 CSS 里的动效用 `motion-safe:` 就够了；这个 hook 给 JS 驱动的那几种
 * （数字滚动、指针摆动、视差、故障）用来决定要不要启动。服务端渲染时按“不减少”处理。
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getList()?.matches ?? false,
    () => false,
  )
}
