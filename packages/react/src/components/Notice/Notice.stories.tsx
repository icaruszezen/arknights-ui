import type { Meta, StoryObj } from '@storybook/react-vite'
import { Notice } from './Notice'

const meta = {
  title: '反馈/Notice',
  component: Notice,
  args: { children: '订单已交付，获得龙门币 ×2000' },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notice>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 信息级：半透明的黑条，前面一个白色的圆圈 i，没有色边（实机提示条的写法）。
 * 它压在场景上时下层仍然隐约可见。
 */
export const Info: Story = {}

/** 警示：黄边之外，顶部再加一条警戒条纹窄边。条纹只做窄边，不铺满。 */
export const Warning: Story = {
  args: { level: 'warning', children: '理智不足，无法开始行动' },
}

export const ErrorLevel: Story = {
  name: 'Error',
  args: { level: 'error', children: '网络连接中断，请重试' },
}

export const WithTitle: Story = {
  args: {
    level: 'warning',
    title: '即将进行闪断更新',
    children: '更新期间无法登录，预计持续 10 分钟。',
  },
}

/** 三个级别并排：信息级不加颜色，警示和错误才在左侧加色边；图形是颜色之外的第二种编码。 */
export const Levels: Story = {
  render: () => (
    <div className="grid gap-ark-2">
      <Notice>订单已交付，获得龙门币 ×2000</Notice>
      <Notice level="warning">理智不足，无法开始行动</Notice>
      <Notice level="error">网络连接中断，请重试</Notice>
    </div>
  ),
}
