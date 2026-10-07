import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { RingProgress } from './RingProgress'

const meta = {
  title: '数据展示/RingProgress',
  component: RingProgress,
  args: { value: 62, 'aria-label': '等级经验', children: '90', label: 'LV' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
} satisfies Meta<typeof RingProgress>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 等级环：中间是等级，环是升到下一级的经验。起点在 12 点方向，端点是平的。
 */
export const Default: Story = {}

/** 经验用行动黄。 */
export const Level: Story = {
  args: { tone: 'action', size: 'lg', value: 2480, max: 3600 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 3600 } } },
}

/** 三档：线宽随直径从 4px 加到 6px。最小一档放不下标签，只留数字。 */
export const Sizes: Story = {
  render: args => (
    <div className="flex items-center gap-ark-6">
      <RingProgress {...args} size="sm" label={undefined} />
      <RingProgress {...args} />
      <RingProgress {...args} size="lg" />
    </div>
  ),
}

/**
 * 压在立绘或场景上时，环内垫一块半透明黑的圆底，数字才读得清——干员卡片上的等级环就是这样。
 * 右边是主界面的写法：`LV` 在数字下面。
 */
export const OnScene: Story = {
  globals: { backgrounds: { value: 'scene' } },
  args: { tone: 'action', value: 100, filled: true },
  render: args => (
    <div className="flex items-center gap-ark-6">
      <RingProgress {...args} />
      <RingProgress {...args} tone="neutral" labelPosition="below">
        120
      </RingProgress>
    </div>
  ),
}

/** 不放内容时就是一个环，比如小头像上表示心情的环。 */
export const RingOnly: Story = {
  args: { children: undefined, label: undefined, size: 'sm', tone: 'neutral', value: 30 },
}

/** 轨道、标签和数字跟随明暗上下文，放进纸白面板时换成深色。 */
export const OnSurfaces: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: args => (
    <div className="flex gap-ark-2">
      <Panel>
        <RingProgress {...args} />
      </Panel>
      <Panel tone="paper">
        <RingProgress {...args} />
      </Panel>
    </div>
  ),
}
