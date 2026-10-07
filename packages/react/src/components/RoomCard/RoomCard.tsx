import { type ComponentProps, type MouseEventHandler, type ReactNode, useId } from 'react'
import { brighterMuted, colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Badge } from '../Badge'

export type RoomKind = 'factory' | 'trading' | 'power' | 'neutral'

/**
 * 设施的类型色，写成覆盖 `--ark-signal` 的类名：制造站黄、贸易站蓝、发电站绿，其余中性。
 * 把同一个类加到这个设施的 `Drawer` 上，颜色就从房间一路标到抽屉和里面的进度条。
 */
export const roomSignal: Record<RoomKind, string> = {
  factory: '[--ark-signal:var(--ark-color-signal-action)]',
  trading: '[--ark-signal:var(--ark-color-signal-info-game)]',
  power: '[--ark-signal:var(--ark-color-signal-success)]',
  neutral: '[--ark-signal:var(--ark-color-neutral-gray-400)]',
}

export interface RoomCardProps extends Omit<ComponentProps<'div'>, 'title' | 'onClick'> {
  /** 设施名，如“制造站”。 */
  title: ReactNode
  /** 设施名后面的英文小字。 */
  sub?: ReactNode
  /** 设施等级，写在标题行的右端。 */
  level?: number
  /**
   * 设施类型，决定这张卡片的类型色。不给就沿用所在位置的信号色。
   * - `factory`：制造站，黄
   * - `trading`：贸易站，蓝
   * - `power`：发电站，绿
   * - `neutral`：控制中枢、宿舍这类没有专属颜色的设施
   */
  kind?: RoomKind
  /** 标题前的图标，压在一块类型色的底上。组件库不带图标，请自备。 */
  icon?: ReactNode
  /** 房间内景的图片地址，垫在最底层并压暗。 */
  src?: string
  /** 右上角的提示：`true` 是一个橙色的提醒标记（有可收取的产出），数字是计数色块。 */
  badge?: boolean | number
  /** 给读屏的说明，如“有可收取的产出”。 */
  badgeLabel?: string
  /** 给了就把整张卡片做成链接。 */
  href?: string
  /** 点卡片时调用，通常是打开这个设施的详情抽屉。给了它整张卡片是一个按钮。 */
  onClick?: MouseEventHandler<HTMLElement>
}

const cover = cn(
  'absolute inset-0 z-1 m-0 box-border block cursor-pointer appearance-none border-0 bg-transparent p-0',
  // 卡片会裁掉溢出的部分，轮廓画在内侧
  focusRingInset,
)

/**
 * 基建剖面里的一个房间：直角矩形，2px 的类型色描边，里面是这个设施的现状——
 * 进驻的干员、产出的进度。房间就是入口，不需要另设菜单。
 *
 * 类型色通过覆盖 `--ark-signal` 给出，所以放在里面的进度条、头像的加成圆环都跟着换。
 * `children` 是房间里的内容。
 *
 * 给了 `href` 或 `onClick` 时整张卡片可点：点击区是盖在上面的一层，名称来自标题行，
 * 里面的内容仍然能被读屏逐项读到。卡片里另有需要单独点的东西时，给它加 `relative z-2`。
 */
export function RoomCard({
  title,
  sub,
  level,
  kind,
  icon,
  src,
  badge,
  badgeLabel,
  href,
  onClick,
  className,
  children,
  ...rest
}: RoomCardProps) {
  const headerId = useId()
  const clickable = href !== undefined || onClick !== undefined
  const hasBadge = badge === true || (typeof badge === 'number' && badge > 0)

  return (
    <div
      data-ark="room-card"
      data-ark-tone="dark"
      data-kind={kind}
      {...rest}
      className={cn(
        'group relative isolate box-border flex min-h-28 flex-col justify-between gap-ark-3 overflow-hidden border-2 border-ark-signal bg-ark-neutral-black/60 p-ark-3 font-ark-cjk-sans text-ark-fg',
        brighterMuted,
        kind !== undefined && roomSignal[kind],
        // 悬停整块换色：底色染上类型色
        clickable && ['hover:bg-ark-signal/25', colorTransition],
        className,
      )}
    >
      {src !== undefined && (
        <img
          src={src}
          alt=""
          className="absolute inset-0 -z-1 m-0 block size-full max-w-none border-0 object-cover opacity-35 saturate-[0.6] select-none"
        />
      )}

      <div id={headerId} className="flex items-center gap-ark-2 leading-ark-solid">
        {icon != null && (
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center bg-ark-signal text-ark-on-signal [&>svg]:block [&>svg]:size-4"
          >
            {icon}
          </span>
        )}
        <span
          className={cn(
            'text-ark-body font-ark-bold whitespace-nowrap',
            clickable && ['group-hover:text-ark-signal-fg', colorTransition],
          )}
        >
          {title}
        </span>
        {sub != null && (
          <span className="min-w-0 truncate font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
            {sub}
          </span>
        )}
        {level !== undefined && (
          <span className="ml-auto flex shrink-0 items-baseline gap-ark-1 pl-ark-2">
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted">
              LV
            </span>
            <b className="font-ark-data text-ark-body font-ark-bold text-ark-signal-fg">{level}</b>
          </span>
        )}
      </div>

      {children != null && <div className="grid gap-ark-2">{children}</div>}

      {hasBadge && (
        <Badge
          dot={badge === true}
          count={typeof badge === 'number' ? badge : undefined}
          label={badgeLabel}
          className={
            badge === true
              ? // 菱形的中心压在角上，卡片裁掉一半，剩下一个橙色的角
                'absolute top-0 right-0 size-4 translate-x-1/2 -translate-y-1/2'
              : 'absolute top-ark-1 right-ark-1'
          }
        />
      )}

      {href !== undefined ? (
        // biome-ignore lint/a11y/useAnchorContent: 名称由 aria-labelledby 指向标题行，链接自己不放内容
        <a href={href} aria-labelledby={headerId} onClick={onClick} className={cover} />
      ) : (
        onClick !== undefined && (
          <button type="button" aria-labelledby={headerId} onClick={onClick} className={cover} />
        )
      )}
    </div>
  )
}
