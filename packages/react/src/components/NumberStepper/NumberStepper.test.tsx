import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NumberStepper } from './NumberStepper'

describe('NumberStepper', () => {
  const field = () => screen.getByRole('spinbutton', { name: '数量' })

  it('五格：最少、减、数值、加、最多', () => {
    render(<NumberStepper aria-label="数量" min={1} max={99} defaultValue={5} />)
    expect(field()).toHaveValue(5)
    for (const name of ['最少', '减少', '增加', '最多']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('加减按 step 走，最少 / 最多一步到头', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberStepper
        aria-label="数量"
        min={0}
        max={50}
        step={5}
        defaultValue={10}
        onValueChange={onValueChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: '增加' }))
    expect(field()).toHaveValue(15)
    await user.click(screen.getByRole('button', { name: '减少' }))
    await user.click(screen.getByRole('button', { name: '减少' }))
    expect(field()).toHaveValue(5)
    await user.click(screen.getByRole('button', { name: '最多' }))
    expect(field()).toHaveValue(50)
    expect(onValueChange).toHaveBeenLastCalledWith(50)
    await user.click(screen.getByRole('button', { name: '最少' }))
    expect(field()).toHaveValue(0)
  })

  it('到了下限或上限，对应的两格禁用', async () => {
    const user = userEvent.setup()
    render(<NumberStepper aria-label="数量" min={1} max={3} defaultValue={1} />)
    expect(screen.getByRole('button', { name: '最少' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '减少' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '增加' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '最多' }))
    expect(screen.getByRole('button', { name: '增加' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '最多' })).toBeDisabled()
  })

  it('可以直接键入；越界的值失焦时收回到范围以内', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <NumberStepper
        aria-label="数量"
        min={1}
        max={20}
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    )
    await user.clear(field())
    await user.type(field(), '12')
    expect(onValueChange).toHaveBeenLastCalledWith(12)
    await user.clear(field())
    await user.type(field(), '99')
    await user.tab()
    expect(field()).toHaveValue(20)
    expect(onValueChange).toHaveBeenLastCalledWith(20)
  })

  it('没有同时给上下限时不显示两端的捷径；bounds 可以强制', () => {
    const { rerender } = render(<NumberStepper aria-label="数量" min={0} />)
    expect(screen.queryByRole('button', { name: '最少' })).toBeNull()
    expect(screen.queryByRole('button', { name: '最多' })).toBeNull()
    rerender(<NumberStepper aria-label="数量" min={0} bounds />)
    expect(screen.getByRole('button', { name: '最少' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '最多' })).toBeNull()
  })

  it('禁用时所有格子都禁用', () => {
    render(<NumberStepper aria-label="数量" min={1} max={9} defaultValue={5} disabled />)
    expect(field()).toBeDisabled()
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
  })
})
