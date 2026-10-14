import { type ComponentProps, type ReactNode, useId } from 'react'
import { CheckCircleIcon, CloseCircleIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { useModalDialog } from '../../utils/useModalDialog'
import { Button } from '../Button'

export type DialogVariant = 'panel' | 'band'
export type DialogColor = 'signal' | 'danger'

export interface DialogProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'color' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /** 弹窗请求关闭时调用（点了按钮、按 Esc、点遮罩）。 */
  onOpenChange?: (open: boolean) => void
  /**
   * - `panel`：居中的一块直角面板，网页和应用里的默认写法
   * - `band`：横贯屏幕的一条带，上下露出被压暗的原页面；内容带是与主题相反的面
   * @default 'panel'
   */
  variant?: DialogVariant
  /** 加粗的标题行。可省略，此时用正文作为弹窗的名称。 */
  title?: ReactNode
  /** 正文下方的补充数值，数据体小字，如 `QUOTA 12/135 → 92/135`。 */
  detail?: ReactNode
  /**
   * 右侧确认块上的文字。
   * @default '确认'
   */
  confirmText?: ReactNode
  /**
   * 左侧取消块上的文字。
   * @default '取消'
   */
  cancelText?: ReactNode
  /**
   * 确认块的颜色。
   * - `signal`：信号色，建设性的确认
   * - `danger`：红，删除一类不可撤回的操作
   * @default 'signal'
   */
  color?: DialogColor
  /** 点确认时调用，随后以 `onOpenChange(false)` 请求关闭。 */
  onConfirm?: () => void
  /** 点取消、按 Esc 或点遮罩时调用，随后以 `onOpenChange(false)` 请求关闭。 */
  onCancel?: () => void
  /** 只留一个确认按钮（纯告知）。此时它是不带颜色的灰底块。 */
  hideCancel?: boolean
}

// 后果的高亮：橙色粗体。浅色面上压暗，比例同信号色文字
const consequence =
  '[&_em]:font-ark-bold [&_em]:text-[color:color-mix(in_srgb,var(--ark-color-signal-accent)_var(--ark-signal-fg-mix),black)] [&_em]:not-italic'

const frames: Record<DialogVariant, string> = {
  // 居中，最宽 28rem，四周至少留 1rem
  panel: cn(
    'm-auto w-[min(28rem,100vw-2rem)]',
    'motion-safe:scale-95 motion-safe:open:scale-100 motion-safe:starting:open:scale-95',
  ),
  // 通栏，垂直居中；内容带纵向展开
  band: cn(
    'm-0 my-auto w-full',
    'motion-safe:scale-y-75 motion-safe:open:scale-y-100 motion-safe:starting:open:scale-y-75',
  ),
}

/**
 * 确认弹窗：要求表态的一问一答。按钮对开、位置固定——取消在左（圆圈叉），确认在右（圆圈对勾），
 * 各占一半宽度；图形是固定的，不只靠颜色区分。
 *
 * 正文里用 `<em>` 标出后果（“将扣除 180 点数”），它会显示成橙色粗体。
 * 基于原生 `<dialog>`：自带焦点圈定、Esc 关闭，关闭后焦点回到触发元素。
 */
export function Dialog({
  open,
  onOpenChange,
  variant = 'panel',
  title,
  detail,
  confirmText = '确认',
  cancelText = '取消',
  color = 'signal',
  onConfirm,
  onCancel,
  hideCancel = false,
  ref,
  className,
  onClick,
  children,
  ...rest
}: DialogProps) {
  const { requestClose, dialogProps } = useModalDialog({
    open,
    onOpenChange,
    onDismiss: onCancel,
    ref,
    onClick,
  })
  const titleId = useId()
  const bodyId = useId()
  const band = variant === 'band'

  return (
    <dialog
      data-ark="dialog"
      data-variant={variant}
      aria-labelledby={title != null ? titleId : bodyId}
      aria-describedby={title != null ? bodyId : undefined}
      {...rest}
      {...dialogProps}
      className={cn(
        'box-border max-w-none border-0 bg-transparent p-0 text-ark-fg',
        frames[variant],
        'backdrop:bg-ark-overlay-scrim backdrop:backdrop-blur-ark-backdrop',
        // 退场过渡期间不拦截点击，下层页面立刻可用
        'pointer-events-none open:pointer-events-auto',
        // 入场：淡入，加一点缩放；减少动效时只保留透明度
        'opacity-0 open:opacity-100 starting:open:opacity-0',
        'transition-[opacity,scale,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
        className,
      )}
    >
      {/* 内容铺满 <dialog>：点在它上面不会被当成点了遮罩 */}
      <div
        // 横带的内容带是与主题相反的面：暗色主题里就是实机那条纸白的带
        data-ark-tone={band ? 'inverse' : undefined}
        className={cn(
          'box-border font-ark-cjk-sans text-ark-fg',
          band
            ? 'bg-ark-surface px-ark-6 py-ark-6 text-center'
            : [
                'border-t-(length:--ark-line-strong) bg-ark-surface-raised px-ark-5 pt-ark-5 pb-ark-6 text-left',
                color === 'danger' ? 'border-t-ark-danger' : 'border-t-ark-signal',
              ],
          consequence,
        )}
      >
        {title != null && (
          <h2 id={titleId} className="m-0 mb-ark-3 text-ark-body-lg leading-ark-snug font-ark-bold">
            {title}
          </h2>
        )}
        <div
          id={bodyId}
          className={cn(
            'text-ark-base leading-ark-body font-ark-regular',
            title != null && 'text-ark-fg-secondary',
          )}
        >
          {children}
        </div>
        {detail != null && (
          <p className="m-0 mt-ark-2 font-ark-data text-ark-caption leading-ark-solid text-ark-fg-muted">
            {detail}
          </p>
        )}
      </div>
      <div className={cn('grid', hideCancel ? 'grid-cols-1' : 'grid-cols-2')}>
        {hideCancel ? (
          // 纯告知的弹窗只有一个不带颜色的块，图形仍是对勾
          <Button
            variant="subtle"
            size="lg"
            icon={<CheckCircleIcon />}
            block
            onClick={() => requestClose(onConfirm)}
          >
            {confirmText}
          </Button>
        ) : (
          <>
            <Button
              variant="subtle"
              size="lg"
              icon={<CloseCircleIcon />}
              block
              onClick={() => requestClose(onCancel)}
            >
              {cancelText}
            </Button>
            <Button
              variant={color === 'danger' ? 'danger' : 'primary'}
              size="lg"
              icon={<CheckCircleIcon />}
              block
              onClick={() => requestClose(onConfirm)}
            >
              {confirmText}
            </Button>
          </>
        )}
      </div>
    </dialog>
  )
}
