import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, Panel } from './Panel'

describe('Panel', () => {
  it('纸白面板设置浅色上下文，其余为深色', () => {
    const { rerender } = render(<Panel data-testid="panel" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'dark')

    rerender(<Panel data-testid="panel" tone="paper" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'light')

    rerender(<Panel data-testid="panel" tone="frosted" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('深色面板把次要文字提亮一档，纸白面板不动', () => {
    const brighter = '[--ark-fg-muted:var(--ark-color-neutral-gray-300)]'
    const { rerender } = render(<Panel data-testid="panel" />)
    expect(screen.getByTestId('panel')).toHaveClass(brighter)

    rerender(<Panel data-testid="panel" tone="frosted" />)
    expect(screen.getByTestId('panel')).toHaveClass(brighter)

    rerender(<Panel data-testid="panel" tone="paper" />)
    expect(screen.getByTestId('panel')).not.toHaveClass(brighter)
  })

  it('as 指定渲染的元素', () => {
    render(
      <Panel as="section" aria-label="制造站">
        内容
      </Panel>,
    )
    expect(screen.getByRole('region', { name: '制造站' }).tagName).toBe('SECTION')
  })

  it('切角时背景画在 ::before 上，根元素不裁切', () => {
    render(<Panel data-testid="panel" cut />)
    const panel = screen.getByTestId('panel')
    expect(panel).toHaveClass('before:ark-cut-tr-md', 'before:bg-ark-overlay-panel-dark')
    expect(panel).not.toHaveClass('bg-ark-overlay-panel-dark')
    expect(panel.className).not.toMatch(/(^|\s)ark-cut-/)
  })

  it('毛玻璃不支持强调边、切角和投影', () => {
    render(<Panel data-testid="panel" tone="frosted" accent="left" cut elevated />)
    const panel = screen.getByTestId('panel')
    expect(panel).toHaveClass('backdrop-blur-ark-backdrop')
    expect(panel.className).not.toContain('ark-cut')
    expect(panel.className).not.toContain('border-ark-signal')
    expect(panel.className).not.toContain('drop-shadow')
  })

  it('半调网点画在 ::after 上，颜色跟随明暗上下文', () => {
    const { rerender } = render(<Panel data-testid="panel" />)
    expect(screen.getByTestId('panel').className).not.toContain('ark-pattern')

    // 与 Pattern 共用工具类：网点取当前文字色，纸白面上不需要再反相
    for (const tone of ['graphite', 'paper'] as const) {
      rerender(<Panel data-testid="panel" tone={tone} halftone />)
      const panel = screen.getByTestId('panel')
      expect(panel).toHaveClass('after:ark-pattern-halftone', 'after:-z-1')
      // 渐疏的方向烘在遮罩图里，不再叠一层渐隐
      expect(panel.className).not.toContain('--ark-pattern-fade')
      expect(panel).not.toHaveClass('after:invert')
    }
  })
})

describe('Card', () => {
  it('是默认带投影的面板', () => {
    render(<Card data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-ark', 'card')
    expect(card).toHaveClass('drop-shadow-ark-panel')
  })

  it('投影可以关掉', () => {
    render(<Card data-testid="card" elevated={false} />)
    expect(screen.getByTestId('card')).not.toHaveClass('drop-shadow-ark-panel')
  })
})
