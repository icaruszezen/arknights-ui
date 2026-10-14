import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Dialog, type DialogProps } from './Dialog'

const meta = {
  title: '反馈/Dialog',
  component: Dialog,
  args: {
    open: false,
    children: '是否以当前配置发布到生产环境？',
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
 * 居中的直角面板：上沿一条信号色边，下方左右对开两个按钮——左边取消（圆圈叉）、右边确认（圆圈对勾）。
 * 按 Esc 或点遮罩等同于取消。
 */
export const Confirm: Story = {
  args: { detail: 'BUILD #0147 → PRODUCTION' },
  render: ({ open: _open, ...args }) => <Demo trigger="发布" {...args} />,
}

/** 不可撤回的操作用红色。正文里用 `<em>` 标出后果，它会显示成橙色粗体。 */
export const Danger: Story = {
  args: {
    color: 'danger',
    title: '删除项目',
    children: (
      <>
        项目下的 12 条记录会一并删除，<em>此操作不可撤回</em>。
      </>
    ),
    confirmText: '删除',
    cancelText: '保留',
  },
  render: ({ open: _open, ...args }) => <Demo trigger="删除项目" {...args} />,
}

/** 纯告知：只留一个确认按钮，它不带颜色。 */
export const Acknowledge: Story = {
  args: { hideCancel: true, children: '数据已同步至最新版本。', confirmText: '知道了' },
  render: ({ open: _open, ...args }) => <Demo trigger="同步数据" {...args} />,
}

/**
 * 通栏横带：内容带横贯屏幕，是与主题相反的面，上下露出被压暗并模糊的原页面。
 * 比居中的面板重得多，留给全屏的沉浸式页面。
 */
export const Band: Story = {
  args: {
    variant: 'band',
    title: '离开编辑',
    children: (
      <>
        当前的修改还没有保存，离开后将<em>全部丢失</em>。
      </>
    ),
    confirmText: '离开',
    cancelText: '继续编辑',
    color: 'danger',
  },
  render: ({ open: _open, ...args }) => <Demo trigger="离开" {...args} />,
}
