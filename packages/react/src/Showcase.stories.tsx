import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Button,
  Card,
  Dialog,
  Divider,
  Empty,
  Heading,
  ListRow,
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

// 不是组件，只是把组件按官网“情报”屏的编排拼在一起：
// 窄列表 + 宽内容的不对称分栏，一屏一个主按钮，一个信号色。文案是演示用的占位内容。
const meta = {
  title: '示例/情报面板',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { category: '活动', date: '2026-10-03', title: '秋季线上分享会开放报名' },
  { category: '公告', date: '2026-09-29', title: '09月29日16:00停机维护公告' },
  { category: '新闻', date: '2026-09-21', title: '新增亮色主题与表单控件' },
]

function NewsList({ category }: { category?: string }) {
  const list = category ? rows.filter(row => row.category === category) : rows
  if (list.length === 0) return <Empty className="mt-ark-4">该分类下暂无情报</Empty>
  return (
    <ul className="m-0 list-none p-0">
      {list.map(row => (
        <li key={row.title}>
          <ListRow category={row.category} date={row.date}>
            {row.title}
          </ListRow>
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
      <div className="grid max-w-5xl items-start gap-ark-7 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        <section className="grid gap-ark-5">
          <Heading as="h1" size="lg" sub="BREAKING NEWS">
            情报
          </Heading>
          <Tabs variant="block" defaultValue="latest">
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
          <div className="flex flex-wrap items-center gap-ark-5">
            <Button variant="primary" size="xl" sub="READ MORE" arrow>
              更多情报
            </Button>
            <Button variant="subtle" size="xs" arrow className="min-w-[7.625rem] font-ark-data">
              VIEW MORE
            </Button>
          </div>
        </section>

        <aside className="grid gap-ark-2">
          <Card tone="inverse" accent="left" halftone>
            <div className="flex items-start justify-between">
              <Heading as="h2" size="sm" sub="QUOTA">
                配额
              </Heading>
              <Tag variant="solid" cut>
                可用
              </Tag>
            </div>
            <Stat label="Current" value={12} max={135} className="mt-ark-5" />
            <Progress aria-label="配额" variant="meter" value={12} max={135} className="mt-ark-3" />
            <Button className="mt-ark-5" onClick={() => setOpen(true)}>
              提升配额
            </Button>
          </Card>
          <Panel>
            <div className="flex items-start justify-between">
              <Heading as="h2" size="sm" sub="BUILD QUEUE">
                构建队列
              </Heading>
              <Tag>运行中</Tag>
            </div>
            <Progress
              aria-label="构建进度"
              variant="thick"
              color="warning"
              value={62}
              segments={5}
              className="mt-ark-5"
            />
            <Divider variant="dash" className="my-ark-4" />
            <Stat label="Remaining" value="02:14:36" size="sm" orientation="horizontal" />
          </Panel>
          <Notice level="warning">配额不足，新的构建会排队等待</Notice>
        </aside>

        <Dialog open={open} onOpenChange={setOpen} detail="QUOTA 12/135 → 92/135">
          是否使用 1 张加量券，把本月配额提高 <em>80 次</em>？
        </Dialog>
      </div>
    )
  },
}
