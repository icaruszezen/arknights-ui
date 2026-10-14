import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Drawer, type DrawerProps } from './Drawer'

const body = '进驻干员 3 / 3，当前产出：赤金'

// 关闭状态的 <dialog> 不在无障碍树里，统一用 hidden: true 查询
const getDrawer = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement
const getCloseButton = () => screen.getByRole('button', { name: '关闭', hidden: true })

function Controlled(props: Partial<DrawerProps>) {
  const [open, setOpen] = useState(true)
  return (
    <Drawer open={open} onOpenChange={setOpen} title="制造站" {...props}>
      {body}
    </Drawer>
  )
}

describe('Drawer', () => {
  it('open 为 true 时以模态方式打开，false 时关闭', () => {
    const { rerender } = render(
      <Drawer open={false} title="制造站">
        {body}
      </Drawer>,
    )
    expect(getDrawer().open).toBe(false)
    expect(getDrawer()).toHaveAttribute('data-ark', 'drawer')

    rerender(
      <Drawer open title="制造站">
        {body}
      </Drawer>,
    )
    expect(getDrawer().open).toBe(true)

    rerender(
      <Drawer open={false} title="制造站">
        {body}
      </Drawer>,
    )
    expect(getDrawer().open).toBe(false)
  })

  it('标题是抽屉的名称，英文小字跟在后面', () => {
    render(
      <Drawer open title="制造站" sub="FACTORY">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveAccessibleName('制造站 FACTORY')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('制造站')
  })

  it('没有标题时用 aria-label 命名', () => {
    render(
      <Drawer open aria-label="设施详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveAccessibleName('设施详情')
    expect(getDrawer()).not.toHaveAttribute('aria-labelledby')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('点关闭直接请求关闭，没有二次确认', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Drawer open title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    await user.click(getCloseButton())
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('Esc（cancel 事件）请求关闭，并拦下浏览器的默认关闭', () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    const event = new Event('cancel', { cancelable: true })
    fireEvent(getDrawer(), event)
    expect(event.defaultPrevented).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('点主画面关闭，点抽屉里面不关闭', () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    fireEvent.click(screen.getByText(body))
    expect(onOpenChange).not.toHaveBeenCalled()

    // 主画面上的点击落在遮罩上，事件目标是 <dialog> 自身
    fireEvent.click(getDrawer())
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('关闭由状态驱动：父组件更新 open 后才真正关闭', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    expect(getDrawer().open).toBe(true)
    await user.click(getCloseButton())
    expect(getDrawer().open).toBe(false)
  })

  it('父组件不更新 open 时保持打开', async () => {
    const user = userEvent.setup()
    render(
      <Drawer open title="制造站">
        {body}
      </Drawer>,
    )
    await user.click(getCloseButton())
    expect(getDrawer().open).toBe(true)
  })

  it('已关闭后的点击不再触发回调', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Drawer open title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    rerender(
      <Drawer open={false} title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    // 退场过渡期间 <dialog> 仍在顶层，可能再收到一次点击
    fireEvent.click(getDrawer())
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('浏览器自行关闭时（原生 close 事件）把状态同步回去', () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open title="制造站" onOpenChange={onOpenChange}>
        {body}
      </Drawer>,
    )
    fireEvent(getDrawer(), new Event('close'))
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('默认的面跟着主题走，不设明暗上下文', () => {
    render(
      <Drawer open title="成员详情">
        {body}
      </Drawer>,
    )
    const drawer = getDrawer()
    expect(drawer).not.toHaveAttribute('data-ark-tone')
    // 内容铺满 <dialog>，底色画在里面那一层
    expect(drawer.children).toHaveLength(1)
    expect(drawer.firstElementChild).toHaveClass('bg-ark-surface')
    expect(drawer).toHaveClass('bg-transparent')
  })

  it('tone="paper" 是纸白的面，并切到浅色上下文', () => {
    render(
      <Drawer open tone="paper" title="成员详情">
        {body}
      </Drawer>,
    )
    const drawer = getDrawer()
    expect(drawer).toHaveAttribute('data-ark-tone', 'light')
    expect(drawer.firstElementChild).toHaveClass('bg-ark-overlay-panel-light')
    // 提亮次要文字是给半透明深色面用的
    expect(drawer.firstElementChild?.className).not.toContain('--ark-fg-muted')
  })

  it('主画面压暗但不模糊，默认没有色边', () => {
    render(
      <Drawer open title="成员详情">
        {body}
      </Drawer>,
    )
    const drawer = getDrawer()
    expect(drawer).toHaveClass('backdrop:bg-ark-overlay-scrim')
    expect(drawer.className).not.toContain('backdrop:backdrop-blur')
    expect(drawer.firstElementChild?.className).not.toContain('border-l-')
  })

  it('accent 在朝主画面的那一缘加一条信号色强调边，画在铺满 <dialog> 的那一层', () => {
    const { rerender } = render(
      <Drawer open accent title="成员详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer().firstElementChild).toHaveClass(
      'border-l-(length:--ark-line-strong)',
      'border-l-ark-signal',
    )
    rerender(
      <Drawer open accent side="left" title="成员详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer().firstElementChild).toHaveClass('border-r-ark-signal')
  })

  it('side 决定贴哪一边：左边的抽屉贴左，下边的通栏、高度随内容', () => {
    const { rerender } = render(
      <Drawer open title="成员详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveAttribute('data-side', 'right')
    expect(getDrawer()).toHaveClass('right-0', 'left-auto', 'h-full')

    rerender(
      <Drawer open side="left" title="导航">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveClass('left-0', 'right-auto')

    rerender(
      <Drawer open side="bottom" title="操作">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveClass('bottom-0', 'top-auto', 'w-full', 'max-h-[85dvh]')
  })

  it('size 换左右抽屉的宽度', () => {
    const { rerender } = render(
      <Drawer open title="成员详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveClass('w-[min(100vw-3rem,max(40vw,22.5rem))]')
    rerender(
      <Drawer open size="sm" title="成员详情">
        {body}
      </Drawer>,
    )
    expect(getDrawer()).toHaveClass('w-[min(100vw-3rem,20rem)]')
  })

  it('平移只在允许动效时进行，减少动效时改为淡入淡出', () => {
    render(
      <Drawer open title="制造站">
        {body}
      </Drawer>,
    )
    const classes = getDrawer().className.split(/\s+/)
    const moving = classes.filter(name => name.includes('translate-x-'))
    // 开和关各一个方向的类，都只在允许动效时生效
    expect(moving.length).toBeGreaterThan(0)
    for (const name of moving) expect(name).toMatch(/^motion-safe:/)
    expect(classes).toContain('motion-reduce:opacity-0')
  })

  it('底栏固定在正文之外', () => {
    render(
      <Drawer open title="制造站" footer={<button type="button">收取产物</button>}>
        {body}
      </Drawer>,
    )
    const action = screen.getByRole('button', { name: '收取产物', hidden: true })
    const scroller = screen.getByText(body)
    expect(scroller).toHaveClass('overflow-y-auto')
    expect(scroller).not.toContainElement(action)
  })

  it('同时支持使用方的 ref', () => {
    let node: HTMLDialogElement | null = null
    render(
      <Drawer
        open
        title="制造站"
        ref={element => {
          node = element
        }}
      >
        {body}
      </Drawer>,
    )
    expect(node).toBe(getDrawer())
    expect(getDrawer().open).toBe(true)
  })
})
