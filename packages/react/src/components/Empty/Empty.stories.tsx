import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, Panel } from '../Panel'
import { Stat } from '../Stat'
import { Empty, EmptySlot } from './Empty'

const meta = {
  title: '反馈/Empty',
  component: Empty,
  args: { children: '暂无内容' },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

/** 虚线框 + 窄体英文 + 中文小字说明。 */
export const Default: Story = {}

export const CustomTitle: Story = {
  args: { title: 'NO RESULT', children: '没有符合筛选条件的记录' },
}

/** 没有说明时，英文标题是唯一的信息，所以它也必须读得清。 */
export const TitleOnly: Story = {
  args: { children: undefined },
}

/**
 * 文字用所在表面的次要文字色，换主题、放进别的面板时跟着换；虚线框取文字色的一半不透明度。
 *
 * 写死的灰做不到这一点：文档原先的 `gray-600` 在黑底上只有 2.95:1。
 */
export const OnSurfaces: Story = {
  render: args => (
    <div className="grid gap-ark-2">
      <Empty {...args} />
      <Panel>
        <Empty {...args} />
      </Panel>
      <Panel tone="inverse">
        <Empty {...args} />
      </Panel>
    </div>
  ),
}

/**
 * 可以填的空位：和旁边已填的格子等大，一圈实线的细框，正中一个加号和动作名。
 * 空位不缩小、不隐藏，位置留着；它本身是一个按钮。
 */
export const Slot: Story = {
  decorators: [],
  render: () => (
    <div className="grid w-[36rem] max-w-full grid-cols-3 gap-ark-3">
      <Card elevated={false}>
        <CardHeader title="前端组" sub="Frontend" />
        <Stat label="Members" value={8} size="sm" />
      </Card>
      <Card elevated={false}>
        <CardHeader title="平台组" sub="Platform" />
        <Stat label="Members" value={5} size="sm" />
      </Card>
      <EmptySlot>新建小组</EmptySlot>
    </div>
  ),
}
