import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('是带方向的分隔符', () => {
    const { rerender } = render(<Divider />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')

    rerender(<Divider orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('带标签时是可读的文字，不再是分隔符', () => {
    render(<Divider label="PROFILE" />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(screen.getByText('PROFILE')).toBeInTheDocument()
  })

  it('竖线不渲染标签', () => {
    render(<Divider orientation="vertical" label="PROFILE" />)
    expect(screen.queryByText('PROFILE')).not.toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('起点标记与线本身对读屏隐藏', () => {
    const { container } = render(<Divider start="bar" />)
    const parts = container.querySelectorAll('[data-ark="divider"] > span')
    expect(parts).toHaveLength(2)
    for (const part of parts) expect(part).toHaveAttribute('aria-hidden', 'true')
  })

  it('bar 是 3.5rem × 3px 的前景色短粗段，和细线之间留 0.5rem', () => {
    const { container, rerender } = render(<Divider start="bar" />)
    const start = () => container.querySelector('[data-ark="divider"] > span')
    expect(start()).toHaveClass('h-[0.1875rem]', 'w-14', 'mr-ark-2', 'bg-ark-fg')
    expect(start()).not.toHaveClass('bg-ark-signal')

    rerender(<Divider start="bar" orientation="vertical" />)
    expect(start()).toHaveClass('h-14', 'w-[0.1875rem]', 'mb-ark-2')
  })

  it('square 是 6px 的方块，紧贴着细线', () => {
    const { container } = render(<Divider start="square" />)
    const start = container.querySelector('[data-ark="divider"] > span')
    expect(start).toHaveClass('size-[0.375rem]', 'bg-ark-fg')
  })
})
