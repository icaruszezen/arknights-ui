import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

// 省略号那一格对读屏隐藏，按角色查不到，直接看 DOM；只取看得见的字（不算补给读屏的“第”“页”）
const labels = () =>
  [...document.querySelectorAll('[data-ark="pagination"] li')].map(item =>
    item.getAttribute('aria-hidden')
      ? '…'
      : [...(item.querySelector('button')?.childNodes ?? [])]
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent)
          .join(''),
  )

describe('Pagination', () => {
  it('是一个导航地标；页码补零到两位，看得见的页码是名称的一部分', () => {
    render(<Pagination pageCount={5} defaultPage={2} />)
    expect(screen.getByRole('navigation', { name: '分页' })).toHaveAttribute(
      'data-ark',
      'pagination',
    )
    expect(labels()).toEqual(['01', '02', '03', '04', '05'])
    const current = screen.getByRole('button', { name: '第 02 页' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveClass('aria-[current=page]:bg-ark-signal')
    expect(screen.getByRole('button', { name: '第 03 页' })).not.toHaveAttribute('aria-current')
  })

  it('页码太多时中间用省略号，首尾两页始终在', () => {
    const { rerender } = render(<Pagination pageCount={12} defaultPage={1} />)
    expect(labels()).toEqual(['01', '02', '…', '12'])
    rerender(<Pagination pageCount={12} page={6} />)
    expect(labels()).toEqual(['01', '…', '05', '06', '07', '…', '12'])
    // 只隔一页时直接写出来，不用省略号占一格
    rerender(<Pagination pageCount={12} page={4} />)
    expect(labels()).toEqual(['01', '02', '03', '04', '05', '…', '12'])
    rerender(<Pagination pageCount={12} page={12} siblings={2} />)
    expect(labels()).toEqual(['01', '…', '10', '11', '12'])
  })

  it('点页码、上一页、下一页都会换页并回调', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination pageCount={9} defaultPage={4} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: '下一页' }))
    expect(onPageChange).toHaveBeenLastCalledWith(5)
    await user.click(screen.getByRole('button', { name: '上一页' }))
    expect(onPageChange).toHaveBeenLastCalledWith(4)
    await user.click(screen.getByRole('button', { name: '第 09 页' }))
    expect(onPageChange).toHaveBeenLastCalledWith(9)
    expect(screen.getByRole('button', { name: '第 09 页' })).toHaveAttribute('aria-current', 'page')
  })

  it('到了头，对应的方向键禁用', () => {
    const { rerender } = render(<Pagination pageCount={3} page={1} />)
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '下一页' })).toBeEnabled()
    rerender(<Pagination pageCount={3} page={3} />)
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled()
  })

  it('compact 只有当前页和总数', async () => {
    const user = userEvent.setup()
    render(<Pagination pageCount={12} defaultPage={3} variant="compact" />)
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('/ 12')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '下一页' }))
    expect(screen.getByText('04')).toBeInTheDocument()
  })

  it('受控时由外部状态决定；越界的页码收回来', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [page, setPage] = useState(99)
      return <Pagination pageCount={4} page={page} onPageChange={setPage} />
    }
    render(<Controlled />)
    expect(screen.getByRole('button', { name: '第 04 页' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: '上一页' }))
    expect(screen.getByRole('button', { name: '第 03 页' })).toHaveAttribute('aria-current', 'page')
  })

  it('按钮的名称可以改', () => {
    render(
      <Pagination
        pageCount={2}
        prevLabel="Previous"
        nextLabel="Next"
        pageLabel={['Page ', '']}
        aria-label="Pages"
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 02' })).toBeInTheDocument()
  })
})
