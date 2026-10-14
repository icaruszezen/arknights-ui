import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('是一个开关，名称来自旁边的文字', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch onCheckedChange={onCheckedChange}>省电模式</Switch>)
    const control = screen.getByRole('switch', { name: '省电模式' })
    expect(control).not.toBeChecked()
    await user.click(control)
    expect(control).toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    await user.keyboard(' ')
    expect(control).not.toBeChecked()
  })

  it('状态格里写着 ON / OFF，是对状态的第二次表述，对读屏隐藏', () => {
    const { container } = render(<Switch defaultChecked>省电模式</Switch>)
    const body = container.querySelector('[data-ark="switch-body"]')
    expect(body).toHaveAttribute('aria-hidden', 'true')
    expect(body).toHaveTextContent('ONOFF')
  })

  it('sm 没有字，只有滑块；状态字可以换', () => {
    const { container, rerender } = render(<Switch size="sm" aria-label="静音" />)
    expect(container.querySelector('[data-ark="switch-body"]')).toHaveTextContent('')
    expect(container.querySelector('[data-part="thumb"]')).not.toBeNull()

    rerender(<Switch aria-label="静音" onLabel="开" offLabel="关" />)
    expect(container.querySelector('[data-ark="switch-body"]')).toHaveTextContent('开关')
  })

  it('禁用时不响应点击', async () => {
    const user = userEvent.setup()
    render(<Switch disabled>省电模式</Switch>)
    await user.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).not.toBeChecked()
  })
})
