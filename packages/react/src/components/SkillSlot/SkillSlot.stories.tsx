import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { glyphs } from '../../../.storybook/glyphs'
import { SkillSlot } from './SkillSlot'

const meta = {
  title: '场景/干员/SkillSlot',
  component: SkillSlot,
  args: { children: glyphs.chevrons, rank: 'RANK 7' },
} satisfies Meta<typeof SkillSlot>

export default meta
type Story = StoryObj<typeof meta>

/** 黑色半透明方块 + 1px 细描边。图形是演示用的自绘几何图形。 */
export const Default: Story = {}

/** 当前选中的那一格：右上角一块信号色的三角加对勾，描边换成信号色，左下角的小字跟着变色。 */
export const Selected: Story = {
  args: { selected: true, rank: 'M3' },
}

/**
 * 干员详情页右下角的三格技能。给了 `onClick` 的格子是按钮，点一下换选中项。
 * 每个按钮用 `label` 说明是哪个技能，它只给读屏。
 */
export const Group: Story = {
  render: function SkillGroup() {
    const [current, setCurrent] = useState(2)
    const skills = [
      { glyph: glyphs.chevrons, rank: 'RANK 7' },
      { glyph: glyphs.slashes, rank: 'RANK 7' },
      { glyph: glyphs.target, rank: 'M3' },
    ]
    return (
      <div className="flex gap-ark-2">
        {skills.map((skill, index) => (
          <SkillSlot
            // biome-ignore lint/suspicious/noArrayIndexKey: 技能的顺序是固定的
            key={index}
            label={`技能 ${index + 1}`}
            rank={skill.rank}
            selected={index === current}
            onClick={() => setCurrent(index)}
          >
            {skill.glyph}
          </SkillSlot>
        ))}
      </div>
    )
  },
}

/** 禁用的格子（尚未解锁的技能）压暗，不响应悬停。 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-ark-2">
      <SkillSlot label="技能 1" rank="RANK 4" onClick={() => {}}>
        {glyphs.chevrons}
      </SkillSlot>
      <SkillSlot label="技能 2（未解锁）" onClick={() => {}} disabled>
        {glyphs.slashes}
      </SkillSlot>
    </div>
  ),
}

/** 默认 4rem 见方，用 `size-*` 调。 */
export const Sizes: Story = {
  render: args => (
    <div className="flex items-end gap-ark-2">
      <SkillSlot {...args} className="size-12" rank={undefined} />
      <SkillSlot {...args} />
      <SkillSlot {...args} className="size-20" />
    </div>
  ),
}
