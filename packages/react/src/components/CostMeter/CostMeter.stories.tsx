import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { CostMeter } from './CostMeter'

const meta = {
  title: '场景/作战/CostMeter',
  component: CostMeter,
  args: { value: 23, progress: 0.65, deployable: 6 },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof CostMeter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 费用是整屏最大的数字。上方的细条是下一点费用的回复进度，再上面一行小字写剩余可部署数。
 * 底板左边是一条 45° 的斜边。
 */
export const Default: Story = {}

/** 只有数字的最简写法。 */
export const Minimal: Story = {
  args: { progress: undefined, deployable: undefined },
}

/**
 * 费用每秒回复一点：细条走满，数字加一。数字等宽，变化时宽度不跳。
 * 这里的计时写在 Story 里，组件本身只负责显示。
 */
export const Recovering: Story = {
  render: function Recovery(args) {
    const [tick, setTick] = useState(0)
    useEffect(() => {
      const timer = setInterval(() => setTick(count => (count + 1) % 990), 100)
      return () => clearInterval(timer)
    }, [])
    return <CostMeter {...args} value={Math.floor(tick / 10)} progress={(tick % 10) / 10} />
  },
}
