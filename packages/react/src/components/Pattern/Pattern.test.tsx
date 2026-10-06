import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pattern } from './Pattern'

const fadeTo = (direction: string) =>
  `[--ark-pattern-fade:linear-gradient(to_${direction},#000,transparent_60%)]`

describe('Pattern', () => {
  it('是纯装饰：对读屏隐藏，不接收点击', () => {
    render(<Pattern data-testid="pattern" />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern).toHaveAttribute('data-ark', 'pattern')
    expect(pattern).toHaveAttribute('aria-hidden', 'true')
    expect(pattern).toHaveClass('pointer-events-none')
    expect(pattern).toBeEmptyDOMElement()
  })

  it('默认是半调网点，朝右上渐疏', () => {
    render(<Pattern data-testid="pattern" />)
    const pattern = screen.getByTestId('pattern')
    expect(pattern).toHaveAttribute('data-variant', 'halftone')
    expect(pattern).toHaveClass('ark-pattern-halftone', fadeTo('top_right'))
  })

  it('每种底纹对应一个工具类', () => {
    const { rerender } = render(<Pattern data-testid="pattern" variant="grain" />)
    for (const variant of ['grain', 'grid', 'scanline', 'hazard'] as const) {
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

    rerender(<Pattern data-testid="pattern" fade="bottom-left" />)
    expect(screen.getByTestId('pattern')).toHaveClass(fadeTo('bottom_left'))
    expect(screen.getByTestId('pattern')).not.toHaveClass(fadeTo('top_right'))

    rerender(<Pattern data-testid="pattern" fade="none" />)
    expect(screen.getByTestId('pattern').className).not.toContain('--ark-pattern-fade')
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
