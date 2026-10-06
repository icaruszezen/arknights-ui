import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type KeyValueListProps = ComponentProps<'dl'>

/**
 * 键值对列表：公告图里“活动时间：…”“解锁条件：…”那几行。
 * 所有的键排成一列、宽度取最长的那个，值从同一条左边线起。
 *
 * 子元素是若干个 `KeyValue`。整体是一个描述列表：键是 `<dt>`，值是 `<dd>`。
 * 竖屏时键和值改成上下两行。
 */
export function KeyValueList({ className, ...rest }: KeyValueListProps) {
  return (
    <dl
      data-ark="key-value-list"
      {...rest}
      className={cn(
        'm-0 box-border grid grid-cols-[auto_minmax(0,1fr)] gap-x-ark-3 gap-y-ark-2 font-ark-cjk-sans text-[1rem] leading-ark-snug text-ark-fg',
        'portrait:grid-cols-1 portrait:gap-y-ark-3',
        className,
      )}
    />
  )
}

export type KeyValueTone = 'default' | 'signal'

export interface KeyValueProps extends ComponentProps<'div'> {
  /** 键，如“活动时间”。后面的冒号由组件补。 */
  label: ReactNode
  /**
   * 值的颜色。值默认是粗体；最要紧的那一项（通常是时间）可以换成主题色。
   * @default 'default'
   */
  tone?: KeyValueTone
}

const tones: Record<KeyValueTone, string> = {
  default: 'text-ark-fg',
  signal: 'text-ark-signal-fg',
}

/**
 * 一行键值对：键偏灰，值用粗体或主题色。`children` 是值，可以放一个 `TimeRange`。
 * 只能放在 `KeyValueList` 里。
 */
export function KeyValue({ label, tone = 'default', className, children, ...rest }: KeyValueProps) {
  return (
    <div
      data-ark="key-value"
      {...rest}
      // 子网格：这一行自己有盒子（可以加底线、间距），两格仍然对齐到列表的两列
      className={cn(
        'col-span-2 box-border grid grid-cols-subgrid items-baseline portrait:col-span-1',
        className,
      )}
    >
      <dt className="m-0 whitespace-nowrap text-ark-fg-muted after:content-['：']">{label}</dt>
      <dd className={cn('m-0 font-ark-bold', tones[tone])}>{children}</dd>
    </div>
  )
}
