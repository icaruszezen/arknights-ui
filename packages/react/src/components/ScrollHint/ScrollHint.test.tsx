import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ScrollHint } from './ScrollHint'

describe('ScrollHint', () => {
  it('默认是装饰：一行 SCROLL 加一个箭头，对读屏隐藏，不接收点击', () => {
    render(<ScrollHint data-testid="hint" />)
    const hint = screen.getByTestId('hint')
    expect(hint).toHaveAttribute('data-ark', 'scroll-hint')
    expect(hint).toHaveAttribute('data-direction', 'down')
    expect(hint.tagName).toBe('SPAN')
    expect(hint).toHaveAttribute('aria-hidden', 'true')
    expect(hint).toHaveClass('pointer-events-none', 'text-ark-neutral-gray-600')
    expect(hint).toHaveTextContent('SCROLL')
    expect(hint.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('字和箭头是一组，只在允许动效时一起淡入、下移淡出', () => {
    render(<ScrollHint data-testid="hint" />)
    const body = screen.getByTestId('hint').querySelector('[data-ark="scroll-hint-body"]')
    expect(body).toHaveTextContent('SCROLL')
    expect(body).toContainElement(screen.getByTestId('hint').querySelector('svg'))
    expect(body).toHaveClass('motion-safe:animate-ark-scroll-hint')
    expect(body?.getAttribute('class')).not.toMatch(/(^|\s)animate-ark-/)
  })

  it('箭头是 2.68rem × 1.25rem 的宽扁形', () => {
    render(<ScrollHint data-testid="hint" />)
    const arrow = screen.getByTestId('hint').querySelector('svg')
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 14')
    expect(arrow).toHaveClass('w-[2.68rem]', 'h-5')
    expect(arrow).not.toHaveClass('-scale-y-100')
  })

  it('竖屏时字和箭头都缩到一半', () => {
    render(<ScrollHint data-testid="hint" />)
    const hint = screen.getByTestId('hint')
    expect(hint.querySelector('[data-ark="scroll-hint-body"]')).toHaveClass(
      'gap-[0.25rem]',
      'portrait:gap-[0.125rem]',
    )
    expect(screen.getByText('SCROLL')).toHaveClass('text-ark-caption', 'portrait:text-[0.375rem]')
    expect(hint.querySelector('svg')).toHaveClass('portrait:w-[1.34rem]', 'portrait:h-[0.625rem]')
  })

  it('up 只剩一个向上的箭头，明灭而不位移', () => {
    render(<ScrollHint data-testid="hint" direction="up" />)
    const hint = screen.getByTestId('hint')
    expect(hint).toHaveAttribute('data-direction', 'up')
    expect(hint).not.toHaveTextContent('SCROLL')
    expect(hint.querySelector('svg')).toHaveClass('-scale-y-100')
    const body = hint.querySelector('[data-ark="scroll-hint-body"]')
    expect(body).toHaveClass('motion-safe:animate-ark-pulse')
    expect(body).not.toHaveClass('motion-safe:animate-ark-scroll-hint')
  })

  it('给了 href 是链接，名称是那行可见的字；用前景色而不是灰', () => {
    render(<ScrollHint href="#information" />)
    const link = screen.getByRole('link', { name: 'SCROLL' })
    expect(link).toHaveAttribute('href', '#information')
    expect(link).not.toHaveAttribute('aria-hidden')
    expect(link).not.toHaveAttribute('aria-label')
    // 可见的部分很小，点击区不小于 44px
    expect(link).toHaveClass('min-h-11', 'min-w-11', 'text-ark-fg')
    expect(link).not.toHaveClass('text-ark-neutral-gray-600')
  })

  it('去掉文字后默认名称是“向下滚动”，up 是“向上滚动”', () => {
    const { rerender } = render(<ScrollHint href="#information">{null}</ScrollHint>)
    expect(screen.getByRole('link', { name: '向下滚动' })).toBeInTheDocument()

    rerender(<ScrollHint href="#top" direction="up" />)
    expect(screen.getByRole('link', { name: '向上滚动' })).toBeInTheDocument()
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

  it('文字可以换', () => {
    render(<ScrollHint href="#next">NEXT</ScrollHint>)
    const link = screen.getByRole('link', { name: 'NEXT' })
    expect(link).not.toHaveAttribute('aria-label')
    expect(link).not.toHaveTextContent('SCROLL')
  })

  it('label 优先于可见文字', () => {
    render(
      <ScrollHint href="#next" label="滚动到情报">
        SCROLL
      </ScrollHint>,
    )
    expect(screen.getByRole('link', { name: '滚动到情报' })).toBeInTheDocument()
  })

  it('颜色可以用 className 换（官网首屏是信号色）', () => {
    render(<ScrollHint data-testid="hint" className="text-ark-signal" />)
    const hint = screen.getByTestId('hint')
    expect(hint).toHaveClass('text-ark-signal')
    expect(hint).not.toHaveClass('text-ark-neutral-gray-600')
  })
})
