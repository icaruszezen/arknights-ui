import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const meta = {
  title: '导航/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  args: { defaultValue: 'latest' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

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

const classes = [
  ['all', '全部'],
  ['guard', '近卫'],
  ['sniper', '狙击'],
  ['caster', '术师'],
  ['medic', '医疗'],
] as const

/** 底条：选中项信号色文字 + 4px 底条，其余文字变灰。底条是颜色之外的第二种标记。 */
export const Underline: Story = {
  args: { variant: 'underline', defaultValue: 'all' },
  render: args => (
    <Tabs {...args} className="w-96">
      <TabList aria-label="职业">
        {classes.map(([value, label]) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
      {classes.map(([value, label]) => (
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

const depot = [
  ['all', '全部'],
  ['consumable', '消耗品'],
  ['basic', '基础物品'],
  ['material', '养成材料'],
] as const

/**
 * 分段块：每一项都有底块，连成一条，选中项明暗对调。游戏内仓库分类的写法。
 * 放进纸白面板时选中项是深色块，和实机一致。
 */
export const Segment: Story = {
  args: { variant: 'segment', defaultValue: 'material' },
  render: args => (
    <Tabs {...args}>
      <TabList aria-label="仓库分类">
        {depot.map(([value, label]) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
}

export const WithDisabled: Story = {
  render: args => (
    <Tabs {...args}>
      <TabList aria-label="新闻分类">
        <Tab value="latest">最新</Tab>
        <Tab value="notice">公告</Tab>
        <Tab value="event" disabled>
          活动
        </Tab>
        <Tab value="news">新闻</Tab>
      </TabList>
    </Tabs>
  ),
}

/** 受控用法：选中项由外部状态决定。 */
export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState('notice')
    return (
      <div className="grid gap-ark-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="新闻分类">
            {news.map(([tab, label]) => (
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
