import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useState } from 'react'
import { ActionButton } from '../ActionButton'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { KeyValue, KeyValueList } from '../KeyValue'
import { Panel } from '../Panel'
import { Tag } from '../Tag'
import { StageMap, StageNode, type StageNodeProps } from './StageMap'

const meta = {
  title: '场景/作战/StageMap',
  component: StageMap,
  subcomponents: { StageNode },
  globals: { backgrounds: { value: 'ink' } },
} satisfies Meta<typeof StageMap>

export default meta
type Story = StoryObj<typeof meta>

type Stage = Pick<StageNodeProps, 'value' | 'col' | 'row' | 'from' | 'state'> & {
  name: string
  cost: number
  level: string
}

// 编号是通用的写法，关卡名是演示用的占位文案
const stages: Stage[] = [
  { value: '1-1', col: 1, name: '前哨', cost: 6, level: '精零 10' },
  { value: '1-2', col: 2, from: '1-1', name: '旧仓库', cost: 6, level: '精零 15' },
  { value: 'TR-1', col: 3, row: -1, from: '1-2', name: '教学', cost: 0, level: '无' },
  { value: '1-3', col: 3, from: '1-2', name: '断桥', cost: 9, level: '精零 20' },
  { value: 'S1-1', col: 4, row: 1, from: '1-3', name: '支线', cost: 9, level: '精零 25' },
  { value: '1-4', col: 4, from: ['1-3', 'TR-1'], name: '闸口', cost: 9, level: '精零 30' },
  { value: '1-5', col: 5, from: '1-4', state: 'current', name: '货场', cost: 12, level: '精一 1' },
  {
    value: '1-6',
    col: 6,
    from: ['1-5', 'S1-1'],
    state: 'locked',
    name: '塔楼',
    cost: 12,
    level: '精一 10',
  },
  { value: '1-7', col: 7, from: '1-6', state: 'locked', name: '终点', cost: 18, level: '精一 20' },
]

const nodes = stages.map(({ cost: _cost, level: _level, name, value, ...stage }) => (
  <StageNode key={value} value={value} name={name} {...stage}>
    {value}
  </StageNode>
))

/**
 * 一条横向延伸的路线：主线在中间，支线向上下分叉，分叉的那一段是 45° 的折线。
 * 节点是白色的横条，左端的六边形标出进度：实心是已通关，空心是当前要打的；
 * 未解锁的是暗的虚线框，通向它的连线也是暗的虚线。点一个节点选中它，选中的那条变成黑底白字。
 */
export const Default: Story = {
  args: { defaultValue: '1-5', 'aria-label': '第一章' },
  render: args => <StageMap {...args}>{nodes}</StageMap>,
}

/** 行距由 `--ark-stage-pitch` 决定，列距始终是它的两倍，所以折线一直是 45°。 */
export const Pitch: Story = {
  args: { defaultValue: '1-3', 'aria-label': '第一章' },
  render: args => (
    <StageMap {...args} style={{ '--ark-stage-pitch': '4rem' } as CSSProperties}>
      {nodes.slice(0, 6)}
    </StageMap>
  ),
}

/**
 * 选中节点后不跳页：右侧的面板换成这一关的信息，底部是“开始行动”，代价直接写在按钮上。
 */
export const WithDetail: Story = {
  render: function Chapter() {
    const [current, setCurrent] = useState('1-5')
    const stage = stages.find(item => item.value === current)
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_18rem] items-start gap-ark-5">
        <StageMap aria-label="第一章" value={current} onValueChange={setCurrent}>
          {nodes}
        </StageMap>
        {stage && (
          <aside className="grid gap-ark-2">
            <Panel>
              <div className="flex items-start justify-between gap-ark-3">
                <Heading as="h2" size="sm" sub="OPERATION">
                  {`${stage.value} ${stage.name}`}
                </Heading>
                <Tag>{stage.state === 'current' ? '未通关' : '已通关'}</Tag>
              </div>
              <Divider variant="dash" className="my-ark-4" />
              <KeyValueList className="text-ark-label">
                <KeyValue label="推荐等级">{stage.level}</KeyValue>
                <KeyValue label="理智消耗">{stage.cost}</KeyValue>
              </KeyValueList>
            </Panel>
            <ActionButton block cost={-stage.cost} costLabel="SANITY" sub="MISSION START">
              开始行动
            </ActionButton>
          </aside>
        )}
      </div>
    )
  },
}

/**
 * `StageNode` 也可以单独当关卡标签用。三种进度：已通关、当前、未解锁；
 * `caption` 是编号上方那行极小的英文。
 */
export const Nodes: Story = {
  render: () => (
    <div className="flex gap-ark-6 pb-ark-5">
      <StageNode value="1-5" name="已通关" caption="OPERATION">
        1-5
      </StageNode>
      <StageNode value="1-6" state="current" name="当前">
        1-6
      </StageNode>
      <StageNode value="1-7" state="locked" name="未解锁">
        1-7
      </StageNode>
      <StageNode value="1-5" selected name="选中">
        1-5
      </StageNode>
    </div>
  ),
}
