import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { scenes } from '../../../.storybook/art'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { ListRow } from '../ListRow'
import { Stagger } from './Stagger'

const rows = [
  { category: '活动', date: '2026-10-03', title: 'SideStory 限时活动即将开启' },
  { category: '公告', date: '2026-09-29', title: '09月29日16:00闪断更新公告' },
  { category: '新闻', date: '2026-09-21', title: '新增界面主题与首页场景' },
  { category: '活动', date: '2026-09-14', title: '危机合约赛季开放' },
]

const list = rows.map(row => (
  <ListRow key={row.title} category={row.category} date={row.date}>
    {row.title}
  </ListRow>
))

const meta = {
  title: '动效/Stagger',
  component: Stagger,
  args: { as: 'ul', className: 'w-[32rem]', children: list },
} satisfies Meta<typeof Stagger>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 列表逐项入场：每一项自左滑入 1rem 并淡入，600ms，比前一项晚 70ms。
 * 切到别的 Story 再切回来可以重看。
 */
export const Default: Story = {}

/** 图片自右进来。 */
export const FromRight: Story = {
  args: {
    as: 'div',
    from: 'right',
    className: 'flex gap-ark-2',
    children: scenes.map(src => (
      <img key={src} src={src} alt="" className="block h-40 w-28 object-cover" />
    )),
  },
}

/** 装饰原地淡入，不位移。 */
export const FadeOnly: Story = {
  args: {
    as: 'div',
    from: 'none',
    className: 'grid w-[32rem] gap-ark-4',
    children: [
      <Divider key="a" start="bar" />,
      <Divider key="b" variant="dash" />,
      <Divider key="c" variant="fade" start="square" />,
    ],
  },
}

/**
 * 编排：标题组先滑入，列表隔 300ms 再逐项跟进，按钮最后。
 * 用 `delay` 把几组入场排出先后；换一个 `key` 就能重播。
 */
export const Choreography: Story = {
  render: function Replayable() {
    const [run, setRun] = useState(0)
    return (
      <div className="grid w-[32rem] gap-ark-5">
        <div key={run} className="grid gap-ark-5">
          <Stagger>
            <Heading as="h2" size="lg" sub="BREAKING NEWS">
              情报
            </Heading>
          </Stagger>
          <Stagger as="ul" delay={300}>
            {list}
          </Stagger>
          <Stagger delay={700} from="none">
            <Button variant="primary" sub="READ MORE" arrow>
              更多情报
            </Button>
          </Stagger>
        </div>
        <Divider variant="dash" />
        <Button onClick={() => setRun(run + 1)}>重播</Button>
      </div>
    )
  },
}

/**
 * `trigger="visible"`：滚进视口才入场，之前保持隐藏。往下滚动这个框。
 */
export const OnVisible: Story = {
  render: args => (
    <section
      aria-label="滚动查看入场"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: 可滚动的区域要能聚焦，键盘才滚得动它
      tabIndex={0}
      className="h-72 w-[34rem] overflow-y-auto border border-ark-rule p-ark-4"
    >
      <p className="m-0 h-80 text-ark-label text-ark-fg-muted">往下滚动 ↓</p>
      <Stagger {...args} trigger="visible" />
    </section>
  ),
}
