import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useState } from 'react'
import { ActionButton } from '../ActionButton'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { Tag } from '../Tag'
import { Drawer, type DrawerProps } from './Drawer'

const meta = {
  title: '面板与卡片/Drawer',
  component: Drawer,
  args: { open: false, title: '制造站', sub: 'FACTORY' },
  // 抽屉压住的是场景的一部分，放在有内容的底上才看得出来
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function Facility() {
  return (
    <div className="grid gap-ark-5">
      <div className="flex gap-ark-2">
        <Tag variant="solid" cut>
          LV.3
        </Tag>
        <Tag>运转中</Tag>
      </div>
      <Stat label="Output" value="赤金" size="sm" orientation="horizontal" />
      <div className="grid gap-ark-2">
        <Progress aria-label="制造进度" variant="thick" tone="action" value={62} segments={5} />
        <p className="m-0 text-right font-ark-data text-ark-caption text-ark-fg-muted">02:14:36</p>
      </div>
      <Divider variant="dash" />
      <Stat label="Efficiency" value="+35" unit="%" size="sm" orientation="horizontal" />
      <Stat label="Operators" value={3} max={3} size="sm" orientation="horizontal" />
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
    <Demo trigger="查看制造站" {...args}>
      <Facility />
    </Demo>
  ),
}

/** 纸白的抽屉：游戏内基建的进驻信息就是这种。里面的子组件自动换成深色前景。 */
export const Paper: Story = {
  args: { tone: 'paper', title: '进驻信息', sub: 'STATIONED' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看进驻信息" {...args}>
      <Facility />
    </Demo>
  ),
}

/** 底栏固定在底部，不随正文滚动，放这个抽屉的主要操作。 */
export const WithFooter: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="查看贸易站"
      {...args}
      title="贸易站"
      sub="TRADING POST"
      footer={
        <ActionButton block cost={3} costLabel="ORDERS" sub="DELIVER ALL">
          交付订单
        </ActionButton>
      }
    >
      <Facility />
    </Demo>
  ),
}

/**
 * 主题色标记归属：打开 `accent`，左缘多一条信号色的强调边。再在抽屉上覆盖 `--ark-signal`，
 * 从房间到抽屉到进度条都是同一种颜色，用户始终知道自己在哪个系统里。
 * 实机的抽屉没有这条边，所以它默认是关的。
 */
export const TypeColor: Story = {
  args: { accent: true },
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="查看发电站"
      {...args}
      title="发电站"
      sub="POWER PLANT"
      style={{ '--ark-signal': 'var(--ark-color-signal-success)' } as CSSProperties}
    >
      <div className="grid gap-ark-5">
        <Stat label="Power" value={270} max={360} size="sm" orientation="horizontal" />
        <Progress aria-label="无人机回复" value={48} />
      </div>
    </Demo>
  ),
}

/** 正文超过一屏时在抽屉里面滚动，标题栏和底栏不动。 */
export const LongContent: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看进驻记录" {...args} title="进驻记录" sub="LOG">
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
