import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Stat } from '../Stat'
import { Tag } from '../Tag'
import { Timeline, TimelineItem } from './Timeline'

const meta = {
  title: '数据展示/Timeline',
  component: Timeline,
  subcomponents: { TimelineItem },
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 只展示：一列带时间的条目。每一格一条短线接一个数字，两格之间夹着更短的分格——
 * 读起来像量具上的读数。
 */
export const Default: Story = {
  args: { 'aria-label': '更新记录' },
  render: args => (
    <Timeline {...args} className="w-96 max-w-full">
      <TimelineItem label="10 / 14">
        <b className="font-ark-bold">新增表单控件</b>
        <p className="m-0 mt-ark-1 text-ark-caption text-ark-fg-muted">
          分段选项、开关、滑条、数量步进器、下拉
        </p>
      </TimelineItem>
      <TimelineItem label="10 / 08">
        <b className="font-ark-bold">整屏示例随画布缩放</b>
        <p className="m-0 mt-ark-1 text-ark-caption text-ark-fg-muted">按官网竖屏重排骨架</p>
      </TimelineItem>
      <TimelineItem label="10 / 06">
        <b className="font-ark-bold">首个版本</b>
        <div className="mt-ark-2 flex gap-ark-2">
          <Tag>tokens</Tag>
          <Tag>21 个组件</Tag>
        </div>
      </TimelineItem>
    </Timeline>
  ),
}

const months = Array.from({ length: 8 }, (_, index) => String(index + 1).padStart(2, '0'))
const empty = new Set(['03', '06'])

/**
 * 可以选：当前的那一格变成信号色并放大，没有内容的格子变灰、不能选。
 * 官网图集页按月份翻图的写法；方向键在各格之间移动并选中。
 */
export const Selectable: Story = {
  render: function Render() {
    const [month, setMonth] = useState('05')
    return (
      <div className="flex gap-ark-7">
        <div className="grid content-start gap-ark-4">
          <span className="font-ark-latin-wide text-ark-body-lg font-ark-bold text-ark-signal-fg">
            TIMELINE
          </span>
          <Timeline aria-label="月份" value={month} onValueChange={setMonth}>
            {months.map(value => (
              <TimelineItem key={value} value={value} label={value} disabled={empty.has(value)} />
            ))}
          </Timeline>
        </div>
        <Stat label="Month" value={month} size="lg" color="signal" />
      </div>
    )
  },
}
