import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

const getBadge = (container: HTMLElement) => container.querySelector('[data-ark="badge"]')

describe('Badge', () => {
  it('显示数量', () => {
    const { container } = render(<Badge count={3} />)
    expect(getBadge(container)).toHaveTextContent(/^3$/)
  })

  it('超过上限时写成 99+，上限可以改', () => {
    const { container, rerender } = render(<Badge count={120} />)
    expect(getBadge(container)).toHaveTextContent('99+')

    rerender(<Badge count={120} max={999} />)
    expect(getBadge(container)).toHaveTextContent(/^120$/)

    rerender(<Badge count={99} />)
    expect(getBadge(container)).toHaveTextContent(/^99$/)
  })

  it('数量为 0 或没有数量时不显示', () => {
    const { container, rerender } = render(<Badge count={0} />)
    expect(container).toBeEmptyDOMElement()

    rerender(<Badge />)
    expect(container).toBeEmptyDOMElement()
  })

  it('红点没有文字，优先于数量', () => {
    const { container } = render(<Badge dot count={3} />)
    const badge = getBadge(container)
    expect(badge).toBeEmptyDOMElement()
    expect(badge).toHaveClass('rounded-full')
  })

  it('数字用黑字压在红底上', () => {
    const { container } = render(<Badge count={3} />)
    expect(getBadge(container)).toHaveClass('bg-ark-signal-danger', 'text-ark-neutral-black')
  })

  it('没有说明的红点对读屏隐藏，数字照常读出', () => {
    const { container, rerender } = render(<Badge dot />)
    expect(getBadge(container)).toHaveAttribute('aria-hidden', 'true')

    rerender(<Badge count={3} />)
    expect(getBadge(container)).not.toHaveAttribute('aria-hidden')
    expect(getBadge(container)).not.toHaveAttribute('role')
  })

  it('label 给读屏一句完整的说明', () => {
    const { rerender } = render(<Badge count={3} label="3 封未读邮件" />)
    expect(screen.getByRole('img', { name: '3 封未读邮件' })).toHaveTextContent('3')

    rerender(<Badge dot label="有可领取的奖励" />)
    const dot = screen.getByRole('img', { name: '有可领取的奖励' })
    expect(dot).not.toHaveAttribute('aria-hidden')
  })

  it('包住子元素时角标贴在右上角', () => {
    const { container } = render(
      <Badge count={3}>
        <button type="button">邮件</button>
      </Badge>,
    )
    const badge = getBadge(container)
    expect(badge).toHaveClass('absolute', 'top-0', 'right-0')
    expect(badge?.parentElement).toHaveClass('relative')
    expect(badge?.parentElement).toContainElement(screen.getByRole('button', { name: '邮件' }))
  })

  it('独立使用时不做绝对定位', () => {
    const { container } = render(<Badge count={3} />)
    expect(getBadge(container)).not.toHaveClass('absolute')
  })

  it('没有角标可显示时，子元素照常渲染', () => {
    const { container } = render(
      <Badge count={0}>
        <button type="button">邮件</button>
      </Badge>,
    )
    expect(screen.getByRole('button', { name: '邮件' })).toBeInTheDocument()
    expect(getBadge(container)).toBeNull()
  })
})
