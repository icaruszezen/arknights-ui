import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActionButton } from './ActionButton'

describe('ActionButton', () => {
  it('默认渲染为 type="button" 的按钮', () => {
    render(<ActionButton cost={-18}>开始行动</ActionButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-ark', 'action-button')
  })

  it('有 href 时渲染为链接', () => {
    render(
      <ActionButton href="/headhunt" cost={600}>
        寻访一次
      </ActionButton>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/headhunt')
    expect(link).not.toHaveAttribute('type')
  })

  it('代价写在按钮里，计入可访问名称', () => {
    render(
      <ActionButton cost={-18} costLabel="SANITY" sub="MISSION START">
        开始行动
      </ActionButton>,
    )
    expect(screen.getByRole('button')).toHaveAccessibleName('SANITY -18 开始行动 MISSION START')
  })

  it('数字代价加千分位，字符串原样输出', () => {
    const { rerender } = render(<ActionButton cost={6000}>寻访十次</ActionButton>)
    expect(screen.getByText('6,000')).toBeInTheDocument()

    rerender(<ActionButton cost="×1">使用</ActionButton>)
    expect(screen.getByText('×1')).toBeInTheDocument()
  })

  it('由两块拼成：左块是代价，取右块的底色压暗', () => {
    render(<ActionButton cost={-18}>开始行动</ActionButton>)
    const [costBlock, actionBlock] = screen.getByRole('button').children
    expect(costBlock).toHaveTextContent('-18')
    expect(costBlock?.className).toContain('color-mix(in_srgb,var(--ark-action)_80%,black)')
    expect(actionBlock).toHaveTextContent('开始行动')
    expect(actionBlock).toHaveClass('bg-(--ark-action)')
  })

  it('两块的底色出自同一个变量，悬停时一起换', () => {
    const { rerender } = render(<ActionButton cost={-18}>开始行动</ActionButton>)
    expect(screen.getByRole('button')).toHaveClass(
      '[--ark-action:var(--ark-signal)]',
      'hover:[--ark-action:var(--ark-invert)]',
    )

    rerender(
      <ActionButton cost={600} variant="paper">
        寻访一次
      </ActionButton>,
    )
    const paper = screen.getByRole('button')
    expect(paper).toHaveClass(
      '[--ark-action:var(--ark-color-neutral-paper)]',
      'hover:[--ark-action:var(--ark-signal)]',
    )
    expect(paper).not.toHaveClass('[--ark-action:var(--ark-signal)]')
  })

  it('点击时调用 onClick，禁用时不调用', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { rerender } = render(
      <ActionButton cost={-18} onClick={onClick}>
        开始行动
      </ActionButton>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <ActionButton cost={-18} onClick={onClick} disabled>
        开始行动
      </ActionButton>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('block 撑满容器宽度', () => {
    render(
      <ActionButton cost={-18} block>
        开始行动
      </ActionButton>,
    )
    expect(screen.getByRole('button')).toHaveClass('flex', 'w-full')
    expect(screen.getByRole('button')).not.toHaveClass('inline-flex')
  })

  it('转发 ref', () => {
    let node: HTMLButtonElement | null = null
    render(
      <ActionButton
        cost={-18}
        ref={element => {
          node = element
        }}
      >
        开始行动
      </ActionButton>,
    )
    expect(node).toBeInstanceOf(HTMLButtonElement)
  })
})
