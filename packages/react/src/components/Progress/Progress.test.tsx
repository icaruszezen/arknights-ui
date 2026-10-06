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

  it('meter 默认用前景色，其余默认用信号色', () => {
    const { rerender } = render(<Progress aria-label="攻击" variant="meter" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-fg')

    rerender(<Progress aria-label="加载" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-signal')

    rerender(<Progress aria-label="经验" variant="thick" tone="action" value={72} />)
    expect(screen.getByRole('progressbar').lastElementChild).toHaveClass('bg-ark-signal-action')
  })
})
