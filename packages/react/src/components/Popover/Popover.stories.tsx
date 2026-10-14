import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { glyphs } from '../../../.storybook/glyphs'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Modal } from '../Modal'
import { Segment, SegmentedControl } from '../SegmentedControl'
import { Popover } from './Popover'

const meta = {
  title: '面板与浮层/Popover',
  component: Popover,
  args: { trigger: <Button icon={glyphs.bars}>筛选</Button>, title: '筛选条件' },
  decorators: [
    Story => (
      <div className="min-h-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const filters = (
  <div className="grid gap-ark-3">
    <Checkbox defaultChecked>只看我负责的</Checkbox>
    <Checkbox>包含已归档</Checkbox>
    <SegmentedControl aria-label="时间范围" variant="joined" size="sm" defaultValue="week">
      <Segment value="day">今天</Segment>
      <Segment value="week">本周</Segment>
      <Segment value="month">本月</Segment>
    </SegmentedControl>
  </div>
)

/**
 * 点一下触发元素，在它旁边展开一小块内容。它不是模态的：下面的页面仍然可以操作。
 * 点外面或按 Esc 关闭，焦点回到触发元素。
 */
export const Default: Story = {
  args: { children: filters },
}

export const Placement: Story = {
  args: { placement: 'right-start', children: filters },
}

/**
 * 浮层开在弹窗里：它在浏览器的顶层，盖在弹窗上面，不会被弹窗裁掉。
 * 这时按 Esc 先关浮层，再按一次才关弹窗。
 */
export const InsideModal: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>打开弹窗</Button>
        <Modal open={open} onOpenChange={setOpen} title="导出记录" sub="EXPORT" size="sm">
          <Popover {...args}>{filters}</Popover>
        </Modal>
      </>
    )
  },
}
