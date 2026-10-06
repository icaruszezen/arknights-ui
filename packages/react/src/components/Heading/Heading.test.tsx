import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading } from './Heading'

describe('Heading', () => {
  it('默认渲染为 h2，as 可改标题级别', () => {
    const { rerender } = render(<Heading>罗德岛</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: '罗德岛' })).toBeInTheDocument()

    rerender(<Heading as="h1">罗德岛</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('DOM 里主行始终在副行之前，位置只影响视觉顺序', () => {
    const { rerender } = render(
      <Heading size="lg" sub="ABOUT TERRA">
        泰拉万象
      </Heading>,
    )
    const heading = screen.getByRole('heading')
    expect(heading).toHaveAccessibleName('泰拉万象 ABOUT TERRA')
    expect(heading).toHaveClass('flex-col-reverse')

    rerender(
      <Heading size="lg" sub="ABOUT TERRA" subPosition="below">
        泰拉万象
      </Heading>,
    )
    expect(screen.getByRole('heading')).toHaveAccessibleName('泰拉万象 ABOUT TERRA')
    expect(screen.getByRole('heading')).toHaveClass('flex-col')
  })

  it('副行默认位置：lg 在上，其余在下', () => {
    const { rerender } = render(<Heading sub="WORLD">设定</Heading>)
    expect(screen.getByRole('heading')).toHaveClass('flex-col')

    rerender(
      <Heading size="sm" sub="FACTORY">
        制造站
      </Heading>,
    )
    expect(screen.getByRole('heading')).toHaveClass('flex-col')

    rerender(
      <Heading size="lg" sub="ABOUT TERRA">
        泰拉万象
      </Heading>,
    )
    expect(screen.getByRole('heading')).toHaveClass('flex-col-reverse')
  })

  it('serif 只改主行的字体', () => {
    render(
      <Heading serif sub="TERMINAL">
        作战
      </Heading>,
    )
    expect(screen.getByText('作战')).toHaveClass('font-ark-cjk-serif', 'font-ark-heavy')
    expect(screen.getByText('TERMINAL')).not.toHaveClass('font-ark-cjk-serif')
  })
})
