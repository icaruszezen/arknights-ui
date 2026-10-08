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
  /**
   * 顶栏靠右：主导航，通常是一个 `Nav`。竖屏时它在最右边、和右栏一样宽的那一格里——
   * 官网在那里放菜单按钮，所以请让 `Nav` 在竖屏折叠（它的默认行为）。
   */
  nav?: ReactNode
  /**
   * 顶栏最右：分享、音频、账号这类小按钮。横屏时这一格和右栏一样宽，正好在右栏的上方；
   * 竖屏时排在菜单按钮的左边。
   */
  actions?: ReactNode
  /**
   * 右栏里这一屏的计数，通常是一个 `Counter`。它最先更新，告诉用户到了第几屏。
   * 横屏时在右栏 44.4% 高的地方；竖屏时在右栏底部、底带的上方，那里只有 2.875rem 宽，
   * 请给 `Counter` 加 `vertical="portrait"`。
   */
  counter?: ReactNode
  /**
   * 右栏底部：下载、社交这类常驻入口。竖屏时右栏放不下，这一块不显示——
   * 官网竖屏把它们挪进了首页的内容区；需要的话请自己在内容里再放一份。
   */
  aside?: ReactNode
  /** 背景巨字：这一屏的英文名，挂在底线下面、内容区的左下角。 */
  ghost?: ReactNode
  /** 底部正中的滚动提示。`true` 用默认的 `ScrollHint`，也可以传一个自己的（比如带链接的）。 */
  scrollHint?: boolean | ReactNode
  /**
   * 横线在哪。骨架只有一条横线，随屏换位置：
   * - `bottom`：内容区的下缘（官网的首页、设定、泰拉万象、更多内容）
   * - `top`：内容区的上缘（官网的情报、干员）
   *
   * 换值时旧的那条滑出画面、新的那条滑进来，1 秒。
   * @default 'bottom'
   */
  line?: ShellLine
  /**
   * 竖屏时横线在哪，不给就和 `line` 一样。官网竖屏只有首页的横线在下缘，其余各屏都在顶栏的下缘：
   * 设定、泰拉万象、更多内容这几屏要写成 `line="bottom" portraitLine="top"`。
   */
  portraitLine?: ShellLine
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
// 竖屏的线比横屏的亮一档（官网：横屏 30% 的白，竖屏 50%）
const rule = cn(
  'pointer-events-none col-span-full h-px bg-ark-rule portrait:bg-ark-rule-strong',
  'motion-safe:transition-[translate,opacity] motion-safe:duration-(--ark-motion-duration-slower) motion-safe:ease-ark-standard',
)

/**
 * 固定骨架：顶栏、右栏、一条横线、背景巨字、滚动提示构成一个不动的框，换屏只换中间的内容。
 * 用户不需要重新找路——导航永远在上面，“第几屏 / 共几屏”永远在右边。
 *
 * 横屏的尺寸是官网的实测值：顶栏高 6.75rem，没有底线，自上而下垫一道黑色的渐变；
 * 内容区上起 9.5rem、下至距底 11.25rem、左起 9rem；右栏宽 14.75rem，左缘一条竖线，
 * 计数在 44.4% 高的地方；巨字左起 8.375rem，挂在底线下面，上缘被裁掉一截；
 * 滚动提示距底 3.75rem，相对整屏居中。竖线和横线同为 30% 的白。
 *
 * 竖屏是另一套编排，也取自官网：顶栏高 4.6875rem，横线在上缘时就是它的下缘；
 * 右栏仍然在右边，收窄到 2.875rem——只够放一个菜单按钮，小按钮排到它的左边，
 * 计数挪到右栏底部，常驻入口不显示；底带高 6rem；内容区四边各留 0.875rem；
 * 巨字缩到 3.5rem、左起 1.4375rem；线换成 50% 的白。
 * 官网竖屏以 750 宽为基准（375 宽的手机上根字号是 8px），这里把它的 rem 值折半，
 * 根字号 16px 时在 375 宽的手机上和官网一样大。
 *
 * 它铺满视口（`h-dvh`），内容区自己滚动。右栏三个槽位（`actions`、`counter`、`aside`）
 * 都不给时不画右栏。上、下两条带的高度和右栏的宽度可以用 `--ark-shell-top`、
 * `--ark-shell-bottom`、`--ark-shell-rail` 改，横屏竖屏共用；只想改一边时写在自己的媒体查询里
 * （`landscape:[--ark-shell-rail:12rem]`）。
 *
 * 官网的根字号随视口缩放，这里不会：视口比基准小的时候这几个固定的 rem 会占掉不少地方，
 * 请自己调小这三个变量，或者像官网那样在页面上设根字号——
 * 横屏 `min(100vw / 120, 100dvh / 67.5)`，竖屏 `min(100vw / 23.4375, 100dvh / 41.6875)`。
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
  portraitLine = line,
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
      data-portrait-line={portraitLine}
      {...rest}
      className={cn(
        'relative isolate box-border grid h-dvh overflow-hidden bg-ark-neutral-black font-ark-cjk-sans text-ark-fg',
        // 三行：顶栏所在的带、内容、压着背景巨字的底带。竖屏的两条带都矮一些
        'grid-rows-[var(--ark-shell-top,9.5rem)_minmax(0,1fr)_var(--ark-shell-bottom,11.25rem)]',
        'portrait:grid-rows-[var(--ark-shell-top,4.6875rem)_minmax(0,1fr)_var(--ark-shell-bottom,6rem)]',
        hasRail
          ? 'grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,14.75rem)] portrait:grid-cols-[minmax(0,1fr)_var(--ark-shell-rail,2.875rem)]'
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
          line !== 'top' && 'landscape:-translate-y-[calc(var(--ark-shell-top,9.5rem)+0.25rem)]',
          portraitLine !== 'top' &&
            'portrait:-translate-y-[calc(var(--ark-shell-top,4.6875rem)+0.25rem)]',
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
            'landscape:translate-y-[calc(var(--ark-shell-bottom,11.25rem)+0.25rem)]',
          portraitLine !== 'bottom' &&
            'portrait:translate-y-[calc(var(--ark-shell-bottom,6rem)+0.25rem)]',
        )}
      />

      {/*
        顶栏横贯整屏，压在右栏上面（右栏的竖线从它的渐变底下穿过去）。
        横屏时比它所在的那条带矮，贴顶放；竖屏时和那条带一样高
      */}
      <header
        className={cn(
          'relative isolate z-1 col-span-full row-start-1 box-border flex h-[6.75rem] min-w-0 items-center self-start',
          'before:absolute before:inset-0 before:-z-1 before:bg-[linear-gradient(0deg,transparent,rgba(0,0,0,0.6),rgba(0,0,0,0.8))]',
          'portrait:h-full portrait:before:bg-[linear-gradient(0deg,transparent,rgba(0,0,0,0.8))]',
        )}
      >
        <div className="mr-auto ml-ark-7 flex shrink-0 items-center portrait:ml-[0.875rem]">
          {logo}
        </div>
        <div
          className={cn(
            'flex min-w-0 items-center justify-end px-[2.5rem]',
            // 竖屏：导航（收成了菜单按钮）排到最后，占右栏上方的那一格
            hasRail
              ? 'portrait:order-last portrait:w-[var(--ark-shell-rail,2.875rem)] portrait:shrink-0 portrait:justify-center portrait:px-0'
              : 'portrait:px-[0.875rem]',
          )}
        >
          {nav}
        </div>
        {hasRail && (
          // 有右栏就留出这一格，哪怕没有小按钮：导航不该伸到右栏上面去
          <div
            data-ark="shell-actions"
            className={cn(
              'box-border flex h-full w-[var(--ark-shell-rail,14.75rem)] shrink-0 items-center justify-center gap-ark-2 px-ark-3',
              'portrait:w-auto portrait:gap-0 portrait:px-[0.375rem]',
            )}
          >
            {actions}
          </div>
        )}
      </header>

      <Content
        className={cn(
          'col-start-1 row-start-2 box-border min-h-0 min-w-0 overflow-y-auto py-ark-6 pr-ark-6 pl-ark-9',
          'portrait:p-[0.875rem]',
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
              'portrait:left-[1.4375rem] portrait:text-[3.5rem]',
            )}
          >
            {ghost}
          </GhostTitle>
        )}
      </div>

      {hint != null && hint !== false && (
        // 相对整屏居中（连右栏一起算），距底 3.75rem；竖屏 1.875rem
        <div
          data-ark="shell-hint"
          className="z-1 col-span-full row-start-3 mb-[3.75rem] flex self-end justify-self-center portrait:mb-[1.875rem]"
        >
          {hint}
        </div>
      )}

      {hasRail && (
        <aside
          className={cn(
            'relative col-start-2 row-span-3 row-start-1 box-border flex min-w-0 flex-col border-l border-ark-rule',
            'portrait:border-ark-rule-strong',
          )}
        >
          {/*
            计数的上缘在 44.4% 高的地方，左右居中。用整行的 flex 居中，不用 left-1/2 加平移：
            后者只给内容留下半栏宽，计数会被挤窄。竖屏时贴着底带的上缘放，离横线 0.25rem
          */}
          <div
            data-ark="shell-counter"
            className="absolute inset-x-0 top-[44.4444%] box-border flex justify-center portrait:top-auto portrait:bottom-[calc(var(--ark-shell-bottom,6rem)+0.25rem)]"
          >
            {counter}
          </div>
          <div className="mt-auto box-border p-ark-4 portrait:hidden">{aside}</div>
        </aside>
      )}
    </div>
  )
}
