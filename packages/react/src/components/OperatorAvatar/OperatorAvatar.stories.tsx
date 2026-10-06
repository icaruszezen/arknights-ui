import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { Panel } from '../Panel'
import { OperatorAvatar } from './OperatorAvatar'

// 占位用的几何剪影，代码画的，不是官方头像
const art = figure()

const meta = {
  title: '场景/基建/OperatorAvatar',
  component: OperatorAvatar,
  args: { src: art, alt: '占位干员甲' },
} satisfies Meta<typeof OperatorAvatar>

export default meta
type Story = StoryObj<typeof meta>

/** 正方形的头像，脸落在上三分之一。 */
export const Default: Story = {}

/**
 * 右下角的二维编码：图形表达“是哪一类加成”，圆环表达“有多强”。
 * 同一种图形、三档圆环，一眼能分出强弱。
 */
export const Buff: Story = {
  render: args => (
    <div className="flex gap-ark-4">
      {[1, 2, 3].map(level => (
        <OperatorAvatar
          {...args}
          key={level}
          buff={glyphs.chevrons}
          buffLevel={level}
          buffLabel={`制造效率加成 ${level} 级`}
        />
      ))}
      <OperatorAvatar {...args} buff={glyphs.cross} buffLevel={3} buffLabel="心情恢复加成 3 级" />
    </div>
  ),
}

/** 底边的心情条：低于阈值时转红并换成斜纹。 */
export const Mood: Story = {
  render: args => (
    <div className="flex gap-ark-4">
      <OperatorAvatar {...args} mood={24} />
      <OperatorAvatar {...args} mood={12} />
      <OperatorAvatar {...args} mood={3} />
    </div>
  ),
}

/**
 * 设施详情里的进驻名单：头像方格并排，空位是带加号的虚线框。
 * 圆环用信号色——这里把 `--ark-signal` 换成了制造站的黄，圆环就跟着换。
 */
export const Stationed: Story = {
  render: args => (
    <Panel
      className="flex gap-ark-2"
      style={{ '--ark-signal': 'var(--ark-color-signal-action)' } as CSSProperties}
    >
      <OperatorAvatar
        {...args}
        buff={glyphs.chevrons}
        buffLevel={3}
        buffLabel="制造效率加成 3 级"
        mood={21}
      />
      <OperatorAvatar
        {...args}
        src={figure('#a39a8f')}
        alt="占位干员乙"
        buff={glyphs.chevrons}
        buffLevel={1}
        buffLabel="制造效率加成 1 级"
        mood={5}
      />
      <OperatorAvatar alt="空位" />
    </Panel>
  ),
}

/** 默认 3.5rem 见方，用 `size-*` 调，角标跟着缩放。 */
export const Sizes: Story = {
  render: args => (
    <div className="flex items-end gap-ark-4">
      <OperatorAvatar {...args} className="size-11" buff={glyphs.chevrons} buffLevel={2} />
      <OperatorAvatar {...args} buff={glyphs.chevrons} buffLevel={2} />
      <OperatorAvatar {...args} className="size-20" buff={glyphs.chevrons} buffLevel={2} />
    </div>
  ),
}
