import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Slider } from './Slider'

const meta = {
  title: '表单/Slider',
  component: Slider,
  args: { 'aria-label': '音量', defaultValue: 60 },
  decorators: [
    Story => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

/** 轨道是一条很细的线；滑块是一块直角的矩形，当前的数值直接印在上面。 */
export const Default: Story = {}

/** `formatValue` 改写印在滑块上的字，读屏读到的也是它。 */
export const Formatted: Story = {
  args: {
    'aria-label': '界面缩放',
    min: 80,
    max: 140,
    step: 10,
    defaultValue: 100,
    formatValue: value => `${value}%`,
  },
}

/** `lg` 是实机设置页的大小：滑块 3.75rem × 2.5rem。 */
export const Large: Story = { args: { size: 'lg' } }

export const Disabled: Story = { args: { disabled: true } }

/** 受控用法：值由外部状态决定。 */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(30)
    return (
      <div className="grid gap-ark-3">
        <Slider {...args} defaultValue={undefined} value={value} onValueChange={setValue} />
        <p className="m-0 font-ark-data text-ark-caption text-ark-fg-muted">value = {value}</p>
      </div>
    )
  },
}
