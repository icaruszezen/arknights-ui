import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'

describe('Slider', () => {
  it('底下是原生的 range，数值印在滑块上并读给读屏', () => {
    const { container } = render(<Slider aria-label="音量" defaultValue={40} />)
    const slider = screen.getByRole('slider', { name: '音量' })
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveValue('40')
    expect(slider).toHaveAttribute('aria-valuetext', '40')
    const thumb = container.querySelector('[data-ark="slider-thumb"]')
    expect(thumb).toHaveTextContent('40')
    expect(thumb).toHaveAttribute('aria-hidden', 'true')
  })

  it('拖动时更新数值并回调；位置用一个 0–1 的比例变量表示', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Slider aria-label="音量" defaultValue={0} min={0} max={200} onValueChange={onValueChange} />,
    )
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '50' } })
    expect(onValueChange).toHaveBeenLastCalledWith(50)
    expect(slider).toHaveValue('50')
    const root = container.querySelector('[data-ark="slider"]') as HTMLElement
    expect(root.style.getPropertyValue('--ark-slider-ratio')).toBe('0.25')
  })

  it('formatValue 改写滑块上的字和 aria-valuetext', () => {
    const { container } = render(
      <Slider aria-label="亮度" defaultValue={80} formatValue={value => `${value}%`} />,
    )
    expect(container.querySelector('[data-ark="slider-thumb"]')).toHaveTextContent('80%')
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '80%')
  })

  it('受控时由外部状态决定；超出范围的值收回来', () => {
    function Controlled() {
      const [value, setValue] = useState(150)
      return <Slider aria-label="音量" value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('100')
    fireEvent.change(slider, { target: { value: '30' } })
    expect(slider).toHaveValue('30')
  })

  it('禁用时原生输入框禁用', () => {
    render(<Slider aria-label="音量" disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })
})
