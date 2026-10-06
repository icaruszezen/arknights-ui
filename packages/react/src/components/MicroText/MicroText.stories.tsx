import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { MicroText } from './MicroText'

const meta = {
  title: '排版与装饰/MicroText',
  component: MicroText,
  args: { children: 'RHODES ISLAND' },
} satisfies Meta<typeof MicroText>

export default meta
type Story = StoryObj<typeof meta>

/** 6px、字距 0.5em。小到不需要被读，但写的是真实的名称、网址或版权信息。 */
export const Default: Story = {}

/** 竖排时顺时针转 90°，贴着画面的边放。 */
export const Vertical: Story = {
  args: { vertical: true, children: 'PRTS // 01' },
}

/**
 * 当纹理用：贴在画面的边角，重复一次这一屏已经说过的内容。
 * 去掉它们信息不缺，留着它们层次更多。
 */
export const AsTexture: Story = {
  render: () => (
    <div className="relative box-border h-56 w-96 border border-ark-rule p-ark-5">
      <Heading as="h3" sub="RHODES ISLAND">
        罗德岛
      </Heading>
      <MicroText className="absolute bottom-ark-3 left-ark-5">
        GITHUB.COM/ICARUSZEZEN/ARKNIGHTS-UI
      </MicroText>
      <MicroText className="absolute right-ark-5 bottom-ark-3">UNOFFICIAL</MicroText>
      <MicroText vertical className="absolute top-ark-5 right-ark-3">
        {'RHODES ISLAND // 01'}
      </MicroText>
    </div>
  ),
}

/** 颜色取所在表面次要文字色的一半，放进石墨或纸白面板时跟着换，始终比正文暗。 */
export const OnSurfaces: Story = {
  render: args => (
    <div className="grid w-72 gap-ark-2">
      <div className="p-ark-5">
        <MicroText {...args} />
      </div>
      <Panel>
        <MicroText {...args} />
      </Panel>
      <Panel tone="paper">
        <MicroText {...args} />
      </Panel>
    </div>
  ),
}
