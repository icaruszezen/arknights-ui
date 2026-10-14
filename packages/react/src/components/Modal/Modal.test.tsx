import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Modal, type ModalProps } from './Modal'

const body = '导出的文件包含当前筛选条件下的全部记录。'

// 关闭状态的 <dialog> 不在无障碍树里，统一用 hidden: true 查询
const getModal = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement
const getCloseButton = () => screen.getByRole('button', { name: '关闭', hidden: true })

function Controlled(props: Partial<ModalProps>) {
  const [open, setOpen] = useState(true)
  return (
    <Modal open={open} onOpenChange={setOpen} title="导出记录" {...props}>
      {body}
    </Modal>
  )
}

describe('Modal', () => {
  it('open 为 true 时以模态方式打开，false 时关闭', () => {
    const { rerender } = render(
      <Modal open={false} title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal().open).toBe(false)
    expect(getModal()).toHaveAttribute('data-ark', 'modal')

    rerender(
      <Modal open title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal().open).toBe(true)
  })

  it('标题是弹层的名称', () => {
    render(
      <Modal open title="导出记录" sub="EXPORT">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveAccessibleName('导出记录 EXPORT')
  })

  it('没有标题时用 aria-label 命名', () => {
    render(
      <Modal open aria-label="签到">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveAccessibleName('签到')
    expect(getModal()).not.toHaveAttribute('aria-labelledby')
  })

  it('点关闭、按 Esc、点遮罩都请求关闭', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open title="导出记录" onOpenChange={onOpenChange}>
        {body}
      </Modal>,
    )

    await user.click(getCloseButton())
    expect(onOpenChange).toHaveBeenCalledTimes(1)

    const cancel = new Event('cancel', { cancelable: true })
    fireEvent(getModal(), cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(2)

    // 遮罩上的点击，事件目标是 <dialog> 自身
    fireEvent.click(getModal())
    expect(onOpenChange).toHaveBeenCalledTimes(3)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('点弹层里面不关闭', () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open title="导出记录" onOpenChange={onOpenChange}>
        {body}
      </Modal>,
    )
    fireEvent.click(screen.getByText(body))
    fireEvent.click(screen.getByRole('heading', { hidden: true }))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('关闭由状态驱动：父组件更新 open 后才真正关闭', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    expect(getModal().open).toBe(true)
    await user.click(getCloseButton())
    expect(getModal().open).toBe(false)
  })

  it('已关闭后的点击不再触发回调', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Modal open title="导出记录" onOpenChange={onOpenChange}>
        {body}
      </Modal>,
    )
    rerender(
      <Modal open={false} title="导出记录" onOpenChange={onOpenChange}>
        {body}
      </Modal>,
    )
    fireEvent.click(getModal())
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('默认是抬起的一层，跟着主题走，不设明暗上下文', () => {
    render(
      <Modal open title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveClass('bg-ark-surface-raised', 'border-0')
    expect(getModal()).not.toHaveAttribute('data-ark-tone')
    expect(getModal().children).toHaveLength(1)
  })

  it('毛玻璃写在 <dialog> 自身，描边画在铺满它的那一层', () => {
    render(
      <Modal open tone="frosted" title="导出记录">
        {body}
      </Modal>,
    )
    const modal = getModal()
    expect(modal).toHaveClass('backdrop-blur-ark-backdrop')
    expect(modal.firstElementChild).toHaveClass('border', 'border-ark-rule')
    expect(modal.firstElementChild?.className).not.toContain('backdrop-blur')
  })

  it('固定明暗的表面给里面的内容设上下文', () => {
    const { rerender } = render(
      <Modal open tone="paper" title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveAttribute('data-ark-tone', 'light')
    rerender(
      <Modal open tone="inverse" title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveAttribute('data-ark-tone', 'inverse')
  })

  it('遮罩把整页压暗并模糊', () => {
    render(
      <Modal open title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveClass(
      'backdrop:bg-ark-overlay-scrim',
      'backdrop:backdrop-blur-ark-backdrop',
    )
  })

  it('footer 固定在底部，不在滚动的正文里', () => {
    render(
      <Modal open title="导出记录" footer={<button type="button">导出</button>}>
        {body}
      </Modal>,
    )
    const footer = getModal().querySelector('[data-ark="modal-footer"]')
    expect(footer).toContainElement(screen.getByRole('button', { name: '导出', hidden: true }))
    expect(footer).not.toContainElement(screen.getByText(body))
    expect(screen.getByText(body)).toHaveClass('overflow-y-auto')
  })

  it('窄屏通栏贴底，宽屏按 size 定宽并居中', () => {
    const { rerender } = render(
      <Modal open title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveClass('w-full', 'mt-auto', 'md:m-auto', 'md:w-[min(36rem,100vw-2rem)]')
    rerender(
      <Modal open size="lg" title="导出记录">
        {body}
      </Modal>,
    )
    expect(getModal()).toHaveClass('md:w-[min(56rem,100vw-2rem)]')
  })

  it('放大只在允许动效时进行，透明度始终过渡', () => {
    render(
      <Modal open title="导出记录">
        {body}
      </Modal>,
    )
    const classes = getModal().className.split(/\s+/)
    const scaling = classes.filter(name => /(^|:)scale-/.test(name))
    expect(scaling.length).toBeGreaterThan(0)
    for (const name of scaling) expect(name).toMatch(/^motion-safe:/)
    expect(classes).toContain('opacity-0')
    expect(classes).toContain('open:opacity-100')
  })

  it('同时支持使用方的 ref', () => {
    let node: HTMLDialogElement | null = null
    render(
      <Modal
        open
        title="导出记录"
        ref={element => {
          node = element
        }}
      >
        {body}
      </Modal>,
    )
    expect(node).toBeInstanceOf(HTMLDialogElement)
    expect(getModal().open).toBe(true)
  })
})
