import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { EntryPanel } from './EntryPanel'

const meta = {
  title: '场景/主界面/EntryPanel',
  component: EntryPanel,
  args: { children: '干员', sub: '角色管理', className: 'h-28 w-56' },
} satisfies Meta<typeof EntryPanel>

export default meta
type Story = StoryObj<typeof meta>

// 右上角的数值：面板是按钮，里面只放行内元素
const sanity = (
  <>
    <span className="font-ark-data text-ark-h2 leading-ark-solid font-ark-bold">
      131
      <span className="text-ark-caption font-ark-regular text-ark-fg-muted">/135</span>
    </span>
    <span className="mt-ark-1 font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted">
      SANITY
    </span>
  </>
)

/**
 * 重磅的中文衬线贴左上，下面一行灰色的小字，其余留白。悬停时整块换色。
 * 没有加载思源宋体 Heavy 时回退到系统宋体，比例不变。
 */
export const Default: Story = {}

/**
 * 纸白是实机主界面上最常见的一种：终端、编队、干员、任务、基建都是它。
 * 右上角放当前的数值，留白处垫一个水印。
 */
export const Paper: Story = {
  args: {
    children: '终端',
    sub: undefined,
    tone: 'paper',
    size: 'lg',
    aside: sanity,
    watermark: glyphs.peak,
    className: 'h-44 w-[28rem]',
  },
}

/**
 * 三种表面：石墨、纸白、信号色。实机上采购中心、公开招募、干员寻访是蓝色的面板，
 * 入口名居中——`tone="signal"` 加 `align="center"`。
 */
export const Tones: Story = {
  render: () => (
    <div className="flex gap-ark-1">
      <EntryPanel className="h-24 w-44">仓库</EntryPanel>
      <EntryPanel tone="paper" sub="角色管理" className="h-24 w-44">
        干员
      </EntryPanel>
      <EntryPanel tone="signal" align="center" className="h-24 w-44">
        采购中心
      </EntryPanel>
    </div>
  ),
}

/** `align` 决定入口名在哪：贴左上（默认，实机现行界面）、居中、贴左下（旧版界面）。 */
export const Align: Story = {
  render: () => (
    <div className="flex gap-ark-1">
      {(['top', 'center', 'bottom'] as const).map(align => (
        <EntryPanel key={align} tone="paper" align={align} sub={align} className="h-32 w-44">
          编队
        </EntryPanel>
      ))}
    </div>
  ),
}

/** 三档字号：1.375rem / 2.5rem / 3.75rem，下面的小字约为入口名的三分之一。 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-ark-1">
      <EntryPanel className="h-20 w-40">仓库</EntryPanel>
      <EntryPanel size="md" sub="角色管理" className="h-32 w-56">
        干员
      </EntryPanel>
      <EntryPanel size="lg" className="h-44 w-80">
        终端
      </EntryPanel>
    </div>
  ),
}

/**
 * 提醒标记压在右上角：未读、可领取。数字是计数色块。提醒标记本身没有文字，
 * 用 `badgeLabel` 告诉读屏它表示什么。
 */
export const WithBadge: Story = {
  render: () => (
    <div className="flex gap-ark-1">
      <EntryPanel badge badgeLabel="有可领取的奖励" className="h-24 w-44">
        任务
      </EntryPanel>
      <EntryPanel badge={3} badgeLabel="3 封未读邮件" className="h-24 w-44">
        邮件
      </EntryPanel>
      <EntryPanel tone="paper" badge badgeLabel="有新的档案" className="h-24 w-44">
        档案
      </EntryPanel>
    </div>
  ),
}

/** 禁用的入口（尚未解锁的系统）压暗，不响应悬停。 */
export const Disabled: Story = {
  args: { disabled: true, children: '集成战略', sub: '尚未解锁' },
}

/** 传入 `href` 时整块面板是链接。 */
export const AsLink: Story = {
  args: { href: '#squads' },
}
