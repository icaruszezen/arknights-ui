import type { Meta, StoryObj } from '@storybook/react-vite'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { Avatar } from './Avatar'

const meta = {
  title: '数据展示/Avatar',
  component: Avatar,
  args: { name: 'Closure' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** 没有图片时显示名字的头两个字符，窄体。直角的方块。 */
export const Default: Story = {}

/** 有图片时铺满；加载不出来会退回到缩写。 */
export const WithImage: Story = {
  args: { src: figure('#aab4ba', '#18d1ff'), name: 'Amiya', size: 'lg' },
}

export const Sizes: Story = {
  render: args => (
    <div className="flex items-end gap-ark-3">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
}

/** 右下角的状态角标：在线是绿色的实块，忙碌是黄色，离线是空心的灰框——不只靠颜色。 */
export const Status: Story = {
  render: () => (
    <div className="flex items-center gap-ark-5">
      <Avatar name="Amiya" status="online" statusLabel="在线" />
      <Avatar name="Kaltsit" status="busy" statusLabel="忙碌" />
      <Avatar name="Closure" status="offline" statusLabel="离线" />
    </div>
  ),
}

/** 圆形只在需要和周围的方块区分开时用；`ring` 标出当前选中的人。 */
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-ark-5">
      <Avatar name="Amiya" ring />
      <Avatar name="Kaltsit" shape="circle" />
      <Avatar aria-label="匿名" fallback={<span className="size-5">{glyphs.shield}</span>} />
    </div>
  ),
}
