import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type NoticeLevel = 'info' | 'warning' | 'error'

export interface NoticeProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * 级别，决定左侧色边、图形和 `role`。
   * - `info`：蓝边，`role="status"`
   * - `warning`：黄边 + 顶部警戒条纹窄边，`role="alert"`
   * - `error`：红边，`role="alert"`
   * @default 'info'
   */
  level?: NoticeLevel
  /** 加粗的首行。 */
  title?: ReactNode
}

// 级别色是固定语义（蓝 = 信息、黄 = 警示、红 = 危险），不跟随可替换的信号色
const edge: Record<NoticeLevel, string> = {
  info: 'border-ark-signal-info',
  warning: 'border-ark-signal-action',
  error: 'border-ark-signal-danger',
}

const glyphColor: Record<NoticeLevel, string> = {
  info: 'text-ark-signal-info',
  warning: 'text-ark-signal-action',
  error: 'text-ark-signal-danger',
}

// 颜色之外再给一种编码：方点、三角、菱形
const glyph: Record<NoticeLevel, ReactNode> = {
  info: <rect x="2" y="2" width="8" height="8" />,
  warning: <path d="M6 1 11.5 11H.5z" />,
  error: <path d="M6 .5 11.5 6 6 11.5.5 6z" />,
}

/** 提示条靠左侧一条色边说明级别。底色保持深色，不整条变色。 */
export function Notice({ level = 'info', title, className, children, ...rest }: NoticeProps) {
  return (
    <div
      data-ark="notice"
      data-ark-tone="dark"
      data-level={level}
      role={level === 'info' ? 'status' : 'alert'}
      {...rest}
      className={cn(
        'relative box-border flex items-start gap-ark-3 border-l-(length:--ark-line-strong) bg-ark-neutral-ink-900 px-ark-4 py-ark-3 font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
        edge[level],
        level === 'warning' && 'pt-[calc(var(--ark-space-3)+0.375rem)]',
        className,
      )}
    >
      {level === 'warning' && (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 left-[calc(var(--ark-line-strong)*-1)] h-1.5 bg-(image:--ark-pattern-hazard)"
        />
      )}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className={cn('mt-1 size-3 shrink-0 fill-current', glyphColor[level])}
      >
        {glyph[level]}
      </svg>
      <div className="grid min-w-0 gap-ark-1">
        {title != null && <strong className="font-ark-bold">{title}</strong>}
        {children != null && <div>{children}</div>}
      </div>
    </div>
  )
}
