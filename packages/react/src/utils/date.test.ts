import { describe, expect, it } from 'vitest'
import { parseDateParts, toDateTimeAttribute } from './date'

describe('parseDateParts', () => {
  it('字符串按字面取年月日，不受时区影响', () => {
    expect(parseDateParts('2026-10-03')).toEqual({ year: '2026', month: '10', day: '03' })
    // 这个时刻在东八区已经是 4 日，按字面仍然是 3 日
    expect(parseDateParts('2026-10-03T23:30:00Z')).toMatchObject({ day: '03', hour: '23' })
  })

  it('字符串里带时间时一并取出，T 和空格都认', () => {
    expect(parseDateParts('2026-10-03T16:00')).toEqual({
      year: '2026',
      month: '10',
      day: '03',
      hour: '16',
      minute: '00',
    })
    expect(parseDateParts(' 2026-10-17 03:59 ')).toMatchObject({ hour: '03', minute: '59' })
  })

  it('Date 对象与时间戳按本地时区取，并补前导零', () => {
    const date = new Date(2026, 0, 5, 4, 7)
    const parts = { year: '2026', month: '01', day: '05', hour: '04', minute: '07' }
    expect(parseDateParts(date)).toEqual(parts)
    expect(parseDateParts(date.getTime())).toEqual(parts)
  })

  it('认不出来的值返回 null', () => {
    expect(parseDateParts('待定')).toBeNull()
    expect(parseDateParts('2026-13-45')).toBeNull()
    expect(parseDateParts(new Date(Number.NaN))).toBeNull()
  })

  it('日期对、时间写错时只留日期', () => {
    expect(parseDateParts('2026-10-03T25:00')).toEqual({ year: '2026', month: '10', day: '03' })
  })
})

describe('toDateTimeAttribute', () => {
  it('默认只写日期，要时间时补上时分', () => {
    const parts = { year: '2026', month: '10', day: '03', hour: '16', minute: '00' }
    expect(toDateTimeAttribute(parts)).toBe('2026-10-03')
    expect(toDateTimeAttribute(parts, true)).toBe('2026-10-03T16:00')
  })

  it('没有时间的值不会编出一个时间', () => {
    expect(toDateTimeAttribute({ year: '2026', month: '10', day: '03' }, true)).toBe('2026-10-03')
  })
})
