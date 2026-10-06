import type { Meta, StoryObj } from '@storybook/react-vite'
import { Serial } from '../Counter'
import { Ticks } from './Ticks'

const meta = {
  title: '排版与装饰/Ticks',
  component: Ticks,
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Ticks>

export default meta
type Story = StoryObj<typeof meta>

/** 一条基线，上面每 0.5rem 一条短刻度，每 5 格一条长的。铺满可用的宽度。 */
export const Default: Story = {}

/** 格距由 `--ark-ticks-step` 决定，长刻度的间隔由 `major` 决定。 */
export const Spacing: Story = {
  render: () => (
    <div className="grid gap-ark-5">
      <Ticks />
      <Ticks major={10} className="[--ark-ticks-step:0.25rem]" />
      <Ticks major={2} className="h-3 [--ark-ticks-step:1rem]" />
    </div>
  ),
}

/** 竖向：基线在左，刻度朝右。需要父容器给出高度。 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-40 gap-ark-3">
      <Ticks orientation="vertical" />
      <Serial prefix="ALT " value="0147" className="text-ark-fg-muted" />
    </div>
  ),
}

/** 贴在一块内容的底边，配一个真实的读数。只在终端、仪表盘这类沉浸型页面里用。 */
export const UnderContent: Story = {
  render: () => (
    <div className="grid gap-ark-2">
      <div className="flex justify-between text-ark-fg-muted">
        <Serial value="0" />
        <Serial value="50" />
        <Serial value="100" />
      </div>
      <Ticks className="-scale-y-100" />
    </div>
  ),
}
