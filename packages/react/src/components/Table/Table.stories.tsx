import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from '../Checkbox'
import { Card } from '../Panel'
import { Tag } from '../Tag'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableSort,
} from './Table'

const meta = {
  title: '数据展示/Table',
  component: Table,
  subcomponents: { TableHead, TableBody, TableRow, TableHeaderCell, TableCell },
  args: { 'aria-label': '构建记录' },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const builds = [
  { id: '0147', branch: 'main', status: '通过', seconds: 128, size: 2480 },
  { id: '0146', branch: 'release/2.4', status: '通过', seconds: 96, size: 2475 },
  { id: '0145', branch: 'feat/forms', status: '失败', seconds: 312, size: 2512 },
  { id: '0144', branch: 'main', status: '运行中', seconds: 44, size: 2466 },
] as const

const statusColor = { 通过: 'success', 失败: 'danger', 运行中: 'signal' } as const

/**
 * 行与行之间只有一条细线，不给每行铺底色。表头是窄体的灰色小字；
 * 数字一列用数据体、靠右对齐，上下才比得了大小。
 */
export const Default: Story = {
  render: args => (
    <div className="w-[44rem] max-w-full">
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Build</TableHeaderCell>
            <TableHeaderCell>Branch</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell numeric>Duration</TableHeaderCell>
            <TableHeaderCell numeric>Size (KB)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {builds.map(build => (
            <TableRow key={build.id}>
              <TableCell className="font-ark-data">#{build.id}</TableCell>
              <TableCell>{build.branch}</TableCell>
              <TableCell>
                <Tag variant="outline" size="sm" color={statusColor[build.status]}>
                  {build.status}
                </Tag>
              </TableCell>
              <TableCell numeric>{build.seconds}s</TableCell>
              <TableCell numeric>{build.size.toLocaleString('en-US')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

/** 可排序的表头是一个按钮，三角指向排序的方向；选中的行左缘一条信号色的边。 */
export const SortableAndSelectable: Story = {
  render: function Render(args) {
    const [sort, setSort] = useState<TableSort>('desc')
    const [picked, setPicked] = useState<string[]>(['0146'])
    const rows = [...builds].sort((a, b) =>
      sort === 'asc' ? a.seconds - b.seconds : b.seconds - a.seconds,
    )
    return (
      <div className="w-[36rem] max-w-full">
        <Table {...args}>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-10">
                <span className="sr-only">选择</span>
              </TableHeaderCell>
              <TableHeaderCell>Build</TableHeaderCell>
              <TableHeaderCell>Branch</TableHeaderCell>
              <TableHeaderCell
                numeric
                sort={sort}
                onSort={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
              >
                Duration
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(build => {
              const selected = picked.includes(build.id)
              return (
                <TableRow key={build.id} selected={selected}>
                  <TableCell>
                    <Checkbox
                      aria-label={`选择 #${build.id}`}
                      checked={selected}
                      onCheckedChange={checked =>
                        setPicked(list =>
                          checked ? [...list, build.id] : list.filter(id => id !== build.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="font-ark-data">#{build.id}</TableCell>
                  <TableCell>{build.branch}</TableCell>
                  <TableCell numeric>{build.seconds}s</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  },
}

/** `compact` 的行高 2.25rem；表头可以固定在滚动容器的顶上。 */
export const CompactSticky: Story = {
  args: { density: 'compact', stickyHeader: true, wrapperClassName: 'h-48' },
  render: args => (
    <Card elevated={false} tone="surface" padding="none" className="w-[28rem] max-w-full">
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Day</TableHeaderCell>
            <TableHeaderCell numeric>Requests</TableHeaderCell>
            <TableHeaderCell numeric>Errors</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 14 }, (_, index) => index + 1).map(day => (
            <TableRow key={day}>
              <TableCell className="font-ark-data">10 / {String(day).padStart(2, '0')}</TableCell>
              <TableCell numeric>{(day * 1873).toLocaleString('en-US')}</TableCell>
              <TableCell numeric>{day % 5}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  ),
}
