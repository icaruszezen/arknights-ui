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

  it('折线箭头对读屏隐藏，并贴在右端', () => {
    render(<Button arrow>更多情报</Button>)
    const button = screen.getByRole('button', { name: '更多情报' })
    const arrow = button.querySelector('svg[aria-hidden="true"]')
    expect(arrow).not.toBeNull()
    expect(arrow).toHaveClass('ml-auto')
    expect(button.lastElementChild).toBe(arrow)
  })

  it('primary 是官网实测的长条：最小宽 14.375rem、高 3.75rem', () => {
    render(<Button variant="primary">更多情报</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-w-[14.375rem]', 'min-h-[3.75rem]')
  })

  it('selected 输出 aria-pressed，样式是整块明暗对调', () => {
    const { rerender } = render(<Button selected>筛选</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveClass('aria-pressed:bg-ark-invert', 'aria-pressed:text-ark-on-invert')
    rerender(<Button selected={false}>筛选</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('confirm 是暗红块、cancel 是黑色块，各带一个对读屏隐藏的默认图标', () => {
    render(
      <>
        <Button variant="cancel">取消</Button>
        <Button variant="confirm">确认</Button>
      </>,
    )
    const cancel = screen.getByRole('button', { name: '取消' })
    const confirm = screen.getByRole('button', { name: '确认' })
    expect(cancel).toHaveClass('bg-ark-neutral-ink-950')
    expect(confirm).toHaveClass('bg-ark-signal-confirm')
    expect(cancel.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
    expect(confirm.querySelector('[aria-hidden="true"] svg')).not.toBeNull()
  })

  it('icon 传 null 去掉默认图标，传节点则换成自己的', () => {
    const { rerender } = render(
      <Button variant="confirm" icon={null}>
        继续结算
      </Button>,
    )
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()

    rerender(<Button icon={<svg data-testid="own" />}>筛选</Button>)
    const button = screen.getByRole('button', { name: '筛选' })
    expect(screen.getByTestId('own').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(button).toContainElement(screen.getByTestId('own'))
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
