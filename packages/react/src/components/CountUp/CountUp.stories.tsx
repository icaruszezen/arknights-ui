import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { CountUp } from './CountUp'

const meta = {
  title: '动效/CountUp',
  component: CountUp,
  args: { value: 128400, className: 'text-ark-display font-ark-bold' },
} satisfies Meta<typeof CountUp>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 从 0 数到目标值，1 秒，起步干脆、收尾平缓。数字自动加千分位。
 * 切到别的 Story 再切回来可以重看。
 */
export const Default: Story = {}

/** 补前导零：编号、序号这类位数固定的数字。 */
export const Padded: Story = {
  args: { value: 147, pad: 4 },
}

/** `format` 自己决定写法：收到的是没有取整的中间值，可以保留小数、加单位。 */
export const Formatted: Story = {
  args: { value: 98.6, format: value => `${value.toFixed(1)}%` },
}

/**
 * 直接放进 `Stat` 的 `value`：数字是主角，滚动的也应该是它。
 * `value` 变化时从当前显示的数接着滚过去，不会跳回 0。
 */
export const InStat: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: function Sanity() {
    const [sanity, setSanity] = useState(131)
    return (
      <Panel className="grid w-72 gap-ark-5">
        <Stat label="Sanity" value={<CountUp value={sanity} />} max={135} />
        <div className="flex gap-ark-2">
          <Button onClick={() => setSanity(Math.max(sanity - 18, 0))}>行动 -18</Button>
          <Button onClick={() => setSanity(135)}>恢复</Button>
        </div>
      </Panel>
    )
  },
}

/** `trigger="visible"`：滚进视口才开始数。往下滚动这个框。 */
export const OnVisible: Story = {
  render: args => (
    <section
      aria-label="滚动查看数字"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: 可滚动的区域要能聚焦，键盘才滚得动它
      tabIndex={0}
      className="h-48 w-96 overflow-y-auto border border-ark-rule p-ark-4"
    >
      <p className="m-0 h-64 text-ark-label text-ark-fg-muted">往下滚动 ↓</p>
      <CountUp {...args} trigger="visible" />
    </section>
  ),
}
