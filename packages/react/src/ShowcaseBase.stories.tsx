import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../.storybook/art'
import { glyphs } from '../.storybook/glyphs'
import { fitScreen } from '../.storybook/scale'
import {
  BackHome,
  Badge,
  Button,
  Countdown,
  Divider,
  Drawer,
  GhostTitle,
  Heading,
  MoodBar,
  OperatorAvatar,
  Progress,
  RoomCard,
  type RoomKind,
  roomSignal,
  Stat,
} from './index'

// 不是组件，只是把基建相关的组件按游戏里的编排拼在一起：
// 基建的总览，每个房间左侧一条类型色的粗边；点房间，详情从右侧的抽屉滑入，背后的房间仍然可见。
// 图片全部是代码画的占位图。
const meta = {
  title: '示例/基建',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  // 游戏内的界面按 1280 × 720 排：根字号随画布等比缩放，画布多大都是完整的一屏
  decorators: [fitScreen('game')],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

interface Room {
  id: string
  kind: RoomKind
  title: string
  sub: string
  status: string
  level: number
  crew: number
  span: string
  output?: string
  progress?: number
  ready?: boolean
}

// 一层一行，大小不一地拼在一起：像一张建筑剖面图
const rooms: Room[] = [
  {
    id: 'control',
    kind: 'neutral',
    title: '控制中枢',
    sub: 'Control Center',
    status: '运转中',
    level: 5,
    crew: 3,
    span: 'col-span-6',
  },
  {
    id: 'factory-1',
    kind: 'factory',
    title: '制造站',
    sub: 'Factory',
    status: '生产中',
    level: 3,
    crew: 3,
    span: 'col-span-2',
    output: '赤金',
    progress: 62,
    ready: true,
  },
  {
    id: 'trading',
    kind: 'trading',
    title: '贸易站',
    sub: 'Trading Post',
    status: '获取中',
    level: 3,
    crew: 2,
    span: 'col-span-2',
    output: '龙门币订单',
    progress: 38,
  },
  {
    id: 'power',
    kind: 'power',
    title: '发电站',
    sub: 'Power Plant',
    status: '发电中',
    level: 3,
    crew: 1,
    span: 'col-span-2',
    output: '无人机',
    progress: 80,
  },
  {
    id: 'factory-2',
    kind: 'factory',
    title: '制造站',
    sub: 'Factory',
    status: '生产中',
    level: 2,
    crew: 2,
    span: 'col-span-3',
    output: '作战记录',
    progress: 15,
  },
  {
    id: 'dorm',
    kind: 'neutral',
    title: '宿舍',
    sub: 'Dormitory',
    status: '休息中',
    level: 2,
    crew: 3,
    span: 'col-span-3',
  },
]

const moods = [22, 13, 4]

// 进驻的干员：头像右下角是加成图标和圆环，底边是心情条
function Crew({ count, size = 'size-11' }: { count: number; size?: string }) {
  return (
    <div className="flex gap-ark-1">
      {moods.map((mood, index) =>
        index < count ? (
          <OperatorAvatar
            key={mood}
            src={figure()}
            alt={`占位干员 ${index + 1}`}
            className={size}
            buff={glyphs.chevrons}
            buffLevel={3 - index}
            buffLabel={`效率加成 ${3 - index} 级`}
            mood={mood}
          />
        ) : (
          <OperatorAvatar key={mood} alt="空位" className={size} />
        ),
      )}
    </div>
  )
}

export const Base: Story = {
  name: '基建',
  render: function Infrastructure() {
    const [open, setOpen] = useState<string | null>(null)
    const current = rooms.find(room => room.id === open)
    const pending = rooms.filter(room => room.ready).length
    return (
      <div className="relative isolate -m-ark-6 min-h-screen overflow-hidden bg-ark-neutral-ink-950">
        <GhostTitle className="absolute bottom-ark-4 left-ark-7 -z-1">Rhodes Island</GhostTitle>

        <div className="flex items-start justify-between">
          <BackHome />
          {/* 汇总入口：分散在各房间的待办集中到一处 */}
          <Badge count={pending} label={`${pending} 项可收取`}>
            <Button className="m-ark-3">通知</Button>
          </Badge>
        </div>

        <div className="grid gap-ark-5 px-ark-7 pt-ark-5 pb-ark-8">
          <Heading as="h1" size="md" sub="INFRASTRUCTURE">
            基建
          </Heading>
          {/* 空间即导航：功能放进一张剖面图里，位置本身就是记忆线索 */}
          <div className="grid max-w-5xl grid-cols-6 gap-ark-1 portrait:grid-cols-1">
            {rooms.map(room => (
              <RoomCard
                key={room.id}
                kind={room.kind}
                title={room.title}
                status={room.status}
                level={room.level}
                badge={room.ready}
                badgeLabel="有可收取的产出"
                onClick={() => setOpen(room.id)}
                className={`${room.span} portrait:col-span-1`}
              >
                <Crew count={room.crew} />
                {room.progress !== undefined && (
                  <Progress
                    aria-label={`${room.title}的产出进度`}
                    variant="thick"
                    value={room.progress}
                  />
                )}
              </RoomCard>
            ))}
          </div>
        </div>

        {/* 类型色贯穿到底：同一个类加到抽屉上，强调边和进度条跟着换色。基建的抽屉是纸白的 */}
        <Drawer
          tone="paper"
          accent
          open={current !== undefined}
          onOpenChange={() => setOpen(null)}
          title={current?.title}
          sub={current?.sub}
          className={current && roomSignal[current.kind]}
          footer={current?.output ? <Button block>收取产物</Button> : undefined}
        >
          {current && (
            <div className="grid gap-ark-5">
              <Stat label="Level" value={current.level} max={5} size="sm" />
              <Divider label="CREW" variant="fade" />
              <Crew count={current.crew} size="size-14" />
              {/* 进驻信息里的心情是带字的粗条：左端写“心情”，右端写当前值和上限 */}
              <div className="grid gap-ark-3 text-ark-label">
                {moods.slice(0, current.crew).map((mood, index) => (
                  <div key={mood} className="grid gap-ark-1">
                    <span className="font-ark-bold">{`占位干员 ${index + 1}`}</span>
                    <MoodBar
                      variant="labeled"
                      value={mood}
                      aria-label={`占位干员 ${index + 1} 的心情`}
                    />
                  </div>
                ))}
              </div>
              {current.output && current.progress !== undefined && (
                <>
                  <Divider label="OUTPUT" variant="fade" />
                  <Stat label="Product" value={current.output} size="sm" orientation="horizontal" />
                  <Progress
                    aria-label="产出进度"
                    variant="thick"
                    value={current.progress}
                    segments={5}
                  />
                  <Stat
                    label="Remaining"
                    value={<Countdown seconds={(100 - current.progress) * 144} />}
                    size="sm"
                    orientation="horizontal"
                  />
                </>
              )}
            </div>
          )}
        </Drawer>
      </div>
    )
  },
}
