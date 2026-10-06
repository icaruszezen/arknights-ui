import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DateText, formatDateText } from './DateText'

describe('formatDateText', () => {
  it('年与月之间双斜杠，月与日之间单斜杠，两侧留空格', () => {
    expect(formatDateText('2026-10-03')).toBe('2026 // 10 / 03')
  })

  it('字符串按字面取年月日，不受时区影响', () => {
    // 这个时刻在东八区已经是 4 日，按字面仍然是 3 日
    expect(formatDateText('2026-10-03T23:30:00Z')).toBe('2026 // 10 / 03')
    expect(formatDateText('  2026-01-05  ')).toBe('2026 // 01 / 05')
  })

  it('Date 对象与时间戳按本地时区取，并补前导零', () => {
    const date = new Date(2026, 0, 5, 23, 59)
    expect(formatDateText(date)).toBe('2026 // 01 / 05')
    expect(formatDateText(date.getTime())).toBe('2026 // 01 / 05')
  })

  it('认不出来的值返回 null', () => {
    expect(formatDateText('待定')).toBeNull()
    expect(formatDateText('2026-13-45')).toBeNull()
    expect(formatDateText(new Date(Number.NaN))).toBeNull()
  })
})

describe('DateText', () => {
  it('输出 <time>，标准格式放在 dateTime 里', () => {
    render(<DateText value="2026-10-03" />)
    const time = screen.getByText('2026 // 10 / 03')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('data-ark', 'date-text')
    expect(time).toHaveAttribute('datetime', '2026-10-03')
  })

  it('认不出来的值原样输出，不带 dateTime', () => {
    render(<DateText value="待定" />)
    expect(screen.getByText('待定')).not.toHaveAttribute('datetime')
  })

  it('自己不设颜色，继承所在文字的颜色', () => {
    const { rerender } = render(<DateText value="2026-10-03" />)
    expect(screen.getByText('2026 // 10 / 03').className).not.toMatch(
      /text-ark-(fg|signal|neutral)/,
    )

    // 使用方给的颜色与默认字号并存，不会互相覆盖
    rerender(<DateText value="2026-10-03" className="text-ark-fg-muted" />)
    expect(screen.getByText('2026 // 10 / 03')).toHaveClass('text-ark-fg-muted', 'text-[1rem]')
  })
})
