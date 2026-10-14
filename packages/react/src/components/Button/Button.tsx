import type { ComponentProps, ElementType, ReactNode } from 'react'
import { ChevronRightIcon } from '../../internal/icons'
import {
  type ControlSize,
  colorTransition,
  controlHeight,
  focusRing,
  hitAreaCoarse,
} from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Spinner } from '../Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'inverse' | 'danger'
export type ButtonSize = ControlSize

interface ButtonOwnProps {
  /**
   * 层级。
   * - `primary`：信号色实心块，一屏只放一个
   * - `secondary`：1px 描边，并列的次要操作
   * - `ghost`：没有底也没有边，工具栏、表格行里的操作
   * - `subtle`：灰底块，比描边更安静（READ MORE、筛选项）
   * - `inverse`：与所在的面明暗相反的色块，成对操作里要强调的那一个
   * - `danger`：红色实心块，删除一类不可撤回的操作
   * @default 'secondary'
   */
  variant?: ButtonVariant
  /**
   * 高度：`xs` 1.5rem、`sm` 2rem、`md` 2.5rem、`lg` 3rem、`xl` 3.75rem。
   * `xl` 是官网那条双语的长按钮：最小宽 14.375rem，文字贴左。
   * @default 'md'
   */
  size?: ButtonSize
  /** 第二行文字，通常是英文。它给色块加一条水平的底线。 */
  sub?: ReactNode
  /** 文字左边的图标。它对读屏隐藏：含义由文字给出。 */
  icon?: ReactNode
  /** 文字右边的图标，同样对读屏隐藏。 */
  iconEnd?: ReactNode
  /** 右端的折线箭头，表示点了会跳转。文字随之贴左。 */
  arrow?: boolean
  /** 选中态：整块明暗对调，同时输出 `aria-pressed`。仅 `<button>` 有效。 */
  selected?: boolean
  /** 正在处理：图标的位置换成旋转指示，按钮不再响应点击。仅 `<button>` 有效。 */
  loading?: boolean
  /** 切掉右上角。仅 `subtle` 有效。 */
  cut?: boolean
  /** 撑满容器宽度。 */
  block?: boolean
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ButtonOwnProps> & { href?: undefined; as?: undefined }
type ButtonAsAnchor = ButtonOwnProps &
  Omit<ComponentProps<'a'>, keyof ButtonOwnProps> & {
    href: string
    /**
     * 用来渲染链接的组件，接路由库的 `Link`。它要能接收 `href`、`className` 和子元素。
     * @default 'a'
     */
    as?: ElementType
  }

/** 传入 `href` 时渲染为 `<a>`（或 `as` 指定的组件），否则渲染为 `<button type="button">`。 */
export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const base = cn(
  'relative m-0 box-border inline-flex cursor-pointer appearance-none items-center border-0 font-ark-cjk-sans no-underline select-none',
  'motion-safe:active:translate-y-px',
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-ark-disabled disabled:text-ark-on-disabled',
  'aria-busy:cursor-progress',
  colorTransition,
  focusRing,
)

// xl 是官网实测：14.375rem × 3.75rem 的长条，文字贴左（1rem），箭头贴右（1.75rem）
const sizes: Record<ButtonSize, string> = {
  // 可见形状只有 24px 高，触屏上用 ::after 把点击区撑到 44px
  xs: cn('min-w-6 gap-ark-1 px-[0.625rem] py-0', hitAreaCoarse),
  sm: cn('min-w-8 gap-ark-2 px-ark-3 py-ark-1', hitAreaCoarse),
  md: cn('min-w-10 gap-ark-2 px-ark-4 py-ark-1', hitAreaCoarse),
  lg: 'min-w-12 gap-ark-3 px-ark-5 py-ark-2',
  xl: 'min-w-[14.375rem] gap-ark-4 py-ark-2 pr-[1.75rem] pl-ark-4',
}

const pressed =
  'aria-pressed:border-ark-invert aria-pressed:bg-ark-invert aria-pressed:text-ark-on-invert aria-pressed:hover:border-ark-signal aria-pressed:hover:bg-ark-signal aria-pressed:hover:text-ark-on-signal'

const surfaces: Record<ButtonVariant, string> = {
  primary: 'bg-ark-signal text-ark-on-signal hover:bg-ark-invert hover:text-ark-on-invert',
  // 实机的描边按钮（设置页的重置）底不是透明的，垫着很淡的一层
  secondary: cn(
    'border border-ark-rule-strong bg-ark-fg/5 text-ark-fg',
    'hover:border-ark-invert hover:bg-ark-invert hover:text-ark-on-invert',
    // 选中是整块明暗对调；已经反白的块悬停时换成信号色
    pressed,
  ),
  ghost: cn('bg-transparent text-ark-fg hover:bg-ark-fg/10 disabled:bg-transparent', pressed),
  subtle: cn('bg-ark-control text-ark-fg hover:bg-ark-invert hover:text-ark-on-invert', pressed),
  inverse: 'bg-ark-invert text-ark-on-invert hover:bg-ark-signal hover:text-ark-on-signal',
  danger: 'bg-ark-danger text-ark-on-danger hover:bg-ark-invert hover:text-ark-on-invert',
}

// 切角时背景搬到 ::before 上裁切，根元素不裁，焦点轮廓才不会缺一个角
const subtleCut = cn(
  'isolate bg-transparent text-ark-fg hover:text-ark-on-invert disabled:bg-transparent',
  'before:absolute before:inset-0 before:-z-1 before:bg-ark-control before:ark-cut-tr-sm',
  'before:transition-colors before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
  'hover:before:bg-ark-invert disabled:before:bg-ark-disabled',
)

// 主文字：色块上是粗体，描边和没有底的轻一档
const weight: Record<ButtonVariant, string> = {
  primary: 'font-ark-bold',
  secondary: 'font-ark-medium',
  ghost: 'font-ark-medium',
  subtle: 'font-ark-bold',
  inverse: 'font-ark-bold',
  danger: 'font-ark-bold',
}
const mainText: Record<ButtonSize, string> = {
  xs: 'text-ark-caption',
  sm: 'text-ark-label',
  md: 'text-ark-label',
  lg: 'text-ark-base',
  xl: 'text-ark-body-lg',
}
// 第二行：数据体粗体，比主文字小一档，最小 12px
const subText: Record<ButtonSize, string> = {
  xs: 'text-ark-caption',
  sm: 'text-ark-caption',
  md: 'text-ark-caption',
  lg: 'text-ark-caption',
  xl: 'text-ark-label',
}
const glyphSize: Record<ButtonSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
}

/**
 * 按钮是一块色面，不是一个胶囊：直角、平涂，悬停时整块换色。
 *
 * 一屏只放一个 `primary`。点了会花掉什么，直接写在按钮文字里。
 * 成对的操作位置固定：取消在左、确认在右。
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'secondary',
    size = 'md',
    sub,
    icon,
    iconEnd,
    arrow = false,
    selected,
    loading = false,
    cut = false,
    block = false,
    className,
    children,
    ...rest
  } = props

  // 有箭头时文字和箭头分在两头；xl 的长条文字始终贴左（官网的写法）
  const leftAligned = arrow || size === 'xl'

  const classes = cn(
    base,
    controlHeight[size],
    sizes[size],
    leftAligned ? 'justify-between' : 'justify-center',
    variant === 'subtle' && cut ? subtleCut : surfaces[variant],
    block && 'flex w-full',
    className,
  )

  const text = (
    <span
      className={cn(
        'grid gap-ark-1',
        leftAligned ? 'justify-items-start text-left' : 'justify-items-center text-center',
      )}
    >
      <span className={cn('leading-ark-solid', weight[variant], mainText[size])}>{children}</span>
      {sub != null && (
        <span className={cn('font-ark-data leading-ark-solid font-ark-bold', subText[size])}>
          {sub}
        </span>
      )}
    </span>
  )

  const slot = (node: ReactNode) => (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center [&>svg]:block [&>svg]:size-full',
        glyphSize[size],
      )}
    >
      {node}
    </span>
  )
  const lead = loading ? (
    <Spinner inherit size={size === 'xs' || size === 'sm' ? 'sm' : 'md'} />
  ) : icon != null && icon !== false ? (
    slot(icon)
  ) : null

  const content = (
    <>
      {lead != null ? (
        // 图标紧挨着文字，比文字到箭头的距离近
        <span className="inline-flex items-center gap-ark-2">
          {lead}
          {text}
        </span>
      ) : (
        text
      )}
      {iconEnd != null && iconEnd !== false && slot(iconEnd)}
      {arrow && (
        <ChevronRightIcon
          className={cn(
            'ml-auto shrink-0',
            size === 'xl' ? 'h-4 w-2' : size === 'lg' ? 'h-3.5 w-[0.4375rem]' : 'h-3 w-1.5',
          )}
        />
      )}
    </>
  )

  if (rest.href !== undefined) {
    const { as: Link = 'a', ...anchor } = rest
    return (
      <Link data-ark="button" {...anchor} className={classes}>
        {content}
      </Link>
    )
  }
  const { as: _, onClick, ...button } = rest
  return (
    <button
      data-ark="button"
      type="button"
      aria-pressed={selected}
      // 处理中不用 disabled：按钮保持原来的颜色，也仍然能被聚焦，读屏读得到“忙”
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...button}
      onClick={loading ? event => event.preventDefault() : onClick}
      className={classes}
    >
      {content}
    </button>
  )
}
