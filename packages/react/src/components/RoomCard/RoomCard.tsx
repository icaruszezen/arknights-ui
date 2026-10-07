import { type ComponentProps, type MouseEventHandler, type ReactNode, useId } from 'react'
import { brighterMuted, colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Badge } from '../Badge'

export type RoomKind = 'factory' | 'trading' | 'power' | 'neutral'

/**
 * 设施的类型色，写成覆盖 `--ark-signal` 的类名：制造站黄、贸易站蓝、发电站黄绿（实机取色），其余中性。
 * 把同一个类加到这个设施的 `Drawer` 上，颜色就从房间一路标到抽屉和里面的进度条。
 */
export const roomSignal: Record<RoomKind, string> = {
  factory: '[--ark-signal:var(--ark-color-facility-factory)]',
  trading: '[--ark-signal:var(--ark-color-facility-trading)]',
  power: '[--ark-signal:var(--ark-color-facility-power)]',
  neutral: '[--ark-signal:var(--ark-color-neutral-gray-400)]',
}

// 等级的小竖条最多画这么多颗；更高的等级仍然如实读给读屏
const MAX_PIPS = 5

export interface RoomCardProps extends Omit<ComponentProps<'div'>, 'title' | 'onClick'> {
  /** 设施名，如“制造站”。 */
  title: ReactNode
  /** 设施名后面的英文小字。实机的总览上没有，需要中英成对时再给。 */
  sub?: ReactNode
  /** 设施等级：标题后面几颗类型色的小竖条，几级就是几颗。 */
  level?: number
  /** 标题下面一行类型色的小字，说明设施现在在做什么，如“生产中”“获取中”。 */
  status?: ReactNode
  /**
   * 设施类型，决定这张卡片的类型色。不给就沿用所在位置的信号色。
   * - `factory`：制造站，黄
   * - `trading`：贸易站，蓝
   * - `power`：发电站，黄绿
   * - `neutral`：控制中枢、宿舍这类没有专属颜色的设施
   */
  kind?: RoomKind
  /** 标题前的图标，压在一块类型色的底上。组件库不带图标，请自备。 */
  icon?: ReactNode
  /** 房间内景的图片地址，垫在最底层并压暗。 */
  src?: string
  /**
   * 有待处理的事：整张卡片加一圈类型色的描边。`true` 时右上角是一个橙色的提醒标记
   * （有可收取的产出），数字是计数色块。
   */
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
 * 基建总览里的一个房间：深色的直角矩形，左侧一条类型色的粗边，标题后面是等级的小竖条，
 * 里面是这个设施的现状——进驻的干员、产出的进度。房间就是入口，不需要另设菜单。
 *
 * 类型色通过覆盖 `--ark-signal` 给出，所以放在里面的进度条、头像的加成圆环都跟着换。
 * `children` 是房间里的内容。有待处理的事时（`badge`）整张卡片被类型色圈起来。
 *
 * 给了 `href` 或 `onClick` 时整张卡片可点：点击区是盖在上面的一层，名称来自标题行，
 * 里面的内容仍然能被读屏逐项读到。卡片里另有需要单独点的东西时，给它加 `relative z-2`。
 */
export function RoomCard({
  title,
  sub,
  level,
  status,
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
  const pips = level === undefined ? 0 : Math.min(Math.max(0, Math.floor(level)), MAX_PIPS)

  return (
    <div
      data-ark="room-card"
      data-ark-tone="dark"
      data-kind={kind}
      {...rest}
      className={cn(
        // 左侧 0.75rem 的类型色粗边（实机 720p 下 12px），其余三边没有描边
        'group relative isolate box-border flex min-h-[5.3125rem] flex-col justify-between gap-ark-3 overflow-hidden border-0 border-l-[0.75rem] border-solid border-ark-signal bg-ark-neutral-ink-800 p-ark-3 font-ark-cjk-sans text-ark-fg',
        brighterMuted,
        kind !== undefined && roomSignal[kind],
        // 有待处理的事：补上另外三边，整张卡片被类型色圈起来
        hasBadge && 'shadow-[inset_0_0_0_2px_var(--ark-signal)]',
        // 悬停整块换色：底色染上类型色，仍然是不透明的
        clickable && [
          'hover:bg-[color-mix(in_srgb,var(--ark-signal)_25%,var(--ark-color-neutral-ink-800))]',
          colorTransition,
        ],
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

      <div className="grid gap-ark-1">
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
          {level !== undefined && (
            // 等级不写数字：几级就是几颗 3 × 9px 的小竖条。数字读给读屏
            <span className="flex shrink-0 items-center gap-0.5">
              <span className="sr-only">等级 {level}</span>
              {Array.from({ length: pips }, (_, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: 小竖条彼此相同，顺序不会变
                  key={index}
                  aria-hidden="true"
                  className="h-[0.5625rem] w-[0.1875rem] bg-ark-signal"
                />
              ))}
            </span>
          )}
          {sub != null && (
            <span className="min-w-0 truncate font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {sub}
            </span>
          )}
        </div>
        {status != null && (
          <span className="text-ark-caption leading-ark-solid font-ark-bold text-ark-signal-fg">
            {status}
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
