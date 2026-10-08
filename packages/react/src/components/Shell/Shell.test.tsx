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
    expect(screen.getByRole('banner').className).not.toContain('--ark-shell-rail')
  })

  it('有右栏时它宽 14.75rem（可用变量改），左缘一条竖线；竖屏挪到底部', () => {
    render(<Shell data-testid="shell" counter={<p>01</p>} />)
    expect(screen.getByTestId('shell')).toHaveClass(
      'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,14.75rem)]',
      'portrait:grid-cols-1',
    )
    const rail = screen.getByRole('complementary')
    expect(rail).toHaveClass('border-l', 'border-ark-rule')
    expect(rail).toHaveClass('portrait:row-start-4', 'portrait:flex-row')
    // 顶栏把右栏顶端那一格让出来
    expect(screen.getByRole('banner')).toHaveClass('pr-[var(--ark-shell-rail,14.75rem)]')
  })

  it('计数放在右栏 44.4% 高的地方，左右居中', () => {
    render(<Shell counter={<p>01 / 05</p>} />)
    const slot = screen.getByText('01 / 05').parentElement
    expect(slot).toHaveClass('absolute', 'top-[44.4444%]', 'inset-x-0', 'flex', 'justify-center')
    // 不用 left-1/2 加平移：那样留给计数的只有半栏宽
    expect(slot?.className).not.toContain('translate-x')
  })

  it('三行的高度是官网的实测值，上下两条带可以用变量改', () => {
    render(<Shell data-testid="shell" />)
    expect(screen.getByTestId('shell')).toHaveClass(
      'grid-rows-[var(--ark-shell-top,9.5rem)_minmax(0,1fr)_var(--ark-shell-bottom,11.25rem)]',
    )
  })

  it('顶栏高 6.75rem，没有底线，垫一道自上而下的黑色渐变', () => {
    render(<Shell logo="LOGO" />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('h-[6.75rem]', 'self-start', 'col-span-full')
    expect(header.className).toContain('before:bg-[linear-gradient(0deg,transparent,')
    expect(header.className).not.toMatch(/(^|\s)border-b/)
  })

  it('默认铺满视口，内容区自己滚动', () => {
    render(<Shell data-testid="shell">内容</Shell>)
    expect(screen.getByTestId('shell')).toHaveClass('h-dvh', 'overflow-hidden')
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-0', 'overflow-y-auto', 'pl-ark-9')
    expect(main.className).not.toMatch(/(^|\s)border-/)
  })

  it('横线只有一条在画面里：默认在内容区下缘，line="top" 换到上缘', () => {
    const { rerender } = render(<Shell data-testid="shell" />)
    const lineAt = (side: string) =>
      screen
        .getByTestId('shell')
        .querySelector(`[data-ark="shell-line"][data-side="${side}"]`) as HTMLElement
    const hidden = (element: HTMLElement) => /translate-y-\[calc\(/.test(element.className)

    expect(screen.getByTestId('shell')).toHaveAttribute('data-line', 'bottom')
    for (const side of ['top', 'bottom']) {
      expect(lineAt(side)).toHaveAttribute('aria-hidden', 'true')
      // 和右栏的竖线同一个颜色，横贯整屏
      expect(lineAt(side)).toHaveClass('h-px', 'bg-ark-rule', 'col-span-full')
    }
    expect(lineAt('top')).toHaveClass('row-start-1', 'self-end')
    expect(lineAt('bottom')).toHaveClass('row-start-3', 'self-start')
    expect(hidden(lineAt('top'))).toBe(true)
    expect(hidden(lineAt('bottom'))).toBe(false)

    rerender(<Shell data-testid="shell" line="top" />)
    expect(screen.getByTestId('shell')).toHaveAttribute('data-line', 'top')
    expect(hidden(lineAt('top'))).toBe(false)
    expect(hidden(lineAt('bottom'))).toBe(true)
  })

  it('横线换位是位移类的动效，只在允许动效时过渡', () => {
    render(<Shell data-testid="shell" />)
    const line = screen.getByTestId('shell').querySelector('[data-ark="shell-line"]')
    expect(line).toHaveClass('motion-safe:transition-[translate,opacity]')
    expect(line?.className).not.toMatch(/(^|\s)transition-/)
  })

  it('背景巨字是装饰，挂在底线下面、上缘被裁掉，以 1s 淡入', () => {
    render(<Shell ghost="BREAKING NEWS" />)
    const ghost = screen.getByText('BREAKING NEWS').closest('[data-ark="ghost-title"]')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveClass(
      'animate-ark-fade-in',
      '[animation-duration:var(--ark-motion-duration-slower)]',
      'top-0',
      'left-[8.375rem]',
      // clip
      'overflow-hidden',
    )
    expect(ghost?.className).not.toContain('translate-y')
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

  it('滚动提示相对整屏居中，距底 3.75rem', () => {
    render(<Shell data-testid="shell" scrollHint counter={<p>01</p>} />)
    const slot = screen.getByTestId('shell').querySelector('[data-ark="shell-hint"]')
    expect(slot).toHaveClass(
      'col-span-full',
      'row-start-3',
      'self-end',
      'justify-self-center',
      'mb-[3.75rem]',
    )
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
