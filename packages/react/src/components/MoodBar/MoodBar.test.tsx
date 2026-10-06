import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MoodBar } from './MoodBar'

const fill = () => screen.getByRole('progressbar').firstElementChild as HTMLElement

describe('MoodBar', () => {
  it('是一条进度条，默认名称是“心情”，上限 24', () => {
    render(<MoodBar value={18} />)
    const bar = screen.getByRole('progressbar', { name: '心情' })
    expect(bar).toHaveAttribute('data-ark', 'mood-bar')
    expect(bar).toHaveAttribute('aria-valuenow', '18')
    expect(bar).toHaveAttribute('aria-valuemax', '24')
    expect(fill().style.width).toBe('75%')
  })

  it('4px 的直角细条，黑色轨道', () => {
    render(<MoodBar value={18} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveClass('h-1', 'bg-ark-neutral-black/60')
    expect(bar.className).not.toContain('rounded')
  })

  it('正常时填充是前景色', () => {
    render(<MoodBar value={18} />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-low')
    expect(fill()).toHaveClass('bg-ark-fg')
  })

  it('低于阈值时转红，并换成斜纹', () => {
    render(<MoodBar value={5} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-low')
    expect(fill()).not.toHaveClass('bg-ark-fg')
    expect(fill().className).toContain('repeating-linear-gradient(-45deg')
    expect(fill().className).toContain('--ark-color-signal-danger')
  })

  it('默认阈值是上限的四分之一，正好等于时不算低', () => {
    const { rerender } = render(<MoodBar value={6} />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-low')

    rerender(<MoodBar value={5.9} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-low')
  })

  it('threshold 和 max 可以改', () => {
    const { rerender } = render(<MoodBar value={10} threshold={12} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-low')

    rerender(<MoodBar value={30} max={100} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-low')
    expect(fill().style.width).toBe('30%')
  })

  it('越界的值被限制在范围内', () => {
    const { rerender } = render(<MoodBar value={40} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '24')
    expect(fill().style.width).toBe('100%')

    rerender(<MoodBar value={-3} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-low')
  })

  it('名称可以用 aria-label 改', () => {
    render(<MoodBar value={12} aria-label="占位干员甲的心情" />)
    expect(screen.getByRole('progressbar', { name: '占位干员甲的心情' })).toBeInTheDocument()
  })

  it('宽度变化的过渡在减少动效时关闭', () => {
    render(<MoodBar value={12} />)
    expect(fill()).toHaveClass('transition-[width]', 'motion-reduce:transition-none')
  })
})
