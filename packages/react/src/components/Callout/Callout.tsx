import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing, hitArea } from '../../utils/classes'
import { cn } from '../../utils/cn'

export interface CalloutProps extends ComponentProps<'span'> {
  /**
   * 选中：小方框和灰字换成一块黑底信号色字的标签。官网点开某个物件之后就是这样。
   * @default false
   */
  active?: boolean
  /**
   * 选中时放在标签上面的图标块（官网是一块 4.875rem 宽的信号色图标）。只在 `active` 时显示，
   * 对读屏隐藏——含义由标签的文字给出。
   */
  icon?: ReactNode
  /** 给了就把标注渲染成链接：标注本身可以是导航入口。 */
  href?: string
  /** 链接的 `target`，仅在有 `href` 时有效。 */
  target?: string
  /** 链接的 `rel`，仅在有 `href` 时有效。 */
  rel?: string
}

const body =
  'relative box-border inline-flex items-center font-ark-latin-condensed font-ark-medium whitespace-nowrap no-underline'

// 待机：窄体 0.875rem 的灰字，前面一个带斜杠的小方框
const idle = 'text-ark-label leading-ark-solid text-ark-fg-muted'

// 选中的标签是固定的黑底信号色字，不随明暗上下文翻转
const tag =
  'box-border min-w-full bg-ark-neutral-black pr-ark-2 pl-ark-1 text-ark-body-lg leading-ark-snug text-ark-signal'

/**
 * 在图片或场景上做标注。两种状态，取值都出自官网的泰拉万象屏（实测）：
 *
 * - 待机：一个 1rem 见方、2px 描边的小方框，里面一道 45° 的斜杠，右边一行窄体灰字。
 *   是链接时悬停变成前景色。
 * - 选中（`active`）：换成黑底信号色字的标签，上面可以放一块图标。
 *
 * 没有引线：标注直接摆在物件旁边。用 `className` 定位（如 `absolute left-1/3 top-1/2`），
 * 定的是小方框左上角的位置。
 */
export function Callout({
  active = false,
  icon,
  href,
  target,
  rel,
  className,
  children,
  ...rest
}: CalloutProps) {
  const content = active ? (
    <>
      {icon != null && icon !== false && (
        <span
          aria-hidden="true"
          className="block w-[4.875rem] [&>img]:block [&>img]:w-full [&>svg]:block [&>svg]:w-full"
        >
          {icon}
        </span>
      )}
      <span className={tag}>{children}</span>
    </>
  ) : (
    <>
      {/* 描边画在盒子外面，里面正好 1rem；斜杠是一根 2px 的竖条斜切 45° */}
      <span
        aria-hidden="true"
        className="mr-ark-3 box-content grid size-4 shrink-0 place-items-center rounded-ark-subtle border-2 border-current before:block before:h-3/4 before:w-0.5 before:skew-x-[45deg] before:bg-current"
      />
      {children}
    </>
  )

  // 选中时标签自己定颜色；外层给一个前景色，免得链接露出浏览器默认的蓝
  const classes = cn(body, active ? 'flex-col items-start text-ark-fg' : idle)

  return (
    <span
      data-ark="callout"
      data-active={active ? '' : undefined}
      {...rest}
      className={cn('relative box-border inline-flex', className)}
    >
      {href !== undefined ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(
            classes,
            !active && 'hover:text-ark-fg',
            colorTransition,
            focusRing,
            // 一行字只有 14px 高，点击区撑到 44px
            !active && hitArea,
          )}
        >
          {content}
        </a>
      ) : (
        <span className={classes}>{content}</span>
      )}
    </span>
  )
}
