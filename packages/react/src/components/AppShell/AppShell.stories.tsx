import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Avatar } from '../Avatar'
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb'
import { Heading } from '../Heading'
import { Nav, NavGroup, NavItem } from '../Nav'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { AppShell } from './AppShell'

const meta = {
  title: '布局与层级/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  // 骨架铺满视口，不要预览自带的那一圈内边距
  decorators: [
    Story => (
      <div className="-m-ark-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

const sidebar = (
  <Nav orientation="vertical" aria-label="侧栏">
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
)

const header = (
  <>
    <span className="font-ark-latin-wide text-ark-base font-ark-bold">ARKNIGHTS-UI</span>
    <Avatar name="Doctor" size="sm" className="ml-auto" />
  </>
)

/**
 * 顶上一条页头，左边一条侧栏，其余是内容区。换页只换内容区，页头和侧栏原地不动。
 * 区与区之间只有 1px 的细线。
 */
export const Default: Story = {
  args: { header, sidebar },
  render: args => (
    <AppShell {...args}>
      <div className="grid gap-ark-5 p-ark-6">
        <Breadcrumb>
          <BreadcrumbItem href="#workspace">工作区</BreadcrumbItem>
          <BreadcrumbItem current>总览</BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" size="md" sub="OVERVIEW">
          总览
        </Heading>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-ark-4">
          <Panel>
            <Stat label="Builds" value={1284} />
          </Panel>
          <Panel>
            <Stat label="Success" value="98.2" unit="%" />
          </Panel>
          <Panel>
            <Stat label="Queue" value={3} max={8} />
          </Panel>
        </div>
      </div>
    </AppShell>
  ),
}

/** 窄屏时侧栏收起，页头最左出现菜单按钮，点开是从左边滑出来的抽屉。 */
export const Narrow: Story = {
  ...Default,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}

/** 没有侧栏时只剩页头和内容区。 */
export const WithoutSidebar: Story = {
  args: { header },
  render: args => (
    <AppShell {...args}>
      <div className="p-ark-6">
        <Heading as="h1" size="md" sub="SETTINGS">
          设置
        </Heading>
      </div>
    </AppShell>
  ),
}
