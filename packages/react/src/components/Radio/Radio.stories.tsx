import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: '表单/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
  args: { 'aria-label': '通知方式', defaultValue: 'mail' },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 单选框是一个菱形，选中时中间填一块信号色——菱形把它和方形的勾选框区分开。
 * 方向键在同一组里移动并选中。
 */
export const Default: Story = {
  render: args => (
    <RadioGroup {...args}>
      <Radio value="mail">邮件</Radio>
      <Radio value="sms">短信</Radio>
      <Radio value="none">不通知</Radio>
    </RadioGroup>
  ),
}

/** 选项带说明、或者有四五个以上时用单选组；只有两三个短选项时用 `SegmentedControl`。 */
export const WithDescription: Story = {
  args: { 'aria-label': '保留策略', defaultValue: '30' },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="7" description="适合临时环境">
        保留 7 天
      </Radio>
      <Radio value="30" description="默认">
        保留 30 天
      </Radio>
      <Radio value="forever" description="占用的存储会计入配额">
        永久保留
      </Radio>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="mail">邮件</Radio>
      <Radio value="sms">短信</Radio>
      <Radio value="none">不通知</Radio>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="mail">邮件</Radio>
      <Radio value="sms">短信</Radio>
    </RadioGroup>
  ),
}
