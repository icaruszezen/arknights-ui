import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Panel } from '../Panel'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { Countdown } from './Countdown'

const meta = {
  title: '场景/基建/Countdown',
  component: Countdown,
  args: { seconds: 8076 },
} satisfies Meta<typeof Countdown>

export default meta
type Story = StoryObj<typeof meta>

/** 给 `seconds` 只是把一个数写成 `HH:MM:SS`，不自己走。 */
export const Default: Story = {}

/**
 * 给 `to` 就每秒自己走，走到零停住并调用 `onDone`。数字等宽，走的时候宽度不变。
 * 读屏不会每秒念一遍。
 */
export const Live: Story = {
  render: function LiveCountdown() {
    const [target, setTarget] = useState(() => Date.now() + 15_000)
    const [done, setDone] = useState(false)
    return (
      <div className="grid justify-items-start gap-ark-4">
        <Countdown to={target} onDone={() => setDone(true)} className="text-ark-h1 font-ark-bold" />
        <Button
          onClick={() => {
            setDone(false)
            setTarget(Date.now() + 15_000)
          }}
        >
          {done ? '已结束 · 重新开始' : '重新开始'}
        </Button>
      </div>
    )
  },
}

/** 超过一天的部分折进小时里；想写成“几天几小时”就给 `format`。 */
export const Format: Story = {
  render: () => {
    const seconds = 2 * 86400 + 3 * 3600 + 5 * 60 + 9
    return (
      <div className="grid gap-ark-3 text-ark-body-lg">
        <Countdown seconds={seconds} />
        <Countdown
          seconds={seconds}
          format={({ days, hours }) => `${days}天${hours}小时`}
          className="font-ark-cjk-sans"
        />
      </div>
    )
  },
}

/**
 * 字号和颜色继承自所在的文字。制造站的详情里，它是“剩余时间”那个数：
 * 放进 `Stat` 的 `value`。
 */
export const InPanel: Story = {
  render: () => (
    <Panel className="grid w-72 gap-ark-4">
      <Progress aria-label="制造进度" variant="thick" tone="action" value={62} segments={5} />
      <Stat
        label="Remaining"
        value={<Countdown seconds={8076} />}
        size="sm"
        orientation="horizontal"
      />
    </Panel>
  ),
}
