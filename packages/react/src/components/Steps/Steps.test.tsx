import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Step, Steps, type StepsProps } from './Steps'

function Flow(props: Partial<StepsProps>) {
  return (
    <Steps aria-label="发布流程" current={1} {...props}>
      <Step title="填写信息" sub="Info" />
      <Step title="选择环境" sub="Target">
        生产环境需要审批
      </Step>
      <Step title="确认发布" sub="Confirm" />
    </Steps>
  )
}

describe('Steps', () => {
  it('是一个有序列表；当前的那一步带 aria-current="step"', () => {
    render(<Flow />)
    const list = screen.getByRole('list', { name: '发布流程' })
    expect(list.tagName).toBe('OL')
    expect(list).toHaveAttribute('data-ark', 'steps')
    const steps = screen.getAllByRole('listitem')
    expect(steps).toHaveLength(3)
    expect(steps.map(step => step.getAttribute('data-state'))).toEqual([
      'done',
      'current',
      'upcoming',
    ])
    expect(steps[1]).toHaveAttribute('aria-current', 'step')
    expect(steps[0]).not.toHaveAttribute('aria-current')
  })

  it('编号补零到两位；完成的换成对勾，并把“已完成”读给读屏', () => {
    render(<Flow />)
    const [done, current, upcoming] = screen.getAllByRole('listitem')
    expect(done?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(done).toHaveTextContent('01 已完成')
    expect(current).toHaveTextContent('02')
    expect(upcoming).toHaveTextContent('03')
  })

  it('三种状态靠明暗和形状区分：反色、信号色、细边', () => {
    render(<Flow />)
    const nodes = screen
      .getAllByRole('listitem')
      .map(step => step.querySelector('.size-8') as HTMLElement)
    expect(nodes[0]).toHaveClass('bg-ark-invert')
    expect(nodes[1]).toHaveClass('bg-ark-signal')
    expect(nodes[2]).toHaveClass('border', 'border-ark-rule-strong')
  })

  it('current 超过步数时全部算完成', () => {
    render(<Flow current={3} />)
    for (const step of screen.getAllByRole('listitem')) {
      expect(step).toHaveAttribute('data-state', 'done')
    }
  })

  it('竖排时节点在左、内容在右', () => {
    render(<Flow orientation="vertical" />)
    expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByRole('list')).toHaveClass('flex-col')
    expect(screen.getByText('生产环境需要审批')).toBeInTheDocument()
  })

  it('脱离 Steps 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Step title="孤立" />)).toThrow('<Step> 必须放在 <Steps> 里')
    error.mockRestore()
  })
})
