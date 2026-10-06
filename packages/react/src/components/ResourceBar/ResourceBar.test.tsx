import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Resource, ResourceBar } from './ResourceBar'

function Bar() {
  return (
    <ResourceBar data-testid="bar">
      <Resource label="龙门币" value={128400} />
      <Resource label="合成玉" value={6000} />
      <Resource label="理智" value={131} max={135} />
    </ResourceBar>
  )
}

describe('ResourceBar', () => {
  it('是一个描述列表：名称在 dt，数量在 dd', () => {
    render(<Bar />)
    const bar = screen.getByTestId('bar')
    expect(bar.tagName).toBe('DL')
    expect(bar).toHaveAttribute('data-ark', 'resource-bar')
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual([
      '龙门币',
      '合成玉',
      '理智',
    ])
    expect(screen.getAllByRole('definition')).toHaveLength(3)
  })

  it('数字加千分位', () => {
    render(<Bar />)
    const [lmd, orundum] = screen.getAllByRole('definition')
    expect(lmd).toHaveTextContent(/^128,400$/)
    expect(orundum).toHaveTextContent(/^6,000$/)
  })

  it('有上限时写成当前值 / 上限', () => {
    render(<Bar />)
    expect(screen.getAllByRole('definition')[2]).toHaveTextContent(/^131\/135$/)
  })

  it('字符串原样输出', () => {
    render(
      <ResourceBar>
        <Resource label="剩余时间" value="02:14:36" />
      </ResourceBar>,
    )
    expect(screen.getByRole('definition')).toHaveTextContent('02:14:36')
  })

  it('自带半透明深色底，次要文字提亮一档', () => {
    render(<Bar />)
    const bar = screen.getByTestId('bar')
    expect(bar).toHaveAttribute('data-ark-tone', 'dark')
    expect(bar).toHaveClass('[--ark-fg-muted:var(--ark-color-neutral-gray-300)]')
    for (const item of bar.children) expect(item).toHaveClass('bg-ark-neutral-black/65')
  })

  it('图标放在名称里，对读屏隐藏', () => {
    render(
      <ResourceBar>
        <Resource label="源石" value={12} icon={<svg data-testid="icon" />} />
      </ResourceBar>,
    )
    const term = screen.getByRole('term')
    expect(term).toContainElement(screen.getByTestId('icon'))
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(term).toHaveTextContent('源石')
  })
})
