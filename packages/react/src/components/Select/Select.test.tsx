import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../Field'
import { Select, SelectOption, type SelectProps } from './Select'

function Voice(props: Partial<SelectProps>) {
  return (
    <Select aria-label="语音" placeholder="请选择" {...props}>
      <SelectOption value="jp">日语</SelectOption>
      <SelectOption value="cn">中文</SelectOption>
      <SelectOption value="kr" disabled>
        韩语
      </SelectOption>
      <SelectOption value="en">English</SelectOption>
    </Select>
  )
}

const trigger = () => screen.getByRole('combobox', { name: '语音' })

describe('Select', () => {
  it('触发行是一个 combobox，显示当前项的文字；没选时显示占位字', () => {
    const { rerender } = render(<Voice />)
    expect(trigger()).toHaveAttribute('data-ark', 'select')
    expect(trigger()).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveTextContent('请选择')
    expect(screen.queryByRole('listbox')).toBeNull()

    rerender(<Voice defaultValue="cn" key="with-value" />)
    expect(trigger()).toHaveTextContent('中文')
  })

  it('点开是一个 listbox：反色的面，已选的那一项标出来', async () => {
    const user = userEvent.setup()
    render(<Voice defaultValue="cn" />)
    await user.click(trigger())
    const list = screen.getByRole('listbox')
    expect(list).toHaveAttribute('data-ark-tone', 'inverse')
    expect(trigger()).toHaveAttribute('aria-controls', list.id)
    expect(within(list).getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('option', { name: '中文' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: '韩语' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('点一项就选中它：回调、收起、焦点回到触发行', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Voice onValueChange={onValueChange} />)
    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: 'English' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('en')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger()).toHaveTextContent('English')
    expect(trigger()).toHaveFocus()
  })

  it('点禁用的项没有反应', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Voice onValueChange={onValueChange} />)
    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: '韩语' }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('键盘：方向键打开并移动（跳过禁用的），Enter 选中，Esc 关闭', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Voice defaultValue="jp" onValueChange={onValueChange} />)
    trigger().focus()
    await user.keyboard('{ArrowDown}')
    const active = () =>
      document.getElementById(trigger().getAttribute('aria-activedescendant') ?? '')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(active()).toHaveTextContent('日语')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    // 跳过了禁用的韩语
    expect(active()).toHaveTextContent('English')
    await user.keyboard('{Home}')
    expect(active()).toHaveTextContent('日语')
    await user.keyboard('{End}{Enter}')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('en')
    expect(screen.queryByRole('listbox')).toBeNull()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger()).toHaveTextContent('English')
  })

  it('收着的时候按字符直接换到以它开头的那一项', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Voice onValueChange={onValueChange} />)
    trigger().focus()
    await user.keyboard('e')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('en')
    expect(trigger()).toHaveTextContent('English')
  })

  it('给了 name 就带一个隐藏的输入框，表单提交时带上选中的值', () => {
    render(
      <form data-testid="form">
        <Voice name="voice" defaultValue="cn" />
      </form>,
    )
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('voice')).toBe('cn')
  })

  it('受控时由外部状态决定', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('jp')
      return <Voice value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: '中文' }))
    expect(trigger()).toHaveTextContent('中文')
  })

  it('禁用时点不开；放进 Field 时名称来自项名，报错标记为不合法', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Voice disabled />)
    await user.click(trigger())
    expect(screen.queryByRole('listbox')).toBeNull()

    rerender(
      <Field label="语音语种" error="请选择一个语种">
        <Select placeholder="请选择">
          <SelectOption value="jp">日语</SelectOption>
        </Select>
      </Field>,
    )
    const field = screen.getByRole('combobox', { name: '语音语种' })
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('请选择一个语种')
  })
})
