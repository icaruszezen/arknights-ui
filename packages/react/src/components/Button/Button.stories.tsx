import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: '按钮/Button',
  component: Button,
  args: { children: '查看全部' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** 默认是描边的次按钮：并列的次要操作都用它。 */
export const Secondary: Story = {}

/** 主按钮：信号色实心块 + 黑字，中文在上、英文在下。一屏只放一个。 */
export const Primary: Story = {
  args: { variant: 'primary', children: '更多情报', sub: 'READ MORE', arrow: true },
}

/** 弱按钮：灰底小条，只放一行小号英文。可见形状 22px 高，点击区仍是 44px。 */
export const Weak: Story = {
  args: { variant: 'weak', children: 'READ MORE', arrow: true, cut: true },
}

/** 点了会花掉什么，直接写在按钮里。 */
export const WithCost: Story = {
  args: { variant: 'primary', children: '开始行动', sub: 'SANITY -18', arrow: true },
}

/** 确认浅、取消深，等宽对开，位置固定：取消在左，确认在右。 */
export const ConfirmCancel: Story = {
  render: () => (
    <div className="grid w-80 grid-cols-2">
      <Button variant="graphite" sub="CANCEL" block>
        取消
      </Button>
      <Button variant="paper" sub="CONFIRM" block>
        确认
      </Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-3 items-center gap-ark-4">
      <Button variant="primary">默认</Button>
      <Button variant="primary" disabled>
        禁用
      </Button>
      <span />
      <Button>描边</Button>
      <Button selected>选中</Button>
      <Button disabled>禁用</Button>
      <Button variant="weak">VIEW MORE</Button>
      <Button variant="weak" cut>
        VIEW MORE
      </Button>
      <Button variant="weak" cut disabled>
        VIEW MORE
      </Button>
    </div>
  ),
}

/** 传入 `href` 时渲染为链接。 */
export const AsLink: Story = {
  args: {
    variant: 'primary',
    href: 'https://github.com/icaruszezen/arknights-ui',
    children: '查看仓库',
    sub: 'REPOSITORY',
    arrow: true,
  },
}
