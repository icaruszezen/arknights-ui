import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StoryControl, StoryControls } from './StoryControls'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('StoryControls', () => {
  it('是一组带名称的按钮', () => {
    render(
      <StoryControls aria-label="剧情控制">
        <StoryControl>自动</StoryControl>
        <StoryControl>跳过</StoryControl>
      </StoryControls>,
    )
    const group = screen.getByRole('group', { name: '剧情控制' })
    expect(group).toHaveAttribute('data-ark', 'story-controls')
    expect(group).toHaveClass('inline-flex', 'gap-ark-1')
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})

describe('StoryControl', () => {
  it('是一个半透明黑底的小按钮，点击区撑到 44px', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<StoryControl onClick={onClick}>跳过</StoryControl>)
    const button = screen.getByRole('button', { name: '跳过' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-ark', 'story-control')
    expect(button).toHaveClass('h-7', 'bg-ark-neutral-black/50', 'text-ark-caption', 'after:h-11')
    // 普通按钮不是开关
    expect(button).not.toHaveAttribute('aria-pressed')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('悬停整块反白', () => {
    render(<StoryControl>跳过</StoryControl>)
    expect(screen.getByRole('button')).toHaveClass(
      'not-disabled:hover:bg-ark-neutral-white',
      'not-disabled:hover:text-ark-neutral-black',
    )
  })

  it('开关项输出 aria-pressed，打开时保持反白', () => {
    const { rerender } = render(<StoryControl pressed={false}>自动</StoryControl>)
    expect(screen.getByRole('button', { pressed: false })).toBeInTheDocument()

    rerender(<StoryControl pressed>自动</StoryControl>)
    expect(screen.getByRole('button', { pressed: true })).toHaveClass(
      'aria-pressed:bg-ark-neutral-white',
      'aria-pressed:text-ark-neutral-black',
    )
  })

  it('图标对读屏隐藏，名称来自文字', () => {
    render(<StoryControl icon={icon}>回顾</StoryControl>)
    expect(screen.getByRole('button', { name: '回顾' })).toContainElement(
      screen.getByTestId('icon'),
    )
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('square 是 5rem 见方的方块：文字在上、图标在下，不需要再撑点击区', () => {
    render(
      <StoryControl shape="square" icon={icon}>
        2X
      </StoryControl>,
    )
    const button = screen.getByRole('button', { name: '2X' })
    expect(button).toHaveAttribute('data-shape', 'square')
    expect(button).toHaveClass('size-20', 'flex-col-reverse', 'font-ark-data', 'text-ark-h2')
    expect(button).not.toHaveClass('h-7', 'after:h-11')
    expect(screen.getByTestId('icon').parentElement).toHaveClass('size-7')
  })

  it('默认是横条', () => {
    render(<StoryControl>跳过</StoryControl>)
    expect(screen.getByRole('button')).toHaveAttribute('data-shape', 'bar')
  })

  it('只放图标时名称来自 aria-label', () => {
    render(<StoryControl shape="square" icon={icon} aria-label="暂停" />)
    expect(screen.getByRole('button', { name: '暂停' })).toContainElement(
      screen.getByTestId('icon'),
    )
  })

  it('禁用时不响应', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <StoryControl disabled onClick={onClick}>
        跳过
      </StoryControl>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed')
  })
})
