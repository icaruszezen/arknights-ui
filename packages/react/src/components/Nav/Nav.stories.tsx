import type { Meta, StoryObj } from '@storybook/react-vite'
import { Counter } from '../Counter'
import { Divider } from '../Divider'
import { Nav, NavItem } from './Nav'

const meta = {
  title: '导航/Nav',
  component: Nav,
  subcomponents: { NavItem },
  args: { 'aria-label': '主导航' },
} satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

const screens = [
  ['index', 'INDEX', '首页'],
  ['information', 'INFORMATION', '情报'],
  ['operator', 'OPERATOR', '干员'],
  ['world', 'WORLD', '设定'],
  ['media', 'MEDIA', '泰拉万象'],
  ['more', 'MORE', '更多内容'],
] as const

const items = screens.map(([id, label, sub]) => (
  <NavItem key={id} href={`#${id}`} sub={sub} current={id === 'information' && 'location'}>
    {label}
  </NavItem>
))

/**
 * 每一项两行：上面英文窄体，下面中文小字。当前项整体变成信号色，没有下划线、底色或加粗。
 *
 * 默认按方向折叠：把视口切到竖屏，横排会收成一个菜单按钮。
 */
export const Default: Story = {
  args: { children: items },
}

/**
 * 当前项只靠颜色区分时，色觉障碍的用户不容易看出来。
 * `indicator` 给它补一条 4px 的条，作为颜色之外的第二种标记。
 */
export const WithIndicator: Story = {
  args: { children: items, indicator: true, collapse: 'never' },
}

/**
 * 折叠后只剩一个菜单按钮。点开是全屏菜单：项目放大成大号列表，逐项淡入；
 * 点任意一项、点关闭或按 Esc 收起。这里用 `collapse="always"` 固定在折叠状态。
 */
export const Collapsed: Story = {
  args: { children: items, collapse: 'always' },
}

/**
 * 竖屏的手机。在画布视图里才是竖屏；文档页是横向的，这里看到的是横排。
 */
export const Portrait: Story = {
  args: { children: items, indicator: true },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/**
 * 放进顶栏：左边是站点名，中间是导航，右边用一条竖线隔出计数。
 * 导航位置全站固定，切屏时只有颜色和数字变化。
 */
export const InHeader: Story = {
  args: { children: items, collapse: 'never' },
  render: args => (
    <header className="flex items-center gap-ark-6">
      <span className="font-ark-latin-wide text-ark-body-lg font-ark-bold">ARKNIGHTS-UI</span>
      <Nav {...args} className="ml-auto" />
      <Divider orientation="vertical" className="h-16 self-auto" />
      <Counter value={1} total={5} label="INFORMATION" size="sm" />
    </header>
  ),
}
