import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('默认渲染为 type="button" 的按钮', () => {
    render(<Button>查看全部</Button>)
    const button = screen.getByRole('button', { name: '查看全部' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-ark', 'button')
    expect(button).not.toHaveAttribute('aria-pressed')
  })

  it('有 href 时渲染为链接', () => {
    render(
      <Button href="/news" variant="primary">
        更多情报
      </Button>,
    )
    const link = screen.getByRole('link', { name: '更多情报' })
    expect(link).toHaveAttribute('href', '/news')
    expect(link).not.toHaveAttribute('type')
  })

  it('sub 作为第二行计入可访问名称', () => {
    render(<Button sub="READ MORE">更多情报</Button>)
    expect(screen.getByRole('button')).toHaveAccessibleName('更多情报 READ MORE')
  })

  it('方向三角对读屏隐藏', () => {
    render(<Button arrow>更多情报</Button>)
    const button = screen.getByRole('button', { name: '更多情报' })
    expect(button.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('selected 输出 aria-pressed', () => {
    const { rerender } = render(<Button selected>筛选</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    rerender(<Button selected={false}>筛选</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('点击时调用 onClick，禁用时不调用', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>开始行动</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Button onClick={onClick} disabled>
        开始行动
      </Button>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('使用方的 className 覆盖同属性的默认类', () => {
    render(<Button className="px-ark-2">查看</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-ark-2')
    expect(button).not.toHaveClass('px-ark-5')
  })

  it('weak + cut 把背景画在 ::before 上，根元素不裁切', () => {
    render(
      <Button variant="weak" cut>
        READ MORE
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('before:ark-cut-tr-sm', 'bg-transparent')
    expect(button.className).not.toMatch(/(^|\s)ark-cut-/)
  })

  it('转发 ref', () => {
    let node: HTMLButtonElement | null = null
    render(
      <Button
        ref={element => {
          node = element
        }}
      >
        查看
      </Button>,
    )
    expect(node).toBeInstanceOf(HTMLButtonElement)
  })
})
