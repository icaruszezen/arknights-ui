import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat } from './Stat'

const meta = {
  title: '数据展示/Stat',
  component: Stat,
  args: { label: 'Sanity', value: 131, max: 135 },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

/** 当前值 / 上限：当前值大而亮，分母小而灰。 */
export const WithMax: Story = {}

/** 数字自动加千分位逗号。 */
export const Thousands: Story = {
  args: { label: 'LMD', value: 128400, max: undefined },
}

/** 编号：补前导零并带总数。信号色只用在这种需要点睛的数字上。 */
export const Counter: Story = {
  args: { label: 'Information', value: 1, max: 5, pad: 2, tone: 'signal', size: 'lg' },
}

export const WithUnit: Story = {
  args: { label: 'Cost', value: 18, max: undefined, unit: '理智' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-ark-7">
      <Stat label="Level" value={90} size="sm" />
      <Stat label="Sanity" value={131} max={135} />
      <Stat label="Cost" value={99} size="lg" />
    </div>
  ),
}

/** 属性表：左标签、右数值，行间只用 1px 细线。 */
export const AttributeTable: Story = {
  render: () => (
    <div className="grid w-64 divide-y divide-ark-rule">
      {[
        ['生命上限', 2480],
        ['攻击', 615],
        ['防御', 402],
        ['法术抗性', 10],
      ].map(([label, value]) => (
        <Stat
          key={label}
          label={label}
          value={value as number}
          size="sm"
          orientation="horizontal"
          className="py-ark-2"
        />
      ))}
    </div>
  ),
}
