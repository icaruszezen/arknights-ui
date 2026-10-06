import { type ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { mechanical } from '../../utils/easing'
import { mergeRefs } from '../../utils/mergeRefs'
import { useInView } from '../../utils/useInView'
import { useReducedMotion } from '../../utils/useReducedMotion'
import { formatStatValue } from '../Stat'

export interface CountUpProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 目标值。之后它再变化时，从当前显示的数字接着滚过去。 */
  value: number
  /**
   * 从几开始滚。
   * @default 0
   */
  from?: number
  /**
   * 滚多久（毫秒）。默认取“数字滚动”所在的 slower 档。
   * @default 1000
   */
  duration?: number
  /** 补前导零到几位（`01`、`0147`）。设置后不再加千分位。 */
  pad?: number
  /**
   * 自己决定怎么写这个数。收到的是没有取整的中间值，可以用来保留小数或加单位。
   * 不给时取整，并和 `Stat` 一样加千分位（或按 `pad` 补零）。
   */
  format?: (value: number) => string
  /**
   * 什么时候开始滚。
   * - `mount`：挂载就开始
   * - `visible`：滚进视口才开始
   * @default 'mount'
   */
  trigger?: 'mount' | 'visible'
}

/**
 * 数字滚动：数字不是淡入，而是从一个值数到另一个值——“机器在工作”，而不是“东西在飘”。
 * 起步干脆、收尾平缓，默认 1 秒。
 *
 * 读屏只读到最终值，不会把中间的每个数都念一遍。用户要求减少动效时直接显示最终值。
 * 数字用数据体、等宽，并按最终位数预留宽度，滚动时旁边的东西不会跟着抖。
 *
 * 可以直接放进 `Stat` 的 `value`。
 */
export function CountUp({
  value,
  from = 0,
  duration = 1000,
  pad,
  format,
  trigger = 'mount',
  ref,
  className,
  ...rest
}: CountUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const setRef = useMemo(() => mergeRefs(rootRef, ref), [ref])
  const reduced = useReducedMotion()
  const started = useInView(rootRef, trigger === 'visible')

  // 减少动效时没有“滚”这回事，一开始就是最终值
  const initial = reduced ? value : from
  const [shown, setShown] = useState(initial)
  // 当前显示的数。value 中途变化时从这里接着滚，而不是跳回起点
  const current = useRef(initial)

  useEffect(() => {
    if (!started) return
    const show = (next: number) => {
      current.current = next
      setShown(next)
    }
    const start = current.current
    if (reduced || duration <= 0 || start === value) {
      show(value)
      return
    }
    let frame = 0
    let startTime: number | undefined
    const tick = (now: number) => {
      startTime ??= now
      const progress = Math.min((now - startTime) / duration, 1)
      show(progress === 1 ? value : start + (value - start) * mechanical(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, reduced, started])

  const write = (n: number) => (format ? format(n) : formatStatValue(Math.round(n), pad))
  const final = write(value)
  // 起点和终点里较长的那个决定预留的宽度
  const width = Math.max(final.length, write(from).length)

  return (
    <span
      data-ark="count-up"
      {...rest}
      ref={setRef}
      className={cn('font-ark-data tabular-nums', className)}
    >
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="inline-block text-end" style={{ minWidth: `${width}ch` }}>
        {write(shown)}
      </span>
    </span>
  )
}
