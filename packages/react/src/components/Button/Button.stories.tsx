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

/**
 * 主按钮：信号色实心块 + 黑字，中文在上、英文在下。一屏只放一个。
 * 尺寸是官网实测：14.375rem × 3.75rem 的长条，文字贴左，折线箭头贴右。
 */
export const Primary: Story = {
  args: { variant: 'primary', children: '更多情报', sub: 'READ MORE', arrow: true },
}

/** 弱按钮：灰底小条，只放一行小号英文。可见形状 24px 高，点击区仍是 44px。 */
export const Weak: Story = {
  args: { variant: 'weak', children: 'READ MORE', arrow: true },
}

/** 点了会花掉什么，直接写在按钮里。 */
export const WithCost: Story = {
  args: { variant: 'primary', children: '开始行动', sub: 'SANITY -18', arrow: true },
}

/**
 * 游戏内的确认与取消：取消是黑色块、在左，确认是暗红块、在右，等宽对开，位置固定。
 * 各带一个固定的图形（圆圈叉、圆圈对勾）；文字写得出具体动作时可以去掉图标。
 */
export const ConfirmCancel: Story = {
  render: () => (
    <div className="grid w-96 gap-ark-4">
      <div className="grid grid-cols-2">
        <Button variant="cancel" block>
          取消
        </Button>
        <Button variant="confirm" block>
          确认
        </Button>
      </div>
      <div className="grid grid-cols-2">
        <Button variant="cancel" icon={null} block>
          放弃行动
        </Button>
        <Button variant="confirm" icon={null} block>
          继续结算
        </Button>
      </div>
    </div>
  ),
}

/** 浅 / 深色块：放在面板里的成对操作，跟着面板的明暗用。 */
export const PaperGraphite: Story = {
  render: () => (
    <div className="grid w-80 grid-cols-2">
      <Button variant="graphite" sub="RESET" block>
        重置
      </Button>
      <Button variant="paper" sub="APPLY" block>
        应用
      </Button>
    </div>
  ),
}

/** 选中是整块明暗对调，和悬停的区别是它一直保持。弱按钮可以切一个角。 */
export const States: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button variant="primary">默认</Button>
        <Button variant="primary" disabled>
          禁用
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button>描边</Button>
        <Button selected>选中</Button>
        <Button disabled>禁用</Button>
      </div>
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button variant="weak">VIEW MORE</Button>
        <Button variant="weak" cut>
          VIEW MORE
        </Button>
        <Button variant="weak" cut disabled>
          VIEW MORE
        </Button>
      </div>
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
