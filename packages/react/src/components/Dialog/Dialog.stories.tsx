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
 * 通栏横带：纸白的内容带上写问题，下方左右对开两个大按钮——左边黑色块取消、右边暗红块确认，
 * 上下露出被压暗并模糊的原页面。按 Esc 或点遮罩等同于取消。
 */
export const Confirm: Story = {
  args: { detail: 'SANITY 12/135 → 92/135' },
  render: ({ open: _open, ...args }) => <Demo trigger="恢复理智" {...args} />,
}

/** 正文里用 `<em>` 标出后果，它会显示成橙色粗体。 */
export const WithTitle: Story = {
  args: {
    title: '放弃行动',
    children: (
      <>
        当前行动的进度不会保留，已消耗的理智将<em>全额返还</em>。
      </>
    ),
    confirmText: '放弃',
    cancelText: '继续行动',
  },
  render: ({ open: _open, ...args }) => <Demo trigger="放弃行动" {...args} />,
}

/** 页面里建设性的确认（编队、升级）用信号色。 */
export const SignalConfirm: Story = {
  args: { confirmVariant: 'signal', children: '是否以当前编队开始行动？' },
  render: ({ open: _open, ...args }) => <Demo trigger="开始行动" {...args} />,
}

/** 纯告知：只留一个确认按钮，它是黑色块。 */
export const Acknowledge: Story = {
  args: { hideCancel: true, children: '数据已同步至最新版本。', confirmText: '知道了' },
  render: ({ open: _open, ...args }) => <Demo trigger="同步数据" {...args} />,
}
