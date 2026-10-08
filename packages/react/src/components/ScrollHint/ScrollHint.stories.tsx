import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { ScrollHint } from './ScrollHint'

const meta = {
  title: '布局与层级/ScrollHint',
  component: ScrollHint,
} satisfies Meta<typeof ScrollHint>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 一行 `SCROLL` 加一个向下的箭头，1.5 秒一轮：淡入、停住、下移并淡出。
 * 默认只是装饰，对读屏隐藏，颜色是官网中间几屏用的灰。
 */
export const Default: Story = {}

/**
 * 官网的三种状态：首屏是信号色，中间几屏是灰，最后一屏换成向上的箭头、2 秒明灭一次。
 */
export const States: Story = {
  render: () => (
    <div className="flex items-end gap-ark-7">
      <ScrollHint className="text-ark-signal" />
      <ScrollHint />
      <ScrollHint direction="up" />
    </div>
  ),
}

/** 给了 `href` 就是“去下一屏”的链接：点击区 44px，用前景色，悬停变信号色。 */
export const AsLink: Story = {
  args: { href: '#information' },
}

/** 文字可以换，也可以传 `null` 去掉。链接的名称就是这行字。 */
export const WithText: Story = {
  args: { href: '#information', children: 'NEXT' },
}

/** 固定骨架里的位置：底部居中，距底边 3.75rem。 */
export const AtBottom: Story = {
  render: args => (
    <div className="relative h-64 w-[36rem] border border-ark-rule">
      <ScrollHint {...args} className="absolute bottom-[3.75rem] left-1/2 -translate-x-1/2" />
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
