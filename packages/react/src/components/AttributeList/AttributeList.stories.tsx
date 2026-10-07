import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
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
 * 干员详情页左侧的属性，实机的写法：两列，每项是一个黑底的小图标加数值，没有文字名称；
 * 数值背后那条半透明的条表示它在同职业里的相对高低——不用读数字就能比较。
 * 名称仍然读给读屏。图标是演示用的自绘几何图形。
 */
export const Default: Story = {
  render: args => (
    <AttributeList {...args} columns={2} className="w-80">
      <Attribute label="生命上限" value={2560} meter={0.62} icon={glyphs.cross} />
      <Attribute label="再部署时间" value="慢" icon={glyphs.bars} meter={0} />
      <Attribute label="攻击" value={789} meter={0.7} icon={glyphs.slashes} />
      <Attribute label="部署费用" value={19} icon={glyphs.diamond} meter={0} />
      <Attribute label="防御" value={447} meter={0.55} icon={glyphs.shield} />
      <Attribute label="阻挡数" value={2} icon={glyphs.blocks} meter={0} />
      <Attribute label="法术抗性" value={10} meter={0.1} icon={glyphs.target} />
      <Attribute label="攻击间隔" value="较慢" icon={glyphs.chevrons} meter={0} />
    </AttributeList>
  ),
}

/**
 * 组件库不带图标。不给 `icon` 时名称写在左边，数值条的左缘仍然对齐；
 * 需要图标和名称都显示时用 `showLabel`。
 */
export const WithLabels: Story = {
  render: args => (
    <div className="flex items-start gap-ark-7">
      <AttributeList {...args} className="w-56">
        <Attribute label="生命上限" value={2480} meter={0.76} />
        <Attribute label="攻击" value={612} meter={0.55} />
        <Attribute label="防御" value={402} meter={0.41} />
        <Attribute label="法术抗性" value={0} meter={0} />
      </AttributeList>
      <AttributeList {...args} className="w-64">
        <Attribute label="生命上限" value={2480} meter={0.76} icon={glyphs.cross} showLabel />
        <Attribute label="攻击" value={612} meter={0.55} icon={glyphs.slashes} showLabel />
        <Attribute label="防御" value={402} meter={0.41} icon={glyphs.shield} showLabel />
      </AttributeList>
    </div>
  ),
}

/** 不给 `meter` 就只有名称和数值。单位跟在数值后面，小而灰。 */
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

/** 放进面板：条取前景色，石墨面板上是浅的，纸白面板上整体换成深色。 */
export const InPanels: Story = {
  render: args => (
    <div className="flex items-start gap-ark-2">
      {(['graphite', 'paper'] as const).map(tone => (
        <Panel key={tone} tone={tone} className="w-56">
          <AttributeList {...args}>
            <Attribute label="生命上限" value={2480} meter={0.76} icon={glyphs.cross} />
            <Attribute label="攻击" value={612} meter={0.55} icon={glyphs.slashes} />
            <Attribute label="防御" value={402} meter={0.41} icon={glyphs.shield} />
          </AttributeList>
        </Panel>
      ))}
    </div>
  ),
}
