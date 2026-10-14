import type { ComponentProps, ReactNode } from 'react'
import { CloseButton } from '../../internal/CloseButton'
import { InfoCircleIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { Pattern } from '../Pattern'

export type NoticeLevel = 'info' | 'success' | 'warning' | 'error'

export interface NoticeProps extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * 级别，决定图形、色边和 `role`。
   * - `info`：圆圈 i，没有色边，`role="status"`
   * - `success`：绿边 + 方块，`role="status"`
   * - `warning`：黄边 + 顶部警戒条纹窄边 + 三角，`role="alert"`
   * - `error`：红边 + 菱形，`role="alert"`
   * @default 'info'
   */
  level?: NoticeLevel
  /** 加粗的首行。 */
  title?: ReactNode
  /** 右侧的操作，通常是一个小按钮（“撤销”“查看”）。 */
  action?: ReactNode
  /** 给了就在右端出现关闭按钮，点它时调用。提示条自己不会消失，由使用方把它拿掉。 */
  onClose?: () => void
  /**
   * 关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

type Graded = Exclude<NoticeLevel, 'info'>

// 级别色是固定语义（绿 = 完成、黄 = 警示、红 = 危险），不跟随可替换的信号色
const edge: Record<NoticeLevel, string> = {
  info: '',
  success: 'border-l-(length:--ark-line-strong) border-l-ark-signal-success',
  warning: 'border-l-(length:--ark-line-strong) border-l-ark-signal-action',
  error: 'border-l-(length:--ark-line-strong) border-l-ark-signal-danger',
}

// 图形用“文字色”的那一档：浅色面上会压暗
const glyphColor: Record<Graded, string> = {
  success: 'text-ark-success-fg',
  warning: 'text-ark-warning-fg',
  error: 'text-ark-danger-fg',
}

// 颜色之外再给一种编码：圆圈 i、方块、三角、菱形
const glyph: Record<Graded, ReactNode> = {
  success: <path d="M1.5 1.5h9v9h-9z" />,
  warning: <path d="M6 1 11.5 11H.5z" />,
  error: <path d="M6 .5 11.5 6 6 11.5.5 6z" />,
}

/**
 * 提示条：一条不带彩色的底，前面一个图形，后面是字。信息级就是这样；
 * 需要分级时在左侧加一条色边，底色不变——不整条变成大红大黄。
 *
 * 它写在页面里、跟着内容走；一会儿就消失的那种用 `Toast`。
 */
export function Notice({
  level = 'info',
  title,
  action,
  onClose,
  closeLabel = '关闭',
  className,
  children,
  ...rest
}: NoticeProps) {
  return (
    <div
      data-ark="notice"
      data-level={level}
      role={level === 'info' || level === 'success' ? 'status' : 'alert'}
      {...rest}
      className={cn(
        'relative box-border flex items-start gap-ark-3 bg-ark-control px-ark-4 py-ark-3 font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
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
      <div className="grid min-w-0 grow gap-ark-1">
        {title != null && <strong className="font-ark-bold">{title}</strong>}
        {children != null && <div>{children}</div>}
      </div>
      {action != null && <div className="shrink-0 self-center">{action}</div>}
      {onClose && (
        <CloseButton
          label={closeLabel}
          onClick={onClose}
          // 44px 的点击区收进提示条的内边距里，不把条撑高
          className="-my-ark-3 -mr-ark-4 self-stretch"
        />
      )}
    </div>
  )
}
