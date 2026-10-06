import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 数量。为 0 时不显示。 */
  count?: number
  /**
   * 显示的上限，超过时写成 `99+`。
   * @default 99
   */
  max?: number
  /** 只显示一个红点：未读、可领取。优先于 `count`。 */
  dot?: boolean
  /**
   * 给读屏的说明，如“3 封未读邮件”。
   * 不给时数字按原样读出；红点没有文字，对读屏隐藏，状态需要在别处另行说明。
   */
  label?: string
  /** 被标记的元素，角标贴在它的右上角。不传时角标独立使用。 */
  children?: ReactNode
}

/**
 * 红点与数字角标：未读、可领取用小红点，数量用右上角的小数字。
 *
 * 红色是固定语义，不跟随可替换的信号色。数字用黑字——白字压在这个红上只有 4.24:1。
 * 其余属性和 `className` 作用在角标本身。
 */
export function Badge({
  count,
  max = 99,
  dot = false,
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
        'box-border inline-flex shrink-0 items-center justify-center bg-ark-signal-danger select-none',
        dot
          ? 'size-2 rounded-full'
          : 'h-4 min-w-4 px-ark-1 font-ark-data text-ark-caption leading-ark-solid font-ark-bold text-ark-neutral-black',
        children != null && 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2',
        className,
      )}
    >
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
