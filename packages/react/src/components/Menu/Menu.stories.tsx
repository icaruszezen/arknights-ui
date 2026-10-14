import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { glyphs } from '../../../.storybook/glyphs'
import { Button, IconButton } from '../Button'
import { Menu, MenuItem, MenuLabel, MenuSeparator } from './Menu'

const meta = {
  title: '面板与浮层/Menu',
  component: Menu,
  subcomponents: { MenuItem, MenuSeparator, MenuLabel },
  args: { trigger: <Button iconEnd={glyphs.chevrons}>操作</Button> },
  decorators: [
    Story => (
      <div className="min-h-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 点一下展开一列操作；悬停和键盘聚焦都是整行反色。
 * 上下方向键移动，按字符跳到以它开头的那一项，Enter 执行，Esc 关闭。
 */
export const Default: Story = {
  render: function Render(args) {
    const [last, setLast] = useState('—')
    return (
      <div className="flex items-center gap-ark-4">
        <Menu {...args}>
          <MenuItem icon={glyphs.frame} shortcut="F2" onSelect={() => setLast('重命名')}>
            重命名
          </MenuItem>
          <MenuItem icon={glyphs.blocks} shortcut="Ctrl D" onSelect={() => setLast('创建副本')}>
            创建副本
          </MenuItem>
          <MenuItem icon={glyphs.forward} disabled>
            移动到…
          </MenuItem>
          <MenuSeparator />
          <MenuItem icon={glyphs.cross} danger onSelect={() => setLast('删除')}>
            删除
          </MenuItem>
        </Menu>
        <span className="font-ark-data text-ark-caption text-ark-fg-muted">LAST: {last}</span>
      </div>
    )
  },
}

/** 用小标题和细线把操作分成几组；有 `href` 的项是链接。 */
export const Grouped: Story = {
  args: { trigger: <IconButton label="更多">{glyphs.bars}</IconButton> },
  render: args => (
    <Menu {...args} aria-label="更多">
      <MenuLabel>Workspace</MenuLabel>
      <MenuItem href="#members">成员</MenuItem>
      <MenuItem href="#billing">账单</MenuItem>
      <MenuSeparator />
      <MenuLabel>Account</MenuLabel>
      <MenuItem href="#profile">个人资料</MenuItem>
      <MenuItem>退出登录</MenuItem>
    </Menu>
  ),
}

/** 贴着视口边缘时自动翻到另一侧。 */
export const Placement: Story = {
  args: { placement: 'bottom-end' },
  render: args => (
    <div className="flex justify-end">
      <Menu {...args}>
        <MenuItem>导出 CSV</MenuItem>
        <MenuItem>导出 JSON</MenuItem>
      </Menu>
    </div>
  ),
}
