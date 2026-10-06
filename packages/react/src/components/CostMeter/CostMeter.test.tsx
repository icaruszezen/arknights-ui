import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CostMeter } from './CostMeter'

describe('CostMeter', () => {
  it('费用是最大的数字：数据体粗体，3.75rem', () => {
    render(<CostMeter data-testid="cost" value={23} />)
    const cost = screen.getByTestId('cost')
    expect(cost).toHaveAttribute('data-ark', 'cost-meter')
    expect(cost).toHaveAttribute('data-ark-tone', 'dark')
    expect(screen.getByText('23')).toHaveClass(
      'font-ark-data',
      'font-ark-bold',
      'text-ark-display',
      'tabular-nums',
    )
  })

  it('旁边是窄体的小标签，默认 COST', () => {
    const { rerender } = render(<CostMeter value={23} />)
    expect(screen.getByText('COST')).toHaveClass('font-ark-latin-condensed', 'text-ark-fg-muted')

    rerender(<CostMeter value={23} label="费用" />)
    expect(screen.getByText('费用')).toBeInTheDocument()
  })

  it('底板是半透明的黑，左边一条 45° 的斜边，画在 ::before 上', () => {
    render(<CostMeter data-testid="cost" value={23} />)
    const cost = screen.getByTestId('cost')
    // 斜边的水平偏移等于底板的高度
    expect(cost).toHaveClass('[--ark-slant:4.5rem]')
    const plate = screen.getByText('23').parentElement
    expect(plate).toHaveClass('h-18', 'before:bg-ark-neutral-black/65', 'before:ark-slant-l')
    expect(plate?.className).not.toMatch(/(^|\s)ark-slant-/)
  })

  it('给了 progress 才有回复进度条：4px，白色', () => {
    const { rerender } = render(<CostMeter value={23} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    rerender(<CostMeter value={23} progress={0.65} />)
    const bar = screen.getByRole('progressbar', { name: '费用回复进度' })
    expect(bar).toHaveAttribute('aria-valuenow', '0.65')
    expect(bar).toHaveAttribute('aria-valuemax', '1')
    expect(bar).toHaveClass('h-1', 'ml-(--ark-slant)')
    expect(bar.lastElementChild).toHaveClass('bg-ark-fg')
  })

  it('progress 为 0 时仍然画出空的进度条', () => {
    render(<CostMeter value={0} progress={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('剩余可部署数写在上方的一行小字里', () => {
    const { rerender } = render(<CostMeter data-testid="cost" value={23} deployable={6} />)
    const line = screen.getByText('6').parentElement
    expect(line).toHaveTextContent('剩余可部署 6')
    expect(line).toHaveClass('text-right', 'text-ark-caption')
    expect(screen.getByText('6')).toHaveClass('font-ark-data', 'font-ark-bold')

    rerender(<CostMeter data-testid="cost" value={23} deployable={6} deployableLabel="DEPLOY" />)
    expect(screen.getByTestId('cost')).toHaveTextContent('DEPLOY 6')
  })

  it('进度条的名称可以改', () => {
    render(<CostMeter value={23} progress={0.5} progressLabel="Cost recovery" />)
    expect(screen.getByRole('progressbar', { name: 'Cost recovery' })).toBeInTheDocument()
  })
})
