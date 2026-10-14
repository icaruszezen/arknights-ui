import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { glyphs } from '../.storybook/glyphs'
import {
  AppShell,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Field,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuItem,
  MenuSeparator,
  Modal,
  Nav,
  NavGroup,
  NavItem,
  Notice,
  Pagination,
  Panel,
  Progress,
  Segment,
  SegmentedControl,
  Select,
  SelectOption,
  Stat,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableSort,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  ToastProvider,
  Tooltip,
  useToast,
} from './index'

// 不是组件，只是把组件按一个后台页面的编排拼在一起：固定的页头和侧栏，内容区里是数值、表格和分页。
// 黑白灰打底，一屏只有一个信号色的主按钮；数字用数据体，表格只用细线分行。
// 文案和数据都是演示用的占位内容。
const meta = {
  title: '示例/仪表盘',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  // 骨架铺满视口，不要预览自带的那一圈内边距
  decorators: [
    Story => (
      <div className="-m-ark-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const builds = [
  { id: '0147', branch: 'main', author: 'Amiya', status: '通过', seconds: 128 },
  { id: '0146', branch: 'release/2.4', author: 'Closure', status: '通过', seconds: 96 },
  { id: '0145', branch: 'feat/forms', author: 'Kaltsit', status: '失败', seconds: 312 },
  { id: '0144', branch: 'main', author: 'Amiya', status: '运行中', seconds: 44 },
  { id: '0143', branch: 'fix/contrast', author: 'Doctor', status: '通过', seconds: 151 },
] as const

const statusColor = { 通过: 'success', 失败: 'danger', 运行中: 'signal' } as const

function Dashboard() {
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState<TableSort>('desc')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)

  const rows = builds
    .filter(build => filter === 'all' || build.status === filter)
    .sort((a, b) => (sort === 'asc' ? a.seconds - b.seconds : b.seconds - a.seconds))

  return (
    <AppShell
      header={
        <>
          <span className="font-ark-latin-wide text-ark-base font-ark-bold">ARKNIGHTS-UI</span>
          <Input
            aria-label="搜索"
            placeholder="搜索构建、分支、成员"
            size="sm"
            className="ml-ark-5 hidden w-72 md:flex"
          />
          <div className="ml-auto flex items-center gap-ark-2">
            <Tooltip content="通知">
              <IconButton label="通知" size="sm">
                {glyphs.target}
              </IconButton>
            </Tooltip>
            <Menu
              placement="bottom-end"
              trigger={
                // 名称来自头像：“Doctor”
                <button
                  type="button"
                  className="m-0 cursor-pointer appearance-none border-0 bg-transparent p-0"
                >
                  <Avatar name="Doctor" size="sm" status="online" />
                </button>
              }
            >
              <MenuItem>个人资料</MenuItem>
              <MenuItem shortcut="Ctrl ,">偏好设置</MenuItem>
              <MenuSeparator />
              <MenuItem>退出登录</MenuItem>
            </Menu>
          </div>
        </>
      }
      sidebar={
        <Nav orientation="vertical" aria-label="侧栏">
          <NavItem href="#overview" icon={glyphs.blocks}>
            总览
          </NavItem>
          <NavItem href="#builds" icon={glyphs.bars} sub="12" current>
            构建
          </NavItem>
          <NavItem href="#releases" icon={glyphs.chevrons}>
            发布
          </NavItem>
          <NavGroup label="Workspace">
            <NavItem href="#members" icon={glyphs.frame} sub="48">
              成员
            </NavItem>
            <NavItem href="#settings" icon={glyphs.gear}>
              设置
            </NavItem>
          </NavGroup>
        </Nav>
      }
    >
      <div className="grid gap-ark-6 p-ark-5 md:p-ark-6">
        <div className="flex flex-wrap items-end justify-between gap-ark-4">
          <div className="grid gap-ark-3">
            <Breadcrumb>
              <BreadcrumbItem href="#workspace">工作区</BreadcrumbItem>
              <BreadcrumbItem current>构建</BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" size="md" sub="BUILDS">
              构建
            </Heading>
          </div>
          <Button variant="primary" icon={glyphs.cross} onClick={() => setCreating(true)}>
            新建构建
          </Button>
        </div>

        {/* 数值是主角：大号数据体，带分母和单位 */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-ark-4">
          <Panel accent="top">
            <Stat label="Builds / 30d" value={1284} />
          </Panel>
          <Panel>
            <Stat label="Success" value="98.2" unit="%" color="success" />
          </Panel>
          <Panel>
            <Stat label="Median" value={112} unit="s" />
          </Panel>
          <Panel>
            <Stat label="Queue" value={3} max={8} />
            <Progress
              aria-label="队列占用"
              variant="meter"
              value={3}
              max={8}
              className="mt-ark-3"
            />
          </Panel>
        </div>

        {/* minmax(0, 1fr)：表格比这一栏宽时在自己的容器里滚，不把整页撑宽 */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-ark-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="grid min-w-0 gap-ark-4">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabList aria-label="状态">
                <Tab value="all">全部</Tab>
                <Tab value="通过">通过</Tab>
                <Tab value="失败">失败</Tab>
                <Tab value="运行中">运行中</Tab>
              </TabList>
            </Tabs>
            <Table aria-label="构建记录">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Build</TableHeaderCell>
                  <TableHeaderCell>Branch</TableHeaderCell>
                  <TableHeaderCell>Author</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell
                    numeric
                    sort={sort}
                    onSort={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
                  >
                    Duration
                  </TableHeaderCell>
                  <TableHeaderCell className="w-10">
                    <span className="sr-only">操作</span>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(build => (
                  <TableRow key={build.id}>
                    <TableCell className="font-ark-data">#{build.id}</TableCell>
                    <TableCell>{build.branch}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-ark-2">
                        <Avatar name={build.author} size="sm" />
                        {build.author}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Tag variant="outline" size="sm" color={statusColor[build.status]}>
                        {build.status}
                      </Tag>
                    </TableCell>
                    <TableCell numeric>{build.seconds}s</TableCell>
                    <TableCell>
                      <Menu
                        placement="bottom-end"
                        trigger={
                          <IconButton label={`#${build.id} 的操作`} size="sm">
                            {glyphs.bars}
                          </IconButton>
                        }
                      >
                        <MenuItem
                          onSelect={() =>
                            toast({ title: `已重新运行 #${build.id}`, level: 'success' })
                          }
                        >
                          重新运行
                        </MenuItem>
                        <MenuItem>查看日志</MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          danger
                          onSelect={() => toast({ title: `已取消 #${build.id}`, level: 'warning' })}
                        >
                          取消
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-wrap items-center justify-between gap-ark-3">
              <span className="font-ark-data text-ark-caption text-ark-fg-muted">
                {rows.length} / 1,284
              </span>
              <Pagination pageCount={12} page={page} onPageChange={setPage} />
            </div>
          </section>

          <aside className="grid gap-ark-5">
            <Notice level="warning" title="配额即将用尽">
              本月还剩 5%，新的构建会排队等待。
            </Notice>
            <Panel>
              <Heading as="h2" size="sm" sub="ACTIVITY">
                动态
              </Heading>
              <Timeline aria-label="动态" className="mt-ark-5">
                <TimelineItem label="16:40">#0147 发布到生产环境</TimelineItem>
                <TimelineItem label="15:12">Closure 合并了 release/2.4</TimelineItem>
                <TimelineItem label="11:05">#0145 集成测试失败</TimelineItem>
              </Timeline>
            </Panel>
          </aside>
        </div>
      </div>

      <Modal
        open={creating}
        onOpenChange={setCreating}
        title="新建构建"
        sub="NEW BUILD"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setCreating(false)
                toast({ title: '构建已加入队列', description: '#0148 · main', level: 'success' })
              }}
            >
              开始构建
            </Button>
          </>
        }
      >
        <div className="grid gap-ark-5">
          <Field label="分支" sub="Branch" required>
            <Select defaultValue="main">
              <SelectOption value="main">main</SelectOption>
              <SelectOption value="release">release/2.4</SelectOption>
              <SelectOption value="forms">feat/forms</SelectOption>
            </Select>
          </Field>
          <Field label="环境" sub="Target" hint="生产环境的构建需要审批">
            <SegmentedControl defaultValue="staging">
              <Segment value="dev">开发</Segment>
              <Segment value="staging">预发</Segment>
              <Segment value="prod">生产</Segment>
            </SegmentedControl>
          </Field>
          <Field label="备注" sub="Note">
            <Input placeholder="这次构建是为了什么" />
          </Field>
        </div>
      </Modal>
    </AppShell>
  )
}

export const Builds: Story = {
  name: '仪表盘',
  render: () => (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  ),
}

/** 窄屏：侧栏收进左边的抽屉，表格在自己的容器里横向滚动。 */
export const BuildsNarrow: Story = {
  ...Builds,
  name: '仪表盘（窄屏）',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
