import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { type GlyphName, glyphs } from '../../../.storybook/glyphs'
import { Panel } from '../Panel'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const meta = {
  title: '导航/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  args: { defaultValue: 'all' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const groups = [
  ['all', '全部'],
  ['running', '运行中'],
  ['failed', '失败'],
  ['done', '已完成'],
  ['archived', '已归档'],
] as const

/** 底条：选中项信号色文字 + 4px 底条，其余文字变灰。底条是颜色之外的第二种标记。 */
export const Underline: Story = {
  render: args => (
    <Tabs {...args} className="w-96 max-w-full">
      <TabList aria-label="状态">
        {groups.map(([value, label]) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
      {groups.map(([value, label]) => (
        <TabPanel
          key={value}
          value={value}
          className="pt-ark-4 text-ark-label text-ark-fg-secondary"
        >
          筛选：{label}
        </TabPanel>
      ))}
    </Tabs>
  ),
}

const news = [
  ['latest', '最新'],
  ['notice', '公告'],
  ['event', '活动'],
  ['news', '新闻'],
] as const

/**
 * 实心块：选中项变成信号色的块，黑字，右端一个折线箭头；其余只留文字，悬停变信号色。
 * 官网新闻分类的写法，尺寸是实测值。
 */
export const Block: Story = {
  args: { variant: 'block', defaultValue: 'latest' },
  render: args => (
    <Tabs {...args}>
      <TabList aria-label="新闻分类">
        {news.map(([value, label]) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
      {news.map(([value, label]) => (
        <TabPanel
          key={value}
          value={value}
          className="pt-ark-4 text-ark-label text-ark-fg-secondary"
        >
          「{label}」分类下的内容
        </TabPanel>
      ))}
    </Tabs>
  ),
}

const sections: readonly (readonly [string, string, GlyphName])[] = [
  ['all', '全部', 'blocks'],
  ['docs', '文档', 'bars'],
  ['media', '图片', 'frame'],
  ['data', '数据', 'peak'],
]

/**
 * 分段块：每一项都有底块，连成一条，项与项之间一条短竖线；选中项明暗对调。
 * 每一项前面可以带一个图标。
 */
export const Segment: Story = {
  args: { variant: 'segment' },
  render: args => (
    <Tabs {...args}>
      <TabList aria-label="文件类型">
        {sections.map(([value, label, glyph]) => (
          <Tab key={value} value={value}>
            <span aria-hidden="true" className="grid size-4 [&>svg]:block [&>svg]:size-full">
              {glyphs[glyph]}
            </span>
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
}

const settings: readonly (readonly [string, string, GlyphName])[] = [
  ['general', '通用', 'gear'],
  ['display', '显示', 'frame'],
  ['notify', '通知', 'target'],
  ['account', '账号', 'shield'],
]

/**
 * 竖排：项数不多、每项要配图标时竖着排在一侧。分段块各自成块、带一圈细边，选中反白——
 * 设置页的分类就是这样。键盘换成上下方向键。
 */
export const Vertical: Story = {
  args: { variant: 'segment', orientation: 'vertical', defaultValue: 'general' },
  render: args => (
    <Tabs {...args} className="w-[32rem] max-w-full">
      <TabList aria-label="设置分类" className="w-40">
        {settings.map(([value, label, glyph]) => (
          <Tab key={value} value={value}>
            <span aria-hidden="true" className="grid size-5 [&>svg]:block [&>svg]:size-full">
              {glyphs[glyph]}
            </span>
            {label}
          </Tab>
        ))}
      </TabList>
      {settings.map(([value, label]) => (
        <TabPanel key={value} value={value} className="text-ark-label text-ark-fg-secondary">
          「{label}」的设置项
        </TabPanel>
      ))}
    </Tabs>
  ),
}

/** 竖排的底条在左缘：当前项连边带字一起换成信号色。 */
export const VerticalUnderline: Story = {
  args: { orientation: 'vertical', defaultValue: 'general' },
  render: args => (
    <Tabs {...args} className="w-[32rem] max-w-full">
      <TabList aria-label="设置分类" className="w-40">
        {settings.map(([value, label]) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
      {settings.map(([value, label]) => (
        <TabPanel key={value} value={value} className="text-ark-label text-ark-fg-secondary">
          「{label}」的设置项
        </TabPanel>
      ))}
    </Tabs>
  ),
}

/** 小一号：工具栏、卡片里的页签。 */
export const Small: Story = {
  render: () => (
    <div className="grid gap-ark-5">
      {(['underline', 'segment', 'block'] as const).map(variant => (
        <Tabs key={variant} variant={variant} size="sm" defaultValue="all">
          <TabList aria-label={`状态（${variant}）`}>
            {groups.slice(0, 4).map(([value, label]) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      ))}
    </div>
  ),
}

/** 放进反色面时，分段块的明暗跟着翻。 */
export const OnInverse: Story = {
  args: { variant: 'segment' },
  render: args => (
    <Panel tone="inverse" className="w-fit">
      <Tabs {...args}>
        <TabList aria-label="文件类型">
          {sections.map(([value, label]) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </Panel>
  ),
}

export const WithDisabled: Story = {
  render: args => (
    <Tabs {...args}>
      <TabList aria-label="状态">
        <Tab value="all">全部</Tab>
        <Tab value="running">运行中</Tab>
        <Tab value="failed" disabled>
          失败
        </Tab>
        <Tab value="done">已完成</Tab>
      </TabList>
    </Tabs>
  ),
}

/** 受控用法：选中项由外部状态决定。 */
export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState('running')
    return (
      <div className="grid gap-ark-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="状态">
            {groups.map(([tab, label]) => (
              <Tab key={tab} value={tab}>
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <p className="m-0 font-ark-data text-ark-caption text-ark-fg-muted">value = {value}</p>
      </div>
    )
  },
}
