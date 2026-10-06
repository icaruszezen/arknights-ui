import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyValue, KeyValueList } from '../KeyValue'
import { TimeRange } from '../TimeRange'
import { NumberedSection } from './NumberedSection'

const meta = {
  title: '场景/宣传物料/NumberedSection',
  component: NumberedSection,
  args: { number: 1, title: '活动说明' },
} satisfies Meta<typeof NumberedSection>

export default meta
type Story = StoryObj<typeof meta>

/** 数据体的两位数字 + 中文小节名 + 一条 1px 细线。内容从小节名的左缘写起。 */
export const Default: Story = {
  render: args => (
    <NumberedSection {...args} className="max-w-xl">
      <KeyValueList>
        <KeyValue label="活动时间" tone="signal">
          <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
        </KeyValue>
        <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
      </KeyValueList>
    </NumberedSection>
  ),
}

/** 标题行右端可以带一行英文小字。 */
export const WithSub: Story = {
  args: { sub: 'Event Info' },
  render: args => (
    <NumberedSection {...args} className="max-w-xl">
      <p className="m-0 text-ark-label leading-ark-body text-ark-fg-secondary">
        活动期间，玩家可通过活动关卡获取活动代币，并在活动商店兑换奖励。
      </p>
    </NumberedSection>
  ),
}

/**
 * 公告长图的骨架：若干个编号小节纵向排下去。每一期只换主题色、页眉和底纹，
 * 分节的方式不变。用工具栏换一个信号色试试。
 */
export const Sequence: Story = {
  render: () => (
    <div className="grid max-w-xl gap-ark-6">
      <NumberedSection number={1} title="活动说明" sub="Event Info">
        <KeyValueList>
          <KeyValue label="活动时间" tone="signal">
            <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
          </KeyValue>
          <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
        </KeyValueList>
      </NumberedSection>
      <NumberedSection number={2} title="新增干员" sub="New Operators">
        <KeyValueList>
          <KeyValue label="寻访时间">
            <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
          </KeyValue>
          <KeyValue label="出现概率">限定寻访期间提升</KeyValue>
        </KeyValueList>
      </NumberedSection>
      <NumberedSection number={3} title="注意事项" sub="Notice">
        <p className="m-0 text-ark-caption leading-ark-body text-ark-fg-muted">
          本页内容为演示用的占位文案，不对应任何真实活动。
        </p>
      </NumberedSection>
    </div>
  ),
}
