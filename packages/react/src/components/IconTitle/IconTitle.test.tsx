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

    const [slot, main, sub] = [...title.children]
    expect(slot).toContainElement(screen.getByTestId('icon'))
    expect(main).toHaveTextContent('集成战略')
    expect(sub).toHaveTextContent('INTEGRATED STRATEGIES')
  })

  it('图标槽是竖长的（宽 1.1 字、高 1.4 字），对读屏隐藏', () => {
    render(<IconTitle icon={icon}>集成战略</IconTitle>)
    const slot = screen.getByTestId('icon').parentElement
    expect(slot).toHaveAttribute('aria-hidden', 'true')
    // 字号 1.1em，所以 1em 宽就是 1.1 个标题字宽，1.2727em 高就是 1.4 个
    expect(slot).toHaveClass('text-[1.1em]', 'w-[1em]', 'h-[1.2727em]', 'shrink-0')
  })

  it('图标占一列，标题和英文都排在第二列：英文从标题文字的左缘写起', () => {
    render(
      <IconTitle data-testid="title" icon={icon} sub="INTEGRATED STRATEGIES">
        集成战略
      </IconTitle>,
    )
    expect(screen.getByTestId('title')).toHaveClass('grid-cols-[auto_minmax(0,1fr)]')
    expect(screen.getByTestId('icon').parentElement).toHaveClass('col-start-1', 'row-start-1')
    expect(screen.getByText('集成战略')).toHaveClass('col-start-2')
    expect(screen.getByText('INTEGRATED STRATEGIES')).toHaveClass('col-start-2')
  })

  it('hang 把图标挂到左边外面：不占列，组件的左缘就是文字的左缘', () => {
    render(
      <IconTitle data-testid="title" icon={icon} sub="INTEGRATED STRATEGIES" hang>
        集成战略
      </IconTitle>,
    )
    const title = screen.getByTestId('title')
    expect(title).toHaveClass('relative')
    expect(title).not.toHaveClass('grid-cols-[auto_minmax(0,1fr)]')
    expect(screen.getByTestId('icon').parentElement).toHaveClass('absolute', 'right-full')
    expect(screen.getByText('集成战略')).not.toHaveClass('col-start-2')
    expect(screen.getByText('INTEGRATED STRATEGIES')).not.toHaveClass('col-start-2')
  })

  it('英文是宽体，颜色跟随标题，不强制大写', () => {
    render(<IconTitle sub="Integrated Strategies">集成战略</IconTitle>)
    const sub = screen.getByText('Integrated Strategies')
    expect(sub).toHaveClass('font-ark-latin-wide', 'font-ark-medium')
    expect(sub).not.toHaveClass('uppercase', 'text-ark-fg-muted', 'font-ark-latin-condensed')
  })

  it('没有图标或英文时不留空壳', () => {
    render(<IconTitle data-testid="title">集成战略</IconTitle>)
    const title = screen.getByTestId('title')
    expect(title.children).toHaveLength(1)
    expect(title.querySelector('[aria-hidden]')).toBeNull()
    expect(title).not.toHaveClass('grid-cols-[auto_minmax(0,1fr)]')
  })

  it('as 指定标题级别', () => {
    render(
      <IconTitle as="h3" sub="ANIMATION">
        衍生动画
      </IconTitle>,
    )
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('衍生动画ANIMATION')
  })

  it('size 只定根元素的字号，英文和间距按它的比例走', () => {
    const { rerender } = render(
      <IconTitle data-testid="title" sub="RA">
        生息演算
      </IconTitle>,
    )
    expect(screen.getByTestId('title')).toHaveClass('text-ark-h2')

    rerender(
      <IconTitle data-testid="title" size="lg" sub="RA">
        生息演算
      </IconTitle>,
    )
    // 官网：中文 3.375rem，英文 1rem（0.2963 倍），上距 1.5rem（0.4444 倍）
    expect(screen.getByTestId('title')).toHaveClass('text-[3.375rem]')
    expect(screen.getByText('RA')).toHaveClass('text-[length:max(0.75rem,0.2963em)]')
    expect(screen.getByText('生息演算')).toHaveClass('mb-[0.4444em]')
  })

  it('没有英文时标题下面不留间距', () => {
    render(<IconTitle>生息演算</IconTitle>)
    expect(screen.getByText('生息演算')).not.toHaveClass('mb-[0.4444em]')
  })

  it('换一个字号，整组跟着缩放', () => {
    render(
      <IconTitle
        data-testid="title"
        size="lg"
        className="text-[length:clamp(1rem,11.25cqw,3.375rem)]"
      >
        生息演算
      </IconTitle>,
    )
    const title = screen.getByTestId('title')
    expect(title).toHaveClass('text-[length:clamp(1rem,11.25cqw,3.375rem)]')
    expect(title).not.toHaveClass('text-[3.375rem]')
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
