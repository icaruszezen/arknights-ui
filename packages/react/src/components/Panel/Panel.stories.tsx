import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { Tab, TabList, Tabs } from '../Tabs'
import { Tag } from '../Tag'
import { Card, Panel } from './Panel'

const meta = {
  title: '面板与卡片/Panel',
  component: Panel,
  // 面板是半透明的，放在有内容的场景上才看得出来
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

/** 石墨面板：其余所有东西的默认容器。半透明，下层隐约可见。 */
export const Graphite: Story = {
  args: { className: 'w-72' },
  render: args => (
    <Panel {...args}>
      <Heading as="h3" size="sm" sub="FACTORY">
        制造站
      </Heading>
      <Progress
        aria-label="制造进度"
        variant="thick"
        tone="action"
        value={62}
        className="mt-ark-5"
      />
      <p className="m-0 mt-ark-2 font-ark-data text-ark-caption text-ark-fg-muted">02:14:36</p>
    </Panel>
  ),
}

/** 纸白面板：一屏最多一两块。文字贴角，留白处压一片半调网点。 */
export const Paper: Story = {
  args: { tone: 'paper', accent: 'left', halftone: true, className: 'w-72' },
  render: args => (
    <Panel {...args}>
      <Heading as="h3" size="sm" sub="PURCHASE CERTIFICATE">
        采购凭证
      </Heading>
      <Divider className="my-ark-4" />
      <Stat label="持有" value={258} className="pb-ark-6" />
    </Panel>
  ),
}

/** 毛玻璃浮层：模糊并保留下层，用户能看出自己没有离开原来的页面。 */
export const Frosted: Story = {
  args: { tone: 'frosted' },
  render: args => (
    <div className="relative grid w-96 grid-cols-2 gap-ark-2 p-ark-4">
      <div className="h-20 bg-ark-signal" />
      <div className="h-20 bg-ark-neutral-paper" />
      <div className="h-24 bg-ark-signal-accent" />
      <div className="h-24 bg-ark-neutral-graphite" />
      <Panel {...args} className="absolute inset-ark-6">
        <Heading as="h3" size="sm" sub="CLASS DETAILS">
          职业详情
        </Heading>
      </Panel>
    </div>
  ),
}

/** 卡片 = 带投影的面板。切角时投影跟着切角的形状走。 */
export const CardWithCut: Story = {
  render: () => (
    <Card cut accent="left" className="w-72">
      <Heading as="h3" size="sm" sub="TRADING POST">
        贸易站
      </Heading>
      <Divider className="my-ark-4" />
      <Stat label="订单" value={3} max={6} size="sm" orientation="horizontal" />
    </Card>
  ),
}

/**
 * 面板会设置明暗上下文。同一组子组件放进石墨和纸白面板，
 * 前景、细线、反白块自动翻转，信号色用作文字时在纸白面上压暗。
 */
export const ToneContext: Story = {
  render: () => {
    const content = (
      <div className="grid gap-ark-4">
        <Heading as="h3" size="sm" sub="OPERATOR">
          干员
        </Heading>
        <div className="flex gap-ark-2">
          <Tag variant="solid" cut>
            近卫
          </Tag>
          <Tag variant="outline">输出</Tag>
        </div>
        <Tabs defaultValue="all" variant="underline">
          <TabList aria-label="职业">
            <Tab value="all">全部</Tab>
            <Tab value="guard">近卫</Tab>
            <Tab value="sniper">狙击</Tab>
          </TabList>
        </Tabs>
        <Stat label="Trust" value={131} max={200} size="sm" orientation="horizontal" />
        <Progress aria-label="信赖" variant="meter" value={131} max={200} />
        <div className="flex gap-ark-3">
          <Button>查看档案</Button>
          <Button selected>已选中</Button>
        </div>
      </div>
    )
    return (
      <div className="grid w-fit grid-cols-2 gap-ark-2">
        <Panel className="w-80">{content}</Panel>
        <Panel tone="paper" className="w-80">
          {content}
        </Panel>
      </div>
    )
  },
}
