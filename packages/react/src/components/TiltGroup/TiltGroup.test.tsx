import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../../internal/testing'
import { TiltGroup } from './TiltGroup'

const movePointerTo = (clientX: number, clientY: number) => {
  window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }))
  vi.advanceTimersToNextFrame()
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('TiltGroup', () => {
  it('默认是右侧的一组：向左后方倾，以右缘为轴', () => {
    render(<TiltGroup data-testid="group">面板</TiltGroup>)
    const group = screen.getByTestId('group')
    expect(group).toHaveAttribute('data-ark', 'tilt-group')
    expect(group).toHaveAttribute('data-side', 'right')
    expect(group).toHaveClass(
      'ark-tilt',
      'origin-right',
      '[--ark-tilt-base:calc(var(--ark-depth-tilt)*-1)]',
    )
  })

  it('左侧的一组方向相反', () => {
    render(<TiltGroup data-testid="group" side="left" />)
    const group = screen.getByTestId('group')
    expect(group).toHaveClass('origin-left', '[--ark-tilt-base:var(--ark-depth-tilt)]')
    expect(group).not.toHaveClass('origin-right')
  })

  it('竖屏取消倾斜', () => {
    render(<TiltGroup data-testid="group" />)
    expect(screen.getByTestId('group')).toHaveClass('portrait:transform-none')
  })

  it('默认不摆动：移动指针不改样式', () => {
    mockMatchMedia(['pointer: fine'])
    render(<TiltGroup data-testid="group" />)
    movePointerTo(0, 0)
    const group = screen.getByTestId('group')
    expect(group.style.getPropertyValue('--ark-tilt-y')).toBe('')
    expect(group).not.toHaveClass('transition-transform')
  })

  it('sway 打开后随指针摆动，幅度不超过 ±2°', () => {
    mockMatchMedia(['pointer: fine'])
    render(<TiltGroup data-testid="group" sway />)
    const group = screen.getByTestId('group')
    expect(group).toHaveClass('transition-transform')

    // 指针在右下角
    movePointerTo(window.innerWidth, window.innerHeight)
    expect(group.style.getPropertyValue('--ark-tilt-y')).toBe('2.00deg')
    expect(group.style.getPropertyValue('--ark-tilt-x')).toBe('-2.00deg')

    // 指针在左上四分之一处
    movePointerTo(window.innerWidth / 4, window.innerHeight / 4)
    expect(group.style.getPropertyValue('--ark-tilt-y')).toBe('-1.00deg')
    expect(group.style.getPropertyValue('--ark-tilt-x')).toBe('1.00deg')
  })

  it('用户要求减少动效时不摆动', () => {
    mockMatchMedia(['pointer: fine', 'prefers-reduced-motion'])
    render(<TiltGroup data-testid="group" sway />)
    movePointerTo(window.innerWidth, window.innerHeight)
    expect(screen.getByTestId('group').style.getPropertyValue('--ark-tilt-y')).toBe('')
  })

  it('触屏设备上不摆动', () => {
    mockMatchMedia([])
    render(<TiltGroup data-testid="group" sway />)
    movePointerTo(window.innerWidth, window.innerHeight)
    expect(screen.getByTestId('group').style.getPropertyValue('--ark-tilt-y')).toBe('')
  })

  it('关掉 sway 后回到基础倾角', () => {
    mockMatchMedia(['pointer: fine'])
    const { rerender } = render(<TiltGroup data-testid="group" sway />)
    movePointerTo(window.innerWidth, 0)
    const group = screen.getByTestId('group')
    expect(group.style.getPropertyValue('--ark-tilt-y')).toBe('2.00deg')

    rerender(<TiltGroup data-testid="group" />)
    expect(group.style.getPropertyValue('--ark-tilt-y')).toBe('0.00deg')
    expect(group.style.getPropertyValue('--ark-tilt-x')).toBe('0.00deg')
  })

  it('使用方传入的 ref 拿得到根元素', () => {
    const ref = createRef<HTMLDivElement>()
    render(<TiltGroup ref={ref} data-testid="group" />)
    expect(ref.current).toBe(screen.getByTestId('group'))
  })
})
