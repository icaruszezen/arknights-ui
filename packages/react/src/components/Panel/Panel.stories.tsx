import type { Meta, StoryObj } from '@storybook/react-vite'
import { scenes } from '../../../.storybook/art'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { Heading } from '../Heading'
import { Progress } from '../Progress'
import { Stat } from '../Stat'
import { Tab, TabList, Tabs } from '../Tabs'
import { Tag } from '../Tag'
import { Card, CardFooter, CardHeader, CardMedia, Panel } from './Panel'

const meta = {
  title: '面板与浮层/Panel',
  component: Panel,
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

/** 默认的面：跟着主题走，暗色是近黑、亮色是纸白。其余所有东西的默认容器。 */
export const Surface: Story = {
  args: { className: 'w-72' },
  render: args => (
    <Panel {...args}>
      <Heading as="h3" size="sm" sub="BUILD QUEUE">
        构建队列
      </Heading>
      <Progress
        aria-label="构建进度"
        variant="thick"
        color="warning"
        value={62}
        className="mt-ark-5"
      />
      <p className="m-0 mt-ark-2 font-ark-data text-ark-caption text-ark-fg-muted">02:14:36</p>
    </Panel>
  ),
}

/**
 * 反色面：与所在主题明暗相反，一屏最多一两块，留给最重要的内容。
 * 文字贴角，留白处压一片半调网点。
 */
export const Inverse: Story = {
  args: { tone: 'inverse', accent: 'left', halftone: true, className: 'w-72' },
  render: args => (
    <Panel {...args}>
      <Heading as="h3" size="sm" sub="BALANCE">
        账户余额
      </Heading>
      <Divider className="my-ark-4" />
      <Stat label="Credit" value={12580} className="pb-ark-6" />
    </Panel>
  ),
}

/** 三档面：画布上的默认面、抬起的一层，以及需要看清边界时的一圈细线。 */
export const Levels: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-ark-4">
      <Panel className="w-48">
        <Stat label="Surface" value="默认" size="sm" />
      </Panel>
      <Panel tone="raised" className="w-48">
        <Stat label="Raised" value="抬起" size="sm" />
      </Panel>
      <Panel bordered className="w-48">
        <Stat label="Bordered" value="描边" size="sm" />
      </Panel>
    </div>
  ),
}

/** 压在图片上的三种半透明表面：石墨、纸白、毛玻璃。它们不跟主题。 */
export const OnImage: Story = {
  render: () => (
    <div
      className="grid w-fit grid-cols-3 gap-ark-4 bg-cover p-ark-6"
      style={{ backgroundImage: `url("${scenes[2]}")` }}
    >
      <Panel tone="graphite" className="w-48">
        <Stat label="Graphite" value="石墨" size="sm" />
      </Panel>
      <Panel tone="paper" className="w-48">
        <Stat label="Paper" value="纸白" size="sm" />
      </Panel>
      <Panel tone="frosted" className="w-48">
        <Stat label="Frosted" value="毛玻璃" size="sm" />
      </Panel>
    </div>
  ),
}

/** 卡片 = 抬起一层、带投影的面板。标题栏、图片、底栏各有一个槽。 */
export const CardSlots: Story = {
  render: () => (
    <Card className="w-80">
      <CardMedia src={scenes[1]} />
      <CardHeader title="季度巡检报告" sub="Inspection Report" extra={<Tag>草稿</Tag>} />
      <p className="m-0 text-ark-label leading-ark-body text-ark-fg-secondary">
        三号舱段的供能读数在本周内两次越过阈值，建议排期检修。
      </p>
      <CardFooter>
        <Button variant="ghost" size="sm">
          稍后
        </Button>
        <Button variant="primary" size="sm">
          查看
        </Button>
      </CardFooter>
    </Card>
  ),
}

/** 切角是可选的点缀，只切一个角；投影跟着切角的形状走。 */
export const CardWithCut: Story = {
  render: () => (
    <Card cut accent="left" className="w-72">
      <CardHeader title="订单" sub="Orders" divider />
      <Stat label="Pending" value={3} max={6} size="sm" orientation="horizontal" />
    </Card>
  ),
}

/** 整张卡片是一个链接：悬停换一档底色。卡片里只放文字和图片。 */
export const CardAsLink: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-ark-4">
      <Card href="#docs" rounded className="w-64">
        <CardHeader title="接入指南" sub="Getting Started" />
        <span className="text-ark-label text-ark-fg-secondary">引入样式表，设好底色与字体。</span>
      </Card>
      <Card href="#tokens" rounded className="w-64">
        <CardHeader title="Design Tokens" sub="Tokens" />
        <span className="text-ark-label text-ark-fg-secondary">颜色、字号、间距的唯一数据源。</span>
      </Card>
    </div>
  ),
}

/**
 * 面板会设置明暗上下文。同一组子组件放进默认的面和反色面，
 * 前景、细线、反白块自动翻转，信号色用作文字时在浅色面上压暗。
 */
export const ToneContext: Story = {
  render: () => {
    const content = (
      <div className="grid gap-ark-4">
        <Heading as="h3" size="sm" sub="MEMBERS">
          成员
        </Heading>
        <div className="flex gap-ark-2">
          <Tag variant="solid">管理员</Tag>
          <Tag variant="outline" color="signal">
            在线
          </Tag>
          <Tag>只读</Tag>
        </div>
        <Tabs defaultValue="all" variant="underline">
          <TabList aria-label="分组">
            <Tab value="all">全部</Tab>
            <Tab value="ops">运维</Tab>
            <Tab value="dev">研发</Tab>
          </TabList>
        </Tabs>
        <Stat label="Quota" value={131} max={200} size="sm" orientation="horizontal" />
        <Progress aria-label="配额" variant="meter" value={131} max={200} />
        <div className="flex gap-ark-3">
          <Button>查看档案</Button>
          <Button selected>已选中</Button>
        </div>
      </div>
    )
    return (
      <div className="grid w-fit grid-cols-2 gap-ark-2">
        <Panel className="w-80">{content}</Panel>
        <Panel tone="inverse" className="w-80">
          {content}
        </Panel>
      </div>
    )
  },
}
