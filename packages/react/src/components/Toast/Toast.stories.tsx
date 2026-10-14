import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { ToastProvider, useToast } from './Toast'

const meta = {
  title: '反馈/Toast',
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

function Triggers() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap gap-ark-3">
      <Button onClick={() => toast({ title: '订单已交付', description: '积分 +2000' })}>
        信息
      </Button>
      <Button onClick={() => toast({ title: '设置已保存', level: 'success' })}>完成</Button>
      <Button
        onClick={() =>
          toast({ title: '配额即将用尽', description: '剩余 5%，建议清理', level: 'warning' })
        }
      >
        警示
      </Button>
      <Button
        onClick={() =>
          toast({ title: '网络连接中断', description: '正在重试…', level: 'error', duration: 0 })
        }
      >
        错误（不自动消失）
      </Button>
      <Button
        onClick={() => {
          const id = toast({
            title: '3 条记录已移入回收站',
            action: (
              <Button variant="ghost" size="sm" onClick={() => toast.dismiss(id)}>
                撤销
              </Button>
            ),
          })
        }}
      >
        带操作
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        全部关掉
      </Button>
    </div>
  )
}

/**
 * 一会儿就消失的提示条，叠在视口的一角。外观就是 `Notice`，底下多一条走时的细线；
 * 指针停在上面、或焦点在里面时不走时。最多同时显示三条，再多的把最早的挤掉。
 */
export const Default: Story = {
  render: args => (
    <ToastProvider {...args}>
      <Triggers />
    </ToastProvider>
  ),
}

/** 四个位置：右下（默认）、底部居中、右上、顶部居中。 */
export const TopCenter: Story = {
  args: { placement: 'top-center' },
  render: args => (
    <ToastProvider {...args}>
      <Triggers />
    </ToastProvider>
  ),
}
