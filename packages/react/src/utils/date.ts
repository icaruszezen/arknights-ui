/** 日期（或日期加时间）：`Date` 对象、时间戳，或 `YYYY-MM-DD`、`YYYY-MM-DDTHH:MM` 开头的字符串。 */
export type DateValue = Date | string | number

export interface DateParts {
  year: string
  month: string
  day: string
  /** 两位的小时和分钟。字符串里没写时间时没有这两项。 */
  hour?: string
  minute?: string
}

const isoDate = /^(\d{4})-(\d{2})-(\d{2})(?!\d)(?:[T ](\d{2}):(\d{2}))?/

const pad2 = (value: number) => String(value).padStart(2, '0')

/**
 * 把日期拆成补好前导零的各段。认不出来时返回 `null`。
 *
 * `YYYY-MM-DD` 开头的字符串按字面取，不经过 `Date`：`new Date('2026-10-03')` 是 UTC 零点，
 * 在西半球的时区会变成前一天。`Date` 对象和时间戳按本地时区取。
 * 服务端渲染时传字符串，两端的结果才一定相同。
 */
export function parseDateParts(value: DateValue): DateParts | null {
  if (typeof value === 'string') {
    const [, year = '', month = '', day = '', hour, minute] = isoDate.exec(value.trim()) ?? []
    if (Number(month) >= 1 && Number(month) <= 12 && Number(day) >= 1 && Number(day) <= 31) {
      // 时间写错了（25:00）就只留日期，不因此把整个值判成认不出来
      const validTime = hour !== undefined && Number(hour) <= 23 && Number(minute) <= 59
      return validTime ? { year, month, day, hour, minute } : { year, month, day }
    }
  }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return {
    year: String(date.getFullYear()).padStart(4, '0'),
    month: pad2(date.getMonth() + 1),
    day: pad2(date.getDate()),
    hour: pad2(date.getHours()),
    minute: pad2(date.getMinutes()),
  }
}

/** 给 `<time dateTime>` 用的标准写法：`2026-10-03`，带时间时是 `2026-10-03T16:00`。 */
export function toDateTimeAttribute(parts: DateParts, withTime = false): string {
  const date = `${parts.year}-${parts.month}-${parts.day}`
  return withTime && parts.hour !== undefined ? `${date}T${parts.hour}:${parts.minute}` : date
}
