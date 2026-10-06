import type { Meta, StoryObj } from '@storybook/react-vite'
import { RewardGlow, type RewardGlowTier } from './RewardGlow'

// 物品图标的占位：一个切了角的方块。组件库不带任何官方图标
function Item({ label }: { label: string }) {
  return (
    <span className="relative isolate grid size-16 place-items-center font-ark-data text-ark-caption font-ark-bold text-ark-neutral-white before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-graphite before:ark-cut-tr-md">
      {label}
    </span>
  )
}

const meta = {
  title: '反馈/RewardGlow',
  component: RewardGlow,
  args: { children: <Item label="×200" /> },
  // 光会画到内容的盒子之外，四周留出位置
  decorators: [
    Story => (
      <div className="p-ark-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RewardGlow>

export default meta
type Story = StoryObj<typeof meta>

/** 物品背后一圈静态的放射光，标记一次正向的结果。默认是白光。 */
export const Default: Story = {}

/** 光的颜色预告稀有度：还没看清是什么，已经知道它有多稀有。 */
export const Tiers: Story = {
  render: () => (
    <div className="flex gap-ark-8">
      {([3, 4, 5, 6] as RewardGlowTier[]).map(tier => (
        <RewardGlow key={tier} tier={tier}>
          <Item label={`T${tier}`} />
        </RewardGlow>
      ))}
    </div>
  ),
}
