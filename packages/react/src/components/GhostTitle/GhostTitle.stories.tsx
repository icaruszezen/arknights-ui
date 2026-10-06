import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { GhostTitle } from './GhostTitle'

const meta = {
  title: '排版与装饰/GhostTitle',
  component: GhostTitle,
  args: { children: 'BREAKING NEWS' },
} satisfies Meta<typeof GhostTitle>

export default meta
type Story = StoryObj<typeof meta>

/** 窄体 7rem、字距收紧到 -0.05em，颜色只比底色亮一档。 */
export const Default: Story = {}

/** 25% 的信号色：设定屏里悬停某个条目时，背后浮现的那行巨字。 */
export const Signal: Story = {
  args: { tone: 'signal', children: 'ORIGINIUM' },
}

/**
 * 垫在内容背后，被内容和容器切掉一部分。栏目名因此写了两遍：
 * 真正的标题给人读，巨字当纹理。
 */
export const BehindContent: Story = {
  render: args => (
    <div className="relative isolate box-border h-64 w-[36rem] overflow-hidden border-b border-ark-rule p-ark-6">
      <GhostTitle {...args} className="absolute -bottom-ark-4 left-ark-5 -z-1" />
      <Heading as="h2" size="lg" sub="INFORMATION">
        情报
      </Heading>
    </div>
  ),
}
