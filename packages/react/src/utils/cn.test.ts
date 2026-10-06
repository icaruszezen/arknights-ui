import tokens from '@arknights-ui/tokens/tokens.json'
import { describe, expect, it } from 'vitest'
import { arkFontSizes, arkFontWeights, arkShadows, cn } from './cn'

const arkKeys = (group: object) => Object.keys(group).map(key => `ark-${key}`)

describe('cn', () => {
  it('同一属性后写的覆盖先写的', () => {
    expect(cn('px-ark-5', 'px-ark-2')).toBe('px-ark-2')
    expect(cn('p-ark-5', 'p-4')).toBe('p-4')
    expect(cn('border-0', 'border')).toBe('border')
    expect(cn('tracking-ark-wide', 'tracking-ark-tight')).toBe('tracking-ark-tight')
    expect(cn('leading-ark-solid', 'leading-ark-body')).toBe('leading-ark-body')
    expect(cn('ease-ark-standard', 'ease-ark-mechanical')).toBe('ease-ark-mechanical')
    expect(cn('animate-ark-spin', 'animate-none')).toBe('animate-none')
    expect(cn('motion-safe:animate-ark-spin', 'motion-safe:animate-ark-blink')).toBe(
      'motion-safe:animate-ark-blink',
    )
  })

  it('字号与颜色共用 text- 前缀，但互不覆盖', () => {
    expect(cn('text-ark-body', 'text-ark-fg')).toBe('text-ark-body text-ark-fg')
    expect(cn('text-ark-body', 'text-ark-label')).toBe('text-ark-label')
    expect(cn('text-ark-fg', 'text-ark-signal')).toBe('text-ark-signal')
  })

  it('字重与字体共用 font- 前缀，但互不覆盖', () => {
    expect(cn('font-ark-data', 'font-ark-bold')).toBe('font-ark-data font-ark-bold')
    expect(cn('font-ark-regular', 'font-ark-bold')).toBe('font-ark-bold')
    expect(cn('font-ark-data', 'font-ark-cjk-sans')).toBe('font-ark-cjk-sans')
  })

  it('投影与投影色共用 shadow- 前缀，但互不覆盖', () => {
    expect(cn('shadow-ark-panel', 'shadow-ark-signal')).toBe('shadow-ark-panel shadow-ark-signal')
    expect(cn('drop-shadow-ark-panel', 'drop-shadow-ark-hard')).toBe('drop-shadow-ark-hard')
  })

  it('带变体的类只与同变体的冲突', () => {
    expect(cn('hover:bg-ark-invert', 'hover:bg-ark-signal')).toBe('hover:bg-ark-signal')
    expect(cn('bg-ark-signal', 'hover:bg-ark-invert')).toBe('bg-ark-signal hover:bg-ark-invert')
  })

  // tokens.json 增删字号、字重、投影后，这里的清单要跟着改
  it('登记的键名与 tokens.json 一致', () => {
    expect(arkFontSizes).toEqual(arkKeys(tokens.font.size))
    expect(arkFontWeights).toEqual(arkKeys(tokens.font.weight))
    expect(arkShadows).toEqual(arkKeys(tokens.shadow))
  })
})
