import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('是一个原生的勾选框，名称来自旁边的文字', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange}>记住我</Checkbox>)
    const checkbox = screen.getByRole('checkbox', { name: '记住我' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    // 键盘：空格切换
    await user.keyboard(' ')
    expect(checkbox).not.toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('点文字也能切换', async () => {
    const user = userEvent.setup()
    render(<Checkbox>记住我</Checkbox>)
    await user.click(screen.getByText('记住我'))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('受控时由外部状态决定', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [checked, setChecked] = useState(true)
      return (
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          接收通知
        </Checkbox>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('checkbox')).toBeChecked()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('indeterminate 写到元素上；说明文字不计入名称之外的地方', () => {
    const { rerender } = render(
      <Checkbox indeterminate description="共 12 项">
        全选
      </Checkbox>,
    )
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(screen.getByText('共 12 项')).toBeInTheDocument()
    rerender(<Checkbox>全选</Checkbox>)
    expect(checkbox.indeterminate).toBe(false)
  })

  it('禁用时不响应点击；表单里带着 name 和 value', async () => {
    const user = userEvent.setup()
    render(
      <form data-testid="form">
        <Checkbox name="agree" value="yes" defaultChecked>
          同意
        </Checkbox>
        <Checkbox name="news" disabled>
          订阅
        </Checkbox>
      </form>,
    )
    await user.click(screen.getByRole('checkbox', { name: '订阅' }))
    expect(screen.getByRole('checkbox', { name: '订阅' })).not.toBeChecked()
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement)
    expect(data.get('agree')).toBe('yes')
    expect(data.has('news')).toBe(false)
  })
})
