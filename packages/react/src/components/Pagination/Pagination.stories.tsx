import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta = {
  title: '导航/Pagination',
  component: Pagination,
  args: { pageCount: 12, defaultPage: 3 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 页码用数据体、补零到两位；当前页是一块信号色的实块，其余悬停时整块反色。
 * 页码太多时中间用省略号，首尾两页始终在。
 */
export const Default: Story = {}

/** 页数不多时全部写出来。 */
export const FewPages: Story = { args: { pageCount: 5, defaultPage: 2 } }

/** `compact`：只有 `‹ 03 / 12 ›`，窄的地方用。 */
export const Compact: Story = { args: { variant: 'compact' } }

export const Small: Story = { args: { size: 'sm' } }

/** 受控用法：页码由外部状态决定。 */
export const Controlled: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(6)
    return (
      <div className="grid justify-items-start gap-ark-3">
        <Pagination {...args} defaultPage={undefined} page={page} onPageChange={setPage} />
        <p className="m-0 font-ark-data text-ark-caption text-ark-fg-muted">page = {page}</p>
      </div>
    )
  },
}
