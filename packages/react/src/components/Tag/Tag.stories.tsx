import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Panel } from '../Panel'
import { Tag } from './Tag'

const meta = {
  title: '数据展示/Tag',
  component: Tag,
  args: { children: '只读' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/** 默认是中性标签：灰底，中性信息。 */
export const Neutral: Story = {}

/** 实心：反色块，留给最要紧的属性。 */
export const Solid: Story = {
  args: { variant: 'solid', children: '管理员' },
}

/** 描边：字和边同色，次要属性。 */
export const Outline: Story = {
  args: { variant: 'outline', color: 'signal', children: '在线' },
}

/** 靠实心 / 描边 / 灰底区分主次，而不只是颜色。 */
export const Group: Story = {
  render: () => (
    <div className="flex items-center gap-ark-2">
      <Tag variant="solid">管理员</Tag>
      <Tag variant="outline">已验证</Tag>
      <Tag>只读</Tag>
    </div>
  ),
}

/** 五种颜色。实心的黄和绿上压黑字，红上压白字；描边的在浅色面上会压暗。 */
export const Colors: Story = {
  render: () => (
    <div className="grid gap-ark-3">
      {(['solid', 'outline'] as const).map(variant => (
        <div key={variant} className="flex items-center gap-ark-2">
          <Tag variant={variant}>默认</Tag>
          <Tag variant={variant} color="signal">
            进行中
          </Tag>
          <Tag variant={variant} color="success">
            已完成
          </Tag>
          <Tag variant={variant} color="warning">
            待处理
          </Tag>
          <Tag variant={variant} color="danger">
            已停用
          </Tag>
        </div>
      ))}
    </div>
  ),
}

/** 圆头的小标签写一个字段的名字或一个状态；切角是可选的点缀；末尾可以带移除按钮。 */
export const Shapes: Story = {
  render: function Render() {
    const [filters, setFilters] = useState(['本月', '已完成', '全部成员'])
    return (
      <div className="grid gap-ark-3">
        <div className="flex items-center gap-ark-2">
          <Tag pill>时间</Tag>
          <Tag pill variant="solid" color="signal" size="sm">
            NEW
          </Tag>
          <Tag variant="solid" cut>
            切角
          </Tag>
          <Tag size="sm">小号</Tag>
        </div>
        <div className="flex items-center gap-ark-2">
          {filters.map(filter => (
            <Tag key={filter} onRemove={() => setFilters(list => list.filter(f => f !== filter))}>
              {filter}
            </Tag>
          ))}
        </div>
      </div>
    )
  },
}

/** 放进反色面：实心标签跟着翻成另一种明暗。 */
export const OnInverse: Story = {
  render: () => (
    <Panel tone="inverse" className="flex w-fit items-center gap-ark-2">
      <Tag variant="solid">当前</Tag>
      <Tag>只读</Tag>
      <span className="text-ark-label text-ark-fg-secondary">全部完成</span>
    </Panel>
  ),
}
