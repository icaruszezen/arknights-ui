import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateText } from './DateText'

const meta = {
  title: '排版与装饰/DateText',
  component: DateText,
  args: { value: '2026-10-03' },
  argTypes: { value: { control: 'text' } },
} satisfies Meta<typeof DateText>

export default meta
type Story = StoryObj<typeof meta>

/** 年和月之间双斜杠，月和日之间单斜杠。数据体，字距 1px。 */
export const Default: Story = {}

/** 颜色继承自所在的文字：新闻行里用次要文字色，标题旁可以用前景色。 */
export const InheritsColor: Story = {
  render: args => (
    <div className="grid gap-ark-3">
      <span className="text-ark-fg">
        <DateText {...args} />
      </span>
      <span className="text-ark-fg-muted">
        <DateText {...args} />
      </span>
      <span className="text-ark-signal-fg">
        <DateText {...args} />
      </span>
    </div>
  ),
}

/**
 * `YYYY-MM-DD` 开头的字符串按字面取年月日；`Date` 对象和时间戳按本地时区取。
 * 认不出来的值原样输出，不编造一个日期。
 */
export const Inputs: Story = {
  render: () => (
    <div className="grid gap-ark-3 text-ark-fg-secondary">
      <DateText value="2026-10-03" />
      <DateText value="2026-10-03T16:00:00+08:00" />
      <DateText value={new Date(2026, 8, 29)} />
      <DateText value="待定" />
    </div>
  ),
}
