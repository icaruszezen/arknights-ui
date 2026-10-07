import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { ActionButton } from './ActionButton'

const meta = {
  title: '按钮/ActionButton',
  component: ActionButton,
  args: { children: '开始行动', cost: -18, costLabel: 'SANITY', sub: 'MISSION START' },
} satisfies Meta<typeof ActionButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 上下两块拼合：上面一块主色写动作，下面一条深色带写代价（实机“开始行动”的写法）。
 * 点了会花掉什么，直接印在按钮上。
 */
export const Default: Story = {}

/** 代价的标签可以省略，只留一个数字。 */
export const CostOnly: Story = {
  args: { costLabel: undefined, sub: undefined },
}

/** 左右拼合：左边一块深色写代价，右边一块主色写动作。高度放不下两行时用。 */
export const Inline: Story = {
  args: { layout: 'inline' },
}

/**
 * 实机的配色：把信号色换成游戏里的蓝，主色块上的字换成白色。
 * 白字压在这个蓝上是 3.2:1，只够大号粗体用，所以不是默认值。
 */
export const GameBlue: Story = {
  args: {
    sub: undefined,
    style: {
      '--ark-signal': 'var(--ark-color-signal-info-deep)',
      '--ark-on-signal': 'var(--ark-color-neutral-white)',
    } as CSSProperties,
  },
}

/**
 * 两个行动按钮并排时，次要的那个用浅色块，主要的那个才用主色。
 * 十连更醒目：在它身上把信号色换成行动黄。
 */
export const Pair: Story = {
  render: () => (
    <div className="flex gap-ark-2">
      <ActionButton variant="paper" cost={600} costLabel="合成玉" sub="HEADHUNT ×1">
        寻访一次
      </ActionButton>
      <ActionButton
        cost={6000}
        costLabel="合成玉"
        sub="HEADHUNT ×10"
        style={{ '--ark-signal': 'var(--ark-color-signal-action)' } as CSSProperties}
      >
        寻访十次
      </ActionButton>
    </div>
  ),
}

/** 禁用时主色块变灰，代价带上的字也压暗。 */
export const States: Story = {
  render: () => (
    <div className="grid w-fit gap-ark-4">
      <ActionButton cost={-18} costLabel="SANITY" sub="MISSION START">
        开始行动
      </ActionButton>
      <ActionButton cost={-18} costLabel="SANITY" sub="MISSION START" disabled>
        开始行动
      </ActionButton>
      <ActionButton cost={-18} costLabel="SANITY" sub="MISSION START" variant="paper">
        开始行动
      </ActionButton>
    </div>
  ),
}

/** 撑满容器：关卡详情面板底部的那个按钮。 */
export const Block: Story = {
  args: { block: true },
  render: args => (
    <div className="w-96">
      <ActionButton {...args} />
    </div>
  ),
}

/** 传入 `href` 时渲染为链接。 */
export const AsLink: Story = {
  args: {
    href: 'https://github.com/icaruszezen/arknights-ui',
    cost: 'MIT',
    costLabel: 'LICENSE',
    children: '查看仓库',
    sub: 'REPOSITORY',
  },
}
