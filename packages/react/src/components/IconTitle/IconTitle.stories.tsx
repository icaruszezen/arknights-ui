import type { Meta, StoryObj } from '@storybook/react-vite'
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

/**
 * 图标 + 中文粗字 + 英文小字。图标在一个竖长的槽里（宽 1.1 字、高 1.4 字），
 * 英文是宽体，从标题文字的左缘写起。
 */
export const Default: Story = {}

/**
 * 三档大小。图标跟着中文的字号走，不需要单独设置。
 * `lg` 是官网更多内容屏的实测值（中文 3.375rem、英文 1rem、上距 1.5rem）。
 */
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
 * `hang` 把图标挂到文字列左边的外面：组件的左缘就是标题文字的左缘（竖线标出的位置）。
 * 官网的条带就是这样排的。
 */
export const Hanging: Story = {
  render: args => (
    <div className="border-l border-ark-rule py-ark-4 pl-0 [margin-left:5rem]">
      <IconTitle {...args} size="lg" hang />
    </div>
  ),
}

/**
 * 一排入口：每个入口是“图标 + 标题 + VIEW MORE > + 一条短横线”，官网更多内容屏的写法。
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
              className="grid justify-items-start text-ark-fg no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ark-fg"
            >
              <IconTitle as="span" icon={<Icon frame="square">{entry.icon}</Icon>} sub={entry.sub}>
                {entry.title}
              </IconTitle>
              {/* 图标占了第一列，下面两样也从文字的左缘起 */}
              <span className="ml-[2.04rem] grid justify-items-start">
                <span className="font-ark-latin-wide text-ark-caption leading-ark-snug font-ark-medium">
                  {'VIEW MORE >'}
                </span>
                <span aria-hidden="true" className="mt-ark-4 h-px w-[6.75rem] bg-current" />
              </span>
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
