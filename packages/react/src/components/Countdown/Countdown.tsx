import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

/** 剩余时间拆开的各段。 */
export interface CountdownParts {
  /** 一共还剩多少秒。 */
  total: number
  days: number
  /** 去掉整天之后的小时，0–23。 */
  hours: number
  minutes: number
  seconds: number
}

interface CountdownOwnProps {
  /**
   * 自己决定怎么写。不给时写成 `HH:MM:SS`，超过一天的部分折进小时里（`50:03:09`）。
   */
  format?: (parts: CountdownParts) => string
  /** 走到零时调用一次。只对 `to` 有效；挂载时已经过了时间也会调用。 */
  onDone?: () => void
}

type CountdownLive = CountdownOwnProps & {
  /** 到什么时候为止：`Date` 对象、时间戳，或者带时区的 ISO 字符串。给了它就每秒自己走。 */
  to: Date | number | string
  seconds?: undefined
}
type CountdownStatic = CountdownOwnProps & {
  /** 还剩多少秒。给它就只显示这个数，不自己走——由外部来更新。 */
  seconds: number
  to?: undefined
}

/** `to` 和 `seconds` 二选一。 */
export type CountdownProps = (CountdownLive | CountdownStatic) &
  Omit<ComponentProps<'time'>, 'children' | 'dateTime'>

const pad2 = (value: number) => String(value).padStart(2, '0')

/** 把秒数拆成天、时、分、秒。负数和小数按 0 和向下取整处理。 */
export function toCountdownParts(totalSeconds: number): CountdownParts {
  const total = Math.max(0, Math.floor(totalSeconds))
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/** 把秒数写成 `HH:MM:SS`，超过一天的部分折进小时里。 */
export function formatCountdown(totalSeconds: number): string {
  const { total, minutes, seconds } = toCountdownParts(totalSeconds)
  return `${pad2(Math.floor(total / 3600))}:${pad2(minutes)}:${pad2(seconds)}`
}

/**
 * 倒计时：数据体的 `HH:MM:SS`，数字等宽，走的时候旁边的东西不会跟着抖。
 * 制造进度、订单、限时商品的剩余时间都这样写。
 *
 * 给 `to` 就每秒自己走，走到零停住并调用 `onDone`；给 `seconds` 就只是把一个数写出来。
 * 输出 `<time>`，标准的时长写法放在 `dateTime` 里。字号和颜色继承自所在的文字。
 * 它是一个计时器（`role="timer"`），读屏不会每秒念一遍。
 *
 * 服务端渲染时，`to` 的剩余时间在两端会差出几秒，这个元素不参与一致性检查。
 */
export function Countdown({ to, seconds, format, onDone, className, ...rest }: CountdownProps) {
  const target = to === undefined ? undefined : new Date(to).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (target === undefined || Number.isNaN(target)) return
    setNow(Date.now())
    let timer: ReturnType<typeof setTimeout> | undefined
    // 对齐到整秒：下一次更新落在剩余时间跨过整秒的那一刻，而不是随便每隔一秒
    const schedule = () => {
      const left = target - Date.now()
      if (left <= 0) return
      timer = setTimeout(
        () => {
          setNow(Date.now())
          schedule()
        },
        left % 1000 || 1000,
      )
    }
    schedule()
    return () => clearTimeout(timer)
  }, [target])

  const invalid = target !== undefined && Number.isNaN(target)
  const remaining =
    target === undefined ? (seconds ?? 0) : invalid ? 0 : Math.ceil((target - now) / 1000)
  const parts = toCountdownParts(remaining)

  // 回调每次渲染都可能是新的，放进 ref 里；同一个目标时间只通知一次
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  })
  const notified = useRef<number | undefined>(undefined)
  const finished = target !== undefined && !invalid && parts.total === 0
  useEffect(() => {
    if (!finished || notified.current === target) return
    notified.current = target
    done.current?.()
  }, [finished, target])

  return (
    <time
      data-ark="countdown"
      role="timer"
      dateTime={
        invalid
          ? undefined
          : `PT${Math.floor(parts.total / 3600)}H${parts.minutes}M${parts.seconds}S`
      }
      suppressHydrationWarning
      {...rest}
      className={cn('font-ark-data leading-ark-solid whitespace-nowrap tabular-nums', className)}
    >
      {/* 认不出来的时间不编造一个数 */}
      {invalid ? '--:--:--' : format ? format(parts) : formatCountdown(parts.total)}
    </time>
  )
}
