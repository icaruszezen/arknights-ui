import { type ComponentProps, type ReactNode, useId } from 'react'
import { OverlayHeader } from '../../internal/OverlayHeader'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useModalDialog } from '../../utils/useModalDialog'

export interface DrawerProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /** 抽屉请求关闭时调用（点了关闭、按 Esc、点主画面）。 */
  onOpenChange?: (open: boolean) => void
  /** 标题，同时是抽屉的名称。省略时请给 `aria-label`。 */
  title?: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /** 固定在底部的一栏，不随正文滚动，通常放这个抽屉的主要操作。 */
  footer?: ReactNode
  /**
   * 关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

/**
 * 抽屉从右侧滑入，压住一部分主画面，但不完全遮挡：详情不占满屏，背后的内容仍然可见，
 * 用户始终知道自己在哪。关闭时原路退回。
 *
 * 抽屉直接关闭——点关闭、按 Esc、点主画面都行，没有二次确认：
 * 反馈的重量不应该超过操作本身。
 *
 * 左缘的强调边用信号色。在抽屉或它的祖先上覆盖 `--ark-signal`，就能标出它属于哪个系统。
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  sub,
  footer,
  closeLabel = '关闭',
  ref,
  className,
  onClick,
  children,
  ...rest
}: DrawerProps) {
  const { requestClose, dialogProps } = useModalDialog({ open, onOpenChange, ref, onClick })
  const titleId = useId()

  return (
    <dialog
      data-ark="drawer"
      data-ark-tone="dark"
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
      {...dialogProps}
      className={cn(
        // 贴右、满高。宽度约为屏宽的 40%，不窄于 22.5rem；窄屏上也给主画面留出 3rem
        'fixed inset-y-0 right-0 left-auto m-0 box-border h-full max-h-none w-[min(100vw-3rem,max(40vw,22.5rem))] max-w-none overflow-hidden border-0 bg-transparent p-0 text-ark-fg',
        // 遮罩透明：主画面不压暗，点它就关
        'backdrop:bg-transparent',
        // 退场过渡期间不拦截点击，下层页面立刻可用
        'pointer-events-none open:pointer-events-auto',
        // 自右向左平移，退场原路返回
        'motion-safe:translate-x-full motion-safe:open:translate-x-0 motion-safe:starting:open:translate-x-full',
        // 减少动效时不位移，改成淡入淡出
        'motion-reduce:opacity-0 motion-reduce:open:opacity-100 motion-reduce:starting:open:opacity-0',
        'transition-[translate,opacity,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
        className,
      )}
    >
      {/* 内容铺满 <dialog>：强调边和底色画在这一层，点在它们上面不会被当成点了遮罩 */}
      <div
        className={cn(
          'box-border flex h-full flex-col border-l-(length:--ark-line-strong) border-ark-signal bg-ark-overlay-panel-dark font-ark-cjk-sans',
          brighterMuted,
        )}
      >
        <OverlayHeader
          titleId={titleId}
          title={title}
          sub={sub}
          closeLabel={closeLabel}
          onClose={() => requestClose()}
        />
        <div className="box-border min-h-0 grow overflow-y-auto px-ark-5 pt-ark-3 pb-ark-5">
          {children}
        </div>
        {footer != null && (
          <div className="box-border shrink-0 border-t border-ark-rule p-ark-5">{footer}</div>
        )}
      </div>
    </dialog>
  )
}
