import tokens from '@arknights-ui/tokens/tokens.json'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { halftoneMask } from '../../internal/halftone'
import { Pattern } from './Pattern'

const fadeTo = (direction: string) =>
  `[--ark-pattern-fade:linear-gradient(to_${direction},#000,transparent_60%)]`

const halftoneVar = (element: HTMLElement) =>
  element.style.getPropertyValue('--ark-pattern-halftone')

describe('Pattern', () => {
  it('是纯装饰：对读屏隐藏，不接收点击', () => {
    render(<Pattern data-testid="pattern" />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern).toHaveAttribute('data-ark', 'pattern')
    expect(pattern).toHaveAttribute('aria-hidden', 'true')
    expect(pattern).toHaveClass('pointer-events-none')
    expect(pattern).toBeEmptyDOMElement()
  })

  it('默认是半调网点，朝右上渐疏：用主题层的遮罩，不另设变量', () => {
    render(<Pattern data-testid="pattern" />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern).toHaveAttribute('data-variant', 'halftone')
    expect(pattern).toHaveAttribute('data-fade', 'top-right')
    expect(pattern).toHaveClass('ark-pattern-halftone')
    expect(halftoneVar(pattern)).toBe('')
    expect(pattern.className).not.toContain('--ark-pattern-fade')
  })

  it('每种底纹对应一个工具类', () => {
    const { rerender } = render(<Pattern data-testid="pattern" variant="grain" />)
    for (const variant of ['dots', 'grain', 'grid', 'scanline', 'hazard'] as const) {
      rerender(<Pattern data-testid="pattern" variant={variant} />)
      const pattern = screen.getByTestId('pattern')
      expect(pattern).toHaveClass(`ark-pattern-${variant}`)
      expect(pattern).not.toHaveClass('ark-pattern-halftone')
    }
  })

  it('半调以外的底纹默认不渐隐', () => {
    render(<Pattern data-testid="pattern" variant="grid" />)
    expect(screen.getByTestId('pattern').className).not.toContain('--ark-pattern-fade')
  })

  it('fade 指定渐疏的方向，none 关掉', () => {
    const { rerender } = render(<Pattern data-testid="pattern" variant="grid" fade="bottom" />)
    expect(screen.getByTestId('pattern')).toHaveClass(fadeTo('bottom'))

    rerender(<Pattern data-testid="pattern" variant="dots" fade="bottom-left" />)
    expect(screen.getByTestId('pattern')).toHaveClass(fadeTo('bottom_left'))

    rerender(<Pattern data-testid="pattern" variant="grid" fade="none" />)
    expect(screen.getByTestId('pattern').className).not.toContain('--ark-pattern-fade')
  })

  it('半调换方向是换遮罩图，不是叠一层渐隐', () => {
    const { rerender } = render(<Pattern data-testid="pattern" fade="bottom-left" />)
    const pattern = screen.getByTestId('pattern')
    expect(halftoneVar(pattern)).toBe(halftoneMask('bottom-left'))
    expect(pattern.className).not.toContain('--ark-pattern-fade')

    rerender(<Pattern data-testid="pattern" fade="none" />)
    expect(halftoneVar(screen.getByTestId('pattern'))).toBe(halftoneMask('none'))
  })

  it('半调的九种写法各是一张不同的遮罩', () => {
    const directions = [
      'none',
      'top',
      'right',
      'bottom',
      'left',
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ] as const
    const masks = directions.map(direction => halftoneMask(direction))
    expect(new Set(masks).size).toBe(directions.length)
    for (const mask of masks) {
      expect(mask).toMatch(/^url\("data:image\/svg\+xml,%3Csvg /)
      expect(mask).toMatch(/ 0 0 \/ 100% 100% no-repeat$/)
      // 写进 CSS 的 url() 里不能有没转义的尖括号和井号
      expect(mask).not.toMatch(/[<>#]/)
    }
  })

  // tokens.json 里的字符串是由 halftoneMask 生成的，改了一边要重新生成另一边
  it('token 里的默认遮罩与生成的一致', () => {
    expect(tokens.pattern.halftone.value).toBe(halftoneMask('top-right'))
  })

  it('使用方的 style 与遮罩变量并存', () => {
    render(<Pattern data-testid="pattern" fade="left" style={{ opacity: 0.5 }} />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern.style.opacity).toBe('0.5')
    expect(halftoneVar(pattern)).toBe(halftoneMask('left'))
  })

  it('默认铺满盒子，警戒条纹是一条窄边', () => {
    const { rerender } = render(<Pattern data-testid="pattern" />)
    expect(screen.getByTestId('pattern')).toHaveClass('size-full')

    rerender(<Pattern data-testid="pattern" variant="hazard" />)
    const hazard = screen.getByTestId('pattern')
    expect(hazard).toHaveClass('h-2', 'w-full')
    expect(hazard).not.toHaveClass('size-full')
  })

  it('mono 只对警戒条纹有效', () => {
    const { rerender } = render(<Pattern data-testid="pattern" variant="hazard" mono />)
    const hazard = screen.getByTestId('pattern')
    expect(hazard).toHaveClass('ark-pattern-hazard-mono')
    expect(hazard).not.toHaveClass('ark-pattern-hazard')

    rerender(<Pattern data-testid="pattern" variant="grid" mono />)
    expect(screen.getByTestId('pattern')).toHaveClass('ark-pattern-grid')
    expect(screen.getByTestId('pattern')).not.toHaveClass('ark-pattern-hazard-mono')
  })

  it('颜色取文字色，位置和大小由 className 决定', () => {
    render(<Pattern data-testid="pattern" className="absolute inset-0 -z-1 h-40 text-ark-signal" />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern).toHaveClass('absolute', 'inset-0', '-z-1', 'h-40', 'text-ark-signal')
    expect(pattern).not.toHaveClass('text-ark-fg')
  })
})
