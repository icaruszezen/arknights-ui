import type { Meta, StoryObj } from '@storybook/react-vite'
import { triangleRight } from '../../utils/classes'
import { Icon } from '../Icon'
import { Panel } from '../Panel'
import { IconTitle } from './IconTitle'

// 演示用的自绘几何图形，不对应任何官方图标
const Diamond = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" stroke="currentColor" strokeWidth="2.5" />
  </svg>
)
const Peak = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 3 21 21H3z" fill="currentColor" />
  </svg>
)
const Blocks = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5v5h-5z" fill="currentColor" />
  </svg>
)

const meta = {
  title: '图标与符号/IconTitle',
  component: IconTitle,
  args: {
    icon: (
      <Icon>
        <Diamond />
      </Icon>
    ),
    sub: 'INTEGRATED STRATEGIES',
    children: '集成战略',
  },
} satisfies Meta<typeof IconTitle>

export default meta
type Story = StoryObj<typeof meta>

/** 图标 + 中文粗字 + 英文小字。图标的高度约等于中文的字高。 */
export const Default: Story = {}

/** 三档大小。图标跟着中文的字号走，不需要单独设置。 */
export const Sizes: Story = {
  render: args => (
    <div className="grid gap-ark-6">
      <IconTitle {...args} size="sm" />
      <IconTitle {...args} size="md" />
      <IconTitle {...args} size="lg" />
    </div>
  ),
}

/**
 * 一排入口：每个入口是“图标 + 标题 + VIEW MORE + 一条短横线”。
 * 同一组图标统一画板和外框。链接在外层，`IconTitle` 自己不带交互。
 */
export const AsEntries: Story = {
  render: () => {
    const entries = [
      { href: '#is', icon: <Diamond />, title: '集成战略', sub: 'INTEGRATED STRATEGIES' },
      { href: '#ra', icon: <Peak />, title: '生息演算', sub: 'RECLAMATION ALGORITHM' },
      { href: '#anime', icon: <Blocks />, title: '衍生动画', sub: 'ANIMATION' },
    ]
    return (
      <ul className="m-0 flex list-none gap-ark-7 p-0">
        {entries.map(entry => (
          <li key={entry.href}>
            <a
              href={entry.href}
              className="group grid justify-items-start gap-ark-3 text-ark-fg no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ark-fg"
            >
              <IconTitle
                as="span"
                icon={<Icon frame="square">{entry.icon}</Icon>}
                sub={entry.sub}
                className="transition-colors duration-(--ark-motion-duration-base) group-hover:text-ark-signal"
              >
                {entry.title}
              </IconTitle>
              <span className="inline-flex items-center gap-ark-2 font-ark-data text-ark-label leading-ark-solid font-ark-bold text-ark-fg-muted">
                VIEW MORE
                <span aria-hidden="true" className={triangleRight} />
              </span>
              <span
                aria-hidden="true"
                className="h-px w-ark-7 bg-ark-fg transition-[width,background-color] duration-(--ark-motion-duration-base) group-hover:w-full group-hover:bg-ark-signal"
              />
            </a>
          </li>
        ))}
      </ul>
    )
  },
}

/** 作为真正的标题时用 `as` 指定级别。放进纸白面板，颜色跟着换。 */
export const OnSurfaces: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: args => (
    <div className="grid w-fit grid-cols-2 gap-ark-2">
      <Panel className="w-72">
        <IconTitle {...args} as="h3" />
      </Panel>
      <Panel tone="paper" className="w-72">
        <IconTitle {...args} as="h3" />
      </Panel>
    </div>
  ),
}
