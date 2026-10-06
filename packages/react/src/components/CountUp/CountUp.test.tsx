import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockMatchMedia } from '../../internal/testing'
import { CountUp } from './CountUp'

// 屏幕上滚动的那个数（对读屏隐藏）和读屏拿到的最终值
const rolling = () => screen.getByTestId('count').querySelector('[aria-hidden="true"]')
const spoken = () => screen.getByTestId('count').querySelector('.sr-only')
const shownNumber = () => Number(rolling()?.textContent?.replaceAll(',', ''))

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('CountUp', () => {
  it('从 0 开始，读屏拿到的始终是最终值', () => {
    render(<CountUp data-testid="count" value={131} />)
    expect(screen.getByTestId('count')).toHaveAttribute('data-ark', 'count-up')
    expect(rolling()).toHaveTextContent('0')
    expect(spoken()).toHaveTextContent('131')
  })

  it('一秒后停在目标值', () => {
    render(<CountUp data-testid="count" value={131} />)
    advance(1100)
    expect(rolling()).toHaveTextContent('131')
  })

  it('起步干脆：时间过半时已经数完八成以上，且一路不回头', () => {
    render(<CountUp data-testid="count" value={1000} />)
    let previous = 0
    for (let elapsed = 0; elapsed < 500; elapsed += 100) {
      advance(100)
      expect(shownNumber()).toBeGreaterThanOrEqual(previous)
      previous = shownNumber()
    }
    expect(previous).toBeGreaterThan(800)
    expect(previous).toBeLessThan(1000)
  })

  it('duration 改变滚动的时长', () => {
    render(<CountUp data-testid="count" value={100} duration={200} />)
    advance(250)
    expect(rolling()).toHaveTextContent('100')
  })

  it('默认加千分位，pad 改为补前导零', () => {
    const { unmount } = render(<CountUp data-testid="count" value={128400} />)
    advance(1100)
    expect(rolling()).toHaveTextContent('128,400')
    unmount()

    render(<CountUp data-testid="count" value={147} pad={4} />)
    expect(rolling()).toHaveTextContent('0000')
    expect(spoken()).toHaveTextContent('0147')
    advance(1100)
    expect(rolling()).toHaveTextContent('0147')
  })

  it('format 收到未取整的中间值', () => {
    const format = vi.fn((value: number) => `${value.toFixed(1)}%`)
    render(<CountUp data-testid="count" value={98.6} format={format} />)
    expect(spoken()).toHaveTextContent('98.6%')

    advance(100)
    const between = format.mock.calls.map(([value]) => value).filter(v => v > 0 && v < 98.6)
    expect(between.length).toBeGreaterThan(0)
    expect(between.some(value => !Number.isInteger(value))).toBe(true)

    advance(1000)
    expect(rolling()).toHaveTextContent('98.6%')
  })

  it('from 指定起点，可以往下数', () => {
    render(<CountUp data-testid="count" value={0} from={18} />)
    expect(rolling()).toHaveTextContent('18')
    advance(1100)
    expect(rolling()).toHaveTextContent('0')
  })

  it('value 变化时从当前显示的数接着滚', () => {
    const { rerender } = render(<CountUp data-testid="count" value={131} />)
    advance(1100)

    rerender(<CountUp data-testid="count" value={200} />)
    expect(spoken()).toHaveTextContent('200')
    advance(100)
    expect(shownNumber()).toBeGreaterThan(131)
    expect(shownNumber()).toBeLessThan(200)
    advance(1000)
    expect(rolling()).toHaveTextContent('200')
  })

  it('用户要求减少动效时直接显示最终值', () => {
    mockMatchMedia(['prefers-reduced-motion'])
    render(<CountUp data-testid="count" value={131} />)
    expect(rolling()).toHaveTextContent('131')
  })

  it('duration 为 0 时不滚动', () => {
    render(<CountUp data-testid="count" value={131} duration={0} />)
    expect(rolling()).toHaveTextContent('131')
  })

  it('trigger="visible" 时进入视口才开始', () => {
    const viewport = mockIntersectionObserver()
    render(<CountUp data-testid="count" value={131} trigger="visible" />)
    advance(1100)
    expect(rolling()).toHaveTextContent('0')

    act(() => viewport.enter())
    advance(1100)
    expect(rolling()).toHaveTextContent('131')
  })

  it('按较长的一端预留宽度，数字靠右，旁边的内容不会抖', () => {
    const { rerender } = render(<CountUp data-testid="count" value={128400} />)
    const box = rolling() as HTMLElement
    expect(box.style.minWidth).toBe('7ch')
    expect(box).toHaveClass('inline-block', 'text-end')

    rerender(<CountUp data-testid="count" value={5} from={1000} />)
    expect((rolling() as HTMLElement).style.minWidth).toBe('5ch')
  })

  it('用数据体的等宽数字，字号颜色由使用方决定', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<CountUp ref={ref} data-testid="count" value={1} className="text-ark-h1" />)
    const count = screen.getByTestId('count')
    expect(count).toHaveClass('font-ark-data', 'tabular-nums', 'text-ark-h1')
    expect(ref.current).toBe(count)
  })

  it('卸载后不再更新', () => {
    const { unmount } = render(<CountUp data-testid="count" value={131} />)
    advance(100)
    unmount()
    expect(() => advance(1000)).not.toThrow()
  })
})
