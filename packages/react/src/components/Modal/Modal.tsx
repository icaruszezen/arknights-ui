import { type ComponentProps, type ReactNode, useId } from 'react'
import { OverlayHeader } from '../../internal/OverlayHeader'
import { cn } from '../../utils/cn'
import { type SurfaceTone, surfaceClass, surfaceContext } from '../../utils/surface'
import { useModalDialog } from '../../utils/useModalDialog'

export type ModalTone = SurfaceTone
export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

export interface ModalProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /** 弹层请求关闭时调用（点了关闭、按 Esc、点遮罩）。 */
  onOpenChange?: (open: boolean) => void
  /**
   * 表面，取值与 `Panel` 相同。
   * @default 'raised'
   */
  tone?: ModalTone
  /**
   * 宽度：`sm` 24rem、`md` 36rem、`lg` 56rem；`full` 占满视口，四周留 1rem。
   * 窄屏上一律通栏、贴底。
   * @default 'md'
   */
  size?: ModalSize
  /** 标题，同时是弹层的名称。省略时请给 `aria-label`。 */
  title?: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /** 固定在底部的一栏，不随正文滚动，放这个弹层的操作。 */
  footer?: ReactNode
  /**
   * 关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

const sizes: Record<ModalSize, string> = {
  sm: 'md:w-[min(24rem,100vw-2rem)]',
  md: 'md:w-[min(36rem,100vw-2rem)]',
  lg: 'md:w-[min(56rem,100vw-2rem)]',
  full: 'md:h-[calc(100dvh-2rem)] md:w-[calc(100vw-2rem)]',
}

/**
 * 弹层：次级内容不跳转新页面，而是在当前页面上呼出。
 * 下层整页被压暗并模糊，而不是被完全遮住，用户能看出自己没有离开原来的页面。
 *
 * 和 `Dialog` 的区别：`Dialog` 是要求表态的确认，`Modal` 是可以随手关掉的内容。
 * 基于原生 `<dialog>`：自带焦点圈定、Esc 关闭，关闭后焦点回到触发元素。
 */
export function Modal({
  open,
  onOpenChange,
  tone = 'raised',
  size = 'md',
  title,
  sub,
  footer,
  closeLabel = '关闭',
  ref,
  className,
  onClick,
  children,
  ...rest
}: ModalProps) {
  const { requestClose, dialogProps } = useModalDialog({ open, onOpenChange, ref, onClick })
  const titleId = useId()

  return (
    <dialog
      data-ark="modal"
      data-ark-tone={surfaceContext[tone]}
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
      {...dialogProps}
      className={cn(
        // 窄屏：通栏、贴底，上面留出 3rem 让人看得到下层。宽屏：居中，宽度看 size
        'm-0 mt-auto box-border max-h-[calc(100dvh-3rem)] w-full max-w-none overflow-hidden border-0 p-0 text-ark-fg',
        'md:m-auto md:max-h-[calc(100dvh-2rem)]',
        sizes[size],
        // 表面写在 <dialog> 自身。毛玻璃写在子元素上的话，淡入期间父级不透明度小于 1，
        // 子元素的 backdrop-filter 取不到下层的画面，模糊要等过渡结束才突然出现
        surfaceClass[tone],
        // 遮罩：整页压暗并模糊
        'backdrop:bg-ark-overlay-scrim backdrop:backdrop-blur-ark-backdrop',
        // 退场过渡期间不拦截点击，下层页面立刻可用
        'pointer-events-none open:pointer-events-auto',
        // 入场：淡入并略微放大（层级深入用 zoom-in）；减少动效时只保留透明度
        'opacity-0 open:opacity-100 starting:open:opacity-0',
        'motion-safe:scale-95 motion-safe:open:scale-100 motion-safe:starting:open:scale-95',
        'transition-[opacity,scale,display,overlay] transition-discrete duration-(--ark-motion-duration-base) ease-ark-standard',
        className,
      )}
    >
      {/* 内容铺满 <dialog>：描边画在这一层，点在它上面不会被当成点了遮罩 */}
      <div
        className={cn(
          'box-border flex h-full max-h-[inherit] flex-col font-ark-cjk-sans',
          // 细描边只给毛玻璃：不透明的面自己就有边界
          tone === 'frosted' && 'border border-ark-rule',
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
          <div
            data-ark="modal-footer"
            className="box-border flex shrink-0 flex-wrap items-center justify-end gap-ark-3 border-t border-ark-rule p-ark-5"
          >
            {footer}
          </div>
        )}
      </div>
    </dialog>
  )
}
