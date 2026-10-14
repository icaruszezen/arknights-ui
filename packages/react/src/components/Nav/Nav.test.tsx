import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Nav, NavGroup, NavItem, type NavProps } from './Nav'

function Site({ withMore = true, ...props }: NavProps & { withMore?: boolean }) {
  return (
    <Nav aria-label="主导航" {...props}>
      <NavItem href="#index" sub="首页">
        INDEX
      </NavItem>
      <NavItem href="#information" sub="情报" current="location">
        INFORMATION
      </NavItem>
      {withMore && (
        <NavItem href="#more" sub="更多内容">
          MORE
        </NavItem>
      )}
    </Nav>
  )
}

// 关闭状态的 <dialog> 不在无障碍树里，用 hidden: true 才查得到
const getMenu = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement
const getMenuButton = () => screen.getByRole('button', { name: '菜单' })

describe('Nav', () => {
  it('是一个带名称的导航地标，里面是一列双语链接', () => {
    render(<Site />)
    const nav = screen.getByRole('navigation', { name: '主导航' })
    expect(nav).toHaveAttribute('data-ark', 'nav')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'INDEX 首页' })).toHaveAttribute('href', '#index')
  })

  it('当前项输出 aria-current，只变颜色', () => {
    render(<Site />)
    const current = screen.getByRole('link', { name: 'INFORMATION 情报' })
    expect(current).toHaveAttribute('aria-current', 'location')
    expect(current).toHaveClass('text-ark-signal-fg')
    expect(current.className).not.toContain('after:')

    const other = screen.getByRole('link', { name: 'INDEX 首页' })
    expect(other).not.toHaveAttribute('aria-current')
    expect(other).toHaveClass('text-ark-fg')
  })

  it('current 为 true 时输出 aria-current="page"', () => {
    render(
      <Nav aria-label="主导航" collapse="never">
        <NavItem href="/operators" current>
          OPERATOR
        </NavItem>
      </Nav>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('indicator 给当前项补一条非颜色的标记', () => {
    render(<Site indicator />)
    expect(screen.getByRole('link', { name: 'INFORMATION 情报' })).toHaveClass(
      'after:bg-ark-signal',
    )
    expect(screen.getByRole('link', { name: 'INDEX 首页' }).className).not.toContain('after:')
  })

  it('条件渲染掉的项不留空的列表项', () => {
    render(<Site withMore={false} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('默认按宽度折叠：窄屏时横排隐藏，菜单按钮出现', () => {
    render(<Site />)
    expect(screen.getByRole('list')).toHaveClass('hidden', 'md:flex')
    const button = getMenuButton()
    expect(button).toHaveClass('grid', 'md:hidden')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('aria-controls', getMenu().id)
    expect(getMenu().open).toBe(false)
  })

  it('collapse="never" 始终横排，没有菜单', () => {
    render(<Site collapse="never" />)
    expect(screen.getByRole('list')).toHaveClass('flex')
    expect(screen.getByRole('list')).not.toHaveClass('hidden')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument()
  })

  it('collapse="always" 只有菜单按钮，没有横排', () => {
    render(<Site collapse="always" />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(getMenuButton()).toHaveClass('grid')
    expect(getMenuButton()).not.toHaveClass('md:hidden')
    expect(within(getMenu()).getAllByRole('link', { hidden: true })).toHaveLength(3)
  })

  it('点菜单按钮以模态方式打开全屏菜单', async () => {
    const user = userEvent.setup()
    render(<Site collapse="always" />)
    await user.click(getMenuButton())

    const menu = getMenu()
    expect(menu.open).toBe(true)
    expect(menu).toHaveAccessibleName('菜单')
    // 菜单跟着主题走，不自己设明暗上下文
    expect(menu).not.toHaveAttribute('data-ark-tone')
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')
  })

  it('菜单里的项逐项延迟入场', async () => {
    const user = userEvent.setup()
    render(<Site collapse="always" />)
    await user.click(getMenuButton())

    const items = within(getMenu()).getAllByRole('listitem')
    expect(items.map(item => item.getAttribute('style'))).toEqual([
      expect.stringContaining('* 0)'),
      expect.stringContaining('* 1)'),
      expect.stringContaining('* 2)'),
    ])
    // 自右滑入只在允许动效时进行，减少动效时只淡入
    for (const item of items) {
      expect(item).toHaveClass(
        'motion-safe:animate-ark-enter-right',
        'motion-reduce:animate-ark-fade-in',
      )
    }
  })

  it('菜单里一项一行：底部细线、主行与小字两端对齐，小字下压一条粗条', async () => {
    const user = userEvent.setup()
    render(<Site collapse="always" />)
    await user.click(getMenuButton())

    const link = within(getMenu()).getByRole('link', { name: 'INDEX 首页' })
    // 取值是官网竖屏菜单折到 375 宽以后的大小，宽屏上放大
    expect(link).toHaveClass('h-15', 'md:h-20', 'justify-between', 'border-b', 'border-ark-rule')
    expect(within(link).getByText('INDEX')).toHaveClass('text-[1.125rem]')
    expect(within(link).getByText('首页')).toHaveClass('after:h-[0.1875rem]', 'after:bg-current')
  })

  it('点菜单里的一项之后关闭，并保留使用方的 onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Nav aria-label="主导航" collapse="always">
        <NavItem href="#index" sub="首页" onClick={onClick}>
          INDEX
        </NavItem>
      </Nav>,
    )
    await user.click(getMenuButton())
    await user.click(within(getMenu()).getByRole('link', { name: 'INDEX 首页' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(getMenu().open).toBe(false)
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('关闭按钮和 Esc 都能关闭菜单', async () => {
    const user = userEvent.setup()
    render(<Site collapse="always" />)

    await user.click(getMenuButton())
    await user.click(within(getMenu()).getByRole('button', { name: '关闭' }))
    expect(getMenu().open).toBe(false)

    await user.click(getMenuButton())
    expect(getMenu().open).toBe(true)
    fireEvent(getMenu(), new Event('cancel', { cancelable: true }))
    expect(getMenu().open).toBe(false)
  })

  it('按钮和菜单的名称可以改', () => {
    render(<Site collapse="always" menuLabel="导航菜单" closeLabel="收起" />)
    expect(screen.getByRole('button', { name: '导航菜单' })).toBeInTheDocument()
    // 关闭状态下算不出可访问名称，直接看属性
    expect(getMenu()).toHaveAttribute('aria-label', '导航菜单')
    expect(
      within(getMenu()).getByRole('button', { name: '收起', hidden: true }),
    ).toBeInTheDocument()
  })

  it('size="md" 是应用页头的大小，默认是官网顶栏的大小', () => {
    const { rerender } = render(<Site collapse="never" />)
    expect(screen.getByText('INDEX')).toHaveClass('text-ark-nav')
    rerender(<Site collapse="never" size="md" />)
    expect(screen.getByText('INDEX')).toHaveClass('text-ark-base')
  })

  it('as 换成路由库的链接组件', () => {
    const RouterLink = (props: ComponentProps<'a'>) => <a data-router="" {...props} />
    render(
      <Nav aria-label="主导航" collapse="never">
        <NavItem href="/news" as={RouterLink} current>
          NEWS
        </NavItem>
      </Nav>,
    )
    const link = screen.getByRole('link', { name: 'NEWS' })
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('竖排是侧栏的一列：没有菜单按钮，当前项左缘一条信号色的边', () => {
    render(
      <Nav aria-label="侧栏" orientation="vertical">
        <NavItem href="/overview" icon={<svg data-testid="icon" />} current>
          总览
        </NavItem>
        <NavItem href="/builds" sub="12">
          构建
        </NavItem>
      </Nav>,
    )
    const nav = screen.getByRole('navigation', { name: '侧栏' })
    expect(nav).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    const current = screen.getByRole('link', { name: '总览' })
    expect(current).toHaveClass('border-l-ark-signal', 'text-ark-signal-fg')
    // 图标对读屏隐藏
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link', { name: '构建 12' })).toHaveClass('border-l-transparent')
  })

  it('NavGroup 给竖排的一组项加一个名称', () => {
    render(
      <Nav aria-label="侧栏" orientation="vertical">
        <NavGroup label="Workspace">
          <NavItem href="/members">成员</NavItem>
          <NavItem href="/billing">账单</NavItem>
        </NavGroup>
      </Nav>,
    )
    const group = screen.getByRole('group', { name: 'Workspace' })
    expect(within(group).getAllByRole('link')).toHaveLength(2)
  })

  it('脱离 Nav 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<NavItem href="#x">孤立</NavItem>)).toThrow('<NavItem> 必须放在 <Nav> 里')
    error.mockRestore()
  })
})
