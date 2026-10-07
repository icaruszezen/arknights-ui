import type { ComponentProps, ReactNode } from 'react'
import { InfoCircleIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { Pattern } from '../Pattern'

export type NoticeLevel = 'info' | 'warning' | 'error'

export interface NoticeProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * 级别，决定图形、色边和 `role`。
   * - `info`：白色的圆圈 i，没有色边，`role="status"`
   * - `warning`：黄边 + 顶部警戒条纹窄边，`role="alert"`
   * - `error`：红边，`role="alert"`
   * @default 'info'
   */
  level?: NoticeLevel
  /** 加粗的首行。 */
  title?: ReactNode
}

// 级别色是固定语义（黄 = 警示、红 = 危险），不跟随可替换的信号色。
// 实机的提示条只见过信息一级，没有色边；警示和错误的色边是本仓库的估计
const edge: Record<NoticeLevel, string> = {
  info: '',
  warning: 'border-l-(length:--ark-line-strong) border-ark-signal-action',
  error: 'border-l-(length:--ark-line-strong) border-ark-signal-danger',
}

const glyphColor = {
  warning: 'text-ark-signal-action',
  error: 'text-ark-signal-danger',
}

// 颜色之外再给一种编码：圆圈 i、三角、菱形
const glyph = {
  warning: <path d="M6 1 11.5 11H.5z" />,
  error: <path d="M6 .5 11.5 6 6 11.5.5 6z" />,
}

/**
 * 提示条：一条半透明的黑底，前面一个图形，后面是白字。信息级就是这样，不加任何颜色；
 * 警示和错误再在左侧加一条色边说明级别。底色始终是深色，不整条变色。
 */
export function Notice({ level = 'info', title, className, children, ...rest }: NoticeProps) {
  return (
    <div
      data-ark="notice"
      data-ark-tone="dark"
      data-level={level}
      role={level === 'info' ? 'status' : 'alert'}
      {...rest}
      className={cn(
        'relative box-border flex items-start gap-ark-3 bg-ark-neutral-black/85 px-ark-4 py-ark-3 font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
        edge[level],
        level === 'warning' && 'pt-[calc(var(--ark-space-3)+0.375rem)]',
        className,
      )}
    >
      {level === 'warning' && (
        <Pattern
          variant="hazard"
          className="absolute top-0 right-0 left-[calc(var(--ark-line-strong)*-1)] h-1.5 w-auto"
        />
      )}
      {level === 'info' ? (
        <InfoCircleIcon className="mt-px size-4.5 shrink-0" />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={cn('mt-1 size-3 shrink-0 fill-current', glyphColor[level])}
        >
          {glyph[level]}
        </svg>
      )}
      <div className="grid min-w-0 gap-ark-1">
        {title != null && <strong className="font-ark-bold">{title}</strong>}
        {children != null && <div>{children}</div>}
      </div>
    </div>
  )
}
