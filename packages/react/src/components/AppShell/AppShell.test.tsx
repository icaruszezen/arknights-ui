import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Nav, NavItem } from '../Nav'
import { AppShell } from './AppShell'

const sidebar = (
  <Nav orientation="vertical" aria-label="侧栏">
    <NavItem href="#overview" current>
      总览
    </NavItem>
    <NavItem href="#builds">构建</NavItem>
  </Nav>
)

// 关闭状态的 <dialog> 不在无障碍树里，用 hidden: true 才查得到
const drawer = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement

describe('AppShell', () => {
  it('页头、侧栏、内容区各是一个地标', () => {
    render(
      <AppShell data-testid="shell" header={<span>ARKNIGHTS-UI</span>} sidebar={sidebar}>
        <h1>总览</h1>
      </AppShell>,
    )
    const shell = screen.getByTestId('shell')
    expect(shell).toHaveAttribute('data-ark', 'app-shell')
    expect(shell).toHaveClass('h-dvh', 'bg-ark-canvas')
    expect(screen.getByRole('banner')).toHaveTextContent('ARKNIGHTS-UI')
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }))
    expect(screen.getByRole('complementary')).toHaveAttribute('data-ark', 'app-shell-sidebar')
  })

  it('窄屏时侧栏收起、菜单按钮出现：按宽度切换', () => {
    render(<AppShell sidebar={sidebar}>内容</AppShell>)
    expect(screen.getByRole('complementary')).toHaveClass('hidden', 'md:block')
    const button = screen.getByRole('button', { name: '导航' })
    expect(button).toHaveClass('md:hidden')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(drawer().open).toBe(false)
  })

  it('点菜单按钮打开从左边滑出来的抽屉，里面是同一份侧栏', async () => {
    const user = userEvent.setup()
    render(<AppShell sidebar={sidebar}>内容</AppShell>)
    await user.click(screen.getByRole('button', { name: '导航' }))
    expect(drawer().open).toBe(true)
    expect(drawer()).toHaveAttribute('data-side', 'left')
    expect(within(drawer()).getAllByRole('link')).toHaveLength(2)
  })

  it('点了抽屉里的链接就关上', async () => {
    const user = userEvent.setup()
    render(<AppShell sidebar={sidebar}>内容</AppShell>)
    await user.click(screen.getByRole('button', { name: '导航' }))
    await user.click(within(drawer()).getByRole('link', { name: '构建' }))
    expect(drawer().open).toBe(false)
  })

  it('没有侧栏时没有菜单按钮，也没有抽屉；内容区的元素可以换', () => {
    render(
      <AppShell header={<span>标识</span>} contentAs="div">
        内容
      </AppShell>,
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('dialog', { hidden: true })).toBeNull()
    expect(screen.queryByRole('main')).toBeNull()
    expect(screen.getByText('内容')).toHaveAttribute('data-ark', 'app-shell-content')
  })
})
