import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KeyValue, KeyValueList } from './KeyValue'

describe('KeyValueList', () => {
  it('是一个描述列表：键在 dt，值在 dd', () => {
    render(
      <KeyValueList data-testid="list">
        <KeyValue label="活动时间">10月03日 16:00</KeyValue>
        <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
      </KeyValueList>,
    )
    const list = screen.getByTestId('list')
    expect(list.tagName).toBe('DL')
    expect(list).toHaveAttribute('data-ark', 'key-value-list')
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual([
      '活动时间',
      '解锁条件',
    ])
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual([
      '10月03日 16:00',
      '通关主线 1-10',
    ])
  })

  it('两列网格：键取最长的宽度，竖屏改成一列', () => {
    render(<KeyValueList data-testid="list" />)
    expect(screen.getByTestId('list')).toHaveClass(
      'grid-cols-[auto_minmax(0,1fr)]',
      'portrait:grid-cols-1',
    )
  })
})

describe('KeyValue', () => {
  it('每一行是子网格，两格对齐到列表的两列', () => {
    render(
      <KeyValueList>
        <KeyValue data-testid="row" label="活动时间">
          长期开放
        </KeyValue>
      </KeyValueList>,
    )
    const row = screen.getByTestId('row')
    expect(row).toHaveAttribute('data-ark', 'key-value')
    expect(row).toHaveClass('col-span-2', 'grid-cols-subgrid', 'portrait:col-span-1')
  })

  it('键是粗体并带冒号，值是常规字重（官方公告正文的写法）', () => {
    render(
      <KeyValueList>
        <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
      </KeyValueList>,
    )
    const key = screen.getByRole('term')
    expect(key).toHaveClass('font-ark-bold', 'text-ark-fg', "after:content-['：']")
    expect(key).not.toHaveClass('text-ark-fg-muted')
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('font-ark-regular', 'text-ark-fg')
    expect(value).not.toHaveClass('font-ark-bold')
  })

  it('tone="signal" 把值换成主题色，只上色、不加粗', () => {
    render(
      <KeyValueList>
        <KeyValue label="活动时间" tone="signal">
          10月03日 16:00
        </KeyValue>
      </KeyValueList>,
    )
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('text-ark-signal-fg', 'font-ark-regular')
    expect(value).not.toHaveClass('text-ark-fg', 'font-ark-bold')
  })
})
