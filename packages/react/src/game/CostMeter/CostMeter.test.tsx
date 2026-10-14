import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CostMeter } from './CostMeter'

describe('CostMeter', () => {
  it('费用是最大的数字：数据体常规字重，2.5rem', () => {
    render(<CostMeter data-testid="cost" value={23} />)
    const cost = screen.getByTestId('cost')
    expect(cost).toHaveAttribute('data-ark', 'cost-meter')
    expect(cost).toHaveAttribute('data-ark-tone', 'dark')
    expect(screen.getByText('23')).toHaveClass(
      'font-ark-data',
      'font-ark-regular',
      'text-ark-h1',
      'tabular-nums',
    )
  })

  it('数字前面是图标，名称只给读屏，默认“费用”', () => {
    const { rerender } = render(<CostMeter value={23} />)
    const name = screen.getByText('费用')
    expect(name).toHaveClass('sr-only')
    const glyph = name.previousElementSibling
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph?.querySelector('svg')).toBeInTheDocument()

    rerender(<CostMeter value={23} label="COST" />)
    expect(screen.getByText('COST')).toHaveClass('sr-only')
  })

  it('icon 换掉默认的图形', () => {
    render(
      <CostMeter
        value={23}
        icon={<svg aria-hidden="true" data-testid="custom" viewBox="0 0 24 24" />}
      />,
    )
    const glyph = screen.getByText('费用').previousElementSibling
    expect(glyph).toContainElement(screen.getByTestId('custom'))
    expect(glyph?.querySelectorAll('svg')).toHaveLength(1)
  })

  it('底板是半透明黑的直角矩形，不裁斜边', () => {
    render(<CostMeter data-testid="cost" value={23} />)
    const plate = screen.getByText('23').parentElement
    expect(plate).toHaveClass('h-[2.625rem]', 'bg-ark-neutral-black/65', 'justify-end')
    expect(screen.getByTestId('cost').innerHTML).not.toMatch(/ark-slant-/)
  })

  it('给了 progress 才有回复进度条：4px，白色，紧贴在底板下缘', () => {
    const { rerender } = render(<CostMeter value={23} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    rerender(<CostMeter value={23} progress={0.65} />)
    const bar = screen.getByRole('progressbar', { name: '费用回复进度' })
    expect(bar).toHaveAttribute('aria-valuenow', '0.65')
    expect(bar).toHaveAttribute('aria-valuemax', '1')
    expect(bar).toHaveClass('h-1')
    expect(bar.lastElementChild).toHaveClass('bg-ark-fg')
    // 底板在前，细条在后
    expect(bar.previousElementSibling).toBe(screen.getByText('23').parentElement)
  })

  it('progress 为 0 时仍然画出空的进度条', () => {
    render(<CostMeter value={0} progress={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('剩余可部署数写在最下面单独的一条深色带里', () => {
    const { rerender } = render(
      <CostMeter data-testid="cost" value={23} progress={0.5} deployable={6} />,
    )
    const line = screen.getByText('6').parentElement
    expect(line).toHaveTextContent('剩余可放置角色：6')
    expect(line).toHaveClass('h-[1.875rem]', 'bg-ark-neutral-black/65', 'text-ark-label')
    expect(screen.getByText('6')).toHaveClass('font-ark-data')
    expect(screen.getByTestId('cost').lastElementChild).toBe(line)

    rerender(
      <CostMeter data-testid="cost" value={23} deployable={6} deployableLabel="Unit Limit: " />,
    )
    expect(screen.getByTestId('cost')).toHaveTextContent('Unit Limit: 6')
  })

  it('进度条的名称可以改', () => {
    render(<CostMeter value={23} progress={0.5} progressLabel="Cost recovery" />)
    expect(screen.getByRole('progressbar', { name: 'Cost recovery' })).toBeInTheDocument()
  })
})
