import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { DeployCard } from './DeployCard'

// 占位用的几何剪影，代码画的，不是官方头像
const art = figure()

const meta = {
  title: '场景/作战/DeployCard',
  component: DeployCard,
  args: { label: '占位干员甲', cost: 12, src: art, classIcon: glyphs.shield },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof DeployCard>

export default meta
type Story = StoryObj<typeof meta>

/** 顶部并排两格：浅灰底的职业图标，黑底的费用。卡面上没有名字，名字只给读屏。 */
export const Default: Story = {}

/** 状态用明暗和数字表达：选中上浮加描边；费用不足变暗、数字变灰；冷却时盖上倒计时。 */
export const States: Story = {
  render: args => (
    <div className="flex items-end gap-ark-4">
      <DeployCard {...args} />
      <DeployCard {...args} selected />
      <DeployCard {...args} cost={32} insufficient />
      <DeployCard {...args} cooldown={18} />
    </div>
  ),
}

/**
 * 底部的卡带：卡片底边对齐，之间只留 4px 的缝。点一张选中它，再点一次取消。
 * 当前费用是 20，比它贵的卡自动压暗。
 */
export const Tray: Story = {
  render: function DeployTray() {
    const [selected, setSelected] = useState<string | null>('d')
    const budget = 20
    const cards = [
      { id: 'a', cost: 12, glyph: glyphs.chevrons, body: '#9aa3a8' },
      { id: 'b', cost: 19, glyph: glyphs.shield, body: '#a39a8f' },
      { id: 'c', cost: 21, glyph: glyphs.target, body: '#8f9aa3' },
      { id: 'd', cost: 9, glyph: glyphs.slashes, body: '#a09aa8' },
      { id: 'e', cost: 14, glyph: glyphs.cross, body: '#9aa39a', cooldown: 17 },
      { id: 'f', cost: 32, glyph: glyphs.diamond, body: '#a3a09a' },
    ]
    return (
      <ul className="m-0 flex list-none items-end gap-ark-1 p-0 pt-ark-3">
        {cards.map((card, index) => (
          <li key={card.id} className="flex">
            <DeployCard
              label={`占位干员 ${index + 1}`}
              cost={card.cost}
              src={figure(card.body)}
              classIcon={card.glyph}
              cooldown={card.cooldown}
              insufficient={card.cost > budget}
              selected={card.id === selected}
              onClick={() => setSelected(card.id === selected ? null : card.id)}
            />
          </li>
        ))}
      </ul>
    )
  },
}
