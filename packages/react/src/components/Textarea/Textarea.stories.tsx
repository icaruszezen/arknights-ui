import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
  title: '表单/Textarea',
  component: Textarea,
  args: { 'aria-label': '备注', placeholder: '写点什么' },
  decorators: [
    Story => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** 和输入框是同一块色块，可以向下拉高。 */
export const Default: Story = {}

/** 右下角写“已输入 / 上限”：数字用数据体，分母小而灰。 */
export const WithCount: Story = {
  args: {
    maxLength: 200,
    showCount: true,
    defaultValue: '三号舱段的供能读数在本周内两次越过阈值。',
  },
}

export const States: Story = {
  render: args => (
    <div className="grid gap-ark-3">
      <Textarea {...args} invalid defaultValue="内容不能少于 10 个字" />
      <Textarea {...args} disabled defaultValue="已归档的记录不能再修改" />
    </div>
  ),
}
