import { createContext, type KeyboardEvent, type MouseEvent, useContext } from 'react'

// 单选组：一排互斥的选项（职业筛选、缩略图切换）。按 WAI-ARIA 的单选组模式，
// 只有选中项在 Tab 键序列里，其余用方向键到达；方向键移动焦点的同时就选中。
// 键盘处理的写法与 Tabs 的 TabList 相同。

export interface RadioGroupContextValue {
  value: string | undefined
  select: (value: string) => void
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

const PREVIOUS = new Set(['ArrowLeft', 'ArrowUp'])
const NEXT = new Set(['ArrowRight', 'ArrowDown'])

/** 挂在 `role="radiogroup"` 的元素上：方向键在选项间移动并立即选中，首尾循环；Home / End 跳到首尾。 */
export function handleRadioGroupKeyDown(event: KeyboardEvent<HTMLElement>) {
  if (event.defaultPrevented) return
  const radios = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
  )
  const index = radios.indexOf(document.activeElement as HTMLButtonElement)
  if (index === -1) return
  const last = radios.length - 1
  let next: number
  if (NEXT.has(event.key)) next = index === last ? 0 : index + 1
  else if (PREVIOUS.has(event.key)) next = index === 0 ? last : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  else return
  event.preventDefault()
  radios[next]?.focus()
  radios[next]?.click()
}

/**
 * 单选组里的一项要展开到 `<button>` 上的属性。
 *
 * @param component 这一项的组件名，脱离单选组使用时报错信息里用
 * @param group 它应该放进去的那个组件名
 */
export function useRadioItem(
  value: string,
  component: string,
  group: string,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void,
) {
  const context = useContext(RadioGroupContext)
  if (!context) throw new Error(`<${component}> 必须放在 <${group}> 里`)
  const selected = context.value === value
  return {
    selected,
    radioProps: {
      type: 'button',
      role: 'radio',
      'aria-checked': selected,
      // 还没有选中项时每一项都能用 Tab 到达，否则整组进不去
      tabIndex: selected || context.value === undefined ? 0 : -1,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.select(value)
      },
    } as const,
  }
}
