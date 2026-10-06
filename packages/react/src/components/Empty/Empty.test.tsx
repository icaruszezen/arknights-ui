import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Empty } from './Empty'

describe('Empty', () => {
  it('默认标题是 NO DATA，没有说明时它就是唯一的信息', () => {
    render(<Empty />)
    expect(screen.getByText('NO DATA')).not.toHaveAttribute('aria-hidden')
  })

  it('有说明时，英文标题对读屏隐藏，只读说明', () => {
    render(<Empty>暂无内容</Empty>)
    expect(screen.getByText('NO DATA')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('暂无内容')).toBeInTheDocument()
  })

  // 写死的 gray-600 在黑底上只有 2.95:1，见 docs/elements/feedback.md「空状态」
  it('颜色跟随明暗上下文，不写死调色板里的灰', () => {
    render(<Empty data-testid="empty">暂无内容</Empty>)
    const empty = screen.getByTestId('empty')
    expect(empty).toHaveClass('text-ark-fg-muted', 'border-ark-fg-muted/50')
    expect(empty.outerHTML).not.toContain('neutral-gray')
  })

  it('标题可以替换', () => {
    render(<Empty title="NO RESULT">没有符合筛选条件的干员</Empty>)
    expect(screen.getByText('NO RESULT')).toBeInTheDocument()
    expect(screen.queryByText('NO DATA')).not.toBeInTheDocument()
  })
})
