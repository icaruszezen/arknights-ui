import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('默认是中性标签：控件的底色，跟着主题走', () => {
    render(<Tag>只读</Tag>)
    const tag = screen.getByText('只读')
    expect(tag).toHaveAttribute('data-ark', 'tag')
    expect(tag).toHaveClass('bg-ark-control', 'text-ark-fg')
  })

  it('solid 默认是反色块，color 换成对应的实底', () => {
    const { rerender } = render(<Tag variant="solid">管理员</Tag>)
    expect(screen.getByText('管理员')).toHaveClass('bg-ark-invert', 'text-ark-on-invert')

    rerender(
      <Tag variant="solid" color="danger">
        已停用
      </Tag>,
    )
    expect(screen.getByText('已停用')).toHaveClass('bg-ark-danger', 'text-ark-on-danger')
  })

  it('outline 的字和边同色，取“文字色”的那一档', () => {
    render(
      <Tag variant="outline" color="signal">
        在线
      </Tag>,
    )
    expect(screen.getByText('在线')).toHaveClass('border', 'border-current', 'text-ark-signal-fg')
  })

  it('切角时背景画在 ::before 上，根元素不裁切', () => {
    render(
      <Tag variant="solid" cut>
        管理员
      </Tag>,
    )
    const tag = screen.getByText('管理员')
    expect(tag).toHaveClass('before:ark-cut-tr-sm', 'before:bg-ark-invert')
    expect(tag).not.toHaveClass('bg-ark-invert')
  })

  it('outline 和 pill 不支持切角', () => {
    render(
      <>
        <Tag variant="outline" cut>
          在线
        </Tag>
        <Tag pill cut>
          时间
        </Tag>
      </>,
    )
    expect(screen.getByText('在线').className).not.toContain('ark-cut')
    expect(screen.getByText('时间').className).not.toContain('ark-cut')
  })

  it('pill 是圆头', () => {
    render(<Tag pill>时间</Tag>)
    expect(screen.getByText('时间')).toHaveClass('rounded-full')
  })

  it('给了 onRemove 才有移除按钮，点它时调用', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const { rerender } = render(<Tag>本月</Tag>)
    expect(screen.queryByRole('button')).toBeNull()

    rerender(<Tag onRemove={onRemove}>本月</Tag>)
    await user.click(screen.getByRole('button', { name: '移除' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
