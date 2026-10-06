import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Notice } from './Notice'

describe('Notice', () => {
  it('信息级用 status，不打断读屏', () => {
    render(<Notice>订单已交付</Notice>)
    expect(screen.getByRole('status')).toHaveTextContent('订单已交付')
    expect(screen.getByRole('status')).toHaveAttribute('data-level', 'info')
  })

  it('警示与错误用 alert', () => {
    const { rerender } = render(<Notice level="warning">理智不足</Notice>)
    expect(screen.getByRole('alert')).toHaveAttribute('data-level', 'warning')

    rerender(<Notice level="error">网络连接中断</Notice>)
    expect(screen.getByRole('alert')).toHaveAttribute('data-level', 'error')
  })

  it('role 可以被覆盖', () => {
    render(
      <Notice level="error" role="status">
        已自动重连
      </Notice>,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('只有警示带警戒条纹窄边', () => {
    const stripe = '[class*="pattern-hazard"]'
    const { rerender } = render(<Notice level="warning">理智不足</Notice>)
    expect(screen.getByRole('alert').querySelector(stripe)).not.toBeNull()

    rerender(<Notice level="error">网络连接中断</Notice>)
    expect(screen.getByRole('alert').querySelector(stripe)).toBeNull()
  })

  it('每个级别的图形不同，且对读屏隐藏', () => {
    const shapes = (['info', 'warning', 'error'] as const).map(level => {
      const { container, unmount } = render(<Notice level={level}>内容</Notice>)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      const shape = svg?.innerHTML
      unmount()
      return shape
    })
    expect(new Set(shapes).size).toBe(3)
  })

  it('渲染标题与正文', () => {
    render(<Notice title="即将进行闪断更新">预计持续 10 分钟。</Notice>)
    const notice = screen.getByRole('status')
    expect(notice).toHaveTextContent('即将进行闪断更新')
    expect(notice).toHaveTextContent('预计持续 10 分钟。')
  })

  it('自身始终是深色上下文', () => {
    render(<Notice>订单已交付</Notice>)
    expect(screen.getByRole('status')).toHaveAttribute('data-ark-tone', 'dark')
  })
})
