import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { OperatorCard } from '../OperatorCard'
import { Tab, TabList, Tabs } from '../Tabs'
import { SquadSlot } from './SquadSlot'

const meta = {
  title: '场景/作战/SquadSlot',
  component: SquadSlot,
} satisfies Meta<typeof SquadSlot>

export default meta
type Story = StoryObj<typeof meta>

// 占位用的几何剪影，代码画的，不是官方立绘
const roster = [
  { id: 'a', name: '占位干员甲', rarity: 6, glyph: glyphs.shield, body: '#9aa3a8' },
  { id: 'b', name: '占位干员乙', rarity: 5, glyph: glyphs.chevrons, body: '#a39a8f' },
  { id: 'c', name: '占位干员丙', rarity: 5, glyph: glyphs.target, body: '#8f9aa3' },
  { id: 'd', name: '占位干员丁', rarity: 4, glyph: glyphs.cross, body: '#a09aa8' },
] as const

const card = (operator: (typeof roster)[number]) => (
  <OperatorCard
    src={figure(operator.body)}
    rarity={operator.rarity}
    classIcon={operator.glyph}
    level={80}
    elite={2}
  >
    {operator.name}
  </OperatorCard>
)

/** 空位：一个带加号的虚线框，和干员卡片一样大。给了 `onAdd` 它就是一个按钮。 */
export const Empty: Story = {
  args: { onAdd: () => {} },
}

/** 放了卡片的位置。卡片被撑满到位置的大小，改位置的宽度，卡片跟着变。 */
export const Filled: Story = {
  render: args => <SquadSlot {...args}>{roster[0] && card(roster[0])}</SquadSlot>,
}

/**
 * 编队：干员卡片横向排列，空位夹在其中，整排的节奏不断。多个编队用顶部的编号标签切换。
 * 点空位补一名干员。
 */
export const Squad: Story = {
  render: function SquadEditor() {
    const [squad, setSquad] = useState('01')
    const [count, setCount] = useState(2)
    return (
      <div className="grid gap-ark-4">
        <Tabs
          value={squad}
          onValueChange={next => {
            setSquad(next)
            setCount(next === '01' ? 2 : 1)
          }}
        >
          <TabList aria-label="编队">
            <Tab value="01">01</Tab>
            <Tab value="02">02</Tab>
            <Tab value="03">03</Tab>
          </TabList>
        </Tabs>
        <ul className="m-0 flex list-none gap-ark-1 p-0">
          {roster.map((operator, index) => (
            <li key={operator.id} className="flex">
              <SquadSlot
                className="w-32"
                onAdd={() => setCount(Math.min(count + 1, roster.length))}
              >
                {index < count ? card(operator) : null}
              </SquadSlot>
            </li>
          ))}
        </ul>
      </div>
    )
  },
}
