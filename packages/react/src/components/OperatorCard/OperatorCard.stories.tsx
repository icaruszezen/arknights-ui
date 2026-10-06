import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { OperatorCard, type OperatorRarity } from './OperatorCard'

// 占位用的几何剪影，代码画的，不是官方立绘
const art = figure()

const meta = {
  title: '场景/干员/OperatorCard',
  component: OperatorCard,
  args: {
    children: '干员代号',
    src: art,
    rarity: 6,
    classIcon: glyphs.shield,
    level: 90,
    elite: 2,
  },
} satisfies Meta<typeof OperatorCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 信息压在卡片四角：左上职业图标，右上星级，左下等级与精英化阶段，底部代号。
 * 下半部的黑色渐变保证白字读得清。立绘和图标都是代码画的占位图。
 */
export const Default: Story = {}

/** 稀有度双重编码：星星的数量，加卡片底边的颜色条。去掉任何一种，信息仍然完整。 */
export const Rarities: Story = {
  render: args => (
    <ul className="m-0 flex list-none gap-ark-1 p-0">
      {([6, 5, 4, 3, 2, 1] as OperatorRarity[]).map(rarity => (
        <li key={rarity}>
          <OperatorCard
            src={args.src}
            classIcon={args.classIcon}
            rarity={rarity}
            level={30 + rarity * 10}
            elite={rarity > 3 ? 2 : rarity > 2 ? 1 : 0}
            className="w-32"
          >
            干员代号
          </OperatorCard>
        </li>
      ))}
    </ul>
  ),
}

/**
 * 干员列表：卡片横向排开，之间只留 4px 的缝。给了 `onClick` 的卡片是按钮，
 * 悬停时立绘恢复饱和度、代号变成信号色；选中的一张内侧多一圈信号色描边。
 */
export const Selectable: Story = {
  render: function OperatorList() {
    const [current, setCurrent] = useState('b')
    const operators = [
      { id: 'a', name: '占位干员甲', rarity: 6, icon: glyphs.shield, body: '#9aa3a8' },
      { id: 'b', name: '占位干员乙', rarity: 5, icon: glyphs.chevrons, body: '#a39a8f' },
      { id: 'c', name: '占位干员丙', rarity: 5, icon: glyphs.target, body: '#8f9aa3' },
      { id: 'd', name: '占位干员丁', rarity: 4, icon: glyphs.cross, body: '#a09aa8' },
    ] as const
    return (
      <ul className="m-0 flex list-none gap-ark-1 p-0">
        {operators.map(operator => (
          <li key={operator.id}>
            <OperatorCard
              src={figure(operator.body)}
              rarity={operator.rarity}
              classIcon={operator.icon}
              level={80}
              elite={2}
              selected={operator.id === current}
              onClick={() => setCurrent(operator.id)}
            >
              {operator.name}
            </OperatorCard>
          </li>
        ))}
      </ul>
    )
  },
}

/** 英文名写在代号下面。 */
export const WithSub: Story = {
  args: { sub: 'Codename' },
}

/** 没有立绘时只剩石墨底，信息的位置不变。 */
export const WithoutPortrait: Story = {
  args: { src: undefined },
}

/** 传入 `href` 时整张卡片是链接。 */
export const AsLink: Story = {
  args: { href: '#operator' },
}
