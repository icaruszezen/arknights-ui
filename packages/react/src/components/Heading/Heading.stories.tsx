import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta = {
  title: '排版与装饰/Heading',
  component: Heading,
  args: { children: '罗德岛', sub: 'RHODES ISLAND' },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

/** 条目标题：中文粗黑 2.5rem，下面一行宽体粗体的英文副标，两行同色。 */
export const Medium: Story = {}

/** 屏标题：英文宽体在上（3.125rem），中文粗黑在下（3.75rem）。两行字号不相等。 */
export const Large: Story = {
  args: { as: 'h1', size: 'lg', children: '泰拉万象', sub: 'ABOUT TERRA' },
}

/**
 * 官网的屏标题下面有一条信号色的粗条：14.375rem × 0.5rem，上距 1.5rem。
 * 别的尺寸按字号等比缩小。
 */
export const WithBar: Story = {
  args: { as: 'h1', size: 'lg', children: '泰拉万象', sub: 'ABOUT TERRA', bar: true },
}

/** 卡片标题：中文粗字 + 拉开字距的窄体英文小字。这一档没有实机出处，是估计。 */
export const Small: Story = {
  args: { as: 'h3', size: 'sm', children: '采购凭证', sub: 'PURCHASE CERTIFICATE' },
}

/** 中文衬线重磅字：游戏主界面入口的写法，有告示牌的意味。 */
export const Serif: Story = {
  args: { serif: true, children: '作战', sub: 'TERMINAL' },
}

/** 副行的位置可以单独指定，比如干员名：小号英文在上，大号中文在下。 */
export const SubAbove: Story = {
  args: { subPosition: 'above', children: '设定', sub: 'WORLD' },
}

export const WithoutSub: Story = {
  args: { sub: undefined, children: '只有一行的标题' },
}
