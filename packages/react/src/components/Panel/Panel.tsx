import type { ComponentProps, ElementType, ReactNode } from 'react'
import { brighterMuted, colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { type SurfaceTone, surfaceClass, surfaceContext } from '../../utils/surface'

export type PanelTone = SurfaceTone
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg'
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
   * - `surface`：默认的面，跟着主题走（暗色近黑、亮色纸白）
   * - `raised`：抬起的一层，比默认的面亮一档
   * - `inverse`：与所在主题相反的面，一屏最多一两块，留给最重要的内容
   * - `graphite`：半透明的石墨灰，压在图片上用
   * - `paper`：半透明的纸白
   * - `frosted`：毛玻璃，模糊并保留下层
   * @default 'surface'
   */
  tone?: PanelTone
  /**
   * 内边距：`sm` 1rem、`md` 1.5rem、`lg` 2rem；`none` 交给内容自己定。
   * @default 'md'
   */
  padding?: PanelPadding
  /** 一条信号色强调边，标记类别或选中。只加一条。`frosted` 不支持。 */
  accent?: 'left' | 'top' | 'bottom'
  /** 一圈 1px 细线。面和底的明度很接近、又需要看清边界时用；`frosted` 总是带。 */
  bordered?: boolean
  /** 切掉右上角。`frosted` 不支持。 */
  cut?: boolean
  /** 投影。卡片才加，普通的面板靠明暗区分层级。`frosted` 不支持。 */
  elevated?: boolean
  /** 在底部压一片渐隐的半调网点，让留白不发飘。 */
  halftone?: boolean
}

const base = 'relative isolate box-border font-ark-cjk-sans text-ark-fg'

const paddings: Record<PanelPadding, string> = {
  none: 'p-0',
  sm: 'p-ark-4',
  md: 'p-ark-5',
  lg: 'p-ark-6',
}

// 切角时背景搬到 ::before 上裁切，根元素不裁，投影才能跟着切角的形状走
const cutLayer = 'before:absolute before:inset-0 before:-z-1 before:ark-cut-tr-md'
const cutBackground: Record<Exclude<PanelTone, 'frosted'>, string> = {
  surface: 'before:bg-ark-surface',
  raised: 'before:bg-ark-surface-raised',
  inverse: 'before:bg-ark-surface',
  graphite: `before:bg-ark-overlay-panel-dark ${brighterMuted}`,
  paper: 'before:bg-ark-overlay-panel-light',
}

const accents = {
  left: 'border-l-(length:--ark-line-strong) border-l-ark-signal',
  top: 'border-t-(length:--ark-line-strong) border-t-ark-signal',
  bottom: 'border-b-(length:--ark-line-strong) border-b-ark-signal',
}

// 与 Pattern 共用同一个工具类：网点取当前文字色，浅色面上自动是深色的。
// 遮罩默认就是左下最密、朝右上越来越小，不用再叠渐隐
const halftoneLayer = cn(
  'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:-z-1 after:h-2/5',
  'after:ark-pattern-halftone',
)

/**
 * 面板是一块直角的面。默认的面跟着主题走；`inverse` 是与主题相反的那一面，说“看这里”；
 * `graphite`、`paper`、`frosted` 是压在图片上用的半透明表面。
 *
 * 内容不居中：标题贴左上或左下，数值贴右上，其余留白。
 * 面板会设置明暗上下文，放在浅色面里的子组件自动换成深色前景。
 */
export function Panel({
  as = 'div',
  tone = 'surface',
  padding = 'md',
  accent,
  bordered = false,
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
      data-ark-tone={surfaceContext[tone]}
      {...rest}
      className={cn(
        base,
        paddings[padding],
        solid && cut ? [cutLayer, cutBackground[tone]] : surfaceClass[tone],
        // 切角的面不描边：边框是矩形的，会在切掉的那个角上露出来
        (bordered || !solid) && !(solid && cut) && 'border border-ark-rule',
        solid && accent && accents[accent],
        solid && elevated && 'drop-shadow-ark-panel',
        halftone && halftoneLayer,
        className,
      )}
    />
  )
}

export interface CardProps extends PanelProps {
  /**
   * 整张卡片是一个链接。卡片里因此只能放文字和图片，不能再放按钮或别的链接。
   */
  href?: string
  /**
   * 渲染链接用的组件，接路由库的 `Link`。仅在给了 `href` 时有效。
   * @default 'a'
   */
  linkAs?: ElementType
  /** 可以点：悬停时换一档底色，带焦点轮廓。给了 `href` 时自动打开。 */
  interactive?: boolean
  /** 2px 的小圆角。圆角只留给卡片这类“可以拿起来的东西”，面板没有。 */
  rounded?: boolean
}

/**
 * 卡片是“可以拿起来的东西”：抬起一层、带投影，用在列表型的页面。
 * 里面可以放 `CardMedia`、`CardHeader`、`CardFooter`，也可以直接放内容。
 */
export function Card({
  tone = 'raised',
  elevated = true,
  href,
  linkAs,
  interactive = href !== undefined,
  rounded = false,
  className,
  ...rest
}: CardProps) {
  const link =
    href !== undefined
      ? // Panel 的 as 只列了容器元素，这里按链接渲染
        ({ as: (linkAs ?? 'a') as unknown as PanelElement, href } as object)
      : undefined
  return (
    <Panel
      data-ark="card"
      tone={tone}
      elevated={elevated}
      {...link}
      {...rest}
      className={cn(
        rounded && 'overflow-hidden rounded-ark-subtle',
        interactive && [
          'block cursor-pointer no-underline hover:bg-ark-control',
          colorTransition,
          focusRing,
        ],
        className,
      )}
    />
  )
}

export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 标题，粗体。 */
  title: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /** 右上角的内容：数值、标签、一个操作。 */
  extra?: ReactNode
  /**
   * 标题渲染成哪个元素。
   * @default 'h3'
   */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  /** 下面加一条细线，把标题和正文分开。 */
  divider?: boolean
}

/** 卡片的标题栏：标题贴左上，英文小字在下，右上角留给数值或操作。 */
export function CardHeader({
  title,
  sub,
  extra,
  titleAs: Title = 'h3',
  divider = false,
  className,
  ...rest
}: CardHeaderProps) {
  return (
    <div
      data-ark="card-header"
      {...rest}
      className={cn(
        'box-border flex items-start justify-between gap-ark-4',
        divider ? 'mb-ark-4 border-b border-ark-rule pb-ark-4' : 'mb-ark-4',
        className,
      )}
    >
      <div className="grid min-w-0 gap-ark-1">
        <Title className="m-0 text-ark-base leading-ark-snug font-ark-bold text-ark-fg">
          {title}
        </Title>
        {sub != null && (
          <span className="font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
            {sub}
          </span>
        )}
      </div>
      {extra != null && <div className="shrink-0">{extra}</div>}
    </div>
  )
}

export type CardFooterProps = ComponentProps<'div'>

/** 卡片的底栏：一条细线，操作贴右。 */
export function CardFooter({ className, ...rest }: CardFooterProps) {
  return (
    <div
      data-ark="card-footer"
      {...rest}
      className={cn(
        'mt-ark-5 box-border flex items-center justify-end gap-ark-3 border-t border-ark-rule pt-ark-4',
        className,
      )}
    />
  )
}

export interface CardMediaProps extends ComponentProps<'img'> {
  /**
   * 宽高比。
   * @default '16 / 9'
   */
  ratio?: string
}

/**
 * 卡片顶上的图：出血到卡片的三条边。放在卡片的最前面；卡片要用默认的内边距（`md`）。
 * 纯装饰的图 `alt` 留空。
 */
export function CardMedia({
  ratio = '16 / 9',
  alt = '',
  className,
  style,
  ...rest
}: CardMediaProps) {
  return (
    <img
      data-ark="card-media"
      alt={alt}
      {...rest}
      style={{ aspectRatio: ratio, ...style }}
      className={cn(
        '-mx-ark-5 -mt-ark-5 mb-ark-4 block w-[calc(100%+var(--ark-space-5)*2)] max-w-none object-cover',
        className,
      )}
    />
  )
}
