import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Button, IconButton } from '../Button'
import { Tooltip } from './Tooltip'

const meta = {
  title: '面板与浮层/Tooltip',
  component: Tooltip,
  args: { content: '复制这条记录的链接', children: <Button>复制链接</Button> },
  decorators: [
    Story => (
      <div className="grid min-h-40 place-items-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** 指针停 300ms、或键盘聚焦时，旁边出现一小块反色的说明。移开、失焦、按下或按 Esc 就消失。 */
export const Default: Story = {}

/** 放不下时自动翻到对面。 */
export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-ark-4">
      {(['top', 'right', 'bottom', 'left'] as const).map(placement => (
        <Tooltip key={placement} content={`出现在 ${placement}`} placement={placement}>
          <Button variant="subtle">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

/**
 * 只有图形的按钮：名称仍然来自 `label`，提示只是把它写出来给看得见的人。
 * 提示是补充描述，不是名称。
 */
export const OnIconButtons: Story = {
  render: () => (
    <div className="flex gap-ark-2">
      <Tooltip content="筛选">
        <IconButton label="筛选">{glyphs.bars}</IconButton>
      </Tooltip>
      <Tooltip content="设置">
        <IconButton label="设置">{glyphs.gear}</IconButton>
      </Tooltip>
      <Tooltip content="没有可以播放的内容">
        <IconButton label="播放" disabled>
          {glyphs.play}
        </IconButton>
      </Tooltip>
    </div>
  ),
}
