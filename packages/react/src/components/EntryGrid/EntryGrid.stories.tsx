import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { EntryPanel, type EntryPanelProps } from '../EntryPanel'
import { TiltGroup } from '../TiltGroup'
import { EntryGrid } from './EntryGrid'

const meta = {
  title: '场景/主界面/EntryGrid',
  component: EntryGrid,
} satisfies Meta<typeof EntryGrid>

export default meta
type Story = StoryObj<typeof meta>

// 右上角的数值：面板是按钮，里面只放行内元素
const sanity = (
  <>
    <span className="font-ark-data text-ark-h2 leading-ark-solid font-ark-bold">
      131
      <span className="text-ark-caption font-ark-regular text-ark-fg-muted">/135</span>
    </span>
    <span className="mt-ark-1 font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted">
      SANITY
    </span>
  </>
)

type System = { id: string; zh: string; en: string } & Pick<
  EntryPanelProps,
  'tone' | 'aside' | 'watermark' | 'badge' | 'badgeLabel'
>

// 按重要程度排：第一个最大，越往后越小
const systems: System[] = [
  {
    id: 'terminal',
    zh: '作战',
    en: 'Terminal',
    tone: 'paper',
    aside: sanity,
    watermark: glyphs.peak,
  },
  { id: 'squads', zh: '编队', en: 'Squads' },
  { id: 'operator', zh: '干员', en: 'Operator' },
  { id: 'store', zh: '采购中心', en: 'Store', tone: 'paper' },
  { id: 'recruit', zh: '公开招募', en: 'Recruit' },
  { id: 'headhunt', zh: '干员寻访', en: 'Headhunt' },
  { id: 'mission', zh: '任务', en: 'Mission', badge: true, badgeLabel: '有可领取的奖励' },
  { id: 'base', zh: '基建', en: 'Base' },
  { id: 'depot', zh: '仓库', en: 'Depot' },
]

// 入口必须是 EntryGrid 的直接子元素（数组可以，包一层 Fragment 就只算一个）
const entries = (list: System[]) =>
  list.map(({ id, zh, en, ...props }) => (
    <EntryPanel key={id} sub={en} {...props}>
      {zh}
    </EntryPanel>
  ))

/**
 * 主界面右面板组的四行：一、二、三、三。作战最大、最亮，面积和亮度直接对应优先级。
 * 入口的字号跟着所在的行走，不用逐个指定。竖屏时改成一列。
 */
export const Default: Story = {
  render: args => (
    <EntryGrid {...args} className="w-[32rem]">
      {entries(systems)}
    </EntryGrid>
  ),
}

/**
 * 它只管拼合。需要“画内界面”那种倾斜时在外面套一个 `TiltGroup`：
 * 只有整组倾斜，里面的面板和文字保持正交。
 */
export const Tilted: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: args => (
    <div className="flex justify-end pr-ark-7">
      <TiltGroup side="right" sway className="w-[32rem]">
        <EntryGrid {...args}>{entries(systems)}</EntryGrid>
      </TiltGroup>
    </div>
  ),
}

/** `rows` 改每一行的个数。这里是二、四：两个主要入口并排，其余四个一行。 */
export const CustomRows: Story = {
  args: { rows: [2, 4] },
  render: args => (
    <EntryGrid {...args} className="w-[40rem]">
      {entries(
        systems.filter(system =>
          ['terminal', 'headhunt', 'squads', 'operator', 'base', 'depot'].includes(system.id),
        ),
      )}
    </EntryGrid>
  ),
}
