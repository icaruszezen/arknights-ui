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
    // 底色跟着主题走，不自己设明暗上下文
    expect(shell).not.toHaveAttribute('data-ark-tone')
    expect(shell).toHaveClass('bg-ark-canvas')

    const header = within(shell).getByRole('banner')
    expect(header).toHaveTextContent('LOGO')
    expect(within(header).getByRole('navigation', { name: '主导航' })).toBeInTheDocument()

    expect(within(shell).getByRole('main')).toContainElement(screen.getByRole('heading'))
    expect(within(shell).getByRole('complementary')).toHaveTextContent('01 / 05')
  })

  it('小按钮在顶栏的最右边，计数和常驻入口在右栏', () => {
    render(
      <Shell
        actions={<button type="button">分享</button>}
        counter={<p>01 / 05</p>}
        aside={<a href="#download">下载</a>}
      />,
    )
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('button', { name: '分享' })).toBeInTheDocument()
    // 顶栏里依次是标识、导航、小按钮
    expect(header.lastElementChild).toHaveAttribute('data-ark', 'shell-actions')

    const rail = screen.getByRole('complementary')
    expect(rail).toHaveTextContent('01 / 05下载')
    expect(within(rail).queryByRole('button')).not.toBeInTheDocument()
    expect(within(rail).getByRole('link', { name: '下载' })).toBeInTheDocument()
  })

  it('右栏的槽位都不给时不画右栏，只剩一列', () => {
    render(<Shell data-testid="shell" logo="LOGO" />)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    const shell = screen.getByTestId('shell')
    expect(shell).toHaveClass('grid-cols-1')
    expect(shell.className).not.toContain('--ark-shell-rail')
    const header = screen.getByRole('banner')
    expect(header.className).not.toContain('--ark-shell-rail')
    expect(header.querySelector('[data-ark="shell-actions"]')).toBeNull()
  })

  it('有右栏时它宽 14.75rem（可用变量改），左缘一条竖线；窄屏收窄到 2.875rem，仍在右边', () => {
    render(<Shell data-testid="shell" counter={<p>01</p>} />)
    expect(screen.getByTestId('shell')).toHaveClass(
      'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,14.75rem)]',
      'max-md:grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,2.875rem)]',
    )
    const rail = screen.getByRole('complementary')
    expect(rail).toHaveClass('col-start-2', 'row-span-3', 'border-l', 'border-ark-rule')
    // 窄屏的线比宽屏亮一档
    expect(rail).toHaveClass('max-md:border-ark-rule-strong')
    expect(rail.className).not.toContain('max-md:row-start-4')
  })

  it('顶栏在右栏上方留出同宽的一格，没有小按钮也留', () => {
    render(<Shell counter={<p>01</p>} />)
    const cell = screen.getByRole('banner').querySelector('[data-ark="shell-actions"]')
    expect(cell).toBeEmptyDOMElement()
    expect(cell).toHaveClass('w-[var(--ark-shell-rail,14.75rem)]', 'h-full', 'shrink-0')
    // 窄屏时这一格只有小按钮那么宽，排在菜单按钮的左边
    expect(cell).toHaveClass('max-md:w-auto')
  })

  it('窄屏时导航排到顶栏的最后，占右栏上方的那一格', () => {
    const { rerender } = render(<Shell nav={<nav aria-label="主导航" />} counter={<p>01</p>} />)
    const slot = () => screen.getByRole('navigation', { name: '主导航' }).parentElement
    expect(slot()).toHaveClass(
      'max-md:order-last',
      'max-md:w-[var(--ark-shell-rail,2.875rem)]',
      'max-md:justify-center',
      'max-md:px-0',
    )

    // 没有右栏时不占那一格，只是贴右
    rerender(<Shell nav={<nav aria-label="主导航" />} />)
    expect(slot()).not.toHaveClass('max-md:order-last')
    expect(slot()).toHaveClass('max-md:px-[0.875rem]')
  })

  it('计数放在右栏 44.4% 高的地方，左右居中；窄屏挪到底带的上方', () => {
    render(<Shell counter={<p>01 / 05</p>} />)
    const slot = screen.getByText('01 / 05').parentElement
    expect(slot).toHaveAttribute('data-ark', 'shell-counter')
    expect(slot).toHaveClass('absolute', 'top-[44.4444%]', 'inset-x-0', 'flex', 'justify-center')
    // 不用 left-1/2 加平移：那样留给计数的只有半栏宽
    expect(slot?.className).not.toContain('translate-x')
    expect(slot).toHaveClass(
      'max-md:top-auto',
      'max-md:bottom-[calc(var(--ark-shell-bottom,6rem)+0.25rem)]',
    )
  })

  it('常驻入口窄屏时不显示：右栏放不下', () => {
    render(<Shell aside={<a href="#download">下载</a>} />)
    expect(screen.getByRole('link', { name: '下载' }).parentElement).toHaveClass('max-md:hidden')
  })

  it('三行的高度是官网的实测值，横屏竖屏各一套，可以用变量改', () => {
    render(<Shell data-testid="shell" />)
    expect(screen.getByTestId('shell')).toHaveClass(
      'grid-rows-[var(--ark-shell-top,9.5rem)_minmax(0,1fr)_var(--ark-shell-bottom,11.25rem)]',
      'max-md:grid-rows-[var(--ark-shell-top,4.6875rem)_minmax(0,1fr)_var(--ark-shell-bottom,6rem)]',
    )
  })

  it('顶栏高 6.75rem，没有底线，垫一道自上而下的黑色渐变，压在右栏上面', () => {
    render(<Shell logo="LOGO" />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('h-[6.75rem]', 'self-start', 'col-span-full', 'z-1')
    expect(header.className).toContain('before:bg-[linear-gradient(0deg,transparent,')
    expect(header.className).not.toMatch(/(^|\s)border-b/)
  })

  it('窄屏的顶栏和它所在的带一样高，渐变只有两段，标识左起 0.875rem', () => {
    render(<Shell logo={<span>LOGO</span>} />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass(
      'max-md:h-full',
      'max-md:before:bg-[linear-gradient(0deg,transparent,color-mix(in_srgb,var(--ark-canvas)_80%,transparent))]',
    )
    expect(screen.getByText('LOGO').parentElement).toHaveClass('ml-ark-7', 'max-md:ml-[0.875rem]')
  })

  it('默认铺满视口，内容区自己滚动；窄屏四边各留 0.875rem', () => {
    render(<Shell data-testid="shell">内容</Shell>)
    expect(screen.getByTestId('shell')).toHaveClass('h-dvh', 'overflow-hidden')
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-0', 'overflow-y-auto', 'pl-ark-9', 'max-md:p-[0.875rem]')
    expect(main.className).not.toMatch(/(^|\s)border-/)
  })

  describe('横线', () => {
    const lineAt = (side: string) =>
      screen
        .getByTestId('shell')
        .querySelector(`[data-ark="shell-line"][data-side="${side}"]`) as HTMLElement
    // 不在画面里的那条被平移到屏幕外面；宽屏、窄屏各由一个类管
    const hidden = (element: HTMLElement, width: 'wide' | 'narrow') => {
      const prefix = `${width === 'wide' ? 'md' : 'max-md'}:${element.dataset.side === 'top' ? '-' : ''}translate-y-[calc(`
      // 逐个类名比：'max-md:…' 里也含有 'md:…' 这一段
      return element.className.split(/\s+/).some(name => name.startsWith(prefix))
    }

    it('只有一条在画面里：默认在内容区下缘，line="top" 换到上缘', () => {
      const { rerender } = render(<Shell data-testid="shell" />)
      expect(screen.getByTestId('shell')).toHaveAttribute('data-line', 'bottom')
      for (const side of ['top', 'bottom']) {
        expect(lineAt(side)).toHaveAttribute('aria-hidden', 'true')
        // 和右栏的竖线同一个颜色，横贯整屏；窄屏亮一档
        expect(lineAt(side)).toHaveClass(
          'h-px',
          'bg-ark-rule',
          'max-md:bg-ark-rule-strong',
          'col-span-full',
        )
      }
      expect(lineAt('top')).toHaveClass('row-start-1', 'self-end')
      expect(lineAt('bottom')).toHaveClass('row-start-3', 'self-start')
      expect(hidden(lineAt('top'), 'wide')).toBe(true)
      expect(hidden(lineAt('bottom'), 'wide')).toBe(false)

      rerender(<Shell data-testid="shell" line="top" />)
      expect(screen.getByTestId('shell')).toHaveAttribute('data-line', 'top')
      expect(hidden(lineAt('top'), 'wide')).toBe(false)
      expect(hidden(lineAt('bottom'), 'wide')).toBe(true)
    })

    it('窄屏默认和宽屏在同一边', () => {
      const { rerender } = render(<Shell data-testid="shell" />)
      expect(screen.getByTestId('shell')).toHaveAttribute('data-narrow-line', 'bottom')
      expect(hidden(lineAt('top'), 'narrow')).toBe(true)
      expect(hidden(lineAt('bottom'), 'narrow')).toBe(false)

      rerender(<Shell data-testid="shell" line="top" />)
      expect(screen.getByTestId('shell')).toHaveAttribute('data-narrow-line', 'top')
      expect(hidden(lineAt('top'), 'narrow')).toBe(false)
      expect(hidden(lineAt('bottom'), 'narrow')).toBe(true)
    })

    it('narrowLine 让窄屏的横线换一边：官网的设定、更多内容几屏横屏在下、竖屏在上', () => {
      render(<Shell data-testid="shell" line="bottom" narrowLine="top" />)
      const shell = screen.getByTestId('shell')
      expect(shell).toHaveAttribute('data-line', 'bottom')
      expect(shell).toHaveAttribute('data-narrow-line', 'top')
      expect(hidden(lineAt('top'), 'wide')).toBe(true)
      expect(hidden(lineAt('bottom'), 'wide')).toBe(false)
      expect(hidden(lineAt('top'), 'narrow')).toBe(false)
      expect(hidden(lineAt('bottom'), 'narrow')).toBe(true)
    })

    it('滑出去的距离跟着那条带的高度走，宽屏窄屏不一样', () => {
      render(<Shell data-testid="shell" line="top" narrowLine="bottom" />)
      expect(lineAt('bottom')).toHaveClass(
        'md:translate-y-[calc(var(--ark-shell-bottom,11.25rem)+0.25rem)]',
      )
      expect(lineAt('top')).toHaveClass(
        'max-md:-translate-y-[calc(var(--ark-shell-top,4.6875rem)+0.25rem)]',
      )
    })

    it('换位是位移类的动效，只在允许动效时过渡', () => {
      render(<Shell data-testid="shell" />)
      expect(lineAt('top')).toHaveClass('motion-safe:transition-[translate,opacity]')
      expect(lineAt('top').className).not.toMatch(/(^|\s)transition-/)
    })
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
    // 竖屏缩到一半，左起 1.4375rem
    expect(ghost).toHaveClass('max-md:text-[3.5rem]', 'max-md:left-[1.4375rem]')
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

  it('滚动提示相对整屏居中，距底 3.75rem；窄屏 1.875rem', () => {
    render(<Shell data-testid="shell" scrollHint counter={<p>01</p>} />)
    const slot = screen.getByTestId('shell').querySelector('[data-ark="shell-hint"]')
    expect(slot).toHaveClass(
      'col-span-full',
      'row-start-3',
      'self-end',
      'justify-self-center',
      'mb-[3.75rem]',
      'max-md:mb-[1.875rem]',
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
