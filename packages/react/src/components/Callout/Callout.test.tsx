import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from './Callout'

describe('Callout', () => {
  it('由方点、折线、标签三部分组成，前两样对读屏隐藏', () => {
    render(<Callout data-testid="callout">GALLERY</Callout>)
    const callout = screen.getByTestId('callout')
    expect(callout).toHaveAttribute('data-ark', 'callout')
    expect(callout.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(callout.querySelector('span[aria-hidden="true"]')).not.toBeNull()

    const label = screen.getByText('GALLERY')
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('默认标签只是文字', () => {
    render(<Callout>GALLERY</Callout>)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('GALLERY').tagName).toBe('SPAN')
  })

  it('有 href 时标签是链接，点击区撑到 44px', () => {
    render(
      <Callout href="#gallery" target="_blank" rel="noreferrer">
        GALLERY
      </Callout>,
    )
    const link = screen.getByRole('link', { name: 'GALLERY' })
    expect(link).toHaveAttribute('href', '#gallery')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link).toHaveClass('after:h-11')
  })

  it('标签是固定的黑底信号色字', () => {
    render(<Callout>GALLERY</Callout>)
    expect(screen.getByText('GALLERY')).toHaveClass('bg-ark-neutral-black', 'text-ark-signal')
  })

  it('折线先水平后 45°：斜段的水平与垂直位移相等', () => {
    render(<Callout data-testid="callout">GALLERY</Callout>)
    const points = (
      screen.getByTestId('callout').querySelector('polyline')?.getAttribute('points') ?? ''
    )
      .split(' ')
      .map(point => point.split(',').map(Number) as [number, number])
    const [start, bend, rise, end] = points
    expect(start?.[1]).toBe(bend?.[1])
    expect(rise?.[1]).toBe(end?.[1])
    expect((rise?.[0] ?? 0) - (bend?.[0] ?? 0)).toBe((bend?.[1] ?? 0) - (rise?.[1] ?? 0))
  })

  it('根节点按方向平移，定位的坐标落在方点上', () => {
    const { rerender } = render(<Callout data-testid="callout">GALLERY</Callout>)
    expect(screen.getByTestId('callout')).toHaveClass('-translate-y-full')

    rerender(
      <Callout data-testid="callout" direction="down-right">
        GALLERY
      </Callout>,
    )
    expect(screen.getByTestId('callout').className).not.toContain('translate')
    expect(screen.getByTestId('callout').querySelector('svg')).toHaveClass('-scale-y-100')

    rerender(
      <Callout data-testid="callout" direction="down-left">
        GALLERY
      </Callout>,
    )
    expect(screen.getByTestId('callout')).toHaveClass('-translate-x-full')
    expect(screen.getByTestId('callout').querySelector('svg')).toHaveClass('-scale-100')
    expect(screen.getByText('GALLERY')).toHaveClass('right-full')
  })

  it('使用方的 className 用来定位', () => {
    render(
      <Callout data-testid="callout" className="absolute top-1/2 left-1/3">
        GALLERY
      </Callout>,
    )
    const callout = screen.getByTestId('callout')
    expect(callout).toHaveClass('absolute', 'top-1/2', 'left-1/3')
    expect(callout).not.toHaveClass('relative')
  })
})
