import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { IconButton } from './IconButton'

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

  it('as 换成路由库的链接组件，href 和类名照样传下去', () => {
    const RouterLink = ({ href, ...rest }: ComponentProps<'a'>) => (
      <a data-router="" href={`/app${href}`} {...rest} />
    )
    render(
      <Button href="/news" as={RouterLink}>
        更多情报
      </Button>,
    )
    const link = screen.getByRole('link', { name: '更多情报' })
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('href', '/app/news')
    expect(link).toHaveAttribute('data-ark', 'button')
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
    expect(button).toHaveClass('justify-between')
  })

  it('size 决定高度，默认 md', () => {
    const { rerender } = render(<Button>查看</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-h-(--ark-size-control-md)')
    rerender(<Button size="xs">查看</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-h-(--ark-size-control-xs)')
  })

  it('xl 是官网实测的长条：最小宽 14.375rem，文字贴左', () => {
    render(
      <Button variant="primary" size="xl">
        更多情报
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass(
      'min-w-[14.375rem]',
      'min-h-(--ark-size-control-xl)',
      'justify-between',
    )
  })

  it('selected 输出 aria-pressed，样式是整块明暗对调', () => {
    const { rerender } = render(<Button selected>筛选</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveClass('aria-pressed:bg-ark-invert', 'aria-pressed:text-ark-on-invert')
    rerender(<Button selected={false}>筛选</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it.each([
    ['primary', 'bg-ark-signal'],
    ['subtle', 'bg-ark-control'],
    ['inverse', 'bg-ark-invert'],
    ['danger', 'bg-ark-danger'],
  ] as const)('%s 的底色取语义键 %s，跟着主题走', (variant, background) => {
    render(<Button variant={variant}>操作</Button>)
    expect(screen.getByRole('button')).toHaveClass(background)
  })

  it('图标对读屏隐藏，前后各一个位置', () => {
    render(
      <Button icon={<svg data-testid="lead" />} iconEnd={<svg data-testid="trail" />}>
        筛选
      </Button>,
    )
    const button = screen.getByRole('button', { name: '筛选' })
    expect(screen.getByTestId('lead').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('trail').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(button).toContainElement(screen.getByTestId('lead'))
    expect(button.lastElementChild).toBe(screen.getByTestId('trail').parentElement)
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

  it('loading 时标记为忙、不响应点击，但仍然可以聚焦', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading icon={<svg data-testid="own" />} onClick={onClick}>
        保存
      </Button>,
    )
    const button = screen.getByRole('button', { name: '保存' })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).not.toBeDisabled()
    // 图标的位置换成旋转指示
    expect(screen.queryByTestId('own')).toBeNull()
    expect(button.querySelector('[data-ark="spinner"]')).not.toBeNull()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
    button.focus()
    expect(button).toHaveFocus()
  })

  it('使用方的 className 覆盖同属性的默认类', () => {
    render(<Button className="px-ark-2">查看</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-ark-2')
    expect(button).not.toHaveClass('px-ark-4')
  })

  it('subtle + cut 把背景画在 ::before 上，根元素不裁切', () => {
    render(
      <Button variant="subtle" cut>
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

describe('IconButton', () => {
  it('名称来自 label，是一个方形的按钮', () => {
    render(
      <IconButton label="关闭">
        <svg />
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: '关闭' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-ark', 'icon-button')
    expect(button).toHaveClass('size-(--ark-size-control-md)')
  })

  it('selected 输出 aria-pressed', () => {
    render(
      <IconButton label="收藏" selected>
        <svg />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: '收藏' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('禁用时不响应点击', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <IconButton label="删除" disabled onClick={onClick}>
        <svg />
      </IconButton>,
    )
    await user.click(screen.getByRole('button', { name: '删除' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
