import type { ComponentProps, ReactNode } from 'react'
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
 * 放进石墨或纸白面板时跟着换。虚线框是装饰，取文字色的一半不透明度。
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
