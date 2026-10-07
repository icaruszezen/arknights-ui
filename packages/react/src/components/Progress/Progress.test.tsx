import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './Progress'

const fillWidth = () =>
  (screen.getByRole('progressbar').lastElementChild as HTMLElement).style.width

describe('Progress', () => {
  it('输出 progressbar 的取值属性', () => {
    render(<Progress aria-label="经验" value={2480} max={3600} />)
    const bar = screen.getByRole('progressbar', { name: '经验' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '3600')
    expect(bar).toHaveAttribute('aria-valuenow', '2480')
  })

  it('max 默认 100，进度宽度按比例', () => {
    render(<Progress aria-label="加载" value={42} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
    expect(fillWidth()).toBe('42%')
  })

  it('把取值限制在 0 到 max 之间', () => {
    const { rerender } = render(<Progress aria-label="加载" value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(fillWidth()).toBe('100%')

    rerender(<Progress aria-label="加载" value={-20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(fillWidth()).toBe('0%')
  })

  it('max 为 0 时进度为 0，不产生 NaN', () => {
    render(<Progress aria-label="加载" value={5} max={0} />)
    expect(fillWidth()).toBe('0%')
  })

  it('只有 thick 才分段', () => {
    const { rerender } = render(
      <Progress aria-label="经验" variant="thick" value={50} segments={5} />,
    )
    expect(screen.getByRole('progressbar').style.maskSize).toContain('/ 5')

    rerender(<Progress aria-label="经验" variant="thin" value={50} segments={5} />)
    expect(screen.getByRole('progressbar').style.maskSize).toBe('')
  })

  it('分段时保留使用方传入的 style', () => {
    render(
      <Progress
        aria-label="经验"
        variant="thick"
        value={50}
        segments={4}
        style={{ width: '10rem' }}
      />,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar.style.width).toBe('10rem')
    expect(bar.style.maskSize).toContain('/ 4')
  })

  it('rail 是 0.5rem 高的中灰轨道，进度与轨道同高', () => {
    render(<Progress aria-label="轮播" variant="rail" value={2} max={5} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveClass('h-2', 'bg-ark-neutral-gray-400')
    expect(bar.children).toHaveLength(1)
    expect(bar.lastElementChild).toHaveClass('inset-y-0', 'bg-ark-signal')
  })

  it('span 只画末尾一段：轮播用它标出当前页的位置', () => {
    const { rerender } = render(
      <Progress aria-label="轮播" variant="rail" value={2} max={5} span={1} />,
    )
    const fill = () => screen.getByRole('progressbar').lastElementChild as HTMLElement
    expect(fill().style.left).toBe('20%')
    expect(fill().style.width).toBe('20%')
    // 读屏读到的仍然是位置本身
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')

    // span 比 value 还大时从头画起，不出现负的起点
    rerender(<Progress aria-label="轮播" variant="rail" value={1} max={5} span={3} />)
    expect(fill().style.left).toBe('0%')
    expect(fill().style.width).toBe('20%')
  })

  it('meter 默认用前景色，其余默认用信号色', () => {
    const { rerender } = render(<Progress aria-label="攻击" variant="meter" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-fg')

    rerender(<Progress aria-label="加载" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-signal')

    rerender(<Progress aria-label="经验" variant="thick" tone="action" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-signal-action')
  })
})
