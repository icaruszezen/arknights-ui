import type { ComponentProps, ReactNode } from 'react'
import { PlusIcon } from '../../internal/icons'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

export interface EmptyProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * 窄体英文标题。
   * @default 'NO DATA'
   */
  title?: ReactNode
}

/**
 * 空状态：虚线框 + 窄体英文 + 一行中文说明（`children`）。不放插画。
 *
 * 它是画面里最安静的一块，但文字仍然读得清：用所在表面的次要文字色，
 * 换主题、放进别的面板时跟着换。虚线框是装饰，取文字色的一半不透明度。
 *
 * “没有数据”只是告知；“可以填的空位”是一个入口，用 `EmptySlot`。
 */
export function Empty({ title = 'NO DATA', className, children, ...rest }: EmptyProps) {
  const described = children != null
  return (
    <div
      data-ark="empty"
      {...rest}
      className={cn(
        // 不用写死的 gray-600：它在黑底上只有 2.95:1，放进石墨面板只剩 1.53:1。
        // 见 docs/elements/feedback.md「空状态」。边框的 50% 在黑底上约等于原来的 gray-600
        'box-border grid justify-items-center gap-ark-2 border border-dashed border-ark-fg-muted/50 px-ark-5 py-ark-6 text-center text-ark-fg-muted',
        className,
      )}
    >
      {/* 有中文说明时，英文标题只是对它的第二次表述，不必再读一遍 */}
      <p
        aria-hidden={described ? true : undefined}
        className="m-0 font-ark-latin-condensed text-ark-label leading-ark-solid font-ark-medium tracking-ark-wide"
      >
        {title}
      </p>
      {described && (
        <p className="m-0 font-ark-cjk-sans text-ark-caption leading-ark-snug">{children}</p>
      )}
    </div>
  )
}

export interface EmptySlotProps extends Omit<ComponentProps<'button'>, 'title'> {
  /** 加号下面的一行动作名，如“添加成员”。它是这个空位的名称。 */
  children: ReactNode
}

/**
 * 可以填的空位：一圈实线的细框，正中一个加号，下面一行动作名。
 *
 * 它和旁边已填的格子等大——宽高由所在的网格决定，默认撑满——空位不缩小、不隐藏，位置留着。
 * 它本身是一个按钮：悬停整块反色。
 */
export function EmptySlot({ className, children, ...rest }: EmptySlotProps) {
  return (
    <button
      data-ark="empty-slot"
      type="button"
      {...rest}
      className={cn(
        'm-0 box-border grid size-full min-h-24 cursor-pointer appearance-none place-content-center justify-items-center gap-ark-2 border border-ark-rule-strong bg-transparent p-ark-4 font-ark-cjk-sans text-ark-label leading-ark-solid font-ark-medium text-ark-fg-secondary',
        'hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
        'disabled:cursor-not-allowed disabled:border-ark-rule disabled:bg-transparent disabled:text-ark-on-disabled',
        colorTransition,
        focusRing,
        className,
      )}
    >
      <PlusIcon className="size-6" />
      <span>{children}</span>
    </button>
  )
}
