import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type ActionButtonVariant = 'signal' | 'paper'
export type ActionButtonLayout = 'stacked' | 'inline'

interface ActionButtonOwnProps {
  /** 点了会花掉什么：消耗的理智、合成玉。数字自动加千分位，字符串原样输出。 */
  cost: number | string
  /** 代价旁边的小标签，说明花的是什么（`SANITY`、合成玉）。 */
  costLabel?: ReactNode
  /** 动作下方的第二行，通常是英文。 */
  sub?: ReactNode
  /**
   * - `signal`：主色块，一屏只放一个
   * - `paper`：浅色块，两个行动按钮并排时给次要的那个（“寻访一次”）
   * @default 'signal'
   */
  variant?: ActionButtonVariant
  /**
   * 两块怎么拼。
   * - `stacked`：上面一块主色写动作，下面一条深色带写代价（实机“开始行动”的写法）
   * - `inline`：左边一块深色写代价，右边一块主色写动作，用在横向放不下两行的地方
   * @default 'stacked'
   */
  layout?: ActionButtonLayout
  /** 撑满容器宽度。 */
  block?: boolean
}

type ActionButtonAsButton = ActionButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ActionButtonOwnProps> & { href?: undefined }
type ActionButtonAsAnchor = ActionButtonOwnProps &
  Omit<ComponentProps<'a'>, keyof ActionButtonOwnProps> & { href: string }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<button type="button">`。`children` 是动作。 */
export type ActionButtonProps = ActionButtonAsButton | ActionButtonAsAnchor

// 主色块的底色出自 --ark-action。悬停、禁用时只改这一个变量；
// inline 布局里左块是它压暗 20%，两块一起换色。
const base = cn(
  // 不换行：按钮被外层按最小内容宽度排版时，中文会被逐字折行，把按钮撑高
  'group/action relative m-0 box-border inline-flex cursor-pointer appearance-none items-stretch border-0 bg-transparent p-0 text-left whitespace-nowrap no-underline select-none',
  'motion-safe:active:translate-y-px',
  'disabled:cursor-not-allowed disabled:[--ark-action:var(--ark-color-neutral-ink-700)] disabled:text-ark-neutral-gray-500',
  colorTransition,
  focusRing,
)

const layouts: Record<ActionButtonLayout, string> = {
  // 实机裁图（1280×720）里是 207 × 74px：上块 52px，下面的代价带 22px
  stacked: 'min-w-52 flex-col',
  inline: 'min-h-16',
}

const variants: Record<ActionButtonVariant, string> = {
  signal: cn(
    '[--ark-action:var(--ark-signal)] text-ark-on-signal',
    'hover:[--ark-action:var(--ark-invert)] hover:text-ark-on-invert',
  ),
  paper: cn(
    '[--ark-action:var(--ark-color-neutral-paper)] text-ark-neutral-paper-ink',
    'hover:[--ark-action:var(--ark-signal)] hover:text-ark-on-signal',
  ),
}

const subText =
  'font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide opacity-80'

/**
 * 游戏内的行动按钮由两块拼成：上面一块主色写动作，下面一条深色带写代价。
 * “开始行动 -18”“寻访十次 6,000”——点了会花掉什么直接印在按钮上，不需要再读别处。
 *
 * 换主色不用新属性，在按钮或它的祖先上覆盖 `--ark-signal` 即可。
 */
export function ActionButton(props: ActionButtonProps) {
  const {
    cost,
    costLabel,
    sub,
    variant = 'signal',
    layout = 'stacked',
    block = false,
    className,
    children,
    ...rest
  } = props

  const classes = cn(base, layouts[layout], variants[variant], block && 'flex w-full', className)

  const content =
    layout === 'stacked' ? (
      <>
        <span
          className={cn(
            'box-border grid min-h-13 grow content-center justify-items-center gap-ark-1 bg-(--ark-action) px-ark-5 py-ark-2',
            colorTransition,
          )}
        >
          <span className="font-ark-cjk-sans text-ark-h2 leading-ark-solid font-ark-bold">
            {children}
          </span>
          {sub != null && <span className={subText}>{sub}</span>}
        </span>
        {/* 代价带是固定的深色，不跟着主色块换色；数字贴右 */}
        <span className="box-border flex h-5.5 shrink-0 items-center justify-end gap-ark-2 bg-ark-neutral-ink-800 px-ark-3 text-ark-neutral-white group-disabled/action:text-ark-neutral-gray-500">
          {costLabel != null && (
            <span className="font-ark-data text-ark-caption leading-ark-solid font-ark-regular">
              {costLabel}
            </span>
          )}
          <span className="font-ark-data text-ark-label leading-ark-solid font-ark-bold">
            {formatStatValue(cost)}
          </span>
        </span>
      </>
    ) : (
      <>
        <span
          className={cn(
            'box-border grid min-w-16 shrink-0 content-center justify-items-center gap-ark-1 bg-[color-mix(in_srgb,var(--ark-action)_80%,black)] px-ark-3',
            colorTransition,
          )}
        >
          {costLabel != null && (
            <span className="font-ark-data text-ark-caption leading-ark-solid font-ark-regular">
              {costLabel}
            </span>
          )}
          <span className="font-ark-data text-ark-nav leading-ark-solid font-ark-bold">
            {formatStatValue(cost)}
          </span>
        </span>
        <span
          className={cn(
            'box-border grid grow content-center gap-ark-1 bg-(--ark-action) px-ark-5',
            colorTransition,
          )}
        >
          <span className="font-ark-cjk-sans text-ark-nav leading-ark-solid font-ark-bold">
            {children}
          </span>
          {sub != null && <span className={subText}>{sub}</span>}
        </span>
      </>
    )

  if (rest.href !== undefined) {
    return (
      <a data-ark="action-button" {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <button data-ark="action-button" type="button" {...rest} className={classes}>
      {content}
    </button>
  )
}
