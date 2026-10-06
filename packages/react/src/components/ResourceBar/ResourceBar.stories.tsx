import type { Meta, StoryObj } from '@storybook/react-vite'
import { Resource, ResourceBar } from './ResourceBar'

const meta = {
  title: '导航/ResourceBar',
  component: ResourceBar,
  subcomponents: { Resource },
  // 每一项的底是半透明的，放在场景上才看得出来
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof ResourceBar>

export default meta
type Story = StoryObj<typeof meta>

/** 每一项是一块半透明黑底：名称是小号中文，数量是数据体粗体，带千分位。 */
export const Default: Story = {
  render: args => (
    <ResourceBar {...args}>
      <Resource label="龙门币" value={128400} />
      <Resource label="合成玉" value={6000} />
      <Resource label="理智" value={131} max={135} />
    </ResourceBar>
  ),
}

/** 贴在右上角。和左上角的返回、主页一样，位置从不改变。 */
export const TopRight: Story = {
  render: args => (
    <div className="relative -m-ark-6 h-40">
      <ResourceBar {...args} className="absolute top-0 right-0">
        <Resource label="龙门币" value={128400} />
        <Resource label="合成玉" value={6000} />
        <Resource label="源石" value={12} />
      </ResourceBar>
    </div>
  ),
}

/** 可以带一个自备的小图标。这里用一个方点代替。 */
export const WithIcon: Story = {
  render: args => (
    <ResourceBar {...args}>
      <Resource
        label="理智"
        value={131}
        max={135}
        icon={<span className="block size-2 bg-ark-signal" />}
      />
      <Resource
        label="合成玉"
        value={6000}
        icon={<span className="block size-2 rotate-45 bg-ark-signal-accent" />}
      />
    </ResourceBar>
  ),
}
