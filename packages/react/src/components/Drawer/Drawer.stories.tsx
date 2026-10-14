import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useState } from 'react'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { Tag } from '../Tag'
import { Drawer, type DrawerProps } from './Drawer'

const meta = {
  title: '面板与浮层/Drawer',
  component: Drawer,
  args: { open: false, title: '构建详情', sub: 'BUILD #0147' },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function Detail() {
  return (
    <div className="grid gap-ark-5">
      <div className="flex gap-ark-2">
        <Tag variant="solid">main</Tag>
        <Tag>运行中</Tag>
      </div>
      <Stat label="Stage" value="集成测试" size="sm" orientation="horizontal" />
      <div className="grid gap-ark-2">
        <Progress aria-label="构建进度" variant="thick" color="warning" value={62} segments={5} />
        <p className="m-0 text-right font-ark-data text-ark-caption text-ark-fg-muted">02:14:36</p>
      </div>
      <Divider variant="dash" />
      <Stat label="Coverage" value="+3.5" unit="%" size="sm" orientation="horizontal" />
      <Stat label="Runners" value={3} max={3} size="sm" orientation="horizontal" />
    </div>
  )
}

function Demo({ trigger, ...props }: Omit<DrawerProps, 'open'> & { trigger: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <Drawer {...props} open={open} onOpenChange={setOpen} />
    </>
  )
}

/**
 * 从右侧滑入，占屏宽的四成左右，左侧的主画面被压暗但仍然看得见。
 * 点关闭、按 Esc 或者点主画面都直接关，没有二次确认。
 */
export const Default: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看构建" {...args}>
      <Detail />
    </Demo>
  ),
}

/** 三个方向：右边放详情，左边放导航，下边放窄屏上的操作。 */
export const Sides: Story = {
  render: function Render({ open: _open, ...args }) {
    const [side, setSide] = useState<DrawerProps['side']>()
    return (
      <>
        <div className="flex gap-ark-3">
          <Button onClick={() => setSide('left')}>左</Button>
          <Button onClick={() => setSide('bottom')}>下</Button>
          <Button onClick={() => setSide('right')}>右</Button>
        </div>
        <Drawer
          {...args}
          side={side ?? 'right'}
          size="sm"
          open={side !== undefined}
          onOpenChange={() => setSide(undefined)}
        >
          <Detail />
        </Drawer>
      </>
    )
  },
}

/** 反色的抽屉：与所在主题明暗相反。里面的子组件自动换成对应的前景。 */
export const Inverse: Story = {
  args: { tone: 'inverse', title: '成员信息', sub: 'MEMBER' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看成员" {...args}>
      <Detail />
    </Demo>
  ),
}

/** 底栏固定在底部，不随正文滚动，放这个抽屉的主要操作。 */
export const WithFooter: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="查看订单"
      {...args}
      title="待处理订单"
      sub="ORDERS"
      footer={
        <Button variant="primary" size="lg" block sub="3 ORDERS">
          全部交付
        </Button>
      }
    >
      <Detail />
    </Demo>
  ),
}

/**
 * 主题色标记归属：打开 `accent`，朝主画面的那一缘多一条信号色的强调边。再在抽屉上覆盖 `--ark-signal`，
 * 从列表到抽屉到进度条都是同一种颜色，用户始终知道自己在哪个系统里。
 */
export const TypeColor: Story = {
  args: { accent: true },
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="查看供能"
      {...args}
      title="供能"
      sub="POWER"
      style={{ '--ark-signal': 'var(--ark-color-signal-success)' } as CSSProperties}
    >
      <div className="grid gap-ark-5">
        <Stat label="Power" value={270} max={360} size="sm" orientation="horizontal" />
        <Progress aria-label="负载" value={48} />
      </div>
    </Demo>
  ),
}

/** 正文超过一屏时在抽屉里面滚动，标题栏和底栏不动。 */
export const LongContent: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看日志" {...args} title="运行日志" sub="LOG">
      <div className="grid divide-y divide-ark-rule">
        {Array.from({ length: 24 }, (_, index) => index + 1).map(day => (
          <Stat
            key={day}
            label={`DAY ${String(day).padStart(2, '0')}`}
            value={day * 120}
            size="sm"
            orientation="horizontal"
            className="py-ark-3"
          />
        ))}
      </div>
    </Demo>
  ),
}
