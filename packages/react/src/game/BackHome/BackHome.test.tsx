import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuickNav, QuickNavItem } from '../QuickNav'
import { BackHome, type BackHomeProps } from './BackHome'

function WithNav(props: BackHomeProps) {
  return (
    <>
      <BackHome {...props}>
        <QuickNav aria-label="快捷导航">
          <QuickNavItem href="#home" sub="HOME">
            首页
          </QuickNavItem>
          <QuickNavItem href="#operator" sub="OPERATOR" current>
            干员
          </QuickNavItem>
        </QuickNav>
      </BackHome>
      <button type="button">页面上的其他按钮</button>
    </>
  )
}

const getToggle = () => screen.getByRole('button', { name: '主页' })
const getPanel = () => document.getElementById(getToggle().getAttribute('aria-controls') ?? '')

describe('BackHome', () => {
  it('是两个相邻的按钮：返回和主页', () => {
    render(<BackHome data-testid="back-home" />)
    expect(screen.getByTestId('back-home')).toHaveAttribute('data-ark', 'back-home')
    const buttons = screen.getAllByRole('button')
    expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual(['返回', '主页'])
    for (const button of buttons) expect(button).toHaveAttribute('type', 'button')
  })

  it('点返回、点主页各自调用回调', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    const onHome = vi.fn()
    render(<BackHome onBack={onBack} onHome={onHome} />)

    await user.click(screen.getByRole('button', { name: '返回' }))
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onHome).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: '主页' }))
    expect(onHome).toHaveBeenCalledTimes(1)
  })

  it('给了 href 就渲染成链接，名称可以改', () => {
    render(<BackHome backHref="/operators" homeHref="/" backLabel="返回干员列表" />)
    expect(screen.getByRole('link', { name: '返回干员列表' })).toHaveAttribute('href', '/operators')
    expect(screen.getByRole('link', { name: '主页' })).toHaveAttribute('href', '/')
  })

  it('是两个并排的直角矩形：返回深灰、主页稍浅，没有斜边', () => {
    render(<BackHome />)
    const back = screen.getByRole('button', { name: '返回' })
    const home = screen.getByRole('button', { name: '主页' })
    expect(back).toHaveClass('bg-ark-neutral-graphite-deep')
    expect(home).toHaveClass('bg-ark-neutral-graphite')
    for (const button of [back, home]) {
      expect(button.className).not.toContain('ark-slant-')
      // 矩形不重叠，点击区就是元素自身
      expect(button).not.toHaveClass('pointer-events-none')
    }
  })

  it('展开时主页块描一圈白边，不换底色', () => {
    render(<WithNav defaultExpanded />)
    expect(getToggle().className).toContain('aria-expanded:shadow-[inset_0_0_0_2px')
    expect(getToggle()).toHaveClass('bg-ark-neutral-graphite')
  })

  it('没有 children 时主页不是展开开关', () => {
    render(<BackHome />)
    expect(getToggle()).not.toHaveAttribute('aria-expanded')
    expect(getToggle()).not.toHaveAttribute('aria-controls')
  })

  it('有 children 时主页是展开开关，默认收起', () => {
    render(<WithNav />)
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getPanel()).toHaveAttribute('hidden')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('点主页展开，再点收起', async () => {
    const user = userEvent.setup()
    const onHome = vi.fn()
    const onExpandedChange = vi.fn()
    render(<WithNav onHome={onHome} onExpandedChange={onExpandedChange} />)

    await user.click(getToggle())
    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(getPanel()).not.toHaveAttribute('hidden')
    expect(screen.getByRole('navigation', { name: '快捷导航' })).toBeInTheDocument()
    expect(onExpandedChange).toHaveBeenLastCalledWith(true)

    await user.click(getToggle())
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedChange).toHaveBeenLastCalledWith(false)
    // 回主页的入口在展开的内容里，开关本身不触发 onHome
    expect(onHome).not.toHaveBeenCalled()
  })

  it('defaultExpanded 一开始就展开', () => {
    render(<WithNav defaultExpanded />)
    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: '首页 HOME' })).toBeInTheDocument()
  })

  it('按 Esc 收起，焦点回到主页按钮', async () => {
    const user = userEvent.setup()
    render(<WithNav defaultExpanded />)
    screen.getByRole('link', { name: '干员 OPERATOR' }).focus()

    await user.keyboard('{Escape}')
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getToggle()).toHaveFocus()
  })

  it('点别处收起，点自身内部不收起', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<WithNav defaultExpanded onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByRole('button', { name: '返回' }))
    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: '页面上的其他按钮' }))
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('选了其中一项之后收起', async () => {
    const user = userEvent.setup()
    render(<WithNav defaultExpanded />)
    await user.click(screen.getByRole('link', { name: '首页 HOME' }))
    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('转发 ref', () => {
    let node: HTMLDivElement | null = null
    render(
      <BackHome
        data-testid="back-home"
        ref={element => {
          node = element
        }}
      />,
    )
    expect(node).toBe(screen.getByTestId('back-home'))
  })
})
