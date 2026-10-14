import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Notice } from './Notice'

describe('Notice', () => {
  it('信息级用 status，不打断读屏', () => {
    render(<Notice>订单已交付</Notice>)
    expect(screen.getByRole('status')).toHaveTextContent('订单已交付')
    expect(screen.getByRole('status')).toHaveAttribute('data-level', 'info')
  })

  it('完成同样用 status，带绿边', () => {
    render(<Notice level="success">已保存</Notice>)
    expect(screen.getByRole('status')).toHaveAttribute('data-level', 'success')
    expect(screen.getByRole('status')).toHaveClass('border-l-ark-signal-success')
  })

  it('警示与错误用 alert', () => {
    const { rerender } = render(<Notice level="warning">配额不足</Notice>)
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
    const { rerender } = render(<Notice level="warning">配额不足</Notice>)
    expect(screen.getByRole('alert').querySelector(stripe)).not.toBeNull()

    rerender(<Notice level="error">网络连接中断</Notice>)
    expect(screen.getByRole('alert').querySelector(stripe)).toBeNull()
  })

  it('每个级别的图形不同，且对读屏隐藏', () => {
    const shapes = (['info', 'success', 'warning', 'error'] as const).map(level => {
      const { container, unmount } = render(<Notice level={level}>内容</Notice>)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      const shape = svg?.innerHTML
      unmount()
      return shape
    })
    expect(new Set(shapes).size).toBe(4)
  })

  it('信息级是不带彩色的底加圆圈 i，没有色边；警示和错误才有', () => {
    const { rerender } = render(<Notice>订单已交付</Notice>)
    const info = screen.getByRole('status')
    expect(info).toHaveClass('bg-ark-control', 'text-ark-fg')
    expect(info.className).not.toContain('border-l-')
    expect(info.querySelector('svg circle')).not.toBeNull()

    rerender(<Notice level="warning">配额不足</Notice>)
    expect(screen.getByRole('alert')).toHaveClass('border-l-ark-signal-action')

    rerender(<Notice level="error">网络连接中断</Notice>)
    expect(screen.getByRole('alert')).toHaveClass('border-l-ark-signal-danger')
  })

  it('渲染标题与正文', () => {
    render(<Notice title="即将进行闪断更新">预计持续 10 分钟。</Notice>)
    const notice = screen.getByRole('status')
    expect(notice).toHaveTextContent('即将进行闪断更新')
    expect(notice).toHaveTextContent('预计持续 10 分钟。')
  })

  it('跟着主题走，不自己设明暗上下文', () => {
    render(<Notice>订单已交付</Notice>)
    expect(screen.getByRole('status')).not.toHaveAttribute('data-ark-tone')
  })

  it('给了 onClose 才有关闭按钮，点它时调用', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { rerender } = render(<Notice>订单已交付</Notice>)
    expect(screen.queryByRole('button')).toBeNull()

    rerender(<Notice onClose={onClose}>订单已交付</Notice>)
    await user.click(screen.getByRole('button', { name: '关闭' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('action 放在文字的右边', () => {
    render(<Notice action={<button type="button">撤销</button>}>已移入回收站</Notice>)
    const notice = screen.getByRole('status')
    expect(notice).toContainElement(screen.getByRole('button', { name: '撤销' }))
  })
})
