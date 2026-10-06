import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta = {
  title: '数据展示/Progress',
  component: Progress,
  args: { value: 42, 'aria-label': '加载进度' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** 细条：1px 半透明轨道 + 4px 信号色进度。 */
export const Thin: Story = {}

/** 粗条：可以用 2px 细缝切成几段。经验、制造进度用黄色。 */
export const Thick: Story = {
  render: args => (
    <div className="grid gap-ark-2">
      <Progress {...args} />
      <p className="m-0 text-right font-ark-data text-ark-caption text-ark-fg-muted">
        EXP 2,480 / 3,600
      </p>
    </div>
  ),
  args: {
    variant: 'thick',
    tone: 'action',
    value: 2480,
    max: 3600,
    segments: 5,
    'aria-label': '经验',
  },
  argTypes: { value: { control: { type: 'range', min: 0, max: 3600 } } },
}

/** 相对值条：2px 高，表示该数值在同类中的高低，不读数字也能比较。 */
export const Meter: Story = {
  args: { variant: 'meter', value: 72, 'aria-label': '攻击（同职业相对值）' },
}
