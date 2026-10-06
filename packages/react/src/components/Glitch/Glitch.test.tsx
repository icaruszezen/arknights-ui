import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../../internal/testing'
import { Glitch } from './Glitch'

const root = () => screen.getByTestId('glitch')
const overlays = () => [...root().querySelectorAll(':scope > span[aria-hidden="true"]')]
const isPlaying = () => root().hasAttribute('data-playing')

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Glitch', () => {
  it('平时只是一层容器，不播放', () => {
    render(
      <Glitch data-testid="glitch" trigger={0}>
        <p>内容</p>
      </Glitch>,
    )
    expect(root()).toHaveAttribute('data-ark', 'glitch')
    expect(root()).toHaveTextContent('内容')
    expect(isPlaying()).toBe(false)
    expect(overlays()).toHaveLength(0)
    expect(root().className).not.toContain('animate-ark-glitch')
  })

  it('trigger 变化时播放一次，0.6 秒后恢复原样', () => {
    const onDone = vi.fn()
    const { rerender } = render(
      <Glitch data-testid="glitch" trigger={0} onDone={onDone}>
        <p>第一屏</p>
      </Glitch>,
    )
    rerender(
      <Glitch data-testid="glitch" trigger={1} onDone={onDone}>
        <p>第二屏</p>
      </Glitch>,
    )
    // 内容已经换了，故障同时开始
    expect(root()).toHaveTextContent('第二屏')
    expect(isPlaying()).toBe(true)
    expect(root()).toHaveClass('motion-safe:animate-ark-glitch')
    expect(overlays()).toHaveLength(2)

    advance(599)
    expect(isPlaying()).toBe(true)
    expect(onDone).not.toHaveBeenCalled()

    advance(1)
    expect(isPlaying()).toBe(false)
    expect(overlays()).toHaveLength(0)
    expect(root().className).not.toContain('animate-ark-glitch')
    expect(root()).toHaveTextContent('第二屏')
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('两层叠加是纯装饰：隐藏、不接收点击，减少动效时不显示', () => {
    const { rerender } = render(<Glitch data-testid="glitch" trigger={0} />)
    rerender(<Glitch data-testid="glitch" trigger={1} />)
    const [bars, mosaic] = overlays()
    expect(bars).toHaveClass('ark-glitch-bars', 'motion-safe:animate-ark-glitch-bars')
    expect(mosaic).toHaveClass('ark-glitch-mosaic', 'motion-safe:animate-ark-glitch-mosaic')
    for (const overlay of overlays()) {
      expect(overlay).toHaveClass('pointer-events-none', 'absolute', 'motion-reduce:hidden')
    }
  })

  it('trigger 没变的重渲染不会触发', () => {
    const { rerender } = render(<Glitch data-testid="glitch" trigger="a" />)
    rerender(<Glitch data-testid="glitch" trigger="a" className="w-full" />)
    expect(isPlaying()).toBe(false)
  })

  it('appear 让它在挂载时播一次', () => {
    const onDone = vi.fn()
    render(<Glitch data-testid="glitch" appear onDone={onDone} />)
    expect(isPlaying()).toBe(true)
    advance(600)
    expect(isPlaying()).toBe(false)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('时长写进变量，上限 1 秒', () => {
    const { rerender } = render(<Glitch data-testid="glitch" trigger={0} duration={300} />)
    expect(root().style.getPropertyValue('--ark-glitch-duration')).toBe('300ms')

    rerender(<Glitch data-testid="glitch" trigger={1} duration={5000} />)
    expect(root().style.getPropertyValue('--ark-glitch-duration')).toBe('1000ms')
    advance(999)
    expect(isPlaying()).toBe(true)
    advance(1)
    expect(isPlaying()).toBe(false)
  })

  it('播放途中再次触发：从头再播，只收尾一次', () => {
    const onDone = vi.fn()
    const { rerender } = render(<Glitch data-testid="glitch" trigger={0} onDone={onDone} />)
    rerender(<Glitch data-testid="glitch" trigger={1} onDone={onDone} />)
    const [firstBars] = overlays()
    advance(400)

    rerender(<Glitch data-testid="glitch" trigger={2} onDone={onDone} />)
    // 叠加层重新挂载，动画从头开始
    expect(overlays()[0]).not.toBe(firstBars)
    advance(400)
    expect(isPlaying()).toBe(true)
    expect(onDone).not.toHaveBeenCalled()

    advance(200)
    expect(isPlaying()).toBe(false)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('用户要求减少动效时不播放，但仍然通知播完', () => {
    mockMatchMedia(['prefers-reduced-motion'])
    const onDone = vi.fn()
    const { rerender } = render(<Glitch data-testid="glitch" trigger={0} onDone={onDone} />)
    rerender(<Glitch data-testid="glitch" trigger={1} onDone={onDone} />)
    expect(isPlaying()).toBe(false)
    expect(overlays()).toHaveLength(0)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('卸载时清掉定时器', () => {
    const onDone = vi.fn()
    const { rerender, unmount } = render(
      <Glitch data-testid="glitch" trigger={0} onDone={onDone} />,
    )
    rerender(<Glitch data-testid="glitch" trigger={1} onDone={onDone} />)
    unmount()
    advance(1000)
    expect(onDone).not.toHaveBeenCalled()
  })
})
