import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { GhostTitle } from '../GhostTitle'
import { Pattern } from '../Pattern'
import { ScrollHint } from '../ScrollHint'

export type ShellContentElement = 'main' | 'div' | 'section'

export interface ShellProps extends ComponentProps<'div'> {
  /** 顶栏最左：站点的标识。 */
  logo?: ReactNode
  /** 顶栏靠右：主导航，通常是一个 `Nav`。 */
  nav?: ReactNode
  /** 右栏顶端，与顶栏同高：分享、音频、账号这类小按钮。 */
  actions?: ReactNode
  /** 右栏中部：这一屏的计数，通常是一个 `Counter`。它最先更新，告诉用户到了第几屏。 */
  counter?: ReactNode
  /** 右栏底部：下载、社交这类常驻入口。 */
  aside?: ReactNode
  /** 背景巨字：这一屏的英文名，垫在内容区的左下角。 */
  ghost?: ReactNode
  /** 底部正中的滚动提示。`true` 用默认的 `ScrollHint`，也可以传一个自己的（比如带链接的）。 */
  scrollHint?: boolean | ReactNode
  /**
   * 背景底纹：整面的斜线网格，加左下角一片半调网点。
   * @default true
   */
  pattern?: boolean
  /**
   * 内容区渲染成哪个元素。页面上已经有 `<main>` 时改成 `div`。
   * @default 'main'
   */
  contentAs?: ShellContentElement
}

// 顶栏下缘和内容区下缘的两条横线，比右栏的竖线更淡
const faintRule = 'border-ark-fg/15'

/**
 * 固定骨架：顶栏、右栏、背景巨字、滚动提示构成一个不动的框，换屏只换中间的内容。
 * 用户不需要重新找路——导航永远在上面，“第几屏 / 共几屏”永远在右边。
 *
 * 它铺满视口（`h-dvh`），内容区自己滚动。右栏三个槽位（`actions`、`counter`、`aside`）
 * 都不给时不画右栏。右栏的宽度由 `--ark-shell-rail` 决定，默认 14rem。
 * 内容区左起 9rem，与背景巨字同一条左边线。
 *
 * 竖屏时右栏挪到底部排成一行，内容区的左边距收窄。导航请自己用 `Nav` 的折叠。
 *
 * 栏目名在这里会写三遍：导航里一遍（小）、右栏计数里一遍（中）、背景巨字一遍（巨）。
 * 巨字只是装饰，真正的标题仍然要写在内容里。
 */
export function Shell({
  logo,
  nav,
  actions,
  counter,
  aside,
  ghost,
  scrollHint = false,
  pattern = true,
  contentAs = 'main',
  className,
  children,
  ...rest
}: ShellProps) {
  const Content = contentAs
  const hasRail = actions != null || counter != null || aside != null
  const hint = scrollHint === true ? <ScrollHint /> : scrollHint

  return (
    <div
      data-ark="shell"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        'relative isolate box-border grid h-dvh overflow-hidden bg-ark-neutral-black font-ark-cjk-sans text-ark-fg',
        // 三行：顶栏、内容、压着背景巨字的底带。竖屏多一行给右栏
        'grid-rows-[6rem_minmax(0,1fr)_7rem] portrait:grid-rows-[4rem_minmax(0,1fr)_4rem_auto]',
        hasRail
          ? 'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,14rem)] portrait:grid-cols-1'
          : 'grid-cols-1',
        className,
      )}
    >
      {pattern && (
        <>
          {/* 铺满整屏时再压低一半：底纹要“细看才有” */}
          <Pattern variant="grid" className="absolute inset-0 -z-2 opacity-50" />
          <Pattern variant="halftone" className="absolute bottom-0 left-0 -z-1 h-2/5 w-1/3" />
        </>
      )}

      <header
        className={cn(
          'col-start-1 row-start-1 box-border flex min-w-0 items-center justify-between gap-ark-5 border-b px-ark-5',
          faintRule,
        )}
      >
        <div className="flex shrink-0 items-center">{logo}</div>
        <div className="flex min-w-0 items-center justify-end">{nav}</div>
      </header>

      <Content
        className={cn(
          'col-start-1 row-start-2 box-border min-h-0 min-w-0 overflow-y-auto border-b py-ark-6 pr-ark-6 pl-ark-9',
          'portrait:px-ark-5',
          // 滚动条跟着骨架的细线走，不用系统默认的浅色轨道
          '[scrollbar-color:var(--ark-rule-strong)_transparent] [scrollbar-width:thin]',
          faintRule,
        )}
      >
        {children}
      </Content>

      <div className="relative col-start-1 row-start-3 min-w-0">
        {ghost != null && (
          <GhostTitle
            // 换屏时巨字跟着换：重新挂载，以 1s 淡入（标题与幽灵字取 slower 档）
            key={typeof ghost === 'string' ? ghost : undefined}
            className={cn(
              // 往上提一点，字的上缘压住内容区的底线，像被一条水平线切过
              'absolute top-0 left-ark-9 -translate-y-[0.16em] animate-ark-fade-in [animation-duration:var(--ark-motion-duration-slower)]',
              'portrait:left-ark-5 portrait:text-[3.5rem]',
            )}
          >
            {ghost}
          </GhostTitle>
        )}
        {hint != null && hint !== false && (
          <div className="absolute bottom-ark-3 left-1/2 flex -translate-x-1/2">{hint}</div>
        )}
      </div>

      {hasRail && (
        <aside
          className={cn(
            'col-start-2 row-span-3 row-start-1 box-border flex min-w-0 flex-col border-l border-ark-rule',
            'portrait:col-start-1 portrait:row-span-1 portrait:row-start-4 portrait:flex-row portrait:items-center portrait:justify-between portrait:gap-ark-4 portrait:border-t portrait:border-l-0 portrait:px-ark-5 portrait:py-ark-3',
          )}
        >
          <div
            className={cn(
              'box-border flex h-[6rem] shrink-0 items-center justify-center gap-ark-2 border-b px-ark-4',
              'portrait:order-last portrait:h-auto portrait:border-b-0 portrait:px-0',
              faintRule,
            )}
          >
            {actions}
          </div>
          <div className="my-auto box-border px-ark-4 portrait:my-0 portrait:px-0">{counter}</div>
          <div className="box-border p-ark-4 portrait:p-0">{aside}</div>
        </aside>
      )}
    </div>
  )
}
