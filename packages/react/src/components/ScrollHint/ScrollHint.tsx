import type { ComponentProps } from 'react'
import { ScrollArrowIcon } from '../../internal/icons'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type ScrollHintDirection = 'down' | 'up'

interface ScrollHintOwnProps {
  /**
   * 可交互时的名称，读屏会念出来。有文字（`children`）时默认用那行文字，
   * 否则是“向下滚动”（`up` 时是“向上滚动”）。
   */
  label?: string
  /**
   * 箭头朝哪边。
   * - `down`：一行字加一个向下的箭头，1.5 秒一轮——淡入、停住、下移并淡出
   * - `up`：最后一屏用的，只剩一个向上的箭头，2 秒明灭一次，不位移
   * @default 'down'
   */
  direction?: ScrollHintDirection
}

type ScrollHintAsAnchor = ScrollHintOwnProps &
  Omit<ComponentProps<'a'>, keyof ScrollHintOwnProps> & { href: string }
type ScrollHintAsButton = ScrollHintOwnProps &
  Omit<ComponentProps<'button'>, keyof ScrollHintOwnProps> & { href?: undefined }

/**
 * 给 `href` 渲染为 `<a>`；给 `onClick` 渲染为 `<button type="button">`；
 * 两样都不给就只是一个装饰用的 `<span>`。
 */
export type ScrollHintProps = ScrollHintAsAnchor | ScrollHintAsButton

const base = 'box-border inline-grid justify-items-center select-none'

// 可见的部分只有两行，点击区撑到 44 × 44
const interactive = cn(
  'm-0 min-h-11 min-w-11 cursor-pointer appearance-none content-center border-0 bg-transparent p-0 text-ark-fg no-underline hover:text-ark-signal-fg',
  colorTransition,
  focusRing,
)

const motions: Record<ScrollHintDirection, string> = {
  down: 'motion-safe:animate-ark-scroll-hint',
  up: 'motion-safe:animate-ark-pulse',
}

/**
 * 滚动提示：固定骨架底部正中，一行 `SCROLL` 加一个向下的箭头，告诉用户下面还有一屏。
 * 取值出自官网（实测）：字是宽体 0.75rem，箭头是两根不相连的粗条，2.68rem × 1.25rem；
 * 整组 1.5 秒一轮地淡入、停住、下移淡出。位置由使用方决定（`Shell` 会把它放在底部居中）。
 *
 * 默认只是装饰，对读屏隐藏，颜色是官网中间几屏用的 `#585858`（首屏是信号色，用 `className` 换）。
 * 给了 `href` 或 `onClick` 就成为“去下一屏”的入口，这时用前景色——`#585858` 压在黑底上不到 3:1。
 * `children` 是箭头上方那行字，默认 `SCROLL`，传 `null` 去掉。动效在“减少动效”下停住。
 */
export function ScrollHint(props: ScrollHintProps) {
  const { label, direction = 'down', className, children: text, ...rest } = props
  // 向上的那一种官网没有字
  const children = text === undefined && direction === 'down' ? 'SCROLL' : text
  const hasText = children != null && children !== false
  // 有可见文字时名称就用它，避免读到的和看到的不一致
  const name = label ?? (hasText ? undefined : direction === 'up' ? '向上滚动' : '向下滚动')

  const content = (
    // 字和箭头是一组，一起淡入淡出
    <span
      data-ark="scroll-hint-body"
      className={cn('inline-grid justify-items-center gap-[0.25rem]', motions[direction])}
    >
      {hasText && (
        <span className="font-ark-latin-wide text-ark-caption leading-ark-solid font-ark-medium">
          {children}
        </span>
      )}
      <ScrollArrowIcon
        className={cn('block h-5 w-[2.68rem]', direction === 'up' && '-scale-y-100')}
      />
    </span>
  )

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest
    return (
      <a
        data-ark="scroll-hint"
        data-direction={direction}
        href={href}
        aria-label={name}
        {...anchorProps}
        className={cn(base, interactive, className)}
      >
        {content}
      </a>
    )
  }
  if (rest.onClick !== undefined) {
    return (
      <button
        data-ark="scroll-hint"
        data-direction={direction}
        type="button"
        aria-label={name}
        {...rest}
        className={cn(base, interactive, className)}
      >
        {content}
      </button>
    )
  }
  // 没有交互时剩下的都是通用属性，按 span 透传
  const { href: _href, ...spanProps } = rest as ComponentProps<'span'> & { href?: undefined }
  return (
    <span
      data-ark="scroll-hint"
      data-direction={direction}
      aria-hidden="true"
      {...spanProps}
      className={cn(base, 'pointer-events-none text-ark-neutral-gray-600', className)}
    >
      {content}
    </span>
  )
}
