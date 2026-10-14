import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  type TableProps,
  TableRow,
} from './Table'

function Builds({ onSort, ...props }: TableProps & { onSort?: () => void }) {
  return (
    <Table aria-label="构建记录" {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>分支</TableHeaderCell>
          <TableHeaderCell numeric sort="desc" onSort={onSort}>
            耗时
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow selected>
          <TableCell>main</TableCell>
          <TableCell numeric>128</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>release</TableCell>
          <TableCell numeric>96</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('是一个原生的表格，表头的每一格是列标题', () => {
    render(<Builds />)
    const table = screen.getByRole('table', { name: '构建记录' })
    expect(table.parentElement).toHaveAttribute('data-ark', 'table')
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByRole('columnheader', { name: '分支' })).toHaveAttribute('scope', 'col')
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('外层横向滚动，表格自己撑满', () => {
    render(<Builds wrapperClassName="h-40" />)
    const wrapper = screen.getByRole('table').parentElement
    expect(wrapper).toHaveClass('overflow-x-auto', 'h-40')
    expect(screen.getByRole('table')).toHaveClass('w-full', 'border-collapse')
  })

  it('数字列用数据体、靠右对齐', () => {
    render(<Builds />)
    expect(screen.getByRole('cell', { name: '128' })).toHaveClass(
      'text-right',
      'font-ark-data',
      'tabular-nums',
    )
    expect(screen.getByRole('columnheader', { name: '耗时' })).toHaveClass('text-right')
    expect(screen.getByRole('cell', { name: 'main' })).not.toHaveClass('text-right')
  })

  it('可排序的表头是一个按钮，并输出 aria-sort', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(<Builds onSort={onSort} />)
    const header = screen.getByRole('columnheader', { name: '耗时' })
    expect(header).toHaveAttribute('aria-sort', 'descending')
    await user.click(within(header).getByRole('button', { name: '耗时' }))
    expect(onSort).toHaveBeenCalledTimes(1)
    // 不排序的列没有按钮，也没有 aria-sort
    const plain = screen.getByRole('columnheader', { name: '分支' })
    expect(plain).not.toHaveAttribute('aria-sort')
    expect(within(plain).queryByRole('button')).toBeNull()
  })

  it('选中的行输出 aria-selected', () => {
    render(<Builds />)
    const [, selected, other] = screen.getAllByRole('row')
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(other).not.toHaveAttribute('aria-selected')
  })

  it('density 换行高；stickyHeader 把表头固定住', () => {
    const { rerender } = render(<Builds />)
    expect(screen.getByRole('cell', { name: 'main' })).toHaveClass('h-12')
    rerender(<Builds density="compact" stickyHeader />)
    expect(screen.getByRole('cell', { name: 'main' })).toHaveClass('h-9')
    expect(screen.getByRole('table')).toHaveAttribute('data-sticky', 'true')
    expect(screen.getByRole('table').className).toContain('[&_thead_th]:sticky')
  })
})
