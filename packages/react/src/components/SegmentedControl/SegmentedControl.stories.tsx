import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Panel } from '../Panel'
import { Segment, SegmentedControl } from './SegmentedControl'

const meta = {
  title: '表单/SegmentedControl',
  component: SegmentedControl,
  subcomponents: { Segment },
  args: { 'aria-label': '帧率', defaultValue: '60' },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 两三个选项直接摆出来，不收进下拉框。选中的那块整块换成信号色；
 * 块与块之间留一道缝，缝的正中一条细线把它们串起来，像一根轴上的几个档位。
 */
export const Default: Story = {
  render: args => (
    <SegmentedControl {...args}>
      <Segment value="30">30 FPS</Segment>
      <Segment value="60">60 FPS</Segment>
      <Segment value="120">120 FPS</Segment>
    </SegmentedControl>
  ),
}

/** `joined`：连成一条，只留很窄的缝。工具栏、筛选条这类要省地方的位置用它。 */
export const Joined: Story = {
  args: { variant: 'joined', 'aria-label': '视图', defaultValue: 'list' },
  render: args => (
    <SegmentedControl {...args}>
      <Segment value="list" icon={glyphs.bars}>
        列表
      </Segment>
      <Segment value="grid" icon={glyphs.blocks}>
        网格
      </Segment>
      <Segment value="board" icon={glyphs.frame}>
        看板
      </Segment>
    </SegmentedControl>
  ),
}

/** 三档高度；`lg` 的每块不窄于 8.5rem，是实机设置页的大小。 */
export const Sizes: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <SegmentedControl key={size} aria-label={`画质（${size}）`} size={size} defaultValue="mid">
          <Segment value="low">低</Segment>
          <Segment value="mid">中</Segment>
          <Segment value="high">高</Segment>
        </SegmentedControl>
      ))}
    </div>
  ),
}

/** 撑满容器宽度，各块等宽。 */
export const Block: Story = {
  args: { block: true, variant: 'joined', 'aria-label': '周期', defaultValue: 'month' },
  render: args => (
    <div className="w-96 max-w-full">
      <SegmentedControl {...args}>
        <Segment value="day">日</Segment>
        <Segment value="week">周</Segment>
        <Segment value="month">月</Segment>
        <Segment value="year">年</Segment>
      </SegmentedControl>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      <SegmentedControl aria-label="帧率（整组禁用）" defaultValue="60" disabled>
        <Segment value="30">30 FPS</Segment>
        <Segment value="60">60 FPS</Segment>
      </SegmentedControl>
      <SegmentedControl aria-label="帧率（单项禁用）" defaultValue="30">
        <Segment value="30">30 FPS</Segment>
        <Segment value="60">60 FPS</Segment>
        <Segment value="120" disabled>
          120 FPS
        </Segment>
      </SegmentedControl>
    </div>
  ),
}

/** 放进反色面时，未选的块换成浅色的底。 */
export const OnInverse: Story = {
  render: args => (
    <Panel tone="inverse" className="w-fit">
      <SegmentedControl {...args}>
        <Segment value="30">30 FPS</Segment>
        <Segment value="60">60 FPS</Segment>
      </SegmentedControl>
    </Panel>
  ),
}
