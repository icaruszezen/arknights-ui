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

  it('自己不定颜色，跟随所在的文字；要压暗由使用方加', () => {
    const { rerender } = render(<MicroText>RHODES ISLAND</MicroText>)
    const text = screen.getByText('RHODES ISLAND')
    // 只有字号一个 text- 类
    expect(text.className.split(' ').filter(name => name.startsWith('text-'))).toEqual([
      'text-ark-micro',
    ])

    rerender(<MicroText className="text-ark-fg-muted">RHODES ISLAND</MicroText>)
    expect(screen.getByText('RHODES ISLAND')).toHaveClass('text-ark-micro', 'text-ark-fg-muted')
  })

  it('使用方的 className 覆盖同属性的默认类', () => {
    render(<MicroText className="text-ark-caption">RHODES ISLAND</MicroText>)
    const text = screen.getByText('RHODES ISLAND')
    expect(text).toHaveClass('text-ark-caption')
    expect(text).not.toHaveClass('text-ark-micro')
  })
})
