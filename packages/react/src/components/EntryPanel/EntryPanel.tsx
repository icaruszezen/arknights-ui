import { type ComponentProps, createContext, type ReactNode, useContext } from 'react'
import { brighterMuted, colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Badge } from '../Badge'
import { Watermark } from '../Icon'

export type EntryPanelTone = 'graphite' | 'paper' | 'signal'
export type EntryPanelSize = 'sm' | 'md' | 'lg'
export type EntryPanelAlign = 'top' | 'center' | 'bottom'

/** `EntryGrid` 按行给出的默认字号。不从包里导出。 */
export const EntrySizeContext = createContext<EntryPanelSize | undefined>(undefined)

interface EntryPanelOwnProps {
  /** 入口名下面的一行灰色小字，和入口名同一种语言，如“角色管理”。 */
  sub?: ReactNode
  /**
   * 表面。实机的主界面上三种都有。
   * - `graphite`：石墨灰（仓库）
   * - `paper`：纸白（终端、编队、干员、任务、基建）
   * - `signal`：信号色的实底（采购中心、公开招募、干员寻访），通常配 `align="center"`
   * @default 'graphite'
   */
  tone?: EntryPanelTone
  /**
   * 入口名在面板里的位置。
   * - `top`：贴左上——实机现行界面的写法
   * - `center`：居中——实机蓝色面板的写法
   * - `bottom`：贴左下——旧版界面和社区复刻的写法
   * @default 'top'
   */
  align?: EntryPanelAlign
  /**
   * 入口名的字号：1.375rem / 2.5rem / 3.75rem，下面的小字约为它的三分之一。
   * 放在 `EntryGrid` 里时默认跟着所在的行走，否则默认 `sm`。
   */
  size?: EntryPanelSize
  /**
   * 右上角的内容，通常是一个数值（作战入口上的理智 `131/135`）。
   * 面板是 `<button>` 时请放行内内容。
   */
  aside?: ReactNode
  /** 右上角的提示：`true` 是一个橙色的提醒标记，数字是计数色块（为 0 时不显示）。 */
  badge?: boolean | number
  /** 给读屏的说明，如“有可领取的奖励”。提醒标记本身没有文字，不给这个就不会被读到。 */
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
  'group relative isolate m-0 box-border flex min-h-20 cursor-pointer appearance-none flex-col overflow-hidden border-0 p-ark-4 text-left font-ark-cjk-sans text-ark-fg no-underline select-none',
  'motion-safe:active:translate-y-px',
  // 面板之间只留很窄的缝：聚焦的那一块提到上面，轮廓不会被相邻的面板盖住
  'focus-visible:z-1',
  'disabled:cursor-not-allowed disabled:opacity-50',
  colorTransition,
  focusRing,
)

const aligns: Record<EntryPanelAlign, string> = {
  top: 'justify-start',
  center: 'items-center justify-center text-center',
  bottom: 'justify-end',
}

// 悬停整块换色，和成对的 Button 一样：石墨变浅灰、纸白变信号色、信号色变白，上面的字都换成深色。
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
  // 实机是白字压蓝（约 3:1）；这里的字跟着信号色自己的前景色走，默认是青蓝底黑字
  signal: cn(
    'bg-ark-signal',
    '[--ark-fg:var(--ark-on-signal)] [--ark-fg-muted:var(--ark-on-signal)] [--ark-fg-secondary:var(--ark-on-signal)]',
    'not-disabled:hover:bg-ark-neutral-white',
    'not-disabled:hover:[--ark-fg:var(--ark-color-neutral-black)] not-disabled:hover:[--ark-fg-muted:var(--ark-color-neutral-black)] not-disabled:hover:[--ark-fg-secondary:var(--ark-color-neutral-black)]',
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

// 文字的硬投影（社区取值）：只给石墨面板，白字压在半透明的深色面上需要它。
// 实机的纸白面板和蓝色面板上没有硬投影。悬停换色之后去掉，深色字不再需要它
const graphiteShadow = 'text-shadow-ark-hard group-[:not(:disabled):hover]:text-shadow-none'

/**
 * 主界面的入口面板：重磅的中文衬线大字贴左上，下面一行灰色的小字，其余留白。
 * 没有描边，面板之间只留很窄的缝；提醒标记压在右上角。
 *
 * 面积直接对应优先级：最重要的入口最大，不需要“推荐”角标。表面有石墨、纸白、信号色三种。
 * 多个入口用 `EntryGrid` 排成“一、二、三、三”；需要透视时再在外面套 `TiltGroup`。
 *
 * 悬停时整块换色。面板会设置明暗上下文，放进 `aside` 的内容跟着所在的表面换色。
 */
export function EntryPanel(props: EntryPanelProps) {
  const inherited = useContext(EntrySizeContext)
  const {
    sub,
    tone = 'graphite',
    align = 'top',
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

  const classes = cn(base, aligns[align], tones[tone], className)

  // DOM 里入口名在最前：读屏先读到“任务”，再读到右上角的数值和提醒标记的说明。
  // 其余几样都是绝对定位的，先后只影响朗读顺序
  const content = (
    <>
      <span className={cn('grid', align === 'center' && 'justify-items-center', gap[size])}>
        <span
          className={cn(
            'font-ark-cjk-serif leading-ark-solid font-ark-heavy',
            titleSize[size],
            tone === 'graphite' && graphiteShadow,
          )}
        >
          {children}
        </span>
        {sub != null && (
          // 实机的小字和入口名是同一种语言（“角色管理”），不是大写的英文注脚
          <span
            className={cn(
              'leading-ark-solid font-ark-regular text-ark-fg-muted',
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
            // 给角标让出位置
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
          className={
            badge === true
              ? // 菱形的中心压在角上，面板裁掉一半，剩下一个橙色的角（实机邮件图标上就是这样）
                'absolute top-0 right-0 size-4 translate-x-1/2 -translate-y-1/2'
              : 'absolute top-ark-2 right-ark-2'
          }
        />
      )}
      {watermark != null && <Watermark>{watermark}</Watermark>}
    </>
  )

  // 信号色的面上是深色字，按浅色上下文算
  const toneAttribute = tone === 'graphite' ? 'dark' : 'light'
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
