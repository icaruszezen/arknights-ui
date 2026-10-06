import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type ActionButtonVariant = 'signal' | 'paper'

interface ActionButtonOwnProps {
  /** 点了会花掉什么：消耗的理智、合成玉。数字自动加千分位，字符串原样输出。 */
  cost: number | string
  /** 代价上方的小标签，说明花的是什么（`SANITY`、合成玉）。 */
  costLabel?: ReactNode
  /** 动作下方的第二行，通常是英文。 */
  sub?: ReactNode
  /**
   * - `signal`：主色块，一屏只放一个
   * - `paper`：浅色块，两个行动按钮并排时给次要的那个（“寻访一次”）
   * @default 'signal'
   */
  variant?: ActionButtonVariant
  /** 撑满容器宽度。 */
  block?: boolean
}

type ActionButtonAsButton = ActionButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ActionButtonOwnProps> & { href?: undefined }
type ActionButtonAsAnchor = ActionButtonOwnProps &
  Omit<ComponentProps<'a'>, keyof ActionButtonOwnProps> & { href: string }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<button type="button">`。`children` 是动作。 */
export type ActionButtonProps = ActionButtonAsButton | ActionButtonAsAnchor

// 两块的底色都从 --ark-action 派生：右块就是它，左块是它压暗 20%。
// 悬停、禁用时只改这一个变量，两块一起换色。
const base = cn(
  // 不换行：按钮被外层按最小内容宽度排版时，中文会被逐字折行，把按钮撑高
  'relative m-0 box-border inline-flex min-h-16 cursor-pointer appearance-none items-stretch border-0 bg-transparent p-0 text-left whitespace-nowrap no-underline select-none',
  'motion-safe:active:translate-y-px',
  'disabled:cursor-not-allowed disabled:[--ark-action:var(--ark-color-neutral-ink-700)] disabled:text-ark-neutral-gray-500',
  colorTransition,
  focusRing,
)

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

/**
 * 游戏内的行动按钮由深浅两块拼成：左边一块深色写代价，右边一块主色写动作。
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
    block = false,
    className,
    children,
    ...rest
  } = props

  const classes = cn(base, variants[variant], block && 'flex w-full', className)

  const content = (
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
        {sub != null && (
          <span className="font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide opacity-80">
            {sub}
          </span>
        )}
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
