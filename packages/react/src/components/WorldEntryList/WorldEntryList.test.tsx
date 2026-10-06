import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WorldEntry, WorldEntryList } from './WorldEntryList'

describe('WorldEntryList', () => {
  it('是一个列表，每个条目各占一项', () => {
    render(
      <WorldEntryList aria-label="设定">
        <WorldEntry href="#a" sub="ORIGINIUM">
          源石
        </WorldEntry>
        <WorldEntry href="#b" sub="INFECTED">
          感染者
        </WorldEntry>
        {null}
      </WorldEntryList>,
    )
    const list = screen.getByRole('list', { name: '设定' })
    expect(list).toHaveAttribute('data-ark', 'world-entry-list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('左缩进逐条递增，形成阶梯；竖屏取消', () => {
    render(
      <WorldEntryList>
        <WorldEntry>源石</WorldEntry>
        <WorldEntry>感染者</WorldEntry>
        <WorldEntry>移动城市</WorldEntry>
      </WorldEntryList>,
    )
    const items = screen.getAllByRole('listitem')
    expect(items.map(item => item.style.getPropertyValue('--ark-entry-index'))).toEqual([
      '0',
      '1',
      '2',
    ])
    for (const item of items) {
      expect(item).toHaveClass(
        'ml-[calc(var(--ark-entry-step,2rem)*var(--ark-entry-index))]',
        'portrait:ml-0',
      )
    }
  })
})

describe('WorldEntry', () => {
  it('中文粗黑 2.5rem 加英文副标，下方一条细线', () => {
    render(
      <WorldEntry data-testid="entry" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const entry = screen.getByTestId('entry')
    expect(entry.tagName).toBe('DIV')
    expect(entry).toHaveAttribute('data-ark', 'world-entry')
    expect(entry).toHaveClass('border-b', 'border-ark-rule')
    expect(screen.getByText('源石')).toHaveClass('text-ark-h1', 'font-ark-bold')
    expect(screen.getByText('ORIGINIUM')).toHaveClass('font-ark-latin-wide')
  })

  it('给了 href 是链接，名称来自中文和英文', () => {
    render(
      <WorldEntry href="#originium" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const link = screen.getByRole('link', { name: '源石 ORIGINIUM' })
    expect(link).toHaveAttribute('href', '#originium')
  })

  it('是链接时悬停文字变色并位移，背后浮现信号色的巨字', () => {
    render(
      <WorldEntry href="#originium" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const link = screen.getByRole('link')
    const heading = link.querySelector('[data-ark="heading"]')
    expect(heading).toHaveClass(
      'group-hover:text-ark-signal-fg',
      'motion-safe:group-hover:translate-x-ark-4',
    )
    // 位移只在允许动效时发生
    expect(heading?.className).not.toMatch(/(^|\s)group-hover:translate-x-/)

    const ghost = link.querySelector('[data-ark="ghost-title"]')
    expect(ghost).toHaveTextContent('ORIGINIUM')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveClass('text-ark-signal/25', 'opacity-0', 'group-hover:opacity-100', '-z-1')
  })

  it('键盘聚焦时有同样的反馈', () => {
    render(
      <WorldEntry href="#originium" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const link = screen.getByRole('link')
    expect(link.querySelector('[data-ark="ghost-title"]')).toHaveClass(
      'group-focus-visible:opacity-100',
    )
    expect(link.querySelector('[data-ark="heading"]')).toHaveClass(
      'group-focus-visible:text-ark-signal-fg',
    )
  })

  it('巨字横向不撑出滚动条', () => {
    render(
      <WorldEntry href="#a" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    expect(screen.getByRole('link')).toHaveClass('overflow-x-clip')
  })

  it('ghost 可以另外指定，也可以去掉', () => {
    const { rerender } = render(
      <WorldEntry href="#a" sub="ORIGINIUM" ghost="ORE">
        源石
      </WorldEntry>,
    )
    expect(screen.getByRole('link').querySelector('[data-ark="ghost-title"]')).toHaveTextContent(
      'ORE',
    )

    rerender(
      <WorldEntry href="#a" sub="ORIGINIUM" ghost={null}>
        源石
      </WorldEntry>,
    )
    expect(screen.getByRole('link').querySelector('[data-ark="ghost-title"]')).toBeNull()
  })

  it('sub 不是字符串时默认没有巨字', () => {
    render(
      <WorldEntry href="#a" sub={<em>ORIGINIUM</em>}>
        源石
      </WorldEntry>,
    )
    expect(screen.getByRole('link').querySelector('[data-ark="ghost-title"]')).toBeNull()
  })

  it('没有 href 时只是一块内容，没有悬停反馈', () => {
    render(
      <WorldEntry data-testid="entry" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const entry = screen.getByTestId('entry')
    expect(entry.querySelector('[data-ark="ghost-title"]')).toBeNull()
    expect(entry.innerHTML).not.toContain('group-hover:')
  })
})
