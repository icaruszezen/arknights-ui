import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { EntryPanel } from './EntryPanel'

const meta = {
  title: '场景/主界面/EntryPanel',
  component: EntryPanel,
  args: { children: '编队', sub: 'Squads', className: 'h-28 w-56' },
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
 * 重磅的中文衬线贴左下，英文小注脚在其下方，其余留白。悬停时整块换色。
 * 没有加载思源宋体 Heavy 时回退到系统宋体，比例不变。
 */
export const Default: Story = {}

/**
 * 纸白留给最重要的入口：最大、最亮的那块就是该点的。右上角放当前的数值，
 * 留白处垫一个水印。
 */
export const Paper: Story = {
  args: {
    children: '作战',
    sub: 'Terminal',
    tone: 'paper',
    size: 'lg',
    aside: sanity,
    watermark: glyphs.peak,
    className: 'h-44 w-[28rem]',
  },
}

/** 三档字号：1.375rem / 2.5rem / 3.75rem，英文注脚约为中文的三分之一。 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-ark-1">
      <EntryPanel sub="Depot" className="h-20 w-40">
        仓库
      </EntryPanel>
      <EntryPanel size="md" sub="Squads" className="h-32 w-56">
        编队
      </EntryPanel>
      <EntryPanel size="lg" sub="Terminal" className="h-44 w-80">
        作战
      </EntryPanel>
    </div>
  ),
}

/**
 * 红点贴在右上角：未读、可领取。数字是数量角标。红点本身没有文字，
 * 用 `badgeLabel` 告诉读屏它表示什么。
 */
export const WithBadge: Story = {
  render: () => (
    <div className="flex gap-ark-1">
      <EntryPanel sub="Mission" badge badgeLabel="有可领取的奖励" className="h-24 w-44">
        任务
      </EntryPanel>
      <EntryPanel sub="Mail" badge={3} badgeLabel="3 封未读邮件" className="h-24 w-44">
        邮件
      </EntryPanel>
      <EntryPanel sub="Store" tone="paper" badge badgeLabel="有新的商品" className="h-24 w-44">
        采购中心
      </EntryPanel>
    </div>
  ),
}

/** 禁用的入口（尚未解锁的系统）压暗，不响应悬停。 */
export const Disabled: Story = {
  args: { disabled: true, children: '集成战略', sub: 'Locked' },
}

/** 传入 `href` 时整块面板是链接。 */
export const AsLink: Story = {
  args: { href: '#squads' },
}
