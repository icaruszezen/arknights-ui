import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scenes } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { Button } from '../Button'
import { Countdown } from '../Countdown'
import { Drawer } from '../Drawer'
import { OperatorAvatar } from '../OperatorAvatar'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { RoomCard, type RoomKind, roomSignal } from './RoomCard'

const meta = {
  title: '场景/基建/RoomCard',
  component: RoomCard,
  args: { title: '制造站', level: 3, status: '生产中', kind: 'factory', className: 'w-72' },
} satisfies Meta<typeof RoomCard>

export default meta
type Story = StoryObj<typeof meta>

// 占位用的几何剪影和场景，代码画的
const crew = (count: number, buffLevel: number) => (
  <div className="flex gap-ark-1">
    {Array.from({ length: 3 }, (_, index) =>
      index < count ? (
        <OperatorAvatar
          // biome-ignore lint/suspicious/noArrayIndexKey: 进驻位的顺序是固定的
          key={index}
          src={figure()}
          alt={`占位干员 ${index + 1}`}
          className="size-11"
          buff={glyphs.chevrons}
          buffLevel={Math.max(1, buffLevel - index)}
          mood={20 - index * 8}
        />
      ) : (
        // biome-ignore lint/suspicious/noArrayIndexKey: 进驻位的顺序是固定的
        <OperatorAvatar key={index} alt="空位" className="size-11" />
      ),
    )}
  </div>
)

/**
 * 一个房间：深色的实底，左侧一条类型色的粗边。标题后面的小竖条是等级，下面一行类型色的小字
 * 是它现在在做什么，再下面是它的现状。进度条和头像右下角的圆环都跟着类型色走。
 */
export const Default: Story = {
  render: args => (
    <RoomCard {...args}>
      {crew(2, 3)}
      <Progress aria-label="制造进度" variant="thick" value={62} segments={5} />
    </RoomCard>
  ),
}

/** 类型色取自实机：制造站黄、贸易站蓝、发电站黄绿，其余设施用中性色。 */
export const Kinds: Story = {
  render: () => (
    <div className="grid w-[38rem] grid-cols-2 gap-ark-1">
      {(
        [
          ['factory', '制造站', '生产中'],
          ['trading', '贸易站', '获取中'],
          ['power', '发电站', '发电中'],
          ['neutral', '宿舍', '休息中'],
        ] as const
      ).map(([kind, title, status]) => (
        <RoomCard key={kind} kind={kind} title={title} status={status} level={3}>
          <Progress aria-label={`${title}进度`} variant="thick" value={45} segments={5} />
        </RoomCard>
      ))}
    </div>
  ),
}

/**
 * 有待处理的事时整张卡片被类型色圈起来：`badge` 为真是右上角一个橙色的角，数字是计数色块。
 * 平时只有左侧那条粗边。
 */
export const Attention: Story = {
  render: () => (
    <div className="grid w-[38rem] grid-cols-2 gap-ark-1">
      <RoomCard kind="trading" title="贸易站" status="获取中" level={3} />
      <RoomCard
        kind="trading"
        title="贸易站"
        status="获取中"
        level={3}
        badge
        badgeLabel="有可交付的订单"
      />
      <RoomCard kind="factory" title="制造站" status="生产中" level={2} badge={3} />
    </div>
  ),
}

/**
 * `src` 给房间垫一张内景图，压暗之后文字仍然读得清。需要中英成对或者一个图标时，
 * `sub` 和 `icon` 仍然可用——实机的总览上没有这两样。
 */
export const WithScene: Story = {
  args: {
    src: scenes[1],
    icon: glyphs.blocks,
    sub: 'Factory',
    badge: true,
    badgeLabel: '有可收取的产出',
  },
  render: args => <RoomCard {...args}>{crew(3, 3)}</RoomCard>,
}

/**
 * 房间就是入口：点一下，详情以抽屉的形式从右侧滑入，背后的房间仍然可见。
 * 把 `roomSignal` 里同一个类加到抽屉上，类型色就从房间一路标到抽屉的强调边和进度条。
 */
export const OpensDrawer: Story = {
  render: function Base() {
    const [open, setOpen] = useState<RoomKind | null>(null)
    const rooms = [
      { kind: 'factory', title: '制造站', sub: 'Factory', status: '生产中', output: '赤金' },
      {
        kind: 'trading',
        title: '贸易站',
        sub: 'Trading Post',
        status: '获取中',
        output: '龙门币订单',
      },
      { kind: 'power', title: '发电站', sub: 'Power Plant', status: '发电中', output: '无人机' },
    ] as const
    const current = rooms.find(room => room.kind === open)
    return (
      <div className="grid w-[30rem] gap-ark-1">
        {rooms.map(room => (
          <RoomCard
            key={room.kind}
            kind={room.kind}
            title={room.title}
            status={room.status}
            level={3}
            onClick={() => setOpen(room.kind)}
          >
            {crew(2, 2)}
          </RoomCard>
        ))}
        <Drawer
          accent
          open={current !== undefined}
          onOpenChange={() => setOpen(null)}
          title={current?.title}
          sub={current?.sub}
          className={current && roomSignal[current.kind]}
          footer={<Button block>收取产物</Button>}
        >
          <div className="grid gap-ark-5">
            {crew(2, 3)}
            <Stat label="Output" value={current?.output ?? ''} size="sm" orientation="horizontal" />
            <Progress aria-label="进度" variant="thick" value={62} segments={5} />
            <Stat
              label="Remaining"
              value={<Countdown seconds={8076} />}
              size="sm"
              orientation="horizontal"
            />
          </div>
        </Drawer>
      </div>
    )
  },
}
