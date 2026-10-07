import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Shell } from './Shell'

describe('Shell', () => {
  it('是一副骨架：顶栏、内容区、右栏各是一个地标', () => {
    render(
      <Shell
        data-testid="shell"
        logo={<span>LOGO</span>}
        nav={<nav aria-label="主导航">导航</nav>}
        counter={<p>01 / 05</p>}
      >
        <h1>情报</h1>
      </Shell>,
    )
    const shell = screen.getByTestId('shell')
    expect(shell).toHaveAttribute('data-ark', 'shell')
    expect(shell).toHaveAttribute('data-ark-tone', 'dark')

    const header = within(shell).getByRole('banner')
    expect(header).toHaveTextContent('LOGO')
    expect(within(header).getByRole('navigation', { name: '主导航' })).toBeInTheDocument()

    expect(within(shell).getByRole('main')).toContainElement(screen.getByRole('heading'))
    expect(within(shell).getByRole('complementary')).toHaveTextContent('01 / 05')
  })

  it('右栏依次放小按钮、计数、常驻入口', () => {
    render(
      <Shell
        actions={<button type="button">分享</button>}
        counter={<p>01 / 05</p>}
        aside={<a href="#download">下载</a>}
      />,
    )
    const rail = screen.getByRole('complementary')
    expect(rail).toHaveTextContent('分享01 / 05下载')
    expect(within(rail).getByRole('button', { name: '分享' })).toBeInTheDocument()
    expect(within(rail).getByRole('link', { name: '下载' })).toBeInTheDocument()
  })

  it('右栏的槽位都不给时不画右栏，只剩一列', () => {
    render(<Shell data-testid="shell" logo="LOGO" />)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    const shell = screen.getByTestId('shell')
    expect(shell).toHaveClass('grid-cols-1')
    expect(shell.className).not.toContain('--ark-shell-rail')
  })

  it('有右栏时它的宽度由变量决定，竖屏挪到底部', () => {
    render(<Shell data-testid="shell" counter={<p>01</p>} />)
    expect(screen.getByTestId('shell')).toHaveClass(
      'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,15rem)]',
      'portrait:grid-cols-1',
    )
    expect(screen.getByRole('complementary')).toHaveClass(
      'portrait:row-start-4',
      'portrait:flex-row',
    )
  })

  it('默认铺满视口，内容区自己滚动', () => {
    render(<Shell data-testid="shell">内容</Shell>)
    expect(screen.getByTestId('shell')).toHaveClass('h-dvh', 'overflow-hidden')
    expect(screen.getByRole('main')).toHaveClass('min-h-0', 'overflow-y-auto', 'pl-ark-9')
  })

  it('背景巨字是装饰，以 1s 淡入', () => {
    render(<Shell ghost="BREAKING NEWS" />)
    const ghost = screen.getByText('BREAKING NEWS')
    expect(ghost).toHaveAttribute('data-ark', 'ghost-title')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveClass(
      'animate-ark-fade-in',
      '[animation-duration:var(--ark-motion-duration-slower)]',
      'left-ark-9',
    )
  })

  it('scrollHint 为 true 时用默认的滚动提示，也可以换成自己的', () => {
    const { rerender } = render(<Shell data-testid="shell" />)
    const hint = () => screen.getByTestId('shell').querySelector('[data-ark="scroll-hint"]')
    expect(hint()).toBeNull()

    rerender(<Shell data-testid="shell" scrollHint />)
    expect(hint()).toHaveAttribute('aria-hidden', 'true')

    rerender(<Shell data-testid="shell" scrollHint={<a href="#next">下一屏</a>} />)
    expect(hint()).toBeNull()
    expect(screen.getByRole('link', { name: '下一屏' })).toBeInTheDocument()
  })

  it('默认垫两层底纹：整面的斜线网格和左下角的半调，可以关掉', () => {
    const { rerender } = render(<Shell data-testid="shell" />)
    const patterns = () => [...screen.getByTestId('shell').querySelectorAll('[data-ark="pattern"]')]
    expect(patterns().map(pattern => pattern.getAttribute('data-variant'))).toEqual([
      'grid',
      'halftone',
    ])
    for (const pattern of patterns()) expect(pattern).toHaveClass('absolute')

    rerender(<Shell data-testid="shell" pattern={false} />)
    expect(patterns()).toHaveLength(0)
  })

  it('contentAs 可以把内容区换成别的元素', () => {
    render(<Shell contentAs="div">内容</Shell>)
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
    expect(screen.getByText('内容').tagName).toBe('DIV')
  })

  it('高度可以用 className 覆盖', () => {
    render(<Shell data-testid="shell" className="h-[40rem]" />)
    const shell = screen.getByTestId('shell')
    expect(shell).toHaveClass('h-[40rem]')
    expect(shell).not.toHaveClass('h-dvh')
  })
})
