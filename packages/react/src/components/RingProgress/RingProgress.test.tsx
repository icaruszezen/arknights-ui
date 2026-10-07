import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RingProgress } from './RingProgress'

const getFill = () => screen.getByRole('progressbar').querySelectorAll('circle')[1] as SVGElement

describe('RingProgress', () => {
  it('输出 progressbar 的取值属性，名称交给里面的环', () => {
    render(<RingProgress data-testid="ring" aria-label="等级经验" value={2480} max={3600} />)
    const bar = screen.getByRole('progressbar', { name: '等级经验' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '3600')
    expect(bar).toHaveAttribute('aria-valuenow', '2480')

    const root = screen.getByTestId('ring')
    expect(root).toHaveAttribute('data-ark', 'ring-progress')
    expect(root).not.toHaveAttribute('aria-label')
    expect(root).not.toHaveAttribute('role')
  })

  it('没走完的部分就是虚线的偏移量', () => {
    const { rerender } = render(<RingProgress aria-label="经验" value={62} />)
    expect(getFill()).toHaveAttribute('pathLength', '100')
    expect(getFill()).toHaveAttribute('stroke-dashoffset', '38')

    rerender(<RingProgress aria-label="经验" value={0} />)
    expect(getFill()).toHaveAttribute('stroke-dashoffset', '100')

    rerender(<RingProgress aria-label="经验" value={100} />)
    expect(getFill()).toHaveAttribute('stroke-dashoffset', '0')
  })

  it('把取值限制在 0 到 max 之间，max 为 0 时不产生 NaN', () => {
    const { rerender } = render(<RingProgress aria-label="经验" value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(getFill()).toHaveAttribute('stroke-dashoffset', '0')

    rerender(<RingProgress aria-label="经验" value={-20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    rerender(<RingProgress aria-label="经验" value={5} max={0} />)
    expect(getFill()).toHaveAttribute('stroke-dashoffset', '100')
  })

  it('中间的内容放在 progressbar 之外，读屏读得到', () => {
    render(
      <RingProgress aria-label="等级经验" value={62} label="LV">
        90
      </RingProgress>,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toContainElement(screen.getByText('90'))
    expect(bar).not.toContainElement(screen.getByText('LV'))
    expect(screen.getByText('90').closest('[aria-hidden="true"]')).toBeNull()
  })

  it('从 12 点方向起，端点是平的', () => {
    render(<RingProgress aria-label="经验" value={62} />)
    expect(screen.getByRole('progressbar').querySelector('svg')).toHaveClass('-rotate-90')
    expect(getFill()).not.toHaveAttribute('stroke-linecap')
  })

  it('三档线宽换算回来是 4、5、6px，圆不超出盒子', () => {
    const cases = [
      ['sm', 48, 4],
      ['md', 72, 5],
      ['lg', 96, 6],
    ] as const
    for (const [size, box, px] of cases) {
      const { unmount } = render(<RingProgress aria-label="经验" value={50} size={size} />)
      const stroke = Number(getFill().getAttribute('stroke-width'))
      const radius = Number(getFill().getAttribute('r'))
      expect((stroke / 100) * box).toBeCloseTo(px)
      expect(radius + stroke / 2).toBeCloseTo(50)
      unmount()
    }
  })

  it('filled 在环内压一块半透明黑的圆底，画在轨道下面', () => {
    const { container, rerender } = render(<RingProgress aria-label="等级" value={50} />)
    expect(container.querySelectorAll('circle')).toHaveLength(2)

    rerender(<RingProgress aria-label="等级" value={50} filled />)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(3)
    expect(circles[0]).toHaveClass('fill-ark-neutral-black/60')
  })

  it('labelPosition 把标签放到数字下面，DOM 里的顺序不变', () => {
    const { rerender } = render(
      <RingProgress aria-label="等级" value={50} label="LV">
        90
      </RingProgress>,
    )
    const center = () => screen.getByText('LV').parentElement as HTMLElement
    expect(center()).toHaveClass('flex-col')

    rerender(
      <RingProgress aria-label="等级" value={50} label="LV" labelPosition="below">
        120
      </RingProgress>,
    )
    expect(center()).toHaveClass('flex-col-reverse')
    expect(center().firstElementChild).toHaveTextContent('LV')
  })

  it('颜色可选，默认信号色', () => {
    const { rerender } = render(<RingProgress aria-label="经验" value={50} />)
    expect(getFill()).toHaveClass('stroke-ark-signal')

    rerender(<RingProgress aria-label="经验" value={50} tone="action" />)
    expect(getFill()).toHaveClass('stroke-ark-signal-action')
  })
})
