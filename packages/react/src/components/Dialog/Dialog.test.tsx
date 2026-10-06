import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Dialog, type DialogProps } from './Dialog'

const message = '是否消耗 1 份应急理智合剂恢复理智？'

// 关闭状态的 <dialog> 不在无障碍树里，统一用 hidden: true 查询
const getDialog = () => screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement
const getButton = (name: string) => screen.getByRole('button', { name, hidden: true })

function Controlled(props: Partial<DialogProps>) {
  const [open, setOpen] = useState(true)
  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {message}
    </Dialog>
  )
}

describe('Dialog', () => {
  it('open 为 true 时以模态方式打开，false 时关闭', () => {
    const { rerender } = render(<Dialog open={false}>{message}</Dialog>)
    expect(getDialog().open).toBe(false)

    rerender(<Dialog open>{message}</Dialog>)
    expect(getDialog().open).toBe(true)

    rerender(<Dialog open={false}>{message}</Dialog>)
    expect(getDialog().open).toBe(false)
  })

  it('没有标题时用正文作为名称', () => {
    render(<Dialog open>{message}</Dialog>)
    const dialog = getDialog()
    expect(document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')).toHaveTextContent(
      message,
    )
    expect(dialog).not.toHaveAttribute('aria-describedby')
  })

  it('有标题时标题为名称、正文为描述', () => {
    render(
      <Dialog open title="放弃行动">
        已消耗的理智将全额返还。
      </Dialog>,
    )
    const dialog = getDialog()
    expect(document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')).toHaveTextContent(
      '放弃行动',
    )
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby') ?? ''),
    ).toHaveTextContent('已消耗的理智将全额返还。')
  })

  it('取消在前（左），确认在后（右）', () => {
    render(<Dialog open>{message}</Dialog>)
    const buttons = screen.getAllByRole('button', { hidden: true })
    expect(buttons.map(button => button.textContent)).toEqual(['取消', '确认'])
  })

  it('点确认：调用 onConfirm 并请求关闭', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onConfirm={onConfirm} onCancel={onCancel} onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    await user.click(getButton('确认'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('点取消：调用 onCancel 并请求关闭', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onConfirm={onConfirm} onCancel={onCancel} onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    await user.click(getButton('取消'))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('Esc（cancel 事件）等同取消，并拦下浏览器的默认关闭', () => {
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onCancel={onCancel} onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    const event = new Event('cancel', { cancelable: true })
    fireEvent(getDialog(), event)
    expect(event.defaultPrevented).toBe(true)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('点遮罩等同取消，点内容带不关闭', () => {
    const onCancel = vi.fn()
    render(
      <Dialog open onCancel={onCancel}>
        {message}
      </Dialog>,
    )
    fireEvent.click(screen.getByText(message))
    expect(onCancel).not.toHaveBeenCalled()

    // 遮罩上的点击，事件目标是 <dialog> 自身
    fireEvent.click(getDialog())
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('关闭由状态驱动：父组件更新 open 后才真正关闭', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    expect(getDialog().open).toBe(true)
    await user.click(getButton('确认'))
    expect(getDialog().open).toBe(false)
  })

  it('父组件不更新 open 时保持打开', async () => {
    const user = userEvent.setup()
    render(<Dialog open>{message}</Dialog>)
    await user.click(getButton('确认'))
    expect(getDialog().open).toBe(true)
  })

  it('已关闭后的点击不再触发回调', () => {
    const onCancel = vi.fn()
    const { rerender } = render(
      <Dialog open onCancel={onCancel}>
        {message}
      </Dialog>,
    )
    rerender(
      <Dialog open={false} onCancel={onCancel}>
        {message}
      </Dialog>,
    )
    // 退场过渡期间 <dialog> 仍在顶层，可能再收到一次点击
    fireEvent.click(getDialog())
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('浏览器自行关闭时（原生 close 事件）把状态同步回去', () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    fireEvent(getDialog(), new Event('close'))
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false)
  })

  it('由父组件引起的关闭不再回调 onOpenChange', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Dialog open onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    rerender(
      <Dialog open={false} onOpenChange={onOpenChange}>
        {message}
      </Dialog>,
    )
    fireEvent(getDialog(), new Event('close'))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('hideCancel 只留确认按钮', () => {
    render(
      <Dialog open hideCancel confirmText="知道了">
        数据已同步至最新版本。
      </Dialog>,
    )
    const buttons = screen.getAllByRole('button', { hidden: true })
    expect(buttons.map(button => button.textContent)).toEqual(['知道了'])
  })

  it('detail 渲染在正文之外，不计入名称', () => {
    render(
      <Dialog open detail="SANITY 12/135 → 92/135">
        {message}
      </Dialog>,
    )
    const dialog = getDialog()
    const label = document.getElementById(dialog.getAttribute('aria-labelledby') ?? '')
    expect(screen.getByText('SANITY 12/135 → 92/135')).toBeInTheDocument()
    expect(label).not.toHaveTextContent('SANITY')
  })

  it('同时支持使用方的 ref', () => {
    let node: HTMLDialogElement | null = null
    render(
      <Dialog
        open
        ref={element => {
          node = element
        }}
      >
        {message}
      </Dialog>,
    )
    expect(node).toBe(getDialog())
    expect(getDialog().open).toBe(true)
  })
})
