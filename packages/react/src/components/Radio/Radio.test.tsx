import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Radio, RadioGroup } from './Radio'

describe('RadioGroup', () => {
  function Notify(props: { onValueChange?: (value: string) => void; disabled?: boolean }) {
    return (
      <RadioGroup aria-label="通知方式" defaultValue="mail" name="notify" {...props}>
        <Radio value="mail">邮件</Radio>
        <Radio value="sms" description="仅工作日">
          短信
        </Radio>
        <Radio value="none">不通知</Radio>
      </RadioGroup>
    )
  }

  it('是一个带名称的单选组，同一时刻只有一项选中', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Notify onValueChange={onValueChange} />)
    expect(screen.getByRole('radiogroup', { name: '通知方式' })).toHaveAttribute(
      'data-ark',
      'radio-group',
    )
    expect(screen.getByRole('radio', { name: '邮件' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: /短信/ }))
    expect(screen.getByRole('radio', { name: /短信/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: '邮件' })).not.toBeChecked()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('sms')
  })

  it('各项共用一个 name，表单提交的是选中的值', () => {
    render(
      <form data-testid="form">
        <Notify />
      </form>,
    )
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement)
    expect(data.get('notify')).toBe('mail')
  })

  it('整组禁用时每一项都禁用', () => {
    render(<Notify disabled />)
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
  })

  it('受控时由外部状态决定', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('a')
      return (
        <RadioGroup aria-label="选项" value={value} onValueChange={setValue}>
          <Radio value="a">甲</Radio>
          <Radio value="b">乙</Radio>
        </RadioGroup>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('radio', { name: '乙' }))
    expect(screen.getByRole('radio', { name: '乙' })).toBeChecked()
  })

  it('脱离 RadioGroup 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Radio value="x">孤立</Radio>)).toThrow('<Radio> 必须放在 <RadioGroup> 里')
    error.mockRestore()
  })
})
