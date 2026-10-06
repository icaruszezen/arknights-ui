import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../internal/testing'
import { useReducedMotion } from './useReducedMotion'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useReducedMotion', () => {
  it('默认不减少动效', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('用户要求减少动效时为 true', () => {
    mockMatchMedia(['prefers-reduced-motion'])
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('环境里没有 matchMedia 时按不减少处理', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(window.matchMedia).toBeUndefined()
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})
