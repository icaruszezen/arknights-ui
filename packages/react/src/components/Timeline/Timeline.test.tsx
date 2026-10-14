import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Timeline, TimelineItem, type TimelineProps } from './Timeline'

function Months(props: TimelineProps) {
  return (
    <Timeline aria-label="月份" {...props}>
      <TimelineItem value="01" label="01" />
      <TimelineItem value="02" label="02" disabled />
      <TimelineItem value="03" label="03" />
      <TimelineItem value="04" label="04" />
    </Timeline>
  )
}

describe('Timeline', () => {
  it('只展示时是一个普通的有序列表，每格右边放内容', () => {
    render(
      <Timeline aria-label="更新记录">
        <TimelineItem label="10 / 14">新增表单控件</TimelineItem>
        <TimelineItem label="10 / 08">整屏示例随画布缩放</TimelineItem>
      </Timeline>,
    )
    const list = screen.getByRole('list', { name: '更新记录' })
    expect(list).toHaveAttribute('data-ark', 'timeline')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByRole('radio')).toBeNull()
    expect(screen.getByText('新增表单控件')).toBeInTheDocument()
  })

  it('给了 defaultValue 就是一组单选，当前的那一格放大', () => {
    render(<Months defaultValue="03" />)
    const group = screen.getByRole('radiogroup', { name: '月份' })
    expect(group).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    const current = screen.getByRole('radio', { name: '03' })
    expect(current).toBeChecked()
    expect(current.closest('[data-ark="timeline-item"]')).toHaveAttribute('data-selected', 'true')
    // 当前项不只靠颜色
    expect(screen.getByText('03')).toHaveClass('scale-125')
  })

  it('点一格就选中它；没有内容的格子不能选', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Months defaultValue="01" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '04' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('04')
    expect(screen.getByRole('radio', { name: '04' })).toBeChecked()

    expect(screen.getByRole('radio', { name: '02' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '02' }))
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('上下方向键移动并选中，跳过不能选的；只有选中项在 Tab 键序列里', async () => {
    const user = userEvent.setup()
    render(<Months defaultValue="01" />)
    expect(screen.getByRole('radio', { name: '01' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: '03' })).toHaveAttribute('tabindex', '-1')
    screen.getByRole('radio', { name: '01' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: '03' })).toBeChecked()
    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { name: '04' })).toBeChecked()
  })

  it('脱离 Timeline 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TimelineItem label="01" />)).toThrow(
      '<TimelineItem> 必须放在 <Timeline> 里',
    )
    error.mockRestore()
  })
})
