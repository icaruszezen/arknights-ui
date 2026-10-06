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

  it('键偏灰并带冒号，值是粗体', () => {
    render(
      <KeyValueList>
        <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
      </KeyValueList>,
    )
    expect(screen.getByRole('term')).toHaveClass('text-ark-fg-muted', "after:content-['：']")
    expect(screen.getByRole('definition')).toHaveClass('font-ark-bold', 'text-ark-fg')
  })

  it('tone="signal" 把值换成主题色', () => {
    render(
      <KeyValueList>
        <KeyValue label="活动时间" tone="signal">
          10月03日 16:00
        </KeyValue>
      </KeyValueList>,
    )
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('text-ark-signal-fg')
    expect(value).not.toHaveClass('text-ark-fg')
  })
})
