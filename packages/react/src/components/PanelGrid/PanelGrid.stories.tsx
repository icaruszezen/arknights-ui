import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Badge } from '../Badge'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { PanelGrid, PanelGridItem } from './PanelGrid'

const meta = {
  title: '布局与层级/PanelGrid',
  component: PanelGrid,
  subcomponents: { PanelGridItem },
  // 面板是半透明的，放在场景上才看得出黑白拼块
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof PanelGrid>

export default meta
type Story = StoryObj<typeof meta>

// 主界面入口的写法：重磅中文衬线贴左下，英文小注脚在其下方，其余留白
function Entry({
  sub,
  tone,
  size = 'sm',
  children,
  extra,
}: {
  sub: string
  tone?: 'paper'
  size?: 'sm' | 'md'
  children: ReactNode
  extra?: ReactNode
}) {
  return (
    <Panel tone={tone} className="flex flex-col justify-end p-ark-4">
      {extra}
      <Heading as="h3" size={size} sub={sub} serif>
        {children}
      </Heading>
    </Panel>
  )
}

/**
 * 游戏主界面右面板组的拼法：一、二、三、三。
 * 作战最大、最亮（纸白），占两行高；其余是石墨。面板之间留 1rem 的缝（实机截图量得），没有描边，
 * 场景从缝里透出来。
 */
export const Default: Story = {
  render: args => (
    <PanelGrid {...args} className="w-[34rem]">
      <PanelGridItem rows={2}>
        <Entry
          sub="TERMINAL"
          tone="paper"
          size="md"
          extra={
            <Stat
              label="Sanity"
              value={131}
              max={135}
              size="sm"
              className="absolute top-ark-4 right-ark-4 justify-items-end"
            />
          }
        >
          作战
        </Entry>
      </PanelGridItem>
      <PanelGridItem span="1/2">
        <Entry sub="SQUADS">编队</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/2">
        <Entry sub="OPERATOR">干员</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="STORE" tone="paper">
          采购中心
        </Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="RECRUIT">公开招募</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="HEADHUNT">干员寻访</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Badge dot label="有可领取的奖励">
          <Entry sub="MISSION">任务</Entry>
        </Badge>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="BASE">基建</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="DEPOT">仓库</Entry>
      </PanelGridItem>
    </PanelGrid>
  ),
}

/** 一块大的配三块小的：大的那块占三行高，小的各占一行。 */
export const BigWithSmall: Story = {
  render: args => (
    <PanelGrid {...args} className="w-[34rem]">
      <PanelGridItem span="2/3" rows={3}>
        <Entry sub="TERMINAL" tone="paper" size="md">
          作战
        </Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="SQUADS">编队</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="OPERATOR">干员</Entry>
      </PanelGridItem>
      <PanelGridItem span="1/3">
        <Entry sub="BASE">基建</Entry>
      </PanelGridItem>
    </PanelGrid>
  ),
}

/**
 * 一行三等分，下面接一行两等分。缝可以收窄：`md` 是 0.5rem，`sm` 是 0.25rem——
 * 实机上同一组里的两块子面板（公开招募、干员寻访）之间就只有这么窄。
 * 行高用 `--ark-panel-grid-row` 调。
 */
export const ThreeOverTwo: Story = {
  args: { gap: 'sm' },
  render: args => (
    <PanelGrid {...args} className="w-[34rem] [--ark-panel-grid-row:7rem]">
      {['STORE', 'RECRUIT', 'HEADHUNT'].map(sub => (
        <PanelGridItem key={sub} span="1/3">
          <Entry sub={sub}>入口</Entry>
        </PanelGridItem>
      ))}
      {['MISSION', 'DEPOT'].map(sub => (
        <PanelGridItem key={sub} span="1/2">
          <Entry sub={sub}>入口</Entry>
        </PanelGridItem>
      ))}
    </PanelGrid>
  ),
}
