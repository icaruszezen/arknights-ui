import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { Switch } from './Switch'

const meta = {
  title: '表单/Switch',
  component: Switch,
  args: { children: '省电模式' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 一条两格宽的直角块：一格是滑块，另一格写着当前的状态。关着的时候滑块在左，右格是深色的 `OFF`；
 * 开着的时候滑块在右，左格是信号色的 `ON`。没有圆头，也没有小圆球。
 */
export const Default: Story = {}

export const On: Story = { args: { defaultChecked: true } }

/** `sm` 没有字，只靠滑块的位置和颜色；`lg` 是实机设置页的大小（10.75rem × 2.75rem）。 */
export const Sizes: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      <Switch size="sm" defaultChecked>
        小号
      </Switch>
      <Switch size="md" defaultChecked>
        默认
      </Switch>
      <Switch size="lg" defaultChecked aria-label="大号" />
    </div>
  ),
}

/** 状态格里的字可以换成中文。 */
export const CustomLabels: Story = {
  args: { onLabel: '开', offLabel: '关', defaultChecked: true },
}

export const Disabled: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-3">
      <Switch disabled>关着且禁用</Switch>
      <Switch disabled defaultChecked>
        开着且禁用
      </Switch>
    </div>
  ),
}

/** 放进反色面时，滑块和底色跟着换。 */
export const OnInverse: Story = {
  render: args => (
    <Panel tone="inverse" className="grid w-fit gap-ark-3">
      <Switch {...args} />
      <Switch {...args} defaultChecked />
    </Panel>
  ),
}
