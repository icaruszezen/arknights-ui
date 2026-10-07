import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { Tag } from '../Tag'
import { Sheet, type SheetProps } from './Sheet'

const meta = {
  title: '面板与卡片/Sheet',
  component: Sheet,
  args: { open: false, title: '职业详情', sub: 'CLASS DETAILS' },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

// 浮层下面要有内容，才看得出“下层仍然隐约可见”
function Page({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-[36rem] max-w-full gap-ark-2">
      <div className="grid grid-cols-2 gap-ark-2">
        <Panel tone="paper" accent="left">
          <Heading as="h3" size="sm" sub="GUARD">
            近卫
          </Heading>
          <Stat label="Attack" value={615} size="sm" className="mt-ark-4" />
        </Panel>
        <Panel>
          <Heading as="h3" size="sm" sub="TRUST">
            信赖
          </Heading>
          <Stat label="Trust" value={131} max={200} size="sm" className="mt-ark-4" />
        </Panel>
      </div>
      <div className="h-24 bg-ark-signal" />
      {children}
    </div>
  )
}

function Demo({ trigger, ...props }: Omit<SheetProps, 'open'> & { trigger: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Page>
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <Sheet {...props} open={open} onOpenChange={setOpen} />
    </Page>
  )
}

/**
 * 在当前页面上呼出的毛玻璃浮层：黑 50% 加模糊，1px 细描边，不切角、没有投影。
 * 下层整页被压暗并模糊，用户能看出自己没有离开原来的页面。
 */
export const Default: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看职业详情" {...args}>
      <div className="grid gap-ark-4 text-ark-label leading-ark-body text-ark-fg-secondary">
        <div className="flex gap-ark-2">
          <Tag variant="solid" cut>
            近卫
          </Tag>
          <Tag>输出</Tag>
          <Tag>生存</Tag>
        </div>
        <p className="m-0">近卫干员擅长近身作战，可以阻挡敌人并造成稳定的伤害。</p>
        <Divider variant="dash" />
        <Stat label="Block" value={2} size="sm" orientation="horizontal" />
        <Stat label="Redeploy" value={70} unit="s" size="sm" orientation="horizontal" />
      </div>
    </Demo>
  ),
}

/**
 * 不透明的面：游戏内采购、兑换的弹层不是毛玻璃，而是实心的石墨或纸白。
 * 纸白的浮层里，子组件自动换成深色前景。
 */
export const Opaque: Story = {
  args: { tone: 'paper', title: '兑换物资', sub: 'EXCHANGE' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="兑换" {...args}>
      <div className="grid gap-ark-4 text-ark-label leading-ark-body text-ark-fg-secondary">
        <div className="flex gap-ark-2">
          <Tag variant="solid">聚合剂</Tag>
          <Tag>已有 5</Tag>
        </div>
        <p className="m-0">精密穿戴装备中常用的材料，多作为隔绝涂层使用。</p>
        <Divider variant="dash" />
        <Stat label="Price" value={100} size="sm" orientation="horizontal" />
      </div>
    </Demo>
  ),
}

/** 没有标题时，用 `aria-label` 给浮层一个名称。 */
export const WithoutTitle: Story = {
  args: { title: undefined, sub: undefined, 'aria-label': '签到奖励' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="签到" {...args}>
      <p className="m-0 text-ark-body leading-ark-body">今日签到奖励已发放至邮箱。</p>
    </Demo>
  ),
}

/** 内容超过屏高时在浮层里面滚动，标题栏不动。 */
export const LongContent: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看更新日志" {...args} title="更新日志" sub="CHANGELOG">
      <div className="grid gap-ark-4 text-ark-label leading-ark-body text-ark-fg-secondary">
        {Array.from({ length: 16 }, (_, index) => index + 1).map(entry => (
          <p key={entry} className="m-0">
            {String(entry).padStart(2, '0')} ·
            调整了若干界面的排版与交互反馈，修正了部分文本的显示问题。
          </p>
        ))}
      </div>
    </Demo>
  ),
}
