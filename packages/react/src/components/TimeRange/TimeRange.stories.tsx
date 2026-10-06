import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyValue, KeyValueList } from '../KeyValue'
import { TimeRange } from './TimeRange'

const meta = {
  title: '场景/宣传物料/TimeRange',
  component: TimeRange,
  args: { from: '2026-10-03T16:00', to: '2026-10-17T03:59' },
} satisfies Meta<typeof TimeRange>

export default meta
type Story = StoryObj<typeof meta>

/** `MM月DD日 HH:MM - MM月DD日 HH:MM`：数字用数据体，“月”“日”跟着所在的文字。 */
export const Default: Story = {}

/** 字符串里没写时间时只输出日期。 */
export const DateOnly: Story = {
  args: { from: '2026-10-03', to: '2026-10-17' },
}

/** 跨年的活动把年份也写出来。 */
export const WithYear: Story = {
  args: { from: '2026-12-30T16:00', to: '2027-01-13T03:59', year: true },
}

/**
 * 字号、字重、颜色都继承自所在的文字。放进 `KeyValue` 当值时是粗体，
 * 最要紧的那一行换成主题色。
 */
export const InKeyValue: Story = {
  render: args => (
    <KeyValueList className="max-w-xl">
      <KeyValue label="活动时间" tone="signal">
        <TimeRange {...args} />
      </KeyValue>
      <KeyValue label="兑换时间">
        <TimeRange from="2026-10-03T16:00" to="2026-10-24T03:59" />
      </KeyValue>
    </KeyValueList>
  ),
}
