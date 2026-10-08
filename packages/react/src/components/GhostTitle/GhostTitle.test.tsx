import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GhostTitle } from './GhostTitle'

describe('GhostTitle', () => {
  it('是装饰，默认对读屏隐藏', () => {
    render(<GhostTitle>BREAKING NEWS</GhostTitle>)
    const title = screen.getByText('BREAKING NEWS')
    expect(title).toHaveAttribute('data-ark', 'ghost-title')
    expect(title).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('不挡住下面内容的点击', () => {
    render(<GhostTitle>WORLD</GhostTitle>)
    expect(screen.getByText('WORLD')).toHaveClass('pointer-events-none')
  })

  it('两种颜色都用不透明度表达，跟随前景色与信号色', () => {
    const { rerender } = render(<GhostTitle>WORLD</GhostTitle>)
    expect(screen.getByText('WORLD')).toHaveClass('text-ark-fg/14')

    rerender(<GhostTitle tone="signal">WORLD</GhostTitle>)
    const title = screen.getByText('WORLD')
    expect(title).toHaveClass('text-ark-signal/25')
    expect(title).not.toHaveClass('text-ark-fg/14')
  })

  it('clip 裁掉字的上缘：容器裁切，字的行高归零，占位块定高', () => {
    const { container, rerender } = render(<GhostTitle>WORLD</GhostTitle>)
    const root = () => container.querySelector('[data-ark="ghost-title"]')
    expect(root()).not.toHaveClass('overflow-hidden')
    expect(root()?.children).toHaveLength(0)

    rerender(<GhostTitle clip>WORLD</GhostTitle>)
    expect(root()).toHaveClass('flex', 'items-baseline', 'overflow-hidden')
    const [text, strut] = root()?.children ?? []
    expect(text).toHaveTextContent('WORLD')
    expect(text).toHaveClass('leading-[0]')
    expect(strut).toBeEmptyDOMElement()
    expect(strut).toHaveClass('w-0', 'supports-[height:1cap]:h-[0.84cap]')
    // 仍然是装饰
    expect(root()).toHaveAttribute('aria-hidden', 'true')
  })

  it('字号可以用 className 覆盖', () => {
    render(<GhostTitle className="text-ark-hero">WORLD</GhostTitle>)
    const title = screen.getByText('WORLD')
    expect(title).toHaveClass('text-ark-hero')
    expect(title).not.toHaveClass('text-ark-ghost')
  })
})
