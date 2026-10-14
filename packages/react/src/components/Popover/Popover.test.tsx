import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Popover } from './Popover'

function Filter(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Popover trigger={<button type="button">筛选</button>} title="筛选条件" {...props}>
      <label>
        <input type="checkbox" /> 只看我的
      </label>
    </Popover>
  )
}

describe('Popover', () => {
  it('平时不在文档里；点触发元素展开，再点一次收起', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Filter onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole('button', { name: '筛选' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    const popover = screen.getByRole('dialog', { name: '筛选条件' })
    expect(popover).toHaveAttribute('data-ark', 'popover')
    expect(popover).toHaveAttribute('popover', 'manual')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', popover.id)
    expect(onOpenChange).toHaveBeenLastCalledWith(true)

    await user.click(trigger)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('打开后焦点进到浮层里；按 Esc 关闭并回到触发元素', async () => {
    const user = userEvent.setup()
    render(<Filter />)
    const trigger = screen.getByRole('button', { name: '筛选' })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(trigger).toHaveFocus()
  })

  it('点外面关闭，点里面不关', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Filter />
        <p>页面上别的内容</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: '筛选' }))
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.pointerDown(screen.getByText('页面上别的内容'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('受控时由外部状态决定', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger={<button type="button">筛选</button>}
          aria-label="筛选"
        >
          内容
        </Popover>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('dialog', { name: '筛选' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '筛选' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('保留触发元素自己的 onClick；它拦下默认行为时不展开', async () => {
    const user = userEvent.setup()
    render(
      <Popover
        trigger={
          <button type="button" onClick={event => event.preventDefault()}>
            筛选
          </button>
        }
        aria-label="筛选"
      >
        内容
      </Popover>,
    )
    await user.click(screen.getByRole('button'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
