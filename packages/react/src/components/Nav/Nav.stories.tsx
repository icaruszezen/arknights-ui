import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Counter } from '../Counter'
import { Divider } from '../Divider'
import { Panel } from '../Panel'
import { Nav, NavGroup, NavItem } from './Nav'

const meta = {
  title: '导航/Nav',
  component: Nav,
  subcomponents: { NavItem, NavGroup },
  args: { 'aria-label': '主导航' },
} satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

const screens = [
  ['index', 'INDEX', '首页'],
  ['information', 'INFORMATION', '情报'],
  ['docs', 'DOCS', '文档'],
  ['components', 'COMPONENTS', '组件'],
  ['tokens', 'TOKENS', '变量'],
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
 * 默认按宽度折叠：视口窄于 48rem 时，横排会收成一个菜单按钮。
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

/** `size="md"` 是应用页头的大小：比例照旧，整体小一档。 */
export const Compact: Story = {
  args: { children: items, size: 'md', indicator: true, collapse: 'never' },
}

/**
 * 折叠后只剩一个菜单按钮。点开是全屏菜单：一项一行，逐项自右滑入；
 * 点任意一项、点关闭或按 Esc 收起。这里用 `collapse="always"` 固定在折叠状态。
 */
export const Collapsed: Story = {
  args: { children: items, collapse: 'always' },
}

/** 窄屏的手机。在画布视图里才是窄屏；文档页是宽的，这里看到的是横排。 */
export const Narrow: Story = {
  args: { children: items, indicator: true },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/**
 * 竖排：应用侧栏的一列。图标加名称，右端可以带一个数；当前项连左缘的边带字一起换成信号色。
 * 用 `NavGroup` 分组。
 */
export const Vertical: Story = {
  args: { orientation: 'vertical', 'aria-label': '侧栏' },
  render: args => (
    <Panel padding="none" className="w-60 py-ark-3">
      <Nav {...args}>
        <NavItem href="#overview" icon={glyphs.blocks} current>
          总览
        </NavItem>
        <NavItem href="#builds" icon={glyphs.bars} sub="12">
          构建
        </NavItem>
        <NavItem href="#releases" icon={glyphs.chevrons}>
          发布
        </NavItem>
        <NavGroup label="Workspace">
          <NavItem href="#members" icon={glyphs.frame} sub="48">
            成员
          </NavItem>
          <NavItem href="#settings" icon={glyphs.gear}>
            设置
          </NavItem>
        </NavGroup>
      </Nav>
    </Panel>
  ),
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
