import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type BadgeTone = 'alert' | 'signal'

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 数量。为 0 时不显示。 */
  count?: number
  /**
   * 显示的上限，超过时写成 `99+`。
   * @default 99
   */
  max?: number
  /** 只显示一个提醒标记：未读、可领取。优先于 `count`。 */
  dot?: boolean
  /**
   * 计数色块的颜色。
   * - `alert`：告警的暗红，白字
   * - `signal`：信号色，通知一类
   * @default 'alert'
   */
  tone?: BadgeTone
  /** 数字前的小图标（告警的三角、通知的铃铛）。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
  /**
   * 给读屏的说明，如“3 封未读邮件”。
   * 不给时数字按原样读出；提醒标记没有文字，对读屏隐藏，状态需要在别处另行说明。
   */
  label?: string
  /** 被标记的元素，角标骑在它的右上角。不传时角标独立使用。 */
  children?: ReactNode
}

// 实机的蓝色通知角标是白字压蓝，对比度只有 3:1；这里用信号色配它自己的前景色
const tones: Record<BadgeTone, string> = {
  alert: 'bg-ark-signal-alert text-ark-neutral-white',
  signal: 'bg-ark-signal text-ark-on-signal',
}

/**
 * 提醒标记与计数角标。
 *
 * 提醒标记是一个橙色的菱形，带一圈白边，骑在元素的角上：只说“有”，不说“有多少”。
 * 计数是一块直角的色块，白色的图标加数字。两样的颜色都是固定语义，不跟随可替换的信号色
 * （`tone="signal"` 除外）。其余属性和 `className` 作用在角标本身。
 */
export function Badge({
  count,
  max = 99,
  dot = false,
  tone = 'alert',
  icon,
  label,
  className,
  children,
  ...rest
}: BadgeProps) {
  const shown = dot || (count !== undefined && count > 0)
  // aria-label 只在带 role 的元素上有效，两样必须一起出现
  const semantics =
    label !== undefined
      ? ({ role: 'img', 'aria-label': label } as const)
      : dot && ({ 'aria-hidden': true } as const)
  const mark = shown && (
    <span
      data-ark="badge"
      {...semantics}
      {...rest}
      className={cn(
        'box-border inline-flex shrink-0 items-center justify-center select-none',
        dot
          ? // 菱形：转 45° 的方块。橙色与白边都是实机取色
            'size-2.5 rotate-45 border border-ark-neutral-white bg-ark-signal-accent'
          : [
              'h-5 min-w-5 gap-0.5 px-ark-1 font-ark-data text-ark-caption leading-ark-solid font-ark-bold',
              tones[tone],
            ],
        children != null && 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2',
        className,
      )}
    >
      {!dot && icon != null && (
        <span
          aria-hidden="true"
          className="grid size-3 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon}
        </span>
      )}
      {!dot && count !== undefined && (count > max ? `${max}+` : count)}
    </span>
  )
  if (children == null) return mark || null
  return (
    // inline-grid：外层被父容器拉伸时，里面的元素跟着撑满
    <span className="relative inline-grid">
      {children}
      {mark}
    </span>
  )
}
