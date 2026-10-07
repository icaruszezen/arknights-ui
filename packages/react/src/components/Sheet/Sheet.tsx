import { type ComponentProps, type ReactNode, useId } from 'react'
import { OverlayHeader } from '../../internal/OverlayHeader'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useModalDialog } from '../../utils/useModalDialog'

export type SheetTone = 'frosted' | 'graphite' | 'paper'

export interface SheetProps
  extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose'> {
  /** 是否打开。受控：请在 `onOpenChange` 里更新它。 */
  open: boolean
  /** 浮层请求关闭时调用（点了关闭、按 Esc、点遮罩）。 */
  onOpenChange?: (open: boolean) => void
  /**
   * 表面。
   * - `frosted`：半透明的毛玻璃，1px 细描边
   * - `graphite` / `paper`：不透明的石墨或纸白，游戏内采购、兑换的弹层是这种
   * @default 'frosted'
   */
  tone?: SheetTone
  /** 标题，同时是浮层的名称。省略时请给 `aria-label`。 */
  title?: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /**
   * 关闭按钮的名称。
   * @default '关闭'
   */
  closeLabel?: string
}

// 表面写在 <dialog> 自身。毛玻璃写在子元素上的话，淡入期间父级不透明度小于 1，
// 子元素的 backdrop-filter 取不到下层的画面，模糊要等过渡结束才突然出现
const surfaces: Record<SheetTone, string> = {
  frosted: 'bg-ark-overlay-scrim backdrop-blur-ark-backdrop',
  graphite: 'bg-ark-neutral-graphite',
  paper: 'bg-ark-neutral-paper',
}

/**
 * 浮层：签到、邮件、职业详情这类次级内容不跳转新页面，而是在当前页面上呼出。
 * 下层整页被压暗并模糊，而不是被完全遮住，用户能看出自己没有离开原来的页面。
 *
 * 和 `Dialog` 的区别：`Dialog` 是要求表态的通栏横带，`Sheet` 是可以随手关掉的内容浮层。
 * 和 `Panel tone="frosted"` 的区别：那只是一种表面，这里多了弹层行为。
 */
export function Sheet({
  open,
  onOpenChange,
  tone = 'frosted',
  title,
  sub,
  closeLabel = '关闭',
  ref,
  className,
  onClick,
  children,
  ...rest
}: SheetProps) {
  const { requestClose, dialogProps } = useModalDialog({ open, onOpenChange, ref, onClick })
  const titleId = useId()

  return (
    <dialog
      data-ark="sheet"
      data-ark-tone={tone === 'paper' ? 'light' : 'dark'}
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
      {...dialogProps}
      className={cn(
        // 居中，最宽 36rem，四周至少留 1rem
        'm-auto box-border max-h-[calc(100dvh-3rem)] w-[min(36rem,100vw-2rem)] max-w-none overflow-hidden border-0 p-0 text-ark-fg',
        surfaces[tone],
        // 遮罩：整页压暗并模糊（实机的写法）
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
          'box-border flex max-h-[inherit] flex-col font-ark-cjk-sans',
          // 细描边只给毛玻璃：不透明的面自己就有边界
          tone === 'frosted' && 'border border-ark-rule',
          tone !== 'paper' && brighterMuted,
        )}
      >
        <OverlayHeader
          titleId={titleId}
          title={title}
          sub={sub}
          closeLabel={closeLabel}
          onClose={() => requestClose()}
        />
        <div className="box-border min-h-0 overflow-y-auto px-ark-5 pt-ark-3 pb-ark-5">
          {children}
        </div>
      </div>
    </dialog>
  )
}
