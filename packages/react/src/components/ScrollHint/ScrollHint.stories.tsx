import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { ScrollHint } from './ScrollHint'

const meta = {
  title: '布局与层级/ScrollHint',
  component: ScrollHint,
} satisfies Meta<typeof ScrollHint>

export default meta
type Story = StoryObj<typeof meta>

/** 一个向下的小箭头，2 秒一个往复。默认只是装饰，对读屏隐藏。 */
export const Default: Story = {}

/** 给了 `href` 就是“去下一屏”的链接：点击区 44px，悬停变信号色。 */
export const AsLink: Story = {
  args: { href: '#information' },
}

/** 箭头上方可以放一行小字。这时链接的名称就是这行字。 */
export const WithText: Story = {
  args: { href: '#information', children: 'SCROLL' },
}

/** 固定骨架里的位置：底部居中，离底边一小段。 */
export const AtBottom: Story = {
  render: args => (
    <div className="relative h-64 w-[36rem] border border-ark-rule">
      <ScrollHint {...args} className="absolute bottom-ark-3 left-1/2 -translate-x-1/2" />
    </div>
  ),
}

/** 放进纸白面板，颜色跟着换。 */
export const OnPaper: Story = {
  globals: { backgrounds: { value: 'scene' } },
  args: { href: '#next', children: 'NEXT' },
  render: args => (
    <Panel tone="paper" className="grid w-48 justify-items-center">
      <ScrollHint {...args} />
    </Panel>
  ),
}
