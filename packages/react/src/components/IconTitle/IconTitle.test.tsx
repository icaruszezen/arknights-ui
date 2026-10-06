import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconTitle } from './IconTitle'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('IconTitle', () => {
  it('依次是图标、中文、英文', () => {
    render(
      <IconTitle data-testid="title" icon={icon} sub="INTEGRATED STRATEGIES">
        集成战略
      </IconTitle>,
    )
    const title = screen.getByTestId('title')
    expect(title).toHaveAttribute('data-ark', 'icon-title')
    expect(title.tagName).toBe('DIV')
    expect(title).toHaveTextContent('集成战略INTEGRATED STRATEGIES')

    const [main, sub] = [...title.children]
    expect(main).toContainElement(screen.getByTestId('icon'))
    expect(main).toHaveTextContent('集成战略')
    expect(sub).toHaveTextContent('INTEGRATED STRATEGIES')
  })

  it('图标槽 1em 见方，对读屏隐藏', () => {
    render(<IconTitle icon={icon}>集成战略</IconTitle>)
    const slot = screen.getByTestId('icon').parentElement
    expect(slot).toHaveAttribute('aria-hidden', 'true')
    expect(slot).toHaveClass('size-[1em]', 'shrink-0')
  })

  it('没有图标或英文时不留空壳', () => {
    render(<IconTitle data-testid="title">集成战略</IconTitle>)
    const title = screen.getByTestId('title')
    expect(title.children).toHaveLength(1)
    expect(title.querySelector('[aria-hidden]')).toBeNull()
  })

  it('as 指定标题级别', () => {
    render(
      <IconTitle as="h3" sub="ANIMATION">
        衍生动画
      </IconTitle>,
    )
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('衍生动画ANIMATION')
  })

  it('size 同时决定中文和英文的字号', () => {
    const { rerender } = render(<IconTitle sub="RA">生息演算</IconTitle>)
    expect(screen.getByText('生息演算').parentElement).toHaveClass('text-ark-h2')
    expect(screen.getByText('RA')).toHaveClass('text-ark-caption')

    rerender(
      <IconTitle size="lg" sub="RA">
        生息演算
      </IconTitle>,
    )
    expect(screen.getByText('生息演算').parentElement).toHaveClass('text-ark-h1')
    expect(screen.getByText('RA')).toHaveClass('text-ark-label')
  })

  it('颜色可以用 className 覆盖', () => {
    render(
      <IconTitle data-testid="title" className="text-ark-signal">
        集成战略
      </IconTitle>,
    )
    const title = screen.getByTestId('title')
    expect(title).toHaveClass('text-ark-signal')
    expect(title).not.toHaveClass('text-ark-fg')
  })
})
