import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'
import { Card, CardFooter, CardHeader, CardMedia, Panel } from './Panel'

describe('Panel', () => {
  it('默认的面跟着主题走：不设明暗上下文', () => {
    render(<Panel data-testid="panel" />)
    const panel = screen.getByTestId('panel')
    expect(panel).not.toHaveAttribute('data-ark-tone')
    expect(panel).toHaveClass('bg-ark-surface')
  })

  it('固定明暗的表面给子树设上下文', () => {
    const { rerender } = render(<Panel data-testid="panel" tone="paper" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'light')

    rerender(<Panel data-testid="panel" tone="graphite" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'dark')

    rerender(<Panel data-testid="panel" tone="inverse" />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-ark-tone', 'inverse')
  })

  it('石墨面板把次要文字提亮一档，其余不动', () => {
    const brighter = '[--ark-fg-muted:var(--ark-color-neutral-gray-300)]'
    const { rerender } = render(<Panel data-testid="panel" tone="graphite" />)
    expect(screen.getByTestId('panel')).toHaveClass(brighter)

    for (const tone of ['surface', 'raised', 'inverse', 'paper', 'frosted'] as const) {
      rerender(<Panel data-testid="panel" tone={tone} />)
      expect(screen.getByTestId('panel')).not.toHaveClass(brighter)
    }
  })

  it('as 指定渲染的元素', () => {
    render(
      <Panel as="section" aria-label="制造站">
        内容
      </Panel>,
    )
    expect(screen.getByRole('region', { name: '制造站' }).tagName).toBe('SECTION')
  })

  it('padding 换内边距，none 交给内容', () => {
    const { rerender } = render(<Panel data-testid="panel" />)
    expect(screen.getByTestId('panel')).toHaveClass('p-ark-5')
    rerender(<Panel data-testid="panel" padding="none" />)
    expect(screen.getByTestId('panel')).toHaveClass('p-0')
  })

  it('切角时背景画在 ::before 上，根元素不裁切', () => {
    render(<Panel data-testid="panel" cut />)
    const panel = screen.getByTestId('panel')
    expect(panel).toHaveClass('before:ark-cut-tr-md', 'before:bg-ark-surface')
    expect(panel).not.toHaveClass('bg-ark-surface')
    expect(panel.className).not.toMatch(/(^|\s)ark-cut-/)
  })

  it('毛玻璃总是带细线，不支持强调边、切角和投影', () => {
    render(<Panel data-testid="panel" tone="frosted" accent="left" cut elevated />)
    const panel = screen.getByTestId('panel')
    expect(panel).toHaveClass('backdrop-blur-ark-backdrop', 'border', 'border-ark-rule')
    expect(panel.className).not.toContain('ark-cut')
    expect(panel.className).not.toContain('border-l-ark-signal')
    expect(panel.className).not.toContain('drop-shadow')
  })

  it('bordered 加一圈细线；切角的面不描边', () => {
    const { rerender } = render(<Panel data-testid="panel" bordered />)
    expect(screen.getByTestId('panel')).toHaveClass('border', 'border-ark-rule')
    rerender(<Panel data-testid="panel" bordered cut />)
    expect(screen.getByTestId('panel')).not.toHaveClass('border')
  })

  it('半调网点画在 ::after 上，颜色跟随明暗上下文', () => {
    const { rerender } = render(<Panel data-testid="panel" />)
    expect(screen.getByTestId('panel').className).not.toContain('ark-pattern')

    // 与 Pattern 共用工具类：网点取当前文字色，浅色面上不需要再反相
    for (const tone of ['surface', 'paper'] as const) {
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
  it('默认是抬起的一层，带投影', () => {
    render(<Card data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-ark', 'card')
    expect(card).toHaveClass('bg-ark-surface-raised', 'drop-shadow-ark-panel')
  })

  it('给了 href 整张卡片是一个链接，带焦点轮廓', () => {
    render(<Card href="/items/1">采购凭证</Card>)
    const link = screen.getByRole('link', { name: '采购凭证' })
    expect(link).toHaveAttribute('href', '/items/1')
    expect(link).toHaveAttribute('data-ark', 'card')
    expect(link).toHaveClass('focus-visible:outline-2', 'hover:bg-ark-control')
  })

  it('linkAs 换成路由库的链接组件', () => {
    const RouterLink = (props: ComponentProps<'a'>) => <a data-router="" {...props} />
    render(
      <Card href="/items/1" linkAs={RouterLink}>
        采购凭证
      </Card>,
    )
    expect(screen.getByRole('link', { name: '采购凭证' })).toHaveAttribute('data-router')
  })

  it('rounded 是 2px 的小圆角', () => {
    render(<Card data-testid="card" rounded />)
    expect(screen.getByTestId('card')).toHaveClass('rounded-ark-subtle')
  })

  it('标题栏：标题是标题元素，英文小字在下，右上角另放内容', () => {
    render(
      <Card>
        <CardHeader title="贸易站" sub="Trading Post" extra={<span>3 / 6</span>} titleAs="h4" />
      </Card>,
    )
    expect(screen.getByRole('heading', { level: 4, name: '贸易站' })).toBeInTheDocument()
    expect(screen.getByText('Trading Post')).toBeInTheDocument()
    expect(screen.getByText('3 / 6')).toBeInTheDocument()
  })

  it('底栏和图片各有稳定的选择器；图片默认是装饰', () => {
    const { container } = render(
      <Card>
        <CardMedia src="/a.png" ratio="4 / 3" />
        <CardFooter>操作</CardFooter>
      </Card>,
    )
    const media = container.querySelector('[data-ark="card-media"]')
    expect(media).toHaveAttribute('alt', '')
    expect(media).toHaveStyle({ aspectRatio: '4 / 3' })
    expect(container.querySelector('[data-ark="card-footer"]')).toHaveTextContent('操作')
  })
})
