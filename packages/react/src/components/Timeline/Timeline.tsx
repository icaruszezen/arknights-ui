import { type ComponentProps, createContext, type ReactNode, useContext } from 'react'
import { handleRovingKeyDown } from '../../internal/roving'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

interface TimelineContextValue {
  /** 能不能选：给了 `value` / `defaultValue` / `onValueChange` 才是。 */
  selectable: boolean
  value: string | undefined
  select: (value: string) => void
}

const TimelineContext = createContext<TimelineContextValue | null>(null)

export interface TimelineProps extends Omit<ComponentProps<'ol'>, 'defaultValue' | 'onChange'> {
  /** 选中的刻度。受控：请在 `onValueChange` 里更新它。给了它（或下面两个之一），时间轴就可以选。 */
  value?: string
  /** 一开始选中的刻度（非受控）。 */
  defaultValue?: string
  /** 选中项变化时调用。 */
  onValueChange?: (value: string) => void
}

/**
 * 时间轴是一把刻度尺：每一格一条短线接一个数字，两格之间夹着更短的分格（官网图集页的写法，实测）。
 * 它读起来像量具上的读数，而不是一个下拉框。
 *
 * 两种用法：
 * - 只展示：一列带时间的条目（更新记录、操作日志），每格右边放内容。
 * - 可以选：给 `value` 或 `defaultValue`，它就是一组单选——当前的那一格变成信号色并放大，
 *   没有内容的格子变灰、不能选。方向键在各格之间移动并选中。
 *
 * 子元素是若干个 `TimelineItem`。可以选的时候请用 `aria-label` 说明选的是什么。
 */
export function Timeline({
  value,
  defaultValue,
  onValueChange,
  className,
  onKeyDown,
  ...rest
}: TimelineProps) {
  const selectable =
    value !== undefined || defaultValue !== undefined || onValueChange !== undefined
  const [current, select] = useControllableState(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  // 可以选的时候它是一组单选；role 和 aria-orientation 必须一起出现
  const group = selectable
    ? ({ role: 'radiogroup', 'aria-orientation': 'vertical' } as const)
    : undefined
  return (
    <TimelineContext value={{ selectable, value: current, select }}>
      <ol
        data-ark="timeline"
        {...group}
        {...rest}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (selectable) handleRovingKeyDown(event, '[role="radio"]:not(:disabled)', 'vertical')
        }}
        className={cn('m-0 box-border grid list-none p-0 font-ark-cjk-sans text-ark-fg', className)}
      />
    </TimelineContext>
  )
}

export interface TimelineItemProps extends Omit<ComponentProps<'li'>, 'value'> {
  /** 刻度上的字：月份、日期、版本号。用数据体。 */
  label: ReactNode
  /** 这一格的值。时间轴可以选的时候必须给。 */
  value?: string
  /** 没有内容的格子：变灰，不能选。 */
  disabled?: boolean
}

// 两格之间的分格：两条更短的线，在这一格的 40% 和 70% 处
const minorTicks =
  'not-last:before:absolute not-last:before:top-[40%] not-last:before:left-0 not-last:before:h-px not-last:before:w-2 not-last:before:bg-ark-fg-muted not-last:after:absolute not-last:after:top-[70%] not-last:after:left-0 not-last:after:h-px not-last:after:w-2 not-last:after:bg-ark-fg-muted'

/**
 * 时间轴上的一格：一条 1rem 的短线接刻度上的字，`children` 是放在右边的内容（可以不给）。
 * 只能放在 `Timeline` 里。
 */
export function TimelineItem({
  label,
  value,
  disabled = false,
  className,
  children,
  ...rest
}: TimelineItemProps) {
  const timeline = useContext(TimelineContext)
  if (!timeline) throw new Error('<TimelineItem> 必须放在 <Timeline> 里')
  const selected = timeline.selectable && value !== undefined && timeline.value === value

  // 可以选的一格是单选组里的一项：只有选中项在 Tab 键序列里；还没有选中项时每一项都能到
  const radio = {
    role: 'radio',
    'aria-checked': selected,
    tabIndex: selected || timeline.value === undefined ? 0 : -1,
  } as const

  const mark = (
    <>
      <span aria-hidden="true" className="h-px w-4 shrink-0 bg-current" />
      <span
        className={cn(
          'origin-left font-ark-data text-ark-body leading-ark-solid whitespace-nowrap',
          'transition-[scale] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none',
          // 当前项不只靠颜色：数字放大到 1.25 倍
          selected && 'scale-125 font-ark-bold',
        )}
      >
        {label}
      </span>
    </>
  )

  return (
    <li
      data-ark="timeline-item"
      data-selected={selected || undefined}
      // 可以选的时候外层是单选组，不是列表
      role={timeline.selectable ? 'none' : undefined}
      {...rest}
      className={cn(
        'relative box-border grid min-h-18 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-ark-5 pb-ark-4 last:min-h-0 last:pb-0',
        minorTicks,
        className,
      )}
    >
      {timeline.selectable && value !== undefined ? (
        <button
          type="button"
          {...radio}
          disabled={disabled}
          onClick={() => timeline.select(value)}
          className={cn(
            'm-0 box-border flex cursor-pointer appearance-none items-center gap-ark-4 border-0 bg-transparent p-0 text-ark-fg-muted',
            'hover:text-ark-fg aria-checked:text-ark-signal-fg',
            'disabled:cursor-not-allowed disabled:text-ark-on-disabled',
            colorTransition,
            focusRing,
          )}
        >
          {mark}
        </button>
      ) : (
        <div
          className={cn(
            'flex items-center gap-ark-4',
            disabled ? 'text-ark-on-disabled' : 'text-ark-fg-muted',
          )}
        >
          {mark}
        </div>
      )}
      <div className="min-w-0 text-ark-label leading-ark-snug">{children}</div>
    </li>
  )
}
