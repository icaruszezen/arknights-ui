import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from '../Divider'
import { Panel } from '../Panel'
import { Counter, Serial } from './Counter'

const meta = {
  title: '排版与装饰/Counter',
  component: Counter,
  subcomponents: { Serial },
  args: { value: 1, total: 5, label: 'INFORMATION' },
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 官网右栏的写法：一个大号信号色数字，后面是“当前 / 总数”和栏目的英文名。
 * 它告诉用户现在在第几屏、一共几屏。
 */
export const Default: Story = {}

/** 小号：全部排成一行，用在轮播、列表项这类地方。 */
export const Small: Story = {
  args: { size: 'sm', value: 3, total: 12, label: undefined },
}

/** 右栏：一条竖线隔出窄栏，计数最先更新，让用户第一时间知道到了哪一屏。 */
export const InSideRail: Story = {
  render: args => (
    <div className="flex h-48 w-fit gap-ark-5">
      <Divider orientation="vertical" variant="fade" start="bar" />
      <Counter {...args} className="self-start" />
    </div>
  ),
}

/** 放进纸白面板时，信号色的大数字压暗以保证对比度。 */
export const OnPaper: Story = {
  render: args => (
    <Panel tone="paper" className="w-fit">
      <Counter {...args} />
    </Panel>
  ),
}

/** 序号：`NO.` 加补零的数字，`VOL.` 加不补零的数字。颜色继承自所在的文字。 */
export const SerialNumbers: Story = {
  render: () => (
    <div className="flex items-baseline gap-ark-6 text-ark-fg-muted">
      <Serial prefix="NO." value={147} pad={4} />
      <Serial prefix="VOL." value={69} />
      <Serial prefix="LOT " value="0011-7777" className="text-ark-fg" />
    </div>
  ),
}
