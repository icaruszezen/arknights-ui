import type { ComponentProps, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type QuickNavProps = ComponentProps<'nav'>

/**
 * 快捷导航条：一条黑色半透明的横条，从任意页面直接跳到任何一个系统，不必先回到主界面。
 * 通常放进 `BackHome`，由主页按钮展开，平时不占空间；也可以单独常驻。
 *
 * 子元素是若干个 `QuickNavItem`。请用 `aria-label` 说明这是哪一组导航。
 */
export function QuickNav({ className, children, ...rest }: QuickNavProps) {
  return (
    <nav
      data-ark="quick-nav"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        'box-border inline-block max-w-full border border-ark-neutral-white/20 bg-ark-neutral-black/85 font-ark-cjk-sans text-ark-fg',
        className,
      )}
    >
      {/* 放不下时横向滚动，而不是把每一项缩小到看不清 */}
      <ul className="m-0 flex list-none overflow-x-auto p-0">
        {toItems(children).map(({ key, child }) => (
          <li key={key} className="flex shrink-0">
            {child}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export interface QuickNavItemProps extends Omit<ComponentProps<'a'>, 'aria-current'> {
  /** 跳到哪里。 */
  href: string
  /** 中文下面的英文小字。 */
  sub?: ReactNode
  /** 当前所在的系统。`true` 输出 `aria-current="page"`，也可以指定 `'location'`。 */
  current?: boolean | 'page' | 'location'
}

/** 快捷导航里的一项：中文加英文小字。当前项是信号色加一条底条，不只靠颜色区分。 */
export function QuickNavItem({
  sub,
  current = false,
  className,
  children,
  ...rest
}: QuickNavItemProps) {
  const isCurrent = current !== false
  return (
    <a
      data-ark="quick-nav-item"
      aria-current={current === true ? 'page' : current || undefined}
      {...rest}
      className={cn(
        'group relative box-border grid h-16 min-w-18 content-center justify-items-center gap-ark-1 px-ark-4 no-underline',
        isCurrent ? 'text-ark-signal-fg' : 'text-ark-fg hover:text-ark-signal-fg',
        isCurrent &&
          'after:absolute after:inset-x-ark-2 after:bottom-0 after:h-(--ark-line-strong) after:bg-ark-signal',
        colorTransition,
        // 横条会裁掉溢出的部分，轮廓画在内侧
        focusRingInset,
        className,
      )}
    >
      <span className="text-[1rem] leading-ark-solid font-ark-bold whitespace-nowrap">
        {children}
      </span>
      {sub != null && (
        <span
          className={cn(
            'font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide whitespace-nowrap uppercase',
            !isCurrent && ['text-ark-fg-muted group-hover:text-ark-signal-fg', colorTransition],
          )}
        >
          {sub}
        </span>
      )}
    </a>
  )
}
