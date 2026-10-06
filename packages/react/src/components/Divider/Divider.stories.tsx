import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: '排版与装饰/Divider',
  component: Divider,
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

/** 1px 细线，行与行之间的默认分隔。 */
export const Solid: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="grid gap-ark-5">
      <Divider />
      <Divider variant="dash" />
      <Divider variant="fade" />
    </div>
  ),
}

/** 分隔线带一个“起点”：信号色短粗段，或一个小方块。 */
export const WithStart: Story = {
  render: () => (
    <div className="grid gap-ark-5">
      <Divider start="bar" />
      <Divider start="square" />
      <Divider start="bar" variant="fade" />
    </div>
  ),
}

/** 以英文标签开头，后面才是细线。 */
export const WithLabel: Story = {
  args: { label: 'PROFILE' },
}

/** 竖线：隔开顶栏右侧的图标区、右栏的计数。 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center gap-ark-4 font-ark-latin-condensed text-ark-nav">
      <span>INDEX</span>
      <Divider orientation="vertical" />
      <span>INFORMATION</span>
      <Divider orientation="vertical" variant="fade" start="bar" />
      <span>OPERATOR</span>
    </div>
  ),
}
