import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('是一个原生的多行输入框', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="备注" />)
    const textarea = screen.getByRole('textbox', { name: '备注' })
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea.parentElement).toHaveAttribute('data-ark', 'textarea')
    await user.type(textarea, '第一行')
    expect(textarea).toHaveValue('第一行')
  })

  it('showCount 配合 maxLength 显示已输入的字数，对读屏隐藏', async () => {
    const user = userEvent.setup()
    const { container } = render(<Textarea aria-label="备注" maxLength={20} showCount />)
    const count = container.querySelector('[data-ark="textarea-count"]')
    expect(count).toHaveAttribute('aria-hidden', 'true')
    expect(count).toHaveTextContent('0 / 20')
    await user.type(screen.getByRole('textbox'), '你好')
    expect(count).toHaveTextContent('2 / 20')
  })

  it('受控时字数跟着 value 走；没有 maxLength 不显示', () => {
    const { container, rerender } = render(
      <Textarea aria-label="备注" value="abc" maxLength={10} showCount onChange={() => {}} />,
    )
    expect(container.querySelector('[data-ark="textarea-count"]')).toHaveTextContent('3 / 10')
    rerender(<Textarea aria-label="备注" value="abc" showCount onChange={() => {}} />)
    expect(container.querySelector('[data-ark="textarea-count"]')).toBeNull()
  })
})
