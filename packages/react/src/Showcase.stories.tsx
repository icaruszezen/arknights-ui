import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Button,
  Card,
  Dialog,
  Divider,
  Empty,
  Heading,
  Notice,
  Panel,
  Progress,
  Stat,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
} from './index'

// 不是组件，只是把首批组件按官网“情报”屏的编排拼在一起：
// 窄列表 + 宽内容的不对称分栏，一屏一个主按钮，一个信号色。
const meta = {
  title: '示例/情报面板',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { category: '活动', date: '2026 // 10 / 03', title: 'SideStory 限时活动即将开启' },
  { category: '公告', date: '2026 // 09 / 29', title: '09月29日16:00闪断更新公告' },
  { category: '新闻', date: '2026 // 09 / 21', title: '新增界面主题与首页场景' },
]

function NewsList({ category }: { category?: string }) {
  const list = category ? rows.filter(row => row.category === category) : rows
  if (list.length === 0) return <Empty className="mt-ark-4">该分类下暂无情报</Empty>
  return (
    <ul className="m-0 list-none p-0">
      {list.map(row => (
        <li key={row.title}>
          <div className="grid grid-cols-[4rem_1fr] items-center gap-x-ark-4 py-ark-4">
            <span className="row-span-2 text-ark-body font-ark-bold text-ark-signal">
              {row.category}
            </span>
            <time className="font-ark-data text-[1rem] leading-ark-solid tracking-[1px] text-ark-fg-muted">
              {row.date}
            </time>
            <span className="pt-ark-2 text-ark-body leading-ark-snug tracking-[2px] text-ark-fg-secondary">
              {row.title}
            </span>
          </div>
          <Divider />
        </li>
      ))}
    </ul>
  )
}

export const Information: Story = {
  name: '情报面板',
  render: function InformationScreen() {
    const [open, setOpen] = useState(false)
    return (
      <div className="grid max-w-5xl grid-cols-[minmax(0,5fr)_minmax(0,4fr)] items-start gap-ark-7">
        <section className="grid gap-ark-5">
          <Heading as="h1" size="lg" sub="BREAKING NEWS">
            情报
          </Heading>
          <Tabs defaultValue="latest">
            <TabList aria-label="情报分类">
              <Tab value="latest">最新</Tab>
              <Tab value="notice">公告</Tab>
              <Tab value="event">活动</Tab>
              <Tab value="news">新闻</Tab>
              <Tab value="other">其他</Tab>
            </TabList>
            <TabPanel value="latest">
              <NewsList />
            </TabPanel>
            <TabPanel value="notice">
              <NewsList category="公告" />
            </TabPanel>
            <TabPanel value="event">
              <NewsList category="活动" />
            </TabPanel>
            <TabPanel value="news">
              <NewsList category="新闻" />
            </TabPanel>
            <TabPanel value="other">
              <NewsList category="其他" />
            </TabPanel>
          </Tabs>
          <div className="flex items-center gap-ark-5">
            <Button variant="primary" sub="READ MORE" arrow>
              更多情报
            </Button>
            <Button variant="weak" arrow cut>
              VIEW MORE
            </Button>
          </div>
        </section>

        <aside className="grid gap-ark-2">
          <Card tone="paper" accent="left" halftone>
            <div className="flex items-start justify-between">
              <Heading as="h2" size="sm" sub="SANITY">
                理智
              </Heading>
              <Tag variant="solid" cut>
                可行动
              </Tag>
            </div>
            <Stat label="Current" value={12} max={135} className="mt-ark-5" />
            <Progress aria-label="理智" variant="meter" value={12} max={135} className="mt-ark-3" />
            <Button className="mt-ark-5" onClick={() => setOpen(true)}>
              恢复理智
            </Button>
          </Card>
          <Panel>
            <div className="flex items-start justify-between">
              <Heading as="h2" size="sm" sub="FACTORY">
                制造站
              </Heading>
              <Tag>运转中</Tag>
            </div>
            <Progress
              aria-label="制造进度"
              variant="thick"
              tone="action"
              value={62}
              segments={5}
              className="mt-ark-5"
            />
            <Divider variant="dash" className="my-ark-4" />
            <Stat label="Remaining" value="02:14:36" size="sm" orientation="horizontal" />
          </Panel>
          <Notice level="warning">理智不足，无法开始行动</Notice>
        </aside>

        <Dialog open={open} onOpenChange={setOpen} detail="SANITY 12/135 → 92/135">
          是否消耗 1 份应急理智合剂恢复理智？
        </Dialog>
      </div>
    )
  },
}
