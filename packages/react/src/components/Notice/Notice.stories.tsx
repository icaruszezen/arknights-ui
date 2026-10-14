import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Notice } from './Notice'

const meta = {
  title: '反馈/Notice',
  component: Notice,
  args: { children: '订单已交付，积分 +2000' },
  decorators: [
    Story => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notice>

export default meta
type Story = StoryObj<typeof meta>

/** 信息级：一条不带彩色的底，前面一个圆圈 i，没有色边。 */
export const Info: Story = {}

/** 完成：左侧一条绿边，图形是方块。 */
export const Success: Story = {
  args: { level: 'success', children: '设置已保存' },
}

/** 警示：黄边之外，顶部再加一条警戒条纹窄边。条纹只做窄边，不铺满。 */
export const Warning: Story = {
  args: { level: 'warning', children: '配额即将用尽，剩余 5%' },
}

export const ErrorLevel: Story = {
  name: 'Error',
  args: { level: 'error', children: '网络连接中断，请重试' },
}

export const WithTitle: Story = {
  args: {
    level: 'warning',
    title: '即将进行停机维护',
    children: '维护期间无法登录，预计持续 10 分钟。',
  },
}

/** 右侧可以放一个操作，再右是关闭按钮。提示条不会自己消失，由使用方拿掉。 */
export const WithAction: Story = {
  render: function Render(args) {
    const [shown, setShown] = useState(true)
    if (!shown) return <Button onClick={() => setShown(true)}>再显示一次</Button>
    return (
      <Notice
        {...args}
        action={
          <Button variant="ghost" size="sm">
            撤销
          </Button>
        }
        onClose={() => setShown(false)}
      >
        3 条记录已移入回收站
      </Notice>
    )
  },
}

/** 四个级别并排：信息级不加颜色，其余才在左侧加色边；图形是颜色之外的第二种编码。 */
export const Levels: Story = {
  render: () => (
    <div className="grid gap-ark-2">
      <Notice>订单已交付，积分 +2000</Notice>
      <Notice level="success">设置已保存</Notice>
      <Notice level="warning">配额即将用尽，剩余 5%</Notice>
      <Notice level="error">网络连接中断，请重试</Notice>
    </div>
  ),
}
