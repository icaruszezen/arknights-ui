import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { Attribute, AttributeList } from './AttributeList'

const meta = {
  title: '场景/干员/AttributeList',
  component: AttributeList,
  subcomponents: { Attribute },
} satisfies Meta<typeof AttributeList>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 干员详情页左侧的属性：标签在左，数值右对齐。每项下方的细条表示这个数值
 * 在同职业里的相对高低——不用读数字就能比较。
 */
export const Default: Story = {
  render: args => (
    <AttributeList {...args} className="w-48">
      <Attribute label="生命上限" value={2480} meter={0.76} />
      <Attribute label="攻击" value={612} meter={0.55} />
      <Attribute label="防御" value={402} meter={0.41} />
      <Attribute label="法术抗性" value={0} meter={0} />
    </AttributeList>
  ),
}

/** 不给 `meter` 就只有标签和数值。单位跟在数值后面，小而灰。 */
export const WithUnits: Story = {
  render: args => (
    <AttributeList {...args} className="w-48">
      <Attribute label="再部署时间" value={70} unit="s" />
      <Attribute label="部署费用" value={19} />
      <Attribute label="阻挡数" value={2} />
      <Attribute label="攻击间隔" value="1.05" unit="s" />
    </AttributeList>
  ),
}

/** 放进面板：石墨面板上次要文字提亮一档，纸白面板上整体换成深色。 */
export const InPanels: Story = {
  render: args => (
    <div className="flex items-start gap-ark-2">
      {(['graphite', 'paper'] as const).map(tone => (
        <Panel key={tone} tone={tone} className="w-56">
          <AttributeList {...args}>
            <Attribute label="生命上限" value={2480} meter={0.76} />
            <Attribute label="攻击" value={612} meter={0.55} />
            <Attribute label="防御" value={402} meter={0.41} />
          </AttributeList>
        </Panel>
      ))}
    </div>
  ),
}
