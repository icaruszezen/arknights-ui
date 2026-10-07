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

  it('没有阶梯缩进：各条左缘对齐', () => {
    render(
      <WorldEntryList>
        <WorldEntry>源石</WorldEntry>
        <WorldEntry>感染者</WorldEntry>
      </WorldEntryList>,
    )
    for (const item of screen.getAllByRole('listitem')) {
      expect(item.className).not.toMatch(/(^|\s)(portrait:)?ml-/)
    }
  })

  it('入场逐条自左滑入，每条晚 200ms；减少动效时只淡入', () => {
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
        'motion-safe:animate-ark-enter-left',
        'motion-safe:[animation-duration:0.8s]',
        'motion-safe:[animation-delay:calc(var(--ark-entry-index)*200ms)]',
        'motion-reduce:animate-ark-fade-in',
      )
    }
  })

  it('stagger={false} 不做入场', () => {
    render(
      <WorldEntryList stagger={false}>
        <WorldEntry>源石</WorldEntry>
      </WorldEntryList>,
    )
    const item = screen.getByRole('listitem')
    expect(item.className).not.toContain('animate-')
    expect(item.style.getPropertyValue('--ark-entry-index')).toBe('')
  })
})

describe('WorldEntry', () => {
  it('6rem 高，中文粗黑 2.5rem 和英文宽体 1.25rem 排在同一行、贴底，下方一条实线', () => {
    render(
      <WorldEntry data-testid="entry" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const entry = screen.getByTestId('entry')
    expect(entry.tagName).toBe('DIV')
    expect(entry).toHaveAttribute('data-ark', 'world-entry')
    expect(entry).toHaveClass('flex', 'h-24', 'items-end', 'border-b', 'border-ark-fg', 'pb-ark-3')
    const zh = screen.getByText('源石')
    const en = screen.getByText('ORIGINIUM')
    expect(zh).toHaveClass('text-ark-h1', 'font-ark-bold')
    expect(en).toHaveClass('font-ark-latin-wide', 'text-ark-body-lg', 'font-ark-bold', 'ml-ark-5')
    // 同一行：英文紧跟在中文后面，是它的兄弟
    expect(zh.nextElementSibling).toBe(en)
  })

  it('默认是灰的', () => {
    render(
      <WorldEntry data-testid="entry" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    expect(screen.getByTestId('entry')).toHaveClass('text-ark-fg-muted')
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

  it('是链接时悬停文字变成前景色并右移 2rem，背后贴着右端浮现信号色的巨字', () => {
    render(
      <WorldEntry href="#originium" sub="ORIGINIUM">
        源石
      </WorldEntry>,
    )
    const link = screen.getByRole('link')
    for (const text of [screen.getByText('源石'), within(link).getAllByText('ORIGINIUM')[1]]) {
      expect(text).toHaveClass(
        'group-hover:text-ark-fg',
        'motion-safe:group-hover:translate-x-ark-6',
      )
      // 变的是明暗，不是信号色；位移只在允许动效时发生
      expect(text?.className).not.toContain('text-ark-signal-fg')
      expect(text?.className.split(' ')).not.toContain('group-hover:translate-x-ark-6')
    }

    const ghost = link.querySelector('[data-ark="ghost-title"]')
    expect(ghost).toHaveTextContent('ORIGINIUM')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveClass(
      'text-ark-signal/25',
      'opacity-0',
      'group-hover:opacity-100',
      '-z-1',
      'right-ark-3',
      'bottom-ark-3',
      'font-ark-latin-wide',
      'text-[4.5rem]',
    )
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
    expect(screen.getByText('源石')).toHaveClass(
      'group-focus-visible:text-ark-fg',
      'motion-safe:group-focus-visible:translate-x-ark-6',
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
