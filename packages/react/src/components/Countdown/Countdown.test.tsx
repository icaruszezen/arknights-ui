import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Countdown, formatCountdown, toCountdownParts } from './Countdown'

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

const timer = () => screen.getByRole('timer')

describe('toCountdownParts', () => {
  it('把秒数拆成天、时、分、秒', () => {
    expect(toCountdownParts(8076)).toEqual({
      total: 8076,
      days: 0,
      hours: 2,
      minutes: 14,
      seconds: 36,
    })
    expect(toCountdownParts(2 * 86400 + 3 * 3600 + 5)).toMatchObject({
      days: 2,
      hours: 3,
      minutes: 0,
      seconds: 5,
    })
  })

  it('负数按 0 算，小数向下取整', () => {
    expect(toCountdownParts(-5).total).toBe(0)
    expect(toCountdownParts(59.9).seconds).toBe(59)
  })
})

describe('formatCountdown', () => {
  it('写成 HH:MM:SS，各段补到两位', () => {
    expect(formatCountdown(8076)).toBe('02:14:36')
    expect(formatCountdown(5)).toBe('00:00:05')
    expect(formatCountdown(0)).toBe('00:00:00')
  })

  it('超过一天的部分折进小时里', () => {
    expect(formatCountdown(2 * 86400 + 3 * 3600 + 9)).toBe('51:00:09')
    expect(formatCountdown(100 * 3600)).toBe('100:00:00')
  })
})

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-07T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('seconds 只是把一个数写出来：数据体、等宽数字', () => {
    render(<Countdown seconds={8076} />)
    expect(timer()).toHaveTextContent('02:14:36')
    expect(timer().tagName).toBe('TIME')
    expect(timer()).toHaveAttribute('data-ark', 'countdown')
    expect(timer()).toHaveAttribute('datetime', 'PT2H14M36S')
    expect(timer()).toHaveClass('font-ark-data', 'tabular-nums', 'whitespace-nowrap')
  })

  it('seconds 不自己走，由外部更新', () => {
    const { rerender } = render(<Countdown seconds={10} />)
    advance(5000)
    expect(timer()).toHaveTextContent('00:00:10')

    rerender(<Countdown seconds={9} />)
    expect(timer()).toHaveTextContent('00:00:09')
  })

  it('to 每秒自己走', () => {
    render(<Countdown to={Date.now() + 8076_000} />)
    expect(timer()).toHaveTextContent('02:14:36')
    advance(1000)
    expect(timer()).toHaveTextContent('02:14:35')
    advance(36_000)
    expect(timer()).toHaveTextContent('02:13:59')
  })

  it('对齐到整秒：剩 2.5 秒时先显示 3，半秒后变成 2', () => {
    render(<Countdown to={Date.now() + 2500} />)
    expect(timer()).toHaveTextContent('00:00:03')
    advance(499)
    expect(timer()).toHaveTextContent('00:00:03')
    advance(1)
    expect(timer()).toHaveTextContent('00:00:02')
    advance(1000)
    expect(timer()).toHaveTextContent('00:00:01')
  })

  it('走到零停住，只调用一次 onDone', () => {
    const onDone = vi.fn()
    render(<Countdown to={Date.now() + 3000} onDone={onDone} />)
    advance(2000)
    expect(onDone).not.toHaveBeenCalled()
    advance(1000)
    expect(timer()).toHaveTextContent('00:00:00')
    expect(onDone).toHaveBeenCalledTimes(1)

    advance(10_000)
    expect(timer()).toHaveTextContent('00:00:00')
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('挂载时已经过了时间：显示零并通知一次', () => {
    const onDone = vi.fn()
    const { rerender } = render(<Countdown to={Date.now() - 5000} onDone={onDone} />)
    expect(timer()).toHaveTextContent('00:00:00')
    expect(onDone).toHaveBeenCalledTimes(1)

    // 回调换了一个新的函数，不会因此再通知一次
    rerender(<Countdown to={Date.now() - 5000} onDone={() => onDone()} />)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('换一个目标时间就重新开始走，到零时再通知一次', () => {
    const onDone = vi.fn()
    const start = Date.now()
    const { rerender } = render(<Countdown to={start + 1000} onDone={onDone} />)
    advance(1000)
    expect(onDone).toHaveBeenCalledTimes(1)

    rerender(<Countdown to={start + 4000} onDone={onDone} />)
    expect(timer()).toHaveTextContent('00:00:03')
    advance(3000)
    expect(timer()).toHaveTextContent('00:00:00')
    expect(onDone).toHaveBeenCalledTimes(2)
  })

  it('to 可以是 Date 对象或 ISO 字符串', () => {
    const { rerender } = render(<Countdown to={new Date('2026-10-07T12:01:05Z')} />)
    expect(timer()).toHaveTextContent('00:01:05')

    rerender(<Countdown to="2026-10-07T14:00:00Z" />)
    expect(timer()).toHaveTextContent('02:00:00')
  })

  it('认不出来的时间不编造一个数，也不通知', () => {
    const onDone = vi.fn()
    render(<Countdown to="待定" onDone={onDone} />)
    expect(timer()).toHaveTextContent('--:--:--')
    expect(timer()).not.toHaveAttribute('datetime')
    expect(onDone).not.toHaveBeenCalled()
  })

  it('format 自己决定怎么写', () => {
    render(
      <Countdown
        seconds={2 * 86400 + 3 * 3600 + 5 * 60}
        format={({ days, hours }) => `${days}天${hours}小时`}
      />,
    )
    expect(timer()).toHaveTextContent('2天3小时')
    // dateTime 仍然是标准的时长写法
    expect(timer()).toHaveAttribute('datetime', 'PT51H5M0S')
  })

  it('自己不设字号和颜色，继承所在的文字', () => {
    render(<Countdown seconds={5} className="text-ark-signal-fg" />)
    expect(timer()).toHaveClass('text-ark-signal-fg')
    expect(timer().className).not.toMatch(/text-ark-(fg|body|label)\b/)
  })

  it('卸载后不再计时', () => {
    const onDone = vi.fn()
    const { unmount } = render(<Countdown to={Date.now() + 2000} onDone={onDone} />)
    unmount()
    advance(5000)
    expect(onDone).not.toHaveBeenCalled()
  })
})
