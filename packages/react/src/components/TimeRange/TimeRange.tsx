import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import {
  type DateParts,
  type DateValue,
  parseDateParts,
  toDateTimeAttribute,
} from '../../utils/date'

export type TimeRangeValue = DateValue

export interface TimeRangeProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * 开始。`YYYY-MM-DDTHH:MM` 开头的字符串按字面取；`Date` 对象和时间戳按本地时区取。
   * 字符串里没写时间时只输出日期。服务端渲染时传字符串，两端的结果才一定相同。
   */
  from: TimeRangeValue
  /** 结束。写法同 `from`。 */
  to: TimeRangeValue
  /**
   * 把年份也写出来（`2026年10月03日`）。跨年的活动用。
   * @default false
   */
  year?: boolean
}

// 一个时间点拆成“数字”和“单位字”两种片段：数字用数据体，月、日这些字跟着所在的文字
type Piece = { digits: string } | { text: string }

function toPieces(parts: DateParts, year: boolean): Piece[] {
  const pieces: Piece[] = []
  if (year) pieces.push({ digits: parts.year }, { text: '年' })
  pieces.push({ digits: parts.month }, { text: '月' }, { digits: parts.day }, { text: '日' })
  if (parts.hour !== undefined) {
    pieces.push({ text: ' ' }, { digits: `${parts.hour}:${parts.minute}` })
  }
  return pieces
}

/** 把一个时间点写成 `10月03日 16:00`。认不出来时返回 `null`。 */
export function formatTimePoint(value: TimeRangeValue, year = false): string | null {
  const parts = parseDateParts(value)
  if (!parts) return null
  return toPieces(parts, year)
    .map(piece => ('digits' in piece ? piece.digits : piece.text))
    .join('')
}

function TimePoint({ value, year }: { value: TimeRangeValue; year: boolean }) {
  const parts = parseDateParts(value)
  // 认不出来的值原样输出，不编造一个时间
  if (!parts) return <span>{String(value)}</span>
  return (
    <time dateTime={toDateTimeAttribute(parts, true)} className="whitespace-nowrap">
      {toPieces(parts, year).map((piece, index) =>
        'digits' in piece ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: 片段的顺序是固定的，不会重排
          <span key={index} className="font-ark-data">
            {piece.digits}
          </span>
        ) : (
          piece.text
        ),
      )}
    </time>
  )
}

/**
 * 起止时间写作 `10月03日 16:00 - 10月17日 03:59`：数字用数据体，“月”“日”跟着所在的文字。
 * 公告里的活动时间、限时卡池的开放时间都这样写。
 *
 * 输出两个 `<time>`，标准格式放在各自的 `dateTime` 里。字号、字重、颜色都继承自所在的文字，
 * 通常放进 `KeyValue` 当值。放不下时在连接号处换行，一个时间点内部不换行。
 */
export function TimeRange({ from, to, year = false, className, ...rest }: TimeRangeProps) {
  return (
    <span data-ark="time-range" {...rest} className={cn('leading-ark-snug', className)}>
      <TimePoint value={from} year={year} />
      {' - '}
      <TimePoint value={to} year={year} />
    </span>
  )
}
