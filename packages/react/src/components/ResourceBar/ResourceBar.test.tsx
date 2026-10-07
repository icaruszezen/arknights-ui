import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('有图标时名称只读给读屏（实机只有图标和数字），showLabel 可以强制显示', () => {
    const { rerender } = render(
      <ResourceBar>
        <Resource label="源石" value={12} icon={<svg />} />
      </ResourceBar>,
    )
    expect(screen.getByText('源石')).toHaveClass('sr-only')

    rerender(
      <ResourceBar>
        <Resource label="源石" value={12} icon={<svg />} showLabel />
      </ResourceBar>,
    )
    expect(screen.getByText('源石')).not.toHaveClass('sr-only')
  })

  it('没有图标时名称照常显示', () => {
    render(<Bar />)
    expect(screen.getByText('龙门币')).not.toHaveClass('sr-only')
  })

  it('onAdd 在数字后面加一个加号按钮，名称带上资源的名称', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(
      <ResourceBar>
        <Resource label="合成玉" value={6000} icon={<svg />} onAdd={onAdd} />
        <Resource label="龙门币" value={128400} icon={<svg />} />
      </ResourceBar>,
    )
    expect(screen.getAllByRole('button')).toHaveLength(1)
    const add = screen.getByRole('button', { name: '补充 合成玉' })
    expect(add.closest('dd')).not.toBeNull()
    // 可见的圆只有 16px，点击区撑到 44px
    expect(add).toHaveClass('size-4', 'after:size-11')
    await user.click(add)
    expect(onAdd).toHaveBeenCalledTimes(1)
    // 加号不改变数量的文字
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent(/^6,000$/)
  })

  it('plain 不画每一项的底，数字直接压在场景上', () => {
    render(
      <ResourceBar data-testid="bar" plain>
        <Resource label="龙门币" value={128400} />
      </ResourceBar>,
    )
    const item = screen.getByTestId('bar').firstElementChild
    expect(item).not.toHaveClass('bg-ark-neutral-black/65')
    expect(item?.className).toContain('text-shadow')
  })
})
