import { type ComponentProps, createContext, type ReactNode, useContext } from 'react'
import { brighterMuted, colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Badge } from '../Badge'
import { Watermark } from '../Icon'

export type EntryPanelTone = 'graphite' | 'paper'
export type EntryPanelSize = 'sm' | 'md' | 'lg'

/** `EntryGrid` 按行给出的默认字号。不从包里导出。 */
export const EntrySizeContext = createContext<EntryPanelSize | undefined>(undefined)

interface EntryPanelOwnProps {
  /** 中文下面的英文注脚，如 `TERMINAL`。 */
  sub?: ReactNode
  /**
   * 表面。
   * - `graphite`：石墨灰，其余所有入口的默认
   * - `paper`：纸白，留给最重要的一两个入口——最亮的那块就是该点的
   * @default 'graphite'
   */
  tone?: EntryPanelTone
  /**
   * 中文的字号：1.375rem / 2.5rem / 3.75rem，英文注脚约为它的三分之一。
   * 放在 `EntryGrid` 里时默认跟着所在的行走，否则默认 `sm`。
   */
  size?: EntryPanelSize
  /**
   * 右上角的内容，通常是一个数值（作战入口上的理智 `131/135`）。
   * 面板是 `<button>` 时请放行内内容。
   */
  aside?: ReactNode
  /** 右上角的提示：`true` 是一个红点，数字是数量角标（为 0 时不显示）。 */
  badge?: boolean | number
  /** 给读屏的说明，如“有可领取的奖励”。红点本身没有文字，不给这个就不会被读到。 */
  badgeLabel?: string
  /** 垫在留白处的水印：一个放大、压低不透明度的标识。 */
  watermark?: ReactNode
}

type EntryPanelAsAnchor = EntryPanelOwnProps &
  Omit<ComponentProps<'a'>, keyof EntryPanelOwnProps> & { href: string }
type EntryPanelAsButton = EntryPanelOwnProps &
  Omit<ComponentProps<'button'>, keyof EntryPanelOwnProps> & { href?: undefined }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<button type="button">`。`children` 是中文入口名。 */
export type EntryPanelProps = EntryPanelAsAnchor | EntryPanelAsButton

const base = cn(
  'group relative isolate m-0 box-border flex min-h-20 cursor-pointer appearance-none flex-col justify-end overflow-hidden border-0 p-ark-4 text-left font-ark-cjk-sans text-ark-fg no-underline select-none',
  'motion-safe:active:translate-y-px',
  // 面板之间只留很窄的缝：聚焦的那一块提到上面，轮廓不会被相邻的面板盖住
  'focus-visible:z-1',
  'disabled:cursor-not-allowed disabled:opacity-50',
  colorTransition,
  focusRing,
)

// 悬停整块换色，和成对的 Button 一样：石墨变浅灰、纸白变信号色，上面的字都换成深色。
// 改的是语义变量而不是具体的类，放进来的数值、小字跟着一起换。禁用时不响应
const tones: Record<EntryPanelTone, string> = {
  graphite: cn(
    'bg-ark-overlay-panel-dark',
    brighterMuted,
    'not-disabled:hover:bg-ark-neutral-gray-400',
    'not-disabled:hover:[--ark-fg:var(--ark-color-neutral-black)] not-disabled:hover:[--ark-fg-muted:var(--ark-color-neutral-black)] not-disabled:hover:[--ark-fg-secondary:var(--ark-color-neutral-black)]',
  ),
  paper: cn(
    'bg-ark-overlay-panel-light',
    'not-disabled:hover:bg-ark-signal',
    'not-disabled:hover:[--ark-fg:var(--ark-on-signal)] not-disabled:hover:[--ark-fg-muted:var(--ark-on-signal)] not-disabled:hover:[--ark-fg-secondary:var(--ark-on-signal)]',
  ),
}

const titleSize: Record<EntryPanelSize, string> = {
  sm: 'text-ark-nav',
  md: 'text-ark-h1',
  lg: 'text-ark-display',
}

// 英文约为中文的 1/3；最小的一档停在字号阶里可读的最小值 0.75rem
const subSize: Record<EntryPanelSize, string> = {
  sm: 'text-ark-caption',
  md: 'text-ark-label',
  lg: 'text-ark-body-lg',
}

const gap: Record<EntryPanelSize, string> = {
  sm: 'gap-ark-1',
  md: 'gap-ark-2',
  lg: 'gap-ark-2',
}

// 文字的硬投影（社区取值）：石墨面板上是 --ark-shadow-hard；纸白面板上只给最大的那一档，
// 5px 的灰色偏移。悬停换色之后去掉，深色字不再需要它
const graphiteShadow = 'text-shadow-ark-hard group-[:not(:disabled):hover]:text-shadow-none'
const paperShadow =
  '[text-shadow:0.3125rem_0.3125rem_0_var(--ark-color-neutral-gray-500)] group-[:not(:disabled):hover]:[text-shadow:none]'

/**
 * 主界面的入口面板：重磅的中文衬线大字贴左下，英文小注脚在其下方，其余留白。
 * 没有描边，面板之间只留很窄的缝；红点提示贴在右上角。
 *
 * 面积与亮度直接对应优先级：最重要的入口最大、用纸白，不需要“推荐”角标。
 * 多个入口用 `EntryGrid` 排成“一、二、三、三”；需要透视时再在外面套 `TiltGroup`。
 *
 * 悬停时整块换色。面板会设置明暗上下文，放进 `aside` 的内容跟着所在的表面换色。
 */
export function EntryPanel(props: EntryPanelProps) {
  const inherited = useContext(EntrySizeContext)
  const {
    sub,
    tone = 'graphite',
    size = inherited ?? 'sm',
    aside,
    badge,
    badgeLabel,
    watermark,
    className,
    children,
    ...rest
  } = props
  const hasBadge = badge === true || (typeof badge === 'number' && badge > 0)

  const classes = cn(base, tones[tone], className)

  // DOM 里入口名在最前：读屏先读到“任务”，再读到右上角的数值和红点的说明。
  // 其余几样都是绝对定位的，先后只影响朗读顺序
  const content = (
    <>
      <span className={cn('grid', gap[size])}>
        <span
          className={cn(
            'font-ark-cjk-serif leading-ark-solid font-ark-heavy',
            titleSize[size],
            tone === 'graphite' && graphiteShadow,
            tone === 'paper' && size === 'lg' && paperShadow,
          )}
        >
          {children}
        </span>
        {sub != null && (
          <span
            className={cn(
              'font-ark-latin-condensed leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase',
              colorTransition,
              subSize[size],
            )}
          >
            {sub}
          </span>
        )}
      </span>
      {aside != null && (
        <span
          className={cn(
            'absolute top-ark-4 grid justify-items-end text-right',
            // 给红点让出位置
            hasBadge ? 'right-ark-5' : 'right-ark-4',
          )}
        >
          {aside}
        </span>
      )}
      {hasBadge && (
        <Badge
          dot={badge === true}
          count={typeof badge === 'number' ? badge : undefined}
          label={badgeLabel}
          className="absolute top-ark-2 right-ark-2"
        />
      )}
      {watermark != null && <Watermark>{watermark}</Watermark>}
    </>
  )

  const toneAttribute = tone === 'paper' ? 'light' : 'dark'
  if (rest.href !== undefined) {
    return (
      <a data-ark="entry-panel" data-ark-tone={toneAttribute} {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <button
      data-ark="entry-panel"
      data-ark-tone={toneAttribute}
      type="button"
      {...rest}
      className={classes}
    >
      {content}
    </button>
  )
}
