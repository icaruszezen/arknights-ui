import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Panel } from '../Panel'
import { ListRow } from './ListRow'

// 没有用 decorators：ListRow 的属性是联合类型（<a> 或 <div>），
// Storybook 从 decorators 推断参数时会把联合变成交叉，结果是 never
function Frame({ children }: { children: ReactNode }) {
  return <div className="w-[32rem] max-w-full">{children}</div>
}

const meta = {
  title: '数据展示/ListRow',
  component: ListRow,
  args: {
    category: '活动',
    date: '2026-10-03',
    children: 'SideStory 限时活动即将开启',
  },
  argTypes: { date: { control: 'text' } },
  render: args => (
    <Frame>
      <ListRow {...args} />
    </Frame>
  ),
} satisfies Meta<typeof ListRow>

export default meta
type Story = StoryObj<typeof meta>

const news = [
  { category: '活动', date: '2026-10-03', title: 'SideStory 限时活动即将开启' },
  { category: '公告', date: '2026-09-29', title: '09月29日16:00闪断更新公告' },
  {
    category: '新闻',
    date: '2026-09-21',
    title: '新增界面主题与首页场景，同步开放若干干员的全新时装',
  },
]

function NewsList() {
  return (
    <ul className="m-0 list-none p-0">
      {news.map(row => (
        <li key={row.title}>
          <ListRow href="#news" category={row.category} date={row.date}>
            {row.title}
          </ListRow>
        </li>
      ))}
    </ul>
  )
}

/**
 * 分类是信号色的中文粗体，日期是数据体，标题带 2px 字距。
 * 一行最小高度 6rem，下面一条 1px 细线。
 */
export const Default: Story = {}

/**
 * 整行是链接时，右端带一个方向三角。悬停时标题变亮，三角变信号色并右移。
 * 多行放进列表里；标题最多两行。
 */
export const AsLinks: Story = {
  render: () => (
    <Frame>
      <NewsList />
    </Frame>
  ),
}

/** 分类和日期都可以省略；没有分类时不留出那一栏。 */
export const Partial: Story = {
  render: () => (
    <Frame>
      <ul className="m-0 list-none p-0">
        <li>
          <ListRow date="2026-09-21">只有日期和标题的一行</ListRow>
        </li>
        <li>
          <ListRow category="公告">只有分类和标题的一行</ListRow>
        </li>
        <li>
          <ListRow>只有标题的一行</ListRow>
        </li>
      </ul>
    </Frame>
  ),
}

/**
 * 竖屏时排成一行，日期移到标题右侧，字号和行高另设。
 * 在画布视图里把视口切到竖屏的手机就能看到；文档页是横向的，这里看到的是横屏的样子。
 */
export const Portrait: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => (
    <Frame>
      <NewsList />
    </Frame>
  ),
}

/** 放进纸白面板：细线、次要文字换成深色，信号色的分类压暗。 */
export const OnPaper: Story = {
  render: args => (
    <Frame>
      <Panel tone="paper">
        <ListRow {...args} />
      </Panel>
    </Frame>
  ),
}
