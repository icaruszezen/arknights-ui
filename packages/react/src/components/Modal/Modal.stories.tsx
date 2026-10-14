import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { Tag } from '../Tag'
import { Modal, type ModalProps } from './Modal'

const meta = {
  title: '面板与浮层/Modal',
  component: Modal,
  args: { open: false, title: '导出记录', sub: 'EXPORT' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// 弹层下面要有内容，才看得出“下层仍然隐约可见”
function Page({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-[36rem] max-w-full gap-ark-2">
      <div className="grid grid-cols-2 gap-ark-2">
        <Panel tone="inverse" accent="left">
          <Heading as="h3" size="sm" sub="RECORDS">
            记录
          </Heading>
          <Stat label="Total" value={1284} size="sm" className="mt-ark-4" />
        </Panel>
        <Panel>
          <Heading as="h3" size="sm" sub="QUOTA">
            配额
          </Heading>
          <Stat label="Used" value={131} max={200} size="sm" className="mt-ark-4" />
        </Panel>
      </div>
      <div className="h-24 bg-ark-signal" />
      {children}
    </div>
  )
}

function Demo({ trigger, ...props }: Omit<ModalProps, 'open'> & { trigger: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Page>
      <Button onClick={() => setOpen(true)}>{trigger}</Button>
      <Modal {...props} open={open} onOpenChange={setOpen} />
    </Page>
  )
}

/**
 * 在当前页面上呼出的弹层：直角、没有投影，下层整页被压暗并模糊，
 * 用户能看出自己没有离开原来的页面。操作放在固定的底栏里，取消在左、确认在右。
 */
export const Default: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="导出"
      {...args}
      footer={
        <>
          <Button variant="ghost">取消</Button>
          <Button variant="primary">导出 CSV</Button>
        </>
      }
    >
      <div className="grid gap-ark-4 text-ark-label leading-ark-body text-ark-fg-secondary">
        <div className="flex gap-ark-2">
          <Tag variant="solid">本月</Tag>
          <Tag>已完成</Tag>
          <Tag>全部成员</Tag>
        </div>
        <p className="m-0">导出的文件包含当前筛选条件下的全部记录，生成后会发到你的邮箱。</p>
        <Divider variant="dash" />
        <Stat label="Rows" value={1284} size="sm" orientation="horizontal" />
        <Stat label="Size" value={2.4} unit="MB" size="sm" orientation="horizontal" />
      </div>
    </Demo>
  ),
}

/** 三档宽度：24rem、36rem、56rem；窄屏上一律通栏、贴底。 */
export const Sizes: Story = {
  render: function Render({ open: _open, ...args }) {
    const [size, setSize] = useState<ModalProps['size']>()
    return (
      <Page>
        <div className="flex gap-ark-3">
          {(['sm', 'md', 'lg', 'full'] as const).map(value => (
            <Button key={value} onClick={() => setSize(value)}>
              {value.toUpperCase()}
            </Button>
          ))}
        </div>
        <Modal
          {...args}
          size={size ?? 'md'}
          open={size !== undefined}
          onOpenChange={() => setSize(undefined)}
        >
          <p className="m-0 text-ark-label leading-ark-body text-ark-fg-secondary">
            宽度由 `size` 决定，高度随内容，最高不超过视口。
          </p>
        </Modal>
      </Page>
    )
  },
}

/** 反色面：与所在主题明暗相反，里面的子组件自动换成对应的前景。 */
export const Inverse: Story = {
  args: { tone: 'inverse', title: '兑换物资', sub: 'EXCHANGE' },
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

/** 毛玻璃：半透明加模糊，一圈 1px 细线。 */
export const Frosted: Story = {
  args: { tone: 'frosted', title: '快捷键', sub: 'SHORTCUTS' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="查看快捷键" {...args}>
      <div className="grid gap-ark-3 text-ark-label text-ark-fg-secondary">
        <Stat label="Search" value="/" size="sm" orientation="horizontal" />
        <Stat label="Command" value="Ctrl K" size="sm" orientation="horizontal" />
      </div>
    </Demo>
  ),
}

/** 没有标题时，用 `aria-label` 给弹层一个名称。 */
export const WithoutTitle: Story = {
  args: { title: undefined, sub: undefined, 'aria-label': '签到奖励' },
  render: ({ open: _open, ...args }) => (
    <Demo trigger="签到" {...args}>
      <p className="m-0 text-ark-base leading-ark-body">今日签到奖励已发放至邮箱。</p>
    </Demo>
  ),
}

/** 内容超过屏高时在弹层里面滚动，标题栏和底栏不动。 */
export const LongContent: Story = {
  render: ({ open: _open, ...args }) => (
    <Demo
      trigger="查看更新日志"
      {...args}
      title="更新日志"
      sub="CHANGELOG"
      footer={<Button variant="primary">知道了</Button>}
    >
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
