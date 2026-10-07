import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorldEntry, WorldEntryList } from './WorldEntryList'

// 世界观里的通用名词，只借来演示版式
const entries = [
  { id: 'originium', zh: '源石', en: 'ORIGINIUM' },
  { id: 'arts', zh: '源石技艺', en: 'ORIGINIUM ARTS' },
  { id: 'infected', zh: '感染者', en: 'INFECTED' },
  { id: 'nomadic', zh: '移动城市', en: 'NOMADIC CITY' },
  { id: 'catastrophe', zh: '天灾', en: 'CATASTROPHE' },
  { id: 'reunion', zh: '整合运动', en: 'REUNION' },
]

const meta = {
  title: '场景/官网/WorldEntryList',
  component: WorldEntryList,
  subcomponents: { WorldEntry },
} satisfies Meta<typeof WorldEntryList>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 官网“设定”屏的条目：纵向排列，左缘对齐，中文和英文在同一行。入场时逐条自左滑入，
 * 每条晚 200ms（刷新这个示例可以重看）。悬停任一条：文字从灰变白并向右位移，
 * 背后贴着右端浮现一行 25% 信号色的巨型英文。用键盘聚焦也是一样。
 */
export const Default: Story = {
  render: args => (
    <WorldEntryList {...args} aria-label="设定" className="max-w-2xl">
      {entries.map(entry => (
        <WorldEntry key={entry.id} href={`#${entry.id}`} sub={entry.en}>
          {entry.zh}
        </WorldEntry>
      ))}
    </WorldEntryList>
  ),
}

/** `stagger={false}` 关掉入场，条目直接出现。 */
export const WithoutEntrance: Story = {
  args: { stagger: false },
  render: args => (
    <WorldEntryList {...args} aria-label="设定" className="max-w-2xl">
      {entries.slice(0, 4).map(entry => (
        <WorldEntry key={entry.id} href={`#${entry.id}`} sub={entry.en}>
          {entry.zh}
        </WorldEntry>
      ))}
    </WorldEntryList>
  ),
}

/** 不是链接时没有悬停反馈，只是一组排好版的名词。 */
export const Static: Story = {
  render: args => (
    <WorldEntryList {...args} className="max-w-xl">
      {entries.slice(0, 3).map(entry => (
        <WorldEntry key={entry.id} sub={entry.en}>
          {entry.zh}
        </WorldEntry>
      ))}
    </WorldEntryList>
  ),
}
