import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Menu, MenuItem, MenuLabel, MenuSeparator } from './Menu'

interface ActionsProps {
  onRename?: () => void
  onDelete?: () => void
}

function Actions({ onRename, onDelete }: ActionsProps) {
  return (
    <Menu trigger={<button type="button">操作</button>} aria-label="记录操作">
      <MenuLabel>编辑</MenuLabel>
      <MenuItem onSelect={onRename}>重命名</MenuItem>
      <MenuItem disabled>复制</MenuItem>
      <MenuItem href="/export">导出</MenuItem>
      <MenuSeparator />
      <MenuItem danger onSelect={onDelete}>
        删除
      </MenuItem>
    </Menu>
  )
}

const trigger = () => screen.getByRole('button', { name: '操作' })

describe('Menu', () => {
  it('平时不在文档里；点触发元素展开，焦点落在第一项', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger())
    const menu = screen.getByRole('menu', { name: '记录操作' })
    expect(menu).toHaveAttribute('data-ark', 'menu')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('menuitem')).toHaveLength(4)
    expect(screen.getByRole('menuitem', { name: '重命名' })).toHaveFocus()
  })

  it('上下方向键在各项之间移动，跳过禁用的，首尾循环；Home / End 跳到首尾', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    await user.click(trigger())
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: '导出' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: '删除' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: '重命名' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: '删除' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('menuitem', { name: '重命名' })).toHaveFocus()
  })

  it('按一个字符跳到以它开头的那一项', async () => {
    const user = userEvent.setup()
    render(
      <Menu trigger={<button type="button">操作</button>}>
        <MenuItem>Archive</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>,
    )
    await user.click(trigger())
    await user.keyboard('d')
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus()
    await user.keyboard('d')
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
  })

  it('选了一项：调用 onSelect，菜单关闭，焦点回到触发元素', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<Actions onRename={onRename} />)
    await user.click(trigger())
    await user.keyboard('{Enter}')
    expect(onRename).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger()).toHaveFocus()
  })

  it('禁用的项读屏读得到，但点了不执行、菜单也不关', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    await user.click(trigger())
    const disabled = screen.getByRole('menuitem', { name: '复制' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await user.click(disabled)
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('Esc 关闭并把焦点还给触发元素；触发元素上按下方向键打开', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    trigger().focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger()).toHaveFocus()
  })

  it('有 href 的项是链接；危险的项文字是红色；分隔线和小标题不能选', async () => {
    const user = userEvent.setup()
    const { baseElement } = render(<Actions />)
    await user.click(trigger())
    const link = screen.getByRole('menuitem', { name: '导出' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/export')
    expect(screen.getByRole('menuitem', { name: '删除' })).toHaveClass('text-ark-danger-fg')
    expect(baseElement.querySelector('[data-ark="menu-separator"]')).not.toBeNull()
    expect(screen.getByText('编辑')).not.toHaveAttribute('role')
  })

  it('脱离 Menu 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<MenuItem>孤立</MenuItem>)).toThrow('<MenuItem> 必须放在 <Menu> 里')
    error.mockRestore()
  })
})
