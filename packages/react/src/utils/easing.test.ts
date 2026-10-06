import { describe, expect, it } from 'vitest'
import { cubicBezier, mechanical } from './easing'

describe('cubicBezier', () => {
  it('两端固定在 0 和 1，越界的进度被夹住', () => {
    const ease = cubicBezier(0.25, 0.1, 0.25, 1)
    expect(ease(0)).toBe(0)
    expect(ease(1)).toBe(1)
    expect(ease(-0.5)).toBe(0)
    expect(ease(1.5)).toBe(1)
  })

  it('控制点落在对角线上时就是线性', () => {
    const linear = cubicBezier(0.25, 0.25, 0.75, 0.75)
    for (const t of [0.1, 0.33, 0.5, 0.8]) expect(linear(t)).toBeCloseTo(t, 5)
  })

  it('与 CSS 的 ease-in 取值一致', () => {
    // cubic-bezier(0.42, 0, 1, 1) 在一半处约为 0.315
    expect(cubicBezier(0.42, 0, 1, 1)(0.5)).toBeCloseTo(0.315, 2)
  })
})

describe('mechanical', () => {
  it('单调递增', () => {
    let previous = 0
    for (let t = 0.05; t <= 1; t += 0.05) {
      const value = mechanical(t)
      expect(value).toBeGreaterThanOrEqual(previous)
      previous = value
    }
  })

  it('起步干脆：时间过半时已经走完八成以上', () => {
    expect(mechanical(0.5)).toBeGreaterThan(0.8)
    expect(mechanical(0.5)).toBeLessThan(0.95)
  })
})
