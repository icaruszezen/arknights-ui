import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyValue, KeyValueList } from '../KeyValue'
import { Panel } from '../Panel'
import { Rating } from '../Rating'
import { Tag } from '../Tag'
import { Codename } from './Codename'

const meta = {
  title: '场景/干员/Codename',
  component: Codename,
  args: { children: '干员代号', sub: 'Codename' },
} satisfies Meta<typeof Codename>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 英文名小字在上，中文代号 Heavy 在下，字距收紧到 -0.1em。
 * 没有加载思源黑体 Heavy 时回退到系统黑体最粗的一档，比例不变。
 */
export const Default: Story = {}

export const Sizes: Story = {
  render: args => (
    <div className="grid justify-items-start gap-ark-6">
      <Codename {...args} size="sm" />
      <Codename {...args} size="md" />
      <Codename {...args} size="lg" />
    </div>
  ),
}

/**
 * 游戏内干员详情页的写法：中文代号是宋体 Heavy、不收字距，上面的英文名大小写混排、常规字重，
 * 再上面是一排白色的星。需要加载思源宋体或 Noto Serif SC 的 Heavy 字重才有“重磅”的效果。
 */
export const Serif: Story = {
  args: { serif: true, size: 'lg', sub: 'Codename' },
  render: args => (
    <div className="grid justify-items-start gap-ark-2">
      <Rating value={6} className="text-ark-neutral-white" />
      <Codename {...args} />
    </div>
  ),
}

/**
 * 官网干员屏量出来的是另一种写法：中文名 Bold、不收字距。
 * 用 `className` 覆盖字重和字距就行，大小关系（1.25rem : 3.75rem）不变。
 */
export const Website: Story = {
  args: { size: 'lg', className: 'font-ark-bold tracking-ark-normal' },
}

/**
 * 干员介绍图是一份“简历”：代号 Heavy 收字距，简略信息用普通字重、左右结构。
 * 配色只用黑白灰，一个亮色点出重点。
 */
export const Resume: Story = {
  render: args => (
    <Panel tone="paper" className="grid w-96 gap-ark-4">
      <Rating value={6} shape="diamond" />
      <Codename {...args} />
      <div className="flex gap-ark-2">
        <Tag variant="solid" cut>
          近卫
        </Tag>
        <Tag>输出</Tag>
      </div>
      <KeyValueList className="gap-y-0 text-ark-label">
        {(
          [
            ['所属', '罗德岛'],
            ['出身地', '未公开'],
            ['专长', '机械维修'],
          ] as const
        ).map(([label, value]) => (
          <KeyValue key={label} label={label} className="border-t border-ark-rule py-ark-2">
            {value}
          </KeyValue>
        ))}
      </KeyValueList>
    </Panel>
  ),
}
