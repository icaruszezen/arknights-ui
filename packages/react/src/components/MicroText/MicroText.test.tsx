import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MicroText } from './MicroText'

describe('MicroText', () => {
  it('默认对读屏隐藏，避免被逐字母朗读', () => {
    render(<MicroText>RHODES ISLAND</MicroText>)
    const text = screen.getByText('RHODES ISLAND')
    expect(text).toHaveAttribute('data-ark', 'micro-text')
    expect(text).toHaveAttribute('aria-hidden', 'true')
  })

  it('需要被读到时可以取消隐藏', () => {
    render(<MicroText aria-hidden={false}>RHODES ISLAND</MicroText>)
    expect(screen.getByText('RHODES ISLAND')).toHaveAttribute('aria-hidden', 'false')
  })

  it('竖排用书写方向，不用旋转', () => {
    const { rerender } = render(<MicroText>PRTS</MicroText>)
    expect(screen.getByText('PRTS')).not.toHaveClass('[writing-mode:vertical-rl]')

    rerender(<MicroText vertical>PRTS</MicroText>)
    const text = screen.getByText('PRTS')
    expect(text).toHaveClass('[writing-mode:vertical-rl]')
    expect(text.className).not.toContain('rotate')
  })

  it('颜色跟随明暗上下文，不写死调色板里的灰', () => {
    render(<MicroText>RHODES ISLAND</MicroText>)
    const text = screen.getByText('RHODES ISLAND')
    expect(text).toHaveClass('text-ark-fg-muted/50')
    expect(text.className).not.toContain('neutral-gray')
  })

  it('使用方的 className 覆盖同属性的默认类', () => {
    render(<MicroText className="text-ark-caption">RHODES ISLAND</MicroText>)
    const text = screen.getByText('RHODES ISLAND')
    expect(text).toHaveClass('text-ark-caption')
    expect(text).not.toHaveClass('text-ark-micro')
  })
})
