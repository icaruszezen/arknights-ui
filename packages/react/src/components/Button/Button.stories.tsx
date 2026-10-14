import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Button } from './Button'
import { IconButton } from './IconButton'

const meta = {
  title: '按钮/Button',
  component: Button,
  args: { children: '查看全部' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** 默认是描边的次按钮：并列的次要操作都用它。 */
export const Secondary: Story = {}

/** 主按钮：信号色实心块 + 黑字。一屏只放一个。 */
export const Primary: Story = {
  args: { variant: 'primary', children: '保存设置' },
}

/** 六个层级。悬停都是整块换色，300ms。 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-ark-4">
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="subtle">安静</Button>
      <Button variant="ghost">无底</Button>
      <Button variant="inverse">反色</Button>
      <Button variant="danger">删除</Button>
    </div>
  ),
}

/**
 * 五档高度：1.5 / 2 / 2.5 / 3 / 3.75rem。`md` 是默认；`xs`、`sm` 给工具栏和表格行，
 * 可见形状不到 44px 的几档，触屏上点击区会自动撑大。
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-ark-4">
      <Button size="xs" variant="subtle">
        XS
      </Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl" variant="primary" sub="READ MORE" arrow>
        更多情报
      </Button>
    </div>
  ),
}

/**
 * `xl` 是官网那条长按钮（实测 14.375rem × 3.75rem）：中文在上、英文在下，文字贴左，折线箭头贴右。
 * 用在落地页、专题页的主行动上。
 */
export const Bilingual: Story = {
  args: { variant: 'primary', size: 'xl', children: '更多情报', sub: 'READ MORE', arrow: true },
}

/** 点了会花掉什么，直接写在按钮里。 */
export const WithCost: Story = {
  args: { variant: 'primary', size: 'lg', children: '兑换', sub: '-180 CREDIT' },
}

/** 图标紧挨着文字；`arrow` 表示点了会跳转，贴在右端。 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-ark-4">
      <Button icon={glyphs.bars}>筛选</Button>
      <Button variant="subtle" iconEnd={glyphs.chevrons}>
        排序
      </Button>
      <Button variant="subtle" size="xs" arrow className="min-w-[7.625rem] font-ark-data">
        READ MORE
      </Button>
    </div>
  ),
}

/**
 * 成对的操作位置固定：取消在左、确认在右，等宽对开。
 * 要强调的那一个用 `primary`（建设性的）或 `danger`（不可撤回的）。
 */
export const Pair: Story = {
  render: () => (
    <div className="grid w-96 gap-ark-4">
      <div className="grid grid-cols-2">
        <Button variant="subtle" size="lg" block>
          取消
        </Button>
        <Button variant="primary" size="lg" block>
          确认
        </Button>
      </div>
      <div className="grid grid-cols-2">
        <Button variant="subtle" size="lg" block>
          保留
        </Button>
        <Button variant="danger" size="lg" block>
          删除记录
        </Button>
      </div>
    </div>
  ),
}

/** 选中是整块明暗对调，和悬停的区别是它一直保持。处理中的按钮保持原色，换上旋转指示。 */
export const States: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button variant="primary">默认</Button>
        <Button variant="primary" loading>
          保存中
        </Button>
        <Button variant="primary" disabled>
          禁用
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button>描边</Button>
        <Button selected>选中</Button>
        <Button disabled>禁用</Button>
      </div>
      <div className="flex flex-wrap items-center gap-ark-4">
        <Button variant="subtle">安静</Button>
        <Button variant="subtle" cut>
          切一个角
        </Button>
        <Button variant="subtle" cut disabled>
          禁用
        </Button>
      </div>
    </div>
  ),
}

/** 只有图形的方形按钮，名称由 `label` 给出。 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-ark-4">
      <IconButton label="筛选" size="sm">
        {glyphs.bars}
      </IconButton>
      <IconButton label="设置">{glyphs.gear}</IconButton>
      <IconButton label="播放" variant="primary" size="lg">
        {glyphs.play}
      </IconButton>
      <IconButton label="收藏" variant="secondary" selected>
        {glyphs.diamond}
      </IconButton>
      <IconButton label="删除" variant="subtle" disabled>
        {glyphs.cross}
      </IconButton>
    </div>
  ),
}

/** 传入 `href` 时渲染为链接；`as` 可以换成路由库的 `Link`。 */
export const AsLink: Story = {
  args: {
    variant: 'primary',
    size: 'xl',
    href: 'https://github.com/icaruszezen/arknights-ui',
    children: '查看仓库',
    sub: 'REPOSITORY',
    arrow: true,
  },
}
