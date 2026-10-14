import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('是一个原生的输入框，属性和 ref 都交给它', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    let node: HTMLInputElement | null = null
    render(
      <Input
        aria-label="搜索"
        placeholder="输入关键词"
        onChange={onChange}
        ref={element => {
          node = element
        }}
      />,
    )
    const input = screen.getByRole('textbox', { name: '搜索' })
    expect(node).toBe(input)
    expect(input).toHaveAttribute('placeholder', '输入关键词')
    await user.type(input, 'ab')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(input).toHaveValue('ab')
  })

  it('className 作用在外面那一层：控件的底色跟着主题走', () => {
    render(<Input aria-label="搜索" className="w-64" />)
    const frame = screen.getByRole('textbox').parentElement
    expect(frame).toHaveAttribute('data-ark', 'input')
    expect(frame).toHaveClass('w-64', 'bg-ark-control', 'border-b')
  })

  it('size 决定高度', () => {
    const { rerender } = render(<Input aria-label="搜索" />)
    expect(screen.getByRole('textbox').parentElement).toHaveClass('h-(--ark-size-control-md)')
    rerender(<Input aria-label="搜索" size="lg" />)
    expect(screen.getByRole('textbox').parentElement).toHaveClass('h-(--ark-size-control-lg)')
  })

  it('前后缀不是输入的一部分', () => {
    render(<Input aria-label="金额" prefix="¥" suffix="元" />)
    const frame = screen.getByRole('textbox').parentElement
    expect(frame).toHaveTextContent('¥元')
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('invalid 输出 aria-invalid', () => {
    render(<Input aria-label="邮箱" invalid />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('禁用时不能输入', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="邮箱" disabled />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(screen.getByRole('textbox')).toHaveValue('')
  })
})
