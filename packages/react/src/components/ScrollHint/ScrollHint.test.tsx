import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScrollHint } from './ScrollHint'

describe('ScrollHint', () => {
  it('默认是装饰：对读屏隐藏，不接收点击', () => {
    render(<ScrollHint data-testid="hint" />)
    const hint = screen.getByTestId('hint')
    expect(hint).toHaveAttribute('data-ark', 'scroll-hint')
    expect(hint.tagName).toBe('SPAN')
    expect(hint).toHaveAttribute('aria-hidden', 'true')
    expect(hint).toHaveClass('pointer-events-none')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('箭头只在允许动效时往复', () => {
    render(<ScrollHint data-testid="hint" />)
    const arrow = screen.getByTestId('hint').querySelector('svg')
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
    expect(arrow).toHaveClass('motion-safe:animate-ark-bob')
    expect(arrow?.getAttribute('class')).not.toMatch(/(^|\s)animate-ark-bob/)
  })

  it('给了 href 是链接，默认名称是“向下滚动”', () => {
    render(<ScrollHint href="#information" />)
    const link = screen.getByRole('link', { name: '向下滚动' })
    expect(link).toHaveAttribute('href', '#information')
    expect(link).not.toHaveAttribute('aria-hidden')
    // 可见的箭头很小，点击区不小于 44px
    expect(link).toHaveClass('min-h-11', 'min-w-11')
  })

  it('给了 onClick 是按钮', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ScrollHint onClick={onClick} label="下一屏" />)
    const button = screen.getByRole('button', { name: '下一屏' })
    expect(button).toHaveAttribute('type', 'button')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('有可见文字时名称就是那行文字', () => {
    render(<ScrollHint href="#next">SCROLL</ScrollHint>)
    const link = screen.getByRole('link', { name: 'SCROLL' })
    expect(link).not.toHaveAttribute('aria-label')
  })

  it('label 优先于可见文字', () => {
    render(
      <ScrollHint href="#next" label="滚动到情报">
        SCROLL
      </ScrollHint>,
    )
    expect(screen.getByRole('link', { name: '滚动到情报' })).toBeInTheDocument()
  })

  it('装饰用时也可以带一行字，整体仍然隐藏', () => {
    render(<ScrollHint data-testid="hint">SCROLL</ScrollHint>)
    const hint = screen.getByTestId('hint')
    expect(hint).toHaveAttribute('aria-hidden', 'true')
    expect(hint).toHaveTextContent('SCROLL')
  })
})
