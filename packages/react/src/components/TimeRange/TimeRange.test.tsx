import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatTimePoint, TimeRange } from './TimeRange'

describe('formatTimePoint', () => {
  it('写成 MM月DD日 HH:MM', () => {
    expect(formatTimePoint('2026-10-03T16:00')).toBe('10月03日 16:00')
  })

  it('字符串里没写时间时只有日期', () => {
    expect(formatTimePoint('2026-10-03')).toBe('10月03日')
  })

  it('year 把年份也写出来', () => {
    expect(formatTimePoint('2026-12-30T16:00', true)).toBe('2026年12月30日 16:00')
  })

  it('Date 对象按本地时区取，并补前导零', () => {
    expect(formatTimePoint(new Date(2026, 0, 5, 4, 7))).toBe('01月05日 04:07')
  })

  it('认不出来的值返回 null', () => {
    expect(formatTimePoint('待定')).toBeNull()
  })
})

describe('TimeRange', () => {
  it('输出两个 <time>，标准格式放在 dateTime 里', () => {
    render(<TimeRange data-testid="range" from="2026-10-03T16:00" to="2026-10-17T03:59" />)
    const range = screen.getByTestId('range')
    expect(range).toHaveAttribute('data-ark', 'time-range')
    expect(range).toHaveTextContent('10月03日 16:00 - 10月17日 03:59')

    const times = range.querySelectorAll('time')
    expect(times).toHaveLength(2)
    expect(times[0]).toHaveAttribute('datetime', '2026-10-03T16:00')
    expect(times[1]).toHaveAttribute('datetime', '2026-10-17T03:59')
  })

  it('数字用数据体，“月”“日”跟着所在的文字', () => {
    render(<TimeRange data-testid="range" from="2026-10-03T16:00" to="2026-10-17T03:59" />)
    const digits = Array.from(screen.getByTestId('range').querySelectorAll('.font-ark-data')).map(
      node => node.textContent,
    )
    expect(digits).toEqual(['10', '03', '16:00', '10', '17', '03:59'])
  })

  it('一个时间点内部不换行', () => {
    render(<TimeRange data-testid="range" from="2026-10-03T16:00" to="2026-10-17T03:59" />)
    for (const time of screen.getByTestId('range').querySelectorAll('time')) {
      expect(time).toHaveClass('whitespace-nowrap')
    }
  })

  it('只有日期时不带时间，dateTime 也只有日期', () => {
    render(<TimeRange data-testid="range" from="2026-10-03" to="2026-10-17" />)
    const range = screen.getByTestId('range')
    expect(range).toHaveTextContent('10月03日 - 10月17日')
    expect(range.querySelector('time')).toHaveAttribute('datetime', '2026-10-03')
  })

  it('year 把年份也写出来', () => {
    render(<TimeRange data-testid="range" from="2026-12-30T16:00" to="2027-01-13T03:59" year />)
    expect(screen.getByTestId('range')).toHaveTextContent(
      '2026年12月30日 16:00 - 2027年01月13日 03:59',
    )
  })

  it('认不出来的值原样输出，不带 dateTime', () => {
    render(<TimeRange data-testid="range" from="2026-10-03T16:00" to="长期开放" />)
    const range = screen.getByTestId('range')
    expect(range).toHaveTextContent('10月03日 16:00 - 长期开放')
    expect(range.querySelectorAll('time')).toHaveLength(1)
  })

  it('自己不设字号和颜色，继承所在的文字', () => {
    render(
      <TimeRange
        data-testid="range"
        from="2026-10-03T16:00"
        to="2026-10-17T03:59"
        className="text-ark-signal-fg"
      />,
    )
    const range = screen.getByTestId('range')
    expect(range).toHaveClass('text-ark-signal-fg')
    expect(range.className).not.toMatch(/text-ark-(fg|body|label)\b/)
  })
})
