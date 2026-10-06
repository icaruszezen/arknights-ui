import { useState } from 'react'

/**
 * 受控 / 非受控二选一的状态：给了 `value` 就由外部决定，否则组件自己记。
 *
 * 返回当前值和一个设置函数。设置函数只在值真的变了时调用 `onChange`；
 * 受控时它不改自己的状态，外部不更新 `value`，当前值就不变。
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = useState(defaultValue)
  const current = value !== undefined ? value : inner
  const set = (next: T) => {
    if (value === undefined) setInner(next)
    if (!Object.is(next, current)) onChange?.(next)
  }
  return [current, set]
}
