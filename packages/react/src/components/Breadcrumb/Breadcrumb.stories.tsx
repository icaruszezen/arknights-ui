import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

const meta = {
  title: '导航/Breadcrumb',
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 从哪里一路走到这一页。第一级后面是双斜杠，往后是单斜杠——和日期、计数是同一种写法。
 * 最后一项是当前页，不是链接。
 */
export const Default: Story = {
  render: args => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#home">首页</BreadcrumbItem>
      <BreadcrumbItem href="#docs">文档</BreadcrumbItem>
      <BreadcrumbItem href="#elements">通用元素</BreadcrumbItem>
      <BreadcrumbItem current>按钮</BreadcrumbItem>
    </Breadcrumb>
  ),
}

/** 只有两级时就是 `首页 // 当前页`。 */
export const TwoLevels: Story = {
  render: args => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#settings">设置</BreadcrumbItem>
      <BreadcrumbItem current>通知</BreadcrumbItem>
    </Breadcrumb>
  ),
}
