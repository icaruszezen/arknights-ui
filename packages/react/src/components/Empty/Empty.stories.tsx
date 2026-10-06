import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { Empty } from './Empty'

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
  args: { title: 'NO RESULT', children: '没有符合筛选条件的干员' },
}

/** 没有说明时，英文标题是唯一的信息，所以它也必须读得清。 */
export const TitleOnly: Story = {
  args: { children: undefined },
}

/**
 * 文字用所在表面的次要文字色，放进石墨或纸白面板时跟着换；虚线框取文字色的一半不透明度。
 *
 * 写死的灰做不到这一点：文档原先的 `gray-600` 在黑底上只有 2.95:1，放进石墨面板只剩 1.53:1。
 */
export const OnSurfaces: Story = {
  render: args => (
    <div className="grid gap-ark-2">
      <Empty {...args} />
      <Panel>
        <Empty {...args} />
      </Panel>
      <Panel tone="paper">
        <Empty {...args} />
      </Panel>
    </div>
  ),
}
