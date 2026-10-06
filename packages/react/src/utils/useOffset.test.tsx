import { render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../internal/testing'
import { type OffsetSource, useOffset } from './useOffset'

type Change = (element: HTMLElement, x: number, y: number) => void

function Probe({
  source,
  enabled = true,
  onChange,
}: {
  source: OffsetSource
  enabled?: boolean
  onChange: Change
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOffset(ref, { source, enabled, onChange })
  return <div ref={ref} data-testid="probe" />
}

const move = (target: EventTarget, clientX: number, clientY: number) =>
  target.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }))

// 回调的第一个参数是元素，断言里只看坐标
const points = (onChange: ReturnType<typeof vi.fn<Change>>) =>
  onChange.mock.calls.map(([, x, y]) => [x, y])

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useOffset', () => {
  it('window：指针在窗口里的位置归一化到 -1 到 1', () => {
    mockMatchMedia(['pointer: fine'])
    const onChange = vi.fn<Change>()
    render(<Probe source="window" onChange={onChange} />)

    move(window, window.innerWidth, 0)
    vi.advanceTimersToNextFrame()
    expect(points(onChange)).toEqual([[1, -1]])

    move(window, window.innerWidth / 2, window.innerHeight / 2)
    vi.advanceTimersToNextFrame()
    expect(points(onChange).at(-1)).toEqual([0, 0])
  })

  it('一帧里来多少次事件都只回调一次，取最后一次的位置', () => {
    mockMatchMedia(['pointer: fine'])
    const onChange = vi.fn<Change>()
    render(<Probe source="window" onChange={onChange} />)

    move(window, 0, 0)
    move(window, window.innerWidth / 4, window.innerHeight)
    move(window, window.innerWidth, window.innerHeight)
    expect(onChange).not.toHaveBeenCalled()

    vi.advanceTimersToNextFrame()
    expect(points(onChange)).toEqual([[1, 1]])
  })

  it('pointer：按元素自己的范围归一化，指针离开后回到正中', () => {
    mockMatchMedia(['pointer: fine'])
    const onChange = vi.fn<Change>()
    const { getByTestId } = render(<Probe source="pointer" onChange={onChange} />)
    const probe = getByTestId('probe')
    vi.spyOn(probe, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 50,
      width: 200,
      height: 100,
    } as DOMRect)

    move(probe, 250, 75)
    vi.advanceTimersToNextFrame()
    expect(points(onChange)).toEqual([[0.5, -0.5]])

    // 超出元素范围的位置被夹住
    move(probe, 900, 75)
    vi.advanceTimersToNextFrame()
    expect(points(onChange).at(-1)).toEqual([1, -0.5])

    probe.dispatchEvent(new PointerEvent('pointerleave'))
    vi.advanceTimersToNextFrame()
    expect(points(onChange).at(-1)).toEqual([0, 0])
  })

  it('scroll：挂载时先算一次，之后跟着滚动更新', () => {
    const onChange = vi.fn<Change>()
    const { getByTestId } = render(<Probe source="scroll" onChange={onChange} />)
    const probe = getByTestId('probe')
    // 挂载时元素还没有尺寸，中心在视口顶端：视口中心在它下方，进度为正
    vi.advanceTimersToNextFrame()
    expect(points(onChange)).toEqual([[0, 1]])

    // 元素中心正好在视口中心
    const half = window.innerHeight / 2
    vi.spyOn(probe, 'getBoundingClientRect').mockReturnValue({
      top: half - 50,
      height: 100,
    } as DOMRect)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersToNextFrame()
    expect(points(onChange).at(-1)).toEqual([0, 0])
  })

  it('没有精确指针的设备上不跟指针', () => {
    mockMatchMedia([])
    const onChange = vi.fn<Change>()
    render(<Probe source="window" onChange={onChange} />)
    move(window, 10, 10)
    vi.advanceTimersToNextFrame()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('用户要求减少动效时不启动，滚动也一样', () => {
    mockMatchMedia(['pointer: fine', 'prefers-reduced-motion'])
    const onChange = vi.fn<Change>()
    render(
      <>
        <Probe source="window" onChange={onChange} />
        <Probe source="scroll" onChange={onChange} />
      </>,
    )
    move(window, 10, 10)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersToNextFrame()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('enabled 为 false 时不挂监听', () => {
    mockMatchMedia(['pointer: fine'])
    const onChange = vi.fn<Change>()
    render(<Probe source="window" enabled={false} onChange={onChange} />)
    move(window, 10, 10)
    vi.advanceTimersToNextFrame()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('停止跟踪时回到正中，并且不再响应', () => {
    mockMatchMedia(['pointer: fine'])
    const onChange = vi.fn<Change>()
    const { unmount } = render(<Probe source="window" onChange={onChange} />)
    move(window, window.innerWidth, window.innerHeight)
    vi.advanceTimersToNextFrame()

    unmount()
    expect(points(onChange).at(-1)).toEqual([0, 0])
    const calls = onChange.mock.calls.length

    move(window, 0, 0)
    vi.advanceTimersToNextFrame()
    expect(onChange).toHaveBeenCalledTimes(calls)
  })
})
