import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListRow } from './ListRow'

const title = 'SideStory 限时活动即将开启'

describe('ListRow', () => {
  it('三栏：分类、日期、标题', () => {
    render(
      <ListRow data-testid="row" category="活动" date="2026-10-03">
        {title}
      </ListRow>,
    )
    const row = screen.getByTestId('row')
    expect(row.tagName).toBe('DIV')
    expect(row).toHaveAttribute('data-ark', 'list-row')
    expect(screen.getByText('活动')).toHaveClass('text-ark-signal-fg', 'font-ark-bold')
    expect(screen.getByText('2026 // 10 / 03').tagName).toBe('TIME')
    expect(screen.getByText(title)).toHaveClass('tracking-[2px]')
  })

  it('行与行之间只有一条细线', () => {
    render(<ListRow data-testid="row">{title}</ListRow>)
    const row = screen.getByTestId('row')
    expect(row).toHaveClass('border-b', 'border-ark-rule')
    expect(row.className).not.toMatch(/(^|\s)bg-/)
  })

  it('有 href 时整行是链接，右端带方向三角', () => {
    render(
      <ListRow href="/news/1" category="活动" date="2026-10-03">
        {title}
      </ListRow>,
    )
    const link = screen.getByRole('link', { name: /SideStory/ })
    expect(link).toHaveAttribute('href', '/news/1')
    expect(link).toHaveAccessibleName(`活动 2026 // 10 / 03 ${title}`)
    expect(link.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('不是链接时没有方向三角，标题也不响应悬停', () => {
    render(<ListRow data-testid="row">{title}</ListRow>)
    expect(screen.getByTestId('row').querySelector('[aria-hidden="true"]')).toBeNull()
    expect(screen.getByText(title)).not.toHaveClass('group-hover:text-ark-fg')
  })

  it('分类与日期都可以省略', () => {
    render(<ListRow data-testid="row">{title}</ListRow>)
    const row = screen.getByTestId('row')
    expect(row.querySelector('time')).toBeNull()
    expect(row.children).toHaveLength(1)
    // 没有分类时不留出那一栏
    expect(row).toHaveClass('grid-cols-[minmax(0,1fr)]')
  })

  it('标题最多两行', () => {
    render(<ListRow>{title}</ListRow>)
    expect(screen.getByText(title)).toHaveClass('line-clamp-2')
  })

  it('分类栏的宽度可以用 className 覆盖', () => {
    render(
      <ListRow data-testid="row" category="版本更新" className="grid-cols-[6rem_minmax(0,1fr)]">
        {title}
      </ListRow>,
    )
    const row = screen.getByTestId('row')
    expect(row).toHaveClass('grid-cols-[6rem_minmax(0,1fr)]')
    expect(row).not.toHaveClass('grid-cols-[4rem_minmax(0,1fr)]')
  })

  it('转发 ref', () => {
    let node: HTMLAnchorElement | null = null
    render(
      <ListRow
        href="/news/1"
        ref={element => {
          node = element
        }}
      >
        {title}
      </ListRow>,
    )
    expect(node).toBeInstanceOf(HTMLAnchorElement)
  })
})
