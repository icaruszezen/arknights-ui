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
})
