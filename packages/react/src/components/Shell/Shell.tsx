import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { GhostTitle } from '../GhostTitle'
import { Pattern } from '../Pattern'
import { ScrollHint } from '../ScrollHint'

export type ShellContentElement = 'main' | 'div' | 'section'
export type ShellLine = 'top' | 'bottom'

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
  /** 背景巨字：这一屏的英文名，挂在底线下面、内容区的左下角。 */
  ghost?: ReactNode
  /** 底部正中的滚动提示。`true` 用默认的 `ScrollHint`，也可以传一个自己的（比如带链接的）。 */
  scrollHint?: boolean | ReactNode
  /**
   * 横线在哪。骨架只有一条横线，随屏换位置：
   * - `bottom`：内容区的下缘，距底 11.25rem（官网的首页、设定、泰拉万象、更多内容）
   * - `top`：内容区的上缘，距顶 9.5rem（官网的情报、干员）
   *
   * 换值时旧的那条滑出画面、新的那条滑进来，1 秒。
   * @default 'bottom'
   */
  line?: ShellLine
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

// 横线画在所在那一行的边上，跟着行高走；不显示的那条顺着来的方向滑出画面。
// 竖屏的行高不一样，改成原地淡出
const rule = cn(
  'pointer-events-none col-span-full h-px bg-ark-rule',
  'motion-safe:transition-[translate,opacity] motion-safe:duration-(--ark-motion-duration-slower) motion-safe:ease-ark-standard',
)

/**
 * 固定骨架：顶栏、右栏、一条横线、背景巨字、滚动提示构成一个不动的框，换屏只换中间的内容。
 * 用户不需要重新找路——导航永远在上面，“第几屏 / 共几屏”永远在右边。
 *
 * 尺寸都是官网的实测值：顶栏高 6.75rem，没有底线，自上而下垫一道黑色的渐变；
 * 内容区上起 9.5rem、下至距底 11.25rem、左起 9rem；右栏宽 14.75rem，左缘一条竖线，
 * 计数在 44.4% 高的地方；巨字左起 8.375rem，挂在底线下面，上缘被裁掉一截；
 * 滚动提示距底 3.75rem，相对整屏居中。竖线和横线同为 30% 的白。
 *
 * 它铺满视口（`h-dvh`），内容区自己滚动。右栏三个槽位（`actions`、`counter`、`aside`）
 * 都不给时不画右栏。上、下两条带的高度和右栏的宽度可以用 `--ark-shell-top`、
 * `--ark-shell-bottom`、`--ark-shell-rail` 改。
 *
 * 官网的根字号随视口缩放，这里不会：视口矮的时候这几个固定的 rem 会占掉不少高度，
 * 请自己调小这三个变量，或者在页面上设根字号。
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
  line = 'bottom',
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
      data-line={line}
      {...rest}
      className={cn(
        'relative isolate box-border grid h-dvh overflow-hidden bg-ark-neutral-black font-ark-cjk-sans text-ark-fg',
        // 三行：顶栏所在的带、内容、压着背景巨字的底带。竖屏多一行给右栏
        'grid-rows-[var(--ark-shell-top,9.5rem)_minmax(0,1fr)_var(--ark-shell-bottom,11.25rem)] portrait:grid-rows-[4rem_minmax(0,1fr)_4rem_auto]',
        hasRail
          ? 'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,14.75rem)] portrait:grid-cols-1'
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

      <span
        aria-hidden="true"
        data-ark="shell-line"
        data-side="top"
        className={cn(
          rule,
          'row-start-1 self-end',
          line !== 'top' &&
            '-translate-y-[calc(var(--ark-shell-top,9.5rem)+0.25rem)] portrait:translate-y-0 portrait:opacity-0',
        )}
      />
      <span
        aria-hidden="true"
        data-ark="shell-line"
        data-side="bottom"
        className={cn(
          rule,
          'row-start-3 self-start',
          line !== 'bottom' &&
            'translate-y-[calc(var(--ark-shell-bottom,11.25rem)+0.25rem)] portrait:translate-y-0 portrait:opacity-0',
        )}
      />

      {/* 顶栏比它所在的那条带矮，贴顶放；渐变垫在自己的内容下面 */}
      <header
        className={cn(
          'relative isolate col-span-full row-start-1 box-border flex h-[6.75rem] min-w-0 items-center self-start',
          'before:absolute before:inset-0 before:-z-1 before:bg-[linear-gradient(0deg,transparent,rgba(0,0,0,0.6),rgba(0,0,0,0.8))]',
          'portrait:h-full portrait:gap-ark-4 portrait:pr-ark-5',
          // 右栏顶端的小按钮和顶栏同高，这里把位置让出来
          hasRail && 'pr-[var(--ark-shell-rail,14.75rem)]',
        )}
      >
        <div className="mr-auto ml-ark-7 flex shrink-0 items-center portrait:ml-ark-5">{logo}</div>
        <div className="flex min-w-0 items-center justify-end px-[2.5rem] portrait:px-0">{nav}</div>
      </header>

      <Content
        className={cn(
          'col-start-1 row-start-2 box-border min-h-0 min-w-0 overflow-y-auto py-ark-6 pr-ark-6 pl-ark-9',
          'portrait:px-ark-5',
          // 滚动条跟着骨架的细线走，不用系统默认的浅色轨道
          '[scrollbar-color:var(--ark-rule-strong)_transparent] [scrollbar-width:thin]',
        )}
      >
        {children}
      </Content>

      <div className="relative col-start-1 row-start-3 min-w-0">
        {ghost != null && (
          <GhostTitle
            // 换屏时巨字跟着换：重新挂载，以 1s 淡入（标题与幽灵字取 slower 档）
            key={typeof ghost === 'string' ? ghost : undefined}
            clip
            className={cn(
              // 挂在底线下面：这一行的上缘就是裁切线
              'absolute top-0 left-[8.375rem] animate-ark-fade-in [animation-duration:var(--ark-motion-duration-slower)]',
              'portrait:left-ark-5 portrait:text-[3.5rem]',
            )}
          >
            {ghost}
          </GhostTitle>
        )}
      </div>

      {hint != null && hint !== false && (
        // 相对整屏居中（连右栏一起算），距底 3.75rem
        <div
          data-ark="shell-hint"
          className="z-1 col-span-full row-start-3 mb-[3.75rem] flex self-end justify-self-center portrait:mb-ark-3"
        >
          {hint}
        </div>
      )}

      {hasRail && (
        <aside
          className={cn(
            'relative col-start-2 row-span-3 row-start-1 box-border flex min-w-0 flex-col border-l border-ark-rule',
            'portrait:col-start-1 portrait:row-span-1 portrait:row-start-4 portrait:flex-row portrait:items-center portrait:justify-between portrait:gap-ark-4 portrait:border-t portrait:border-l-0 portrait:px-ark-5 portrait:py-ark-3',
          )}
        >
          <div
            className={cn(
              'box-border flex h-[6.75rem] shrink-0 items-center justify-center gap-ark-2 px-ark-3',
              'portrait:order-last portrait:h-auto portrait:px-0',
            )}
          >
            {actions}
          </div>
          {/*
            计数的上缘在 44.4% 高的地方，左右居中。用整行的 flex 居中，不用 left-1/2 加平移：
            后者只给内容留下半栏宽，计数会被挤窄
          */}
          <div className="absolute inset-x-0 top-[44.4444%] box-border flex justify-center portrait:static">
            {counter}
          </div>
          <div className="mt-auto box-border p-ark-4 portrait:mt-0 portrait:p-0">{aside}</div>
        </aside>
      )}
    </div>
  )
}
