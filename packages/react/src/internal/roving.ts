import type { KeyboardEvent } from 'react'

export type RovingAxis = 'horizontal' | 'vertical' | 'both'

const PREVIOUS: Record<RovingAxis, readonly string[]> = {
  horizontal: ['ArrowLeft'],
  vertical: ['ArrowUp'],
  both: ['ArrowLeft', 'ArrowUp'],
}
const NEXT: Record<RovingAxis, readonly string[]> = {
  horizontal: ['ArrowRight'],
  vertical: ['ArrowDown'],
  both: ['ArrowRight', 'ArrowDown'],
}

/**
 * 一组里只有一项在 Tab 键序列里、其余用方向键到达的那种键盘操作（标签页、单选组、菜单）。
 * 挂在容器的 `onKeyDown` 上：方向键在 `selector` 选中的各项之间移动焦点，首尾循环；Home / End 跳到首尾。
 *
 * @param selector 容器里可以到达的项，例如 `[role="tab"]:not(:disabled)`
 * @param axis 哪一组方向键起作用
 * @param activate 移到新的一项之后顺便点它一下（标签页、单选组是“移到即选中”）
 * @returns 是否处理了这次按键
 */
export function handleRovingKeyDown(
  event: KeyboardEvent<HTMLElement>,
  selector: string,
  axis: RovingAxis = 'both',
  activate = true,
): boolean {
  if (event.defaultPrevented) return false
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(selector))
  const index = items.indexOf(document.activeElement as HTMLElement)
  if (index === -1) return false
  const last = items.length - 1
  let next: number
  if (NEXT[axis].includes(event.key)) next = index === last ? 0 : index + 1
  else if (PREVIOUS[axis].includes(event.key)) next = index === 0 ? last : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  else return false
  event.preventDefault()
  items[next]?.focus()
  if (activate) items[next]?.click()
  return true
}
