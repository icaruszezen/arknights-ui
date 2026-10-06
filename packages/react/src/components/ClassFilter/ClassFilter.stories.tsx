import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../../../.storybook/art'
import { type GlyphName, glyphs } from '../../../.storybook/glyphs'
import { Button } from '../Button'
import { OperatorCard } from '../OperatorCard'
import { ClassFilter, ClassFilterItem } from './ClassFilter'

// 职业的名称是通用的说法；图标是演示用的自绘几何图形，不对应官方的职业图标
const classes: { id: string; name: string; glyph: GlyphName }[] = [
  { id: 'vanguard', name: '先锋', glyph: 'chevrons' },
  { id: 'guard', name: '近卫', glyph: 'slashes' },
  { id: 'defender', name: '重装', glyph: 'shield' },
  { id: 'sniper', name: '狙击', glyph: 'target' },
  { id: 'caster', name: '术师', glyph: 'diamond' },
  { id: 'medic', name: '医疗', glyph: 'cross' },
  { id: 'supporter', name: '辅助', glyph: 'frame' },
  { id: 'specialist', name: '特种', glyph: 'peak' },
]

const meta = {
  title: '场景/干员/ClassFilter',
  component: ClassFilter,
  subcomponents: { ClassFilterItem },
  args: { defaultValue: 'all', 'aria-label': '职业' },
} satisfies Meta<typeof ClassFilter>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <>
    <ClassFilterItem value="all">全部</ClassFilterItem>
    {classes.map(item => (
      <ClassFilterItem key={item.id} value={item.id} icon={glyphs[item.glyph]}>
        {item.name}
      </ClassFilterItem>
    ))}
  </>
)

/**
 * 图标排成一排，当前项整块反白。Tab 进到选中项，左右方向键移动并立即切换。
 * 图标下面的名称不能省：只放图标就得让人猜。
 */
export const Default: Story = {
  render: args => <ClassFilter {...args}>{items}</ClassFilter>,
}

/** 放不下时横向滚动，而不是把每一项缩小到看不清。 */
export const Overflow: Story = {
  render: args => (
    <div className="w-72">
      <ClassFilter {...args}>{items}</ClassFilter>
    </div>
  ),
}

/**
 * 干员列表的顶栏：左边是职业筛选，右边是排序方式与升降序。
 * 排序不属于筛选，用普通的按钮和它并排。
 */
export const WithList: Story = {
  render: function OperatorList() {
    const [current, setCurrent] = useState('all')
    const [descending, setDescending] = useState(true)
    const operators = classes.flatMap((item, index) =>
      current === 'all' || current === item.id
        ? [{ ...item, level: 90 - index * 7, rarity: (6 - (index % 3)) as 4 | 5 | 6 }]
        : [],
    )
    const sorted = descending ? operators : [...operators].reverse()
    return (
      <div className="grid gap-ark-4">
        <div className="flex flex-wrap items-center justify-between gap-ark-4">
          <ClassFilter aria-label="职业" value={current} onValueChange={setCurrent}>
            {items}
          </ClassFilter>
          <Button sub="LEVEL" onClick={() => setDescending(!descending)}>
            {descending ? '等级 · 降序' : '等级 · 升序'}
          </Button>
        </div>
        <ul className="m-0 flex list-none gap-ark-1 overflow-x-auto p-0">
          {sorted.map(operator => (
            <li key={operator.id}>
              <OperatorCard
                src={figure()}
                rarity={operator.rarity}
                classIcon={glyphs[operator.glyph]}
                level={operator.level}
                elite={2}
                className="w-32"
              >
                {`${operator.name}干员`}
              </OperatorCard>
            </li>
          ))}
        </ul>
      </div>
    )
  },
}
