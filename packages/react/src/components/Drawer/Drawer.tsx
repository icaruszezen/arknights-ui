import { type ComponentProps, type ReactNode, useId } from 'react'
import { OverlayHeader } from '../../internal/OverlayHeader'
import { cn } from '../../utils/cn'
import { type SurfaceTone, surfaceClass, surfaceContext } from '../../utils/surface'
import { useModalDialog } from '../../utils/useModalDialog'

export type DrawerTone = Exclude<SurfaceTone, 'frosted'>
export type DrawerSide = 'right' | 'left' | 'bottom'
export type DrawerSize = 'sm' | 'md' | 'lg'

export interface DrawerProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /**
   * 从哪一边进来。右边放详情，左边放导航，下边放窄屏上的操作。
   * @default 'right'
   */
  side?: DrawerSide
  /**
   * 左右抽屉的宽度：`sm` 20rem、`md` 约屏宽的四成（不窄于 22.5rem）、`lg` 48rem；
   * 窄屏上都给主画面留出 3rem。下边的抽屉高度随内容，最高 85% 屏高。
   * @default 'md'
   */
  size?: DrawerSize
  /**
   * 表面，取值与 `Panel` 相同（没有毛玻璃）。
   * @default 'surface'
   */
  tone?: DrawerTone
  /**
   * 朝主画面的那一缘加一条信号色的强调边。
   * 需要标出抽屉属于哪个系统时打开，并在抽屉或它的祖先上覆盖 `--ark-signal`。
   */
  accent?: boolean
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

// 贴哪一边、从哪一边平移进来。退场原路返回
const placement: Record<DrawerSide, string> = {
  right: cn(
    'inset-y-0 right-0 left-auto h-full max-h-none',
    'motion-safe:translate-x-full motion-safe:open:translate-x-0 motion-safe:starting:open:translate-x-full',
  ),
  left: cn(
    'inset-y-0 right-auto left-0 h-full max-h-none',
    'motion-safe:-translate-x-full motion-safe:open:translate-x-0 motion-safe:starting:open:-translate-x-full',
  ),
  bottom: cn(
    'inset-x-0 top-auto bottom-0 max-h-[85dvh] w-full',
    'motion-safe:translate-y-full motion-safe:open:translate-y-0 motion-safe:starting:open:translate-y-full',
  ),
}

const widths: Record<DrawerSize, string> = {
  sm: 'w-[min(100vw-3rem,20rem)]',
  md: 'w-[min(100vw-3rem,max(40vw,22.5rem))]',
  lg: 'w-[min(100vw-3rem,48rem)]',
}

const accents: Record<DrawerSide, string> = {
  right: 'border-l-(length:--ark-line-strong) border-l-ark-signal',
  left: 'border-r-(length:--ark-line-strong) border-r-ark-signal',
  bottom: 'border-t-(length:--ark-line-strong) border-t-ark-signal',
}

/**
 * 抽屉从一侧滑入，压住一部分主画面，但不完全遮挡：背后的内容被压暗但仍然可见，
 * 用户始终知道自己在哪。关闭时原路退回。
 *
 * 抽屉直接关闭——点关闭、按 Esc、点主画面都行，没有二次确认：
 * 反馈的重量不应该超过操作本身。页面上的“返回”应当先关抽屉，再退出页面。
 */
export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  size = 'md',
  tone = 'surface',
  accent = false,
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
      data-side={side}
      data-ark-tone={surfaceContext[tone]}
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
      {...dialogProps}
      className={cn(
        'fixed m-0 box-border max-w-none overflow-hidden border-0 bg-transparent p-0 text-ark-fg',
        placement[side],
        side !== 'bottom' && widths[size],
        // 主画面压暗但不模糊，点它就关
        'backdrop:bg-ark-overlay-scrim',
        // 退场过渡期间不拦截点击，下层页面立刻可用
        'pointer-events-none open:pointer-events-auto',
        // 减少动效时不位移，改成淡入淡出
        'motion-reduce:opacity-0 motion-reduce:open:opacity-100 motion-reduce:starting:open:opacity-0',
        'transition-[translate,opacity,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
        className,
      )}
    >
      {/* 内容铺满 <dialog>：强调边和底色画在这一层，点在它们上面不会被当成点了遮罩 */}
      <div
        className={cn(
          'box-border flex h-full max-h-[inherit] flex-col font-ark-cjk-sans',
          accent && accents[side],
          surfaceClass[tone],
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
