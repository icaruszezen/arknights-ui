import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Dialog, type DialogProps } from './Dialog'

const meta = {
  title: '反馈/Dialog',
  component: Dialog,
  args: {
    open: false,
    children: '是否消耗 1 份应急理智合剂恢复理智？',
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

function Demo({ trigger, ...props }: Omit<DialogProps, 'open'> & { trigger: string }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState('—')
  return (
    <div className="flex items-center gap-ark-4">
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <span className="font-ark-data text-ark-caption text-ark-fg-muted">RESULT: {result}</span>
      <Dialog
        {...props}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setResult('CONFIRMED')}
        onCancel={() => setResult('CANCELLED')}
      />
    </div>
  )
}

/**
 * 通栏横带：中间写问题，下方左右对开两个大按钮，上下露出被压暗并模糊的原页面。
 * 按 Esc 或点遮罩等同于取消。
 */
export const Confirm: Story = {
  args: { detail: 'SANITY 12/135 → 92/135' },
  render: ({ open: _open, ...args }) => <Demo trigger="恢复理智" {...args} />,
}

export const WithTitle: Story = {
  args: {
    title: '放弃行动',
    children: '当前行动的进度不会保留，已消耗的理智将全额返还。',
    confirmText: '放弃',
    cancelText: '继续行动',
  },
  render: ({ open: _open, ...args }) => <Demo trigger="放弃行动" {...args} />,
}

/** 纯告知：只留一个确认按钮。 */
export const Acknowledge: Story = {
  args: { hideCancel: true, children: '数据已同步至最新版本。', confirmText: '知道了' },
  render: ({ open: _open, ...args }) => <Demo trigger="同步数据" {...args} />,
}
