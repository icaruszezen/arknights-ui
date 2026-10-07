import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Sheet, type SheetProps } from './Sheet'

const body = '近卫干员擅长近身作战，可以阻挡多个敌人。'

// 关闭状态的 <dialog> 不在无障碍树里，统一用 hidden: true 查询
const getSheet = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement
const getCloseButton = () => screen.getByRole('button', { name: '关闭', hidden: true })

function Controlled(props: Partial<SheetProps>) {
  const [open, setOpen] = useState(true)
  return (
    <Sheet open={open} onOpenChange={setOpen} title="职业详情" {...props}>
      {body}
    </Sheet>
  )
}

describe('Sheet', () => {
  it('open 为 true 时以模态方式打开，false 时关闭', () => {
    const { rerender } = render(
      <Sheet open={false} title="职业详情">
        {body}
      </Sheet>,
    )
    expect(getSheet().open).toBe(false)
    expect(getSheet()).toHaveAttribute('data-ark', 'sheet')

    rerender(
      <Sheet open title="职业详情">
        {body}
      </Sheet>,
    )
    expect(getSheet().open).toBe(true)
  })

  it('标题是浮层的名称', () => {
    render(
      <Sheet open title="职业详情" sub="CLASS DETAILS">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveAccessibleName('职业详情 CLASS DETAILS')
  })

  it('没有标题时用 aria-label 命名', () => {
    render(
      <Sheet open aria-label="签到">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveAccessibleName('签到')
    expect(getSheet()).not.toHaveAttribute('aria-labelledby')
  })

  it('点关闭、按 Esc、点遮罩都请求关闭', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Sheet open title="职业详情" onOpenChange={onOpenChange}>
        {body}
      </Sheet>,
    )

    await user.click(getCloseButton())
    expect(onOpenChange).toHaveBeenCalledTimes(1)

    const cancel = new Event('cancel', { cancelable: true })
    fireEvent(getSheet(), cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(2)

    // 遮罩上的点击，事件目标是 <dialog> 自身
    fireEvent.click(getSheet())
    expect(onOpenChange).toHaveBeenCalledTimes(3)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('点浮层里面不关闭', () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet open title="职业详情" onOpenChange={onOpenChange}>
        {body}
      </Sheet>,
    )
    fireEvent.click(screen.getByText(body))
    fireEvent.click(screen.getByRole('heading', { hidden: true }))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('关闭由状态驱动：父组件更新 open 后才真正关闭', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    expect(getSheet().open).toBe(true)
    await user.click(getCloseButton())
    expect(getSheet().open).toBe(false)
  })

  it('已关闭后的点击不再触发回调', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Sheet open title="职业详情" onOpenChange={onOpenChange}>
        {body}
      </Sheet>,
    )
    rerender(
      <Sheet open={false} title="职业详情" onOpenChange={onOpenChange}>
        {body}
      </Sheet>,
    )
    fireEvent.click(getSheet())
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('毛玻璃写在 <dialog> 自身，描边画在铺满它的那一层', () => {
    render(
      <Sheet open title="职业详情">
        {body}
      </Sheet>,
    )
    const sheet = getSheet()
    expect(sheet).toHaveClass('bg-ark-overlay-scrim', 'backdrop-blur-ark-backdrop', 'border-0')
    expect(sheet.children).toHaveLength(1)
    expect(sheet.firstElementChild).toHaveClass('border', 'border-ark-rule')
    expect(sheet.firstElementChild?.className).not.toContain('backdrop-blur')
  })

  it('遮罩把整页压暗并模糊', () => {
    render(
      <Sheet open title="职业详情">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveClass(
      'backdrop:bg-ark-overlay-scrim',
      'backdrop:backdrop-blur-ark-backdrop',
    )
  })

  it('tone="graphite" / "paper" 是不透明的面，没有细描边', () => {
    const { rerender } = render(
      <Sheet open tone="graphite" title="采购">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveClass('bg-ark-neutral-graphite')
    // 浮层自身不再是毛玻璃（遮罩上的模糊是另一个类）
    expect(getSheet().className.split(/\s+/)).not.toContain('backdrop-blur-ark-backdrop')
    expect(getSheet()).not.toHaveClass('bg-ark-overlay-scrim')
    expect(getSheet().firstElementChild).not.toHaveClass('border')

    rerender(
      <Sheet open tone="paper" title="采购">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveClass('bg-ark-neutral-paper')
    expect(getSheet()).toHaveAttribute('data-ark-tone', 'light')
    expect(getSheet().firstElementChild?.className).not.toContain('--ark-fg-muted')
  })

  it('放大只在允许动效时进行，透明度始终过渡', () => {
    render(
      <Sheet open title="职业详情">
        {body}
      </Sheet>,
    )
    const classes = getSheet().className.split(/\s+/)
    const scaling = classes.filter(name => /(^|:)scale-/.test(name))
    expect(scaling.length).toBeGreaterThan(0)
    for (const name of scaling) expect(name).toMatch(/^motion-safe:/)
    expect(classes).toContain('opacity-0')
    expect(classes).toContain('open:opacity-100')
  })

  it('自身是深色上下文，次要文字提亮一档', () => {
    render(
      <Sheet open title="职业详情">
        {body}
      </Sheet>,
    )
    expect(getSheet()).toHaveAttribute('data-ark-tone', 'dark')
    expect(getSheet().firstElementChild).toHaveClass(
      '[--ark-fg-muted:var(--ark-color-neutral-gray-300)]',
    )
  })

  it('同时支持使用方的 ref', () => {
    let node: HTMLDialogElement | null = null
    render(
      <Sheet
        open
        title="职业详情"
        ref={element => {
          node = element
        }}
      >
        {body}
      </Sheet>,
    )
    expect(node).toBe(getSheet())
  })
})
