import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing, hitArea, triangleRight } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'weak' | 'paper' | 'graphite'

interface ButtonOwnProps {
  /**
   * 层级。
   * - `primary`：信号色实心块，一屏只放一个
   * - `secondary`：1px 描边，并列的次要操作
   * - `weak`：灰底小条，只放一行小号英文（READ MORE）
   * - `paper` / `graphite`：浅 / 深色块，成对出现时确认用浅、取消用深
   * @default 'secondary'
   */
  variant?: ButtonVariant
  /** 第二行文字，通常是英文。它给色块加一条水平的底线。 */
  sub?: ReactNode
  /** 右侧的方向三角，表示点了会跳转。 */
  arrow?: boolean
  /** 选中态：信号色描边加底部 4px 条，同时输出 `aria-pressed`。仅 `<button>` 有效。 */
  selected?: boolean
  /** 切掉右上角。仅 `weak` 有效。 */
  cut?: boolean
  /** 撑满容器宽度。 */
  block?: boolean
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ButtonOwnProps> & { href?: undefined }
type ButtonAsAnchor = ButtonOwnProps &
  Omit<ComponentProps<'a'>, keyof ButtonOwnProps> & { href: string }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<button type="button">`。 */
export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const base = cn(
  'relative m-0 box-border inline-flex cursor-pointer appearance-none items-center border-0 no-underline select-none',
  'motion-safe:active:translate-y-px',
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-ark-neutral-ink-700 disabled:text-ark-neutral-gray-500',
  colorTransition,
  focusRing,
)

const regular = 'min-h-11 min-w-11 gap-ark-4 px-ark-5 py-ark-3'
// 可见形状只有 22px 高，用 ::after 把点击区撑到 44px
const compact = cn('gap-ark-2 px-ark-2 py-ark-1', hitArea)

const surfaces: Record<ButtonVariant, string> = {
  primary:
    'justify-between bg-ark-signal text-ark-on-signal hover:bg-ark-invert hover:text-ark-on-invert',
  secondary: cn(
    'justify-center border border-ark-rule-strong bg-transparent text-ark-fg',
    'hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
    'aria-pressed:border-ark-signal-fg aria-pressed:text-ark-signal-fg aria-pressed:shadow-[inset_0_-4px_0_var(--ark-signal)]',
    'aria-pressed:hover:border-ark-invert aria-pressed:hover:text-ark-on-invert',
  ),
  weak: 'bg-ark-neutral-gray-600 text-ark-neutral-gray-300 hover:bg-ark-invert hover:text-ark-on-invert',
  paper:
    'justify-center bg-ark-neutral-paper text-ark-neutral-paper-ink hover:bg-ark-signal hover:text-ark-on-signal',
  graphite:
    'justify-center bg-ark-neutral-graphite text-ark-neutral-white hover:bg-ark-neutral-gray-400 hover:text-ark-neutral-black',
}

// 切角时背景搬到 ::before 上裁切，根元素不裁，焦点轮廓才不会缺一个角
const weakCut = cn(
  'isolate bg-transparent text-ark-neutral-gray-300 hover:text-ark-on-invert disabled:bg-transparent',
  'before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-gray-600 before:ark-cut-tr-sm',
  'before:transition-colors before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
  'hover:before:bg-ark-invert disabled:before:bg-ark-neutral-ink-700',
)

const mainText: Record<ButtonVariant, string> = {
  primary: 'font-ark-cjk-sans text-ark-body-lg leading-ark-solid font-ark-bold',
  secondary: 'font-ark-cjk-sans text-[1rem] leading-ark-solid font-ark-regular',
  weak: 'font-ark-data text-ark-label leading-ark-solid font-ark-bold',
  paper: 'font-ark-cjk-sans text-ark-body leading-ark-solid font-ark-bold',
  graphite: 'font-ark-cjk-sans text-ark-body leading-ark-solid font-ark-bold',
}

const dataSub = 'font-ark-data text-ark-label leading-ark-solid font-ark-bold'
// 70%：再淡一档（60%）在纸白块上只有 3.72:1
const condensedSub =
  'font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide opacity-70'
const subText: Record<ButtonVariant, string> = {
  primary: dataSub,
  secondary: dataSub,
  weak: dataSub,
  paper: condensedSub,
  graphite: condensedSub,
}

const leftAligned: Record<ButtonVariant, boolean> = {
  primary: true,
  secondary: false,
  weak: true,
  paper: false,
  graphite: false,
}

/**
 * 按钮是一块色面，不是一个胶囊：直角、平涂，悬停时整块换色。
 *
 * 一屏只放一个 `primary`。点了会花掉什么，直接写在按钮文字里。
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'secondary',
    sub,
    arrow = false,
    selected,
    cut = false,
    block = false,
    className,
    children,
    ...rest
  } = props

  const classes = cn(
    base,
    variant === 'weak' ? compact : regular,
    variant === 'weak' && cut ? weakCut : surfaces[variant],
    block && 'flex w-full',
    className,
  )

  const content = (
    <>
      <span
        className={cn(
          'grid gap-ark-1',
          leftAligned[variant]
            ? 'justify-items-start text-left'
            : 'justify-items-center text-center',
        )}
      >
        <span className={mainText[variant]}>{children}</span>
        {sub != null && <span className={subText[variant]}>{sub}</span>}
      </span>
      {arrow && <span aria-hidden="true" className={triangleRight} />}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a data-ark="button" {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <button data-ark="button" type="button" aria-pressed={selected} {...rest} className={classes}>
      {content}
    </button>
  )
}
