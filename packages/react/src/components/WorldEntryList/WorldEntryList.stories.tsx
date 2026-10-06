import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
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
 * 官网“设定”屏的条目：纵向排列，左缩进逐条递增。悬停任一条：文字变成信号色并向右位移，
 * 背后浮现一行 25% 信号色的巨型英文。用键盘聚焦也是一样。
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

/** 每一级缩进由 `--ark-entry-step` 决定，设成 0 就是一条直线。 */
export const Step: Story = {
  render: args => (
    <div className="grid max-w-4xl grid-cols-2 gap-ark-7">
      {(['3.5rem', '0rem'] as const).map(step => (
        <WorldEntryList
          {...args}
          key={step}
          aria-label={`缩进 ${step}`}
          style={{ '--ark-entry-step': step } as CSSProperties}
        >
          {entries.slice(0, 4).map(entry => (
            <WorldEntry key={entry.id} href={`#${entry.id}`} sub={entry.en}>
              {entry.zh}
            </WorldEntry>
          ))}
        </WorldEntryList>
      ))}
    </div>
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
