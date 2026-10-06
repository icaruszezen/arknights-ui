import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { Loading } from './Loading'

const meta = {
  title: '反馈/Loading',
  component: Loading,
  args: { value: 65, children: 'LOADING ASSETS' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

/** 细进度条 + 英文状态文字 + 右对齐的百分比。 */
export const Default: Story = {}

/**
 * 不知道还要多久时：旋转指示，状态文字后面跟一个闪烁的光标。
 * 旋转 1s 匀速，光标 1s 逐帧，没有缓动。
 */
export const Indeterminate: Story = {
  args: { value: undefined, children: 'CONNECTING' },
}

/** 只留旋转指示，塞进按钮或一行文字里。这时要给一个 `aria-label`。 */
export const SpinnerOnly: Story = {
  args: { value: undefined, children: null, 'aria-label': '加载中' },
}

/** 进度条也可以带光标。 */
export const WithCursor: Story = {
  args: { cursor: true, value: 12, children: 'DECRYPTING' },
}

/** 轨道、状态文字跟随明暗上下文。 */
export const OnSurfaces: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: args => (
    <div className="grid gap-ark-2">
      <Panel>
        <Loading {...args} />
      </Panel>
      <Panel tone="paper">
        <Loading {...args} />
      </Panel>
      <Panel>
        <Loading>SYNCING</Loading>
      </Panel>
    </div>
  ),
}
