import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Ticks } from './Ticks'

describe('Ticks', () => {
  it('是装饰，默认对读屏隐藏', () => {
    render(<Ticks data-testid="ticks" />)
    const ticks = screen.getByTestId('ticks')
    expect(ticks).toHaveAttribute('data-ark', 'ticks')
    expect(ticks).toHaveAttribute('aria-hidden', 'true')
  })

  it('默认每 5 格一条长刻度，可以改', () => {
    const { rerender } = render(<Ticks data-testid="ticks" />)
    expect(screen.getByTestId('ticks').style.getPropertyValue('--ark-ticks-major')).toBe('5')

    rerender(<Ticks data-testid="ticks" major={10} />)
    expect(screen.getByTestId('ticks').style.getPropertyValue('--ark-ticks-major')).toBe('10')
  })

  it('横向铺满宽度，竖向跟随父容器的高度', () => {
    const { rerender } = render(<Ticks data-testid="ticks" />)
    expect(screen.getByTestId('ticks')).toHaveClass('h-2', 'w-full')

    rerender(<Ticks data-testid="ticks" orientation="vertical" />)
    const ticks = screen.getByTestId('ticks')
    expect(ticks).toHaveClass('w-2', 'self-stretch')
    expect(ticks).not.toHaveClass('w-full')
  })

  // happy-dom 不保留含渐变的 background-image，这里看三层背景各自的尺寸：
  // 基线 1px、长刻度占满、短刻度只占一半
  it('三层背景：基线、长刻度、短刻度，随方向换轴', () => {
    const { rerender } = render(<Ticks data-testid="ticks" />)
    expect(screen.getByTestId('ticks').style.backgroundSize).toBe('100% 1px, 100% 100%, 100% 50%')

    rerender(<Ticks data-testid="ticks" orientation="vertical" />)
    expect(screen.getByTestId('ticks').style.backgroundSize).toBe('1px 100%, 100% 100%, 50% 100%')
  })

  it('颜色跟随文字色，保留使用方传入的 style', () => {
    render(<Ticks data-testid="ticks" style={{ opacity: 0.5 }} />)
    const ticks = screen.getByTestId('ticks')
    expect(ticks).toHaveClass('text-ark-fg-muted')
    expect(ticks.style.opacity).toBe('0.5')
    expect(ticks.style.getPropertyValue('--ark-ticks-major')).toBe('5')
  })
})
