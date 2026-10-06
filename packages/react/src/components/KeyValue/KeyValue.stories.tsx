import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { TimeRange } from '../TimeRange'
import { KeyValue, KeyValueList } from './KeyValue'

const meta = {
  title: '场景/宣传物料/KeyValue',
  component: KeyValueList,
  subcomponents: { KeyValue },
} satisfies Meta<typeof KeyValueList>

export default meta
type Story = StoryObj<typeof meta>

const rows = (
  <>
    <KeyValue label="活动时间" tone="signal">
      <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
    </KeyValue>
    <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
    <KeyValue label="活动说明">
      活动期间，玩家可通过活动关卡获取活动代币，并在活动商店兑换奖励。
    </KeyValue>
  </>
)

/**
 * 公告图里的键值对：键偏灰、带冒号，值是粗体；最要紧的一项换成主题色。
 * 键排成一列，值从同一条左边线起，值太长时在自己那一列里折行。
 */
export const Default: Story = {
  render: args => (
    <KeyValueList {...args} className="max-w-xl">
      {rows}
    </KeyValueList>
  ),
}

/** 放进纸白面板：键和值跟着换成深色，主题色压暗以保证对比度。 */
export const OnPaper: Story = {
  render: args => (
    <Panel tone="paper" className="max-w-xl">
      <KeyValueList {...args}>{rows}</KeyValueList>
    </Panel>
  ),
}

/** 每一行自己有盒子，可以给它加底线。 */
export const WithRules: Story = {
  render: args => (
    <KeyValueList {...args} className="max-w-md gap-y-0">
      {(
        [
          ['代号', '占位干员'],
          ['职业', '近卫'],
          ['所属', '罗德岛'],
        ] as const
      ).map(([label, value]) => (
        <KeyValue key={label} label={label} className="border-b border-ark-rule py-ark-2">
          {value}
        </KeyValue>
      ))}
    </KeyValueList>
  ),
}
