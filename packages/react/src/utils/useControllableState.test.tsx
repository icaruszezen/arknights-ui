import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControllableState } from './useControllableState'

describe('useControllableState', () => {
  it('非受控时自己记住值，从 defaultValue 开始', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<number>(undefined, 0, onChange))
    expect(result.current[0]).toBe(0)

    act(() => result.current[1](2))
    expect(result.current[0]).toBe(2)
    expect(onChange).toHaveBeenCalledExactlyOnceWith(2)
  })

  it('受控时由外部的值决定，设置函数只回调', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<number>(value, 0, onChange),
      { initialProps: { value: 1 } },
    )
    expect(result.current[0]).toBe(1)

    // 外部不更新 value，当前值就不变
    act(() => result.current[1](3))
    expect(onChange).toHaveBeenCalledExactlyOnceWith(3)
    expect(result.current[0]).toBe(1)

    rerender({ value: 3 })
    expect(result.current[0]).toBe(3)
  })

  it('值没有变化时不回调', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<string>(undefined, 'a', onChange))
    act(() => result.current[1]('a'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
