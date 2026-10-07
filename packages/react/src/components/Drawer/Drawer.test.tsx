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

  it('tone="paper" 是纸白的面，并切到浅色上下文', () => {
    render(
      <Drawer open tone="paper" title="进驻信息">
        {body}
      </Drawer>,
    )
    const drawer = getDrawer()
    expect(drawer).toHaveAttribute('data-ark-tone', 'light')
    expect(drawer.firstElementChild).toHaveClass('bg-ark-overlay-panel-light')
    expect(drawer.firstElementChild).not.toHaveClass('bg-ark-overlay-panel-dark')
    // 提亮次要文字是给半透明深色面用的
    expect(drawer.firstElementChild?.className).not.toContain('--ark-fg-muted')
  })

  it('主画面压暗但不模糊；石墨半透明的面，默认没有色边', () => {
    render(
      <Drawer open title="制造站">
        {body}
      </Drawer>,
    )
    const drawer = getDrawer()
    expect(drawer).toHaveClass('backdrop:bg-ark-overlay-scrim', 'bg-transparent')
    expect(drawer.className).not.toContain('backdrop:backdrop-blur')
    expect(drawer).toHaveAttribute('data-ark-tone', 'dark')
    // 内容铺满 <dialog>，底色画在里面那一层
    expect(drawer.children).toHaveLength(1)
    expect(drawer.firstElementChild).toHaveClass('bg-ark-overlay-panel-dark')
    // 实机的抽屉没有色边
    expect(drawer.firstElementChild?.className).not.toContain('border-l-')
  })

  it('accent 在左缘加一条信号色强调边，画在铺满 <dialog> 的那一层', () => {
    render(
      <Drawer open accent title="制造站">
        {body}
      </Drawer>,
    )
    expect(getDrawer().firstElementChild).toHaveClass(
      'border-l-(length:--ark-line-strong)',
      'border-ark-signal',
    )
  })

  it('平移只在允许动效时进行，减少动效时改为淡入淡出', () => {
    render(
      <Drawer open title="制造站">
        {body}
      </Drawer>,
    )
    const classes = getDrawer().className.split(/\s+/)
    const moving = classes.filter(name => name.includes('translate-x-'))
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
