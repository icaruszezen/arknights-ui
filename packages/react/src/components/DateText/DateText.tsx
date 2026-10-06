import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type DateTextValue = Date | string | number

export interface DateTextProps extends Omit<ComponentProps<'time'>, 'children' | 'dateTime'> {
  /**
   * 日期。`YYYY-MM-DD` 开头的字符串按字面取年月日；`Date` 对象和时间戳按本地时区取。
   * 服务端渲染时传字符串，两端的结果才一定相同。
   */
  value: DateTextValue
}

interface DateParts {
  year: string
  month: string
  day: string
}

const isoDate = /^(\d{4})-(\d{2})-(\d{2})(?!\d)/

function parseDateParts(value: DateTextValue): DateParts | null {
  if (typeof value === 'string') {
    // 按字面取，不经过 Date：new Date('2026-10-03') 是 UTC 零点，在西半球的时区会变成前一天
    const [, year = '', month = '', day = ''] = isoDate.exec(value.trim()) ?? []
    if (Number(month) >= 1 && Number(month) <= 12 && Number(day) >= 1 && Number(day) <= 31) {
      return { year, month, day }
    }
  }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return {
    year: String(date.getFullYear()).padStart(4, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

/** 把日期写成 `2026 // 10 / 03`。认不出来时返回 `null`。 */
export function formatDateText(value: DateTextValue): string | null {
  const parts = parseDateParts(value)
  return parts && `${parts.year} // ${parts.month} / ${parts.day}`
}

/**
 * 日期写作 `2026 // 10 / 03`：年和月之间双斜杠，月和日之间单斜杠，斜杠两侧留空格。
 * 一个普通的日期因此变成了有辨识度的图形。
 *
 * 输出 `<time>`，标准格式放在 `dateTime` 里。颜色继承自所在的文字。
 */
export function DateText({ value, className, ...rest }: DateTextProps) {
  const parts = parseDateParts(value)
  return (
    <time
      data-ark="date-text"
      dateTime={parts ? `${parts.year}-${parts.month}-${parts.day}` : undefined}
      {...rest}
      className={cn(
        'font-ark-data text-[1rem] leading-ark-solid font-ark-regular tracking-[1px] whitespace-nowrap',
        className,
      )}
    >
      {/* 认不出来的值原样输出，不编造一个日期 */}
      {parts ? `${parts.year} // ${parts.month} / ${parts.day}` : String(value)}
    </time>
  )
}
