import type { ComponentProps } from 'react'
import { ChevronDownIcon } from '../../internal/icons'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

interface ScrollHintOwnProps {
  /**
   * 可交互时的名称，读屏会念出来。有文字（`children`）时默认用那行文字，否则是“向下滚动”。
   */
  label?: string
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

const base = 'box-border inline-grid justify-items-center gap-ark-2 select-none'

// 可见的箭头只有 12px 高，点击区撑到 44 × 44
const interactive = cn(
  'm-0 min-h-11 min-w-11 cursor-pointer appearance-none content-center border-0 bg-transparent p-0 text-ark-fg no-underline hover:text-ark-signal-fg',
  colorTransition,
  focusRing,
)

/**
 * 滚动提示：固定骨架底部正中一个向下的小箭头，缓慢地上下往复，告诉用户下面还有一屏。
 * 位置由使用方决定（`Shell` 会把它放在底部居中）。
 *
 * 默认只是装饰，对读屏隐藏。给了 `href` 或 `onClick` 就成为“去下一屏”的入口。
 * `children` 可以在箭头上方放一行小字，如 `SCROLL`。往复的位移在“减少动效”下停住。
 */
export function ScrollHint(props: ScrollHintProps) {
  const { label, className, children, ...rest } = props
  const hasText = children != null && children !== false
  // 有可见文字时名称就用它，避免读到的和看到的不一致
  const name = label ?? (hasText ? undefined : '向下滚动')

  const content = (
    <>
      {hasText && (
        <span className="font-ark-data text-ark-caption leading-ark-solid font-ark-regular tracking-ark-wide uppercase">
          {children}
        </span>
      )}
      {/* 2s 往复（官网实测 1.5–2s） */}
      <ChevronDownIcon className="block size-6 motion-safe:animate-ark-bob" />
    </>
  )

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest
    return (
      <a
        data-ark="scroll-hint"
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
      aria-hidden="true"
      {...spanProps}
      className={cn(base, 'pointer-events-none text-ark-fg/70', className)}
    >
      {content}
    </span>
  )
}
