import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RewardGlow } from './RewardGlow'

describe('RewardGlow', () => {
  it('包住内容，光画在伪元素上，不增加任何可读的节点', () => {
    render(
      <RewardGlow data-testid="glow">
        <img alt="龙门币" src="data:," />
      </RewardGlow>,
    )
    const glow = screen.getByTestId('glow')
    expect(glow).toHaveAttribute('data-ark', 'reward-glow')
    expect(glow.children).toHaveLength(1)
    expect(glow).toContainElement(screen.getByRole('img', { name: '龙门币' }))
  })

  it('光垫在内容之下，不拦截点击', () => {
    render(<RewardGlow data-testid="glow" />)
    const glow = screen.getByTestId('glow')
    expect(glow).toHaveClass(
      'isolate',
      'before:-z-1',
      'after:-z-1',
      'before:pointer-events-none',
      'after:pointer-events-none',
    )
  })

  it('默认白光，tier 换成对应的稀有度色', () => {
    const { rerender } = render(<RewardGlow data-testid="glow" />)
    expect(screen.getByTestId('glow')).toHaveClass('[--ark-glow:var(--ark-color-neutral-white)]')

    rerender(<RewardGlow data-testid="glow" tier={6} />)
    const glow = screen.getByTestId('glow')
    expect(glow).toHaveClass('[--ark-glow:var(--ark-color-tier-6)]')
    expect(glow).not.toHaveClass('[--ark-glow:var(--ark-color-neutral-white)]')
  })

  it('光是静态的，没有动画', () => {
    render(<RewardGlow data-testid="glow" tier={5} />)
    expect(screen.getByTestId('glow').className).not.toMatch(/animate|transition/)
  })
})
