import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Rating } from './Rating'

const getShapes = () => [...screen.getByRole('img').querySelectorAll('svg')]

describe('Rating', () => {
  it('读屏读到一句话，图形本身对它隐藏', () => {
    render(<Rating value={5} />)
    const rating = screen.getByRole('img', { name: '5 星' })
    expect(rating).toHaveAttribute('data-ark', 'rating')
    for (const shape of getShapes()) expect(shape).toHaveAttribute('aria-hidden', 'true')
  })

  it('不给 max 时只画 value 颗', () => {
    render(<Rating value={4} />)
    expect(getShapes()).toHaveLength(4)
    expect(getShapes().some(shape => shape.classList.contains('opacity-25'))).toBe(false)
  })

  it('给了 max 时补齐到 max 颗，没点亮的画成暗的', () => {
    render(<Rating value={4} max={6} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('4 / 6 星')
    const dimmed = getShapes().map(shape => shape.classList.contains('opacity-25'))
    expect(dimmed).toEqual([false, false, false, false, true, true])
  })

  it('取整数部分，并限制在 0 到 max 之间', () => {
    const { rerender } = render(<Rating value={3.8} />)
    expect(getShapes()).toHaveLength(3)

    rerender(<Rating value={-2} />)
    expect(getShapes()).toHaveLength(0)
    expect(screen.getByRole('img')).toHaveAccessibleName('0 星')

    rerender(<Rating value={9} max={6} />)
    expect(getShapes()).toHaveLength(6)
    expect(screen.getByRole('img')).toHaveAccessibleName('6 / 6 星')
  })

  it('星形与菱形是两种不同的图形', () => {
    const { rerender } = render(<Rating value={1} />)
    const star = getShapes()[0]?.innerHTML
    rerender(<Rating value={1} shape="diamond" />)
    const diamond = getShapes()[0]?.innerHTML
    expect(star).toBeTruthy()
    expect(diamond).toBeTruthy()
    expect(star).not.toBe(diamond)
  })

  it('用稀有度的金色，并跟随明暗上下文压暗', () => {
    render(<Rating value={5} />)
    const rating = screen.getByRole('img')
    expect(rating.className).toContain('--ark-color-tier-5')
    expect(rating.className).toContain('--ark-signal-fg-mix')
  })

  it('名称和颜色都可以改写', () => {
    render(<Rating value={6} aria-label="六星干员" className="text-ark-tier-6" />)
    const rating = screen.getByRole('img', { name: '六星干员' })
    expect(rating).toHaveClass('text-ark-tier-6')
    expect(rating.className).not.toContain('--ark-color-tier-5')
  })
})
