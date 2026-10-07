import type { ComponentProps, ReactNode } from 'react'
import { CheckCircleIcon, ChevronRightIcon, CloseCircleIcon } from '../../internal/icons'
import { colorTransition, focusRing, hitArea } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'weak'
  | 'confirm'
  | 'cancel'
  | 'paper'
  | 'graphite'

interface ButtonOwnProps {
  /**
   * 层级。
   * - `primary`：信号色实心块，一屏只放一个
   * - `secondary`：1px 描边，并列的次要操作
   * - `weak`：灰底小条，只放一行小号英文（READ MORE）
   * - `confirm` / `cancel`：游戏内成对出现的确认与取消——确认是暗红块，取消是黑色块
   * - `paper` / `graphite`：浅 / 深色块，跟着所在面板的明暗用
   * @default 'secondary'
   */
  variant?: ButtonVariant
  /** 第二行文字，通常是英文。它给色块加一条水平的底线。 */
  sub?: ReactNode
  /**
   * 文字左边的图标。它对读屏隐藏：含义由文字给出。
   * `confirm` 默认是圆圈对勾，`cancel` 默认是圆圈叉；传 `null` 去掉。
   */
  icon?: ReactNode
  /** 右端的折线箭头，表示点了会跳转。 */
  arrow?: boolean
  /** 选中态：整块明暗对调，同时输出 `aria-pressed`。仅 `<button>` 有效。 */
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
// 官网实测：14.375rem × 3.75rem 的长条，文字贴左（1rem），箭头贴右（1.75rem）
const wide = 'min-h-[3.75rem] min-w-[14.375rem] gap-ark-4 py-ark-2 pr-[1.75rem] pl-ark-4'
// 官网实测：7.625rem × 1.5rem。可见形状只有 24px 高，用 ::after 把点击区撑到 44px
const compact = cn('h-6 min-w-[7.625rem] gap-ark-2 px-[0.625rem] py-0', hitArea)

const sizes: Record<ButtonVariant, string> = {
  primary: wide,
  secondary: regular,
  weak: compact,
  confirm: regular,
  cancel: regular,
  paper: regular,
  graphite: regular,
}

const surfaces: Record<ButtonVariant, string> = {
  primary:
    'justify-between bg-ark-signal text-ark-on-signal hover:bg-ark-invert hover:text-ark-on-invert',
  secondary: cn(
    'justify-center border border-ark-rule-strong bg-transparent text-ark-fg',
    'hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
    // 选中是整块明暗对调（实机的“代理指挥”）；已经反白的块悬停时换成信号色
    'aria-pressed:border-ark-invert aria-pressed:bg-ark-invert aria-pressed:text-ark-on-invert',
    'aria-pressed:hover:border-ark-signal aria-pressed:hover:bg-ark-signal aria-pressed:hover:text-ark-on-signal',
  ),
  weak: 'justify-between bg-ark-neutral-gray-600 text-ark-neutral-gray-300 hover:bg-ark-invert hover:text-ark-on-invert',
  // 暗红和黑是固定语义（实机弹窗取色），不跟随可替换的信号色，也不跟随明暗上下文
  confirm:
    'justify-center bg-ark-signal-confirm text-ark-neutral-white hover:bg-ark-neutral-white hover:text-ark-neutral-black',
  cancel:
    'justify-center bg-ark-neutral-ink-950 text-ark-neutral-white hover:bg-ark-neutral-white hover:text-ark-neutral-black',
  paper:
    'justify-center bg-ark-neutral-paper text-ark-neutral-paper-ink hover:bg-ark-signal hover:text-ark-on-signal',
  graphite:
    'justify-center bg-ark-neutral-graphite text-ark-neutral-white hover:bg-ark-neutral-gray-400 hover:text-ark-neutral-black',
}

// 切角时背景搬到 ::before 上裁切，根元素不裁，焦点轮廓才不会缺一个角
const weakCut = cn(
  'isolate justify-between bg-transparent text-ark-neutral-gray-300 hover:text-ark-on-invert disabled:bg-transparent',
  'before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-gray-600 before:ark-cut-tr-sm',
  'before:transition-colors before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
  'hover:before:bg-ark-invert disabled:before:bg-ark-neutral-ink-700',
)

const blockText = 'font-ark-cjk-sans text-ark-body leading-ark-solid font-ark-bold'
const mainText: Record<ButtonVariant, string> = {
  primary: 'font-ark-cjk-sans text-ark-body-lg leading-ark-solid font-ark-bold',
  secondary: 'font-ark-cjk-sans text-[1rem] leading-ark-solid font-ark-regular',
  weak: 'font-ark-data text-ark-label leading-ark-solid font-ark-bold',
  confirm: blockText,
  cancel: blockText,
  paper: blockText,
  graphite: blockText,
}

const dataSub = 'font-ark-data text-ark-label leading-ark-solid font-ark-bold'
// 70%：再淡一档（60%）在纸白块上只有 3.72:1
const condensedSub =
  'font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide opacity-70'
const subText: Record<ButtonVariant, string> = {
  primary: dataSub,
  secondary: dataSub,
  weak: dataSub,
  confirm: condensedSub,
  cancel: condensedSub,
  paper: condensedSub,
  graphite: condensedSub,
}

// 实机里确认与取消各有固定的图形，文字可有可无
const defaultIcon: Partial<Record<ButtonVariant, ReactNode>> = {
  confirm: <CheckCircleIcon />,
  cancel: <CloseCircleIcon />,
}

const leftAligned: Record<ButtonVariant, boolean> = {
  primary: true,
  secondary: false,
  weak: true,
  confirm: false,
  cancel: false,
  paper: false,
  graphite: false,
}

/**
 * 按钮是一块色面，不是一个胶囊：直角、平涂，悬停时整块换色。
 *
 * 一屏只放一个 `primary`。点了会花掉什么，直接写在按钮文字里。
 * 确认与取消成对出现时用 `confirm` 和 `cancel`：取消在左、确认在右，位置固定。
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'secondary',
    sub,
    icon,
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
    sizes[variant],
    variant === 'weak' && cut ? weakCut : surfaces[variant],
    block && 'flex w-full',
    className,
  )

  const text = (
    <span
      className={cn(
        'grid gap-ark-1',
        leftAligned[variant] ? 'justify-items-start text-left' : 'justify-items-center text-center',
      )}
    >
      <span className={mainText[variant]}>{children}</span>
      {sub != null && <span className={subText[variant]}>{sub}</span>}
    </span>
  )

  const glyph = icon === undefined ? defaultIcon[variant] : icon

  const content = (
    <>
      {glyph != null && glyph !== false ? (
        // 图标紧挨着文字，比文字到箭头的距离近
        <span className="inline-flex items-center gap-ark-2">
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
          >
            {glyph}
          </span>
          {text}
        </span>
      ) : (
        text
      )}
      {arrow && (
        <ChevronRightIcon
          className={cn('ml-auto shrink-0', variant === 'weak' ? 'h-3.5 w-[0.4375rem]' : 'h-4 w-2')}
        />
      )}
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
