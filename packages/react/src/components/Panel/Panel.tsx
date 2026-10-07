import type { ComponentProps } from 'react'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type PanelTone = 'graphite' | 'paper' | 'frosted'
export type PanelElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'li'

export interface PanelProps extends ComponentProps<'div'> {
  /**
   * 渲染成哪个元素。
   * @default 'div'
   */
  as?: PanelElement
  /**
   * 表面。
   * - `graphite`：石墨灰，半透明，其余所有东西的默认容器
   * - `paper`：纸白，一屏最多一两块，留给最重要的入口
   * - `frosted`：毛玻璃浮层，模糊并保留下层
   * @default 'graphite'
   */
  tone?: PanelTone
  /**
   * 一条信号色强调边，标记类别或选中。只加一条。`frosted` 不支持。
   * 主界面的面板把它放在上沿或下沿。
   */
  accent?: 'left' | 'top' | 'bottom'
  /** 切掉右上角。`frosted` 不支持。 */
  cut?: boolean
  /** 投影。卡片才加，主界面的面板靠明暗区分层级。`frosted` 不支持。 */
  elevated?: boolean
  /** 在底部压一片渐隐的半调网点，让留白不发飘。 */
  halftone?: boolean
}

const base = 'relative isolate box-border p-ark-5 font-ark-cjk-sans text-ark-fg'

const flat: Record<PanelTone, string> = {
  graphite: 'bg-ark-overlay-panel-dark',
  paper: 'bg-ark-overlay-panel-light',
  frosted: 'border border-ark-rule bg-ark-overlay-scrim backdrop-blur-ark-backdrop',
}

// 切角时背景搬到 ::before 上裁切，根元素不裁，投影才能跟着切角的形状走
const cutLayer = 'before:absolute before:inset-0 before:-z-1 before:ark-cut-tr-md'
const cutBackground: Record<Exclude<PanelTone, 'frosted'>, string> = {
  graphite: 'before:bg-ark-overlay-panel-dark',
  paper: 'before:bg-ark-overlay-panel-light',
}

const accents = {
  left: 'border-l-(length:--ark-line-strong) border-ark-signal',
  top: 'border-t-(length:--ark-line-strong) border-ark-signal',
  bottom: 'border-b-(length:--ark-line-strong) border-ark-signal',
}

// 与 Pattern 共用同一个工具类：网点取当前文字色，纸白面上自动是深色的
const halftoneLayer = cn(
  'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:-z-1 after:h-2/5',
  'after:ark-pattern-halftone',
  'after:[--ark-pattern-fade:linear-gradient(to_top_right,#000,transparent_60%)]',
)

/**
 * 面板只有两种底：石墨说“我在这里”，纸白说“看这里”；再加一种盖在上面的毛玻璃。
 *
 * 内容不居中：标题贴左上或左下，数值贴右上，其余留白。
 * 面板会设置明暗上下文，放在纸白面板里的子组件自动换成深色前景。
 */
export function Panel({
  as = 'div',
  tone = 'graphite',
  accent,
  cut = false,
  elevated = false,
  halftone = false,
  className,
  ...rest
}: PanelProps) {
  // 可选元素共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  const solid = tone !== 'frosted'
  return (
    <Comp
      data-ark="panel"
      data-ark-tone={tone === 'paper' ? 'light' : 'dark'}
      {...rest}
      className={cn(
        base,
        tone !== 'paper' && brighterMuted,
        solid && cut ? [cutLayer, cutBackground[tone]] : flat[tone],
        solid && accent && accents[accent],
        solid && elevated && 'drop-shadow-ark-panel',
        halftone && halftoneLayer,
        className,
      )}
    />
  )
}

export type CardProps = PanelProps

/** 卡片是“可以拿起来的东西”：带投影的面板，用在采购、仓库这类列表型页面。 */
export function Card({ elevated = true, ...rest }: CardProps) {
  return <Panel data-ark="card" elevated={elevated} {...rest} />
}
