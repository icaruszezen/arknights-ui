import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scene } from '../.storybook/art'
import { glyphs } from '../.storybook/glyphs'
import {
  ActionButton,
  BackHome,
  CostMeter,
  DeployCard,
  Divider,
  GhostTitle,
  Heading,
  HudCounter,
  HudCounterItem,
  KeyValue,
  KeyValueList,
  MicroText,
  Panel,
  Resource,
  ResourceBar,
  StageMap,
  StageNode,
  StoryControl,
  StoryControls,
  Tag,
  UnitBar,
} from './index'

// 不是组件，只是把作战相关的组件按游戏里的编排拼在一起：
// 关卡选择是一张地图，作战界面是一块 HUD——信息贴四边，战场留在中间。
// 图片全部是代码画的占位图。
const meta = {
  title: '示例/作战',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 编号是通用的写法，关卡名是演示用的占位文案
const stages = [
  { value: '1-1', col: 1, name: '前哨', cost: 6, level: '精零 10' },
  { value: '1-2', col: 2, from: '1-1', name: '旧仓库', cost: 6, level: '精零 15' },
  { value: 'TR-1', col: 3, row: -1, from: '1-2', name: '教学', cost: 0, level: '无' },
  { value: '1-3', col: 3, from: '1-2', name: '断桥', cost: 9, level: '精零 20' },
  { value: '1-4', col: 4, from: ['1-3', 'TR-1'], name: '闸口', cost: 9, level: '精零 30' },
  { value: '1-5', col: 5, from: '1-4', state: 'current', name: '货场', cost: 12, level: '精一 1' },
  { value: '1-6', col: 6, from: '1-5', state: 'locked', name: '塔楼', cost: 12, level: '精一 10' },
] as const

export const StageSelect: Story = {
  name: '关卡选择',
  render: function Chapter() {
    const [current, setCurrent] = useState('1-5')
    const stage = stages.find(item => item.value === current) ?? stages[0]
    return (
      <div className="relative isolate -m-ark-6 grid min-h-screen grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-ark-neutral-black/55">
        <GhostTitle className="absolute bottom-ark-4 left-ark-7 -z-1">Episode 01</GhostTitle>
        <MicroText vertical className="absolute right-ark-2 bottom-ark-7 text-ark-fg-muted">
          {'ARKNIGHTS-UI // UNOFFICIAL'}
        </MicroText>

        <div className="flex items-start justify-between">
          <BackHome />
          <ResourceBar>
            <Resource label="理智" value={131} max={135} />
          </ResourceBar>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_20rem] items-center gap-ark-6 px-ark-7 pb-ark-7 portrait:grid-cols-1">
          <div className="grid gap-ark-6">
            <Heading as="h1" size="md" sub="EPISODE 01">
              第一章
            </Heading>
            {/* 把列表画成地图：关卡之间的先后与分支用空间位置来表达 */}
            <StageMap aria-label="第一章" value={current} onValueChange={setCurrent}>
              {stages.map(({ cost: _cost, level: _level, name, value, ...rest }) => (
                <StageNode key={value} value={value} name={name} caption="OPERATION" {...rest}>
                  {value}
                </StageNode>
              ))}
            </StageMap>
          </div>

          <aside className="grid gap-ark-2">
            <Panel>
              <div className="flex items-start justify-between gap-ark-3">
                <Heading as="h2" size="sm" sub="OPERATION">
                  {`${stage.value} ${stage.name}`}
                </Heading>
                <Tag>{'state' in stage && stage.state === 'current' ? '未通关' : '已通关'}</Tag>
              </div>
              <Divider variant="dash" className="my-ark-4" />
              <KeyValueList className="text-ark-label">
                <KeyValue label="推荐等级">{stage.level}</KeyValue>
                <KeyValue label="敌方情报">3 种</KeyValue>
              </KeyValueList>
            </Panel>
            {/* 代价直接写在按钮上 */}
            <ActionButton block cost={-stage.cost} costLabel="SANITY" sub="MISSION START">
              开始行动
            </ActionButton>
          </aside>
        </div>
      </div>
    )
  },
}

const deck = [
  { id: 'a', cost: 12, glyph: glyphs.chevrons, body: '#9aa3a8' },
  { id: 'b', cost: 19, glyph: glyphs.shield, body: '#a39a8f' },
  { id: 'c', cost: 21, glyph: glyphs.target, body: '#8f9aa3' },
  { id: 'd', cost: 9, glyph: glyphs.slashes, body: '#a09aa8' },
  { id: 'e', cost: 14, glyph: glyphs.cross, body: '#9aa39a', cooldown: 17 },
  { id: 'f', cost: 32, glyph: glyphs.diamond, body: '#a3a09a' },
]

export const Hud: Story = {
  name: '作战 HUD',
  render: function Battle() {
    const [selected, setSelected] = useState<string | null>('d')
    const [speed, setSpeed] = useState(1)
    const [paused, setPaused] = useState(false)
    const cost = 23
    return (
      <div className="relative isolate -m-ark-6 h-screen min-h-[32rem] overflow-hidden">
        <img
          src={scene('#3e4a52', '#161b1e')}
          alt=""
          className="absolute inset-0 -z-3 block size-full object-cover opacity-70"
        />
        {/* 战场：一张透视的格子。选中了干员时，可部署的地块用半透明的信号色高亮 */}
        <svg
          aria-hidden="true"
          viewBox="0 0 720 405"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="absolute inset-0 -z-2 block size-full"
        >
          <g className="stroke-ark-neutral-white/15">
            <path d="M150 300 570 300 520 120 200 120Z" />
            <path d="M163 255H557M175 210H545M188 165H532" />
            <path d="M234 300 264 120M318 300 328 120M402 300 392 120M486 300 456 120" />
          </g>
          {selected && (
            <path
              d="M402 255 479 255 472 210 400 210Z"
              className="fill-ark-signal/30 stroke-none"
            />
          )}
        </svg>

        {/* 单位头顶的细条：蓝是我方的生命，黄绿是技力；敌方是红 */}
        <div className="absolute top-[46%] left-[60%]">
          <UnitBar
            value={76}
            skill={18}
            skillMax={34}
            label="我方单位的生命"
            skillLabel="我方单位的技力"
            className="absolute -top-ark-3 left-1/2 -translate-x-1/2"
          />
          <div aria-hidden="true" className="size-9 bg-ark-signal-info-deep/90" />
        </div>
        <div className="absolute top-[30%] left-[27%]">
          <UnitBar
            side="enemy"
            value={41}
            label="敌方单位的生命"
            className="absolute -top-ark-2 left-1/2 -translate-x-1/2"
          />
          <div aria-hidden="true" className="size-9 bg-ark-signal-danger/80" />
        </div>

        {/* 战况置顶居中 */}
        <HudCounter className="absolute top-0 left-1/2 -translate-x-1/2">
          <HudCounterItem side="enemy" label="击杀" value={12} max={47} />
          <HudCounterItem side="ally" label="生命点数" value={3} />
        </HudCounter>

        {/* 设置在左上，倍速和暂停成组靠右上：都是 5rem 的方块 */}
        <StoryControls aria-label="作战设置" className="absolute top-ark-3 left-ark-3">
          <StoryControl shape="square" icon={glyphs.gear} aria-label="设置" />
        </StoryControls>
        <StoryControls aria-label="作战控制" className="absolute top-ark-3 right-ark-3">
          <StoryControl
            shape="square"
            icon={speed === 1 ? glyphs.play : glyphs.forward}
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          >
            {`${speed}X`}
          </StoryControl>
          <StoryControl
            shape="square"
            icon={glyphs.pause}
            aria-label="暂停"
            pressed={paused}
            onClick={() => setPaused(!paused)}
          />
        </StoryControls>

        {/* 底部卡带：比当前费用贵的卡自动压暗 */}
        <ul className="absolute bottom-0 left-1/2 m-0 flex -translate-x-1/2 list-none items-end gap-ark-1 p-0">
          {deck.map((card, index) => (
            <li key={card.id} className="flex">
              <DeployCard
                label={`占位干员 ${index + 1}`}
                cost={card.cost}
                src={figure(card.body)}
                classIcon={card.glyph}
                cooldown={card.cooldown}
                insufficient={card.cost > cost}
                selected={card.id === selected}
                onClick={() => setSelected(card.id === selected ? null : card.id)}
              />
            </li>
          ))}
        </ul>

        {/* 费用是全屏最大的数字，贴右边，压在卡带上方 */}
        <CostMeter
          value={cost}
          progress={0.65}
          deployable={6}
          className="absolute right-0 bottom-36"
        />
      </div>
    )
  },
}
