import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { IconTitle } from '../IconTitle'

export type StripGalleryProps = ComponentProps<'ul'>

/**
 * 条带切图：多个入口并排时，每个入口取原图的一条竖带，等宽排列，底部统一压黑。
 *
 * 子元素是若干个 `Strip`，各自包进一个列表项。条带之间没有缝——每条的右缘有一道暗边，
 * 相邻两条靠它分开（官网实测）。条带默认是 4:9 的竖条，
 * 给这个列表一个高度（如 `h-[70vh]`）就改为撑满这个高度。
 * 竖屏时改成纵向堆叠的横带，而不是把竖条挤得更窄。
 */
export function StripGallery({ className, children, ...rest }: StripGalleryProps) {
  return (
    <ul
      data-ark="strip-gallery"
      {...rest}
      className={cn(
        // 一行、等宽；行高在列表有高度时撑满，否则由条带的比例决定
        'm-0 box-border grid list-none auto-cols-fr grid-flow-col grid-rows-[minmax(0,1fr)] p-0',
        'portrait:grid-flow-row portrait:grid-rows-none',
        className,
      )}
    >
      {toItems(children).map(({ key, child }) => (
        <li key={key} className="grid min-w-0">
          {child}
        </li>
      ))}
    </ul>
  )
}

interface StripOwnProps {
  /** 图片地址。 */
  src: string
  /**
   * 替代文字。条带上已经有标题，图片通常只是陪衬。
   * @default ''
   */
  alt?: string
  /**
   * 取原图的哪一条竖带：图片的 `object-position`，如 `'30% 20%'`。
   * 选脸或关键物件所在的那一条。
   * @default 居中
   */
  position?: string
  /** 标题左边的图标，通常是一个 `Icon`。它挂在文字列的左边外面。 */
  icon?: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /**
   * 英文下面那行“查看更多”。传 `null` 去掉。
   * @default 'VIEW MORE >'
   */
  more?: ReactNode
  /**
   * 这一条的主题色（任意 CSS 颜色）：自下往上三成高的地方横着一道色带，把图片染上这个颜色。
   * 官网每条各有一个，是从插画里取的暗色。
   */
  tint?: string
  /**
   * 悬停时自下浮起的那层颜色，官网用的是比 `tint` 更鲜的同色系。不给就用 `tint`。
   * 只在是链接时有效。
   */
  hoverTint?: string
}

type StripAsAnchor = StripOwnProps &
  Omit<ComponentProps<'a'>, keyof StripOwnProps> & { href: string }
type StripAsBlock = StripOwnProps &
  Omit<ComponentProps<'div'>, keyof StripOwnProps> & { href?: undefined }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<div>`。 */
export type StripProps = StripAsAnchor | StripAsBlock

const layer = 'pointer-events-none absolute inset-0'
const fade = 'transition-opacity duration-(--ark-motion-duration-base) ease-ark-standard'

// 四道黑色渐变（官网实测）：底部两道叠在一起，顶部一道给顶栏垫底，右缘一道 4rem 的暗边把相邻两条分开。
// 竖屏是横带，换成底部一道加左侧一道
const shade = cn(
  'bg-[linear-gradient(0deg,#000,transparent_40%),linear-gradient(0deg,#000,transparent_30%),linear-gradient(#000,rgba(0,0,0,0.6)_20%,transparent_40%),linear-gradient(-90deg,rgba(0,0,0,0.8),transparent_4rem)]',
  'portrait:bg-[linear-gradient(0deg,rgba(0,0,0,0.6),transparent_30%),linear-gradient(90deg,#000,transparent_30%)]',
)

/**
 * 一条竖带：图片铺满，上下压黑，左下是“图标 + 中文粗字 + 英文小字”、一行 VIEW MORE 和一条短横线。
 * `children` 是中文标题。取值出自官网更多内容屏（实测）。
 *
 * 官网的条带固定 30rem 宽；这里把条带设成容器，文字的位置和字号按条带的宽度走
 * （30rem 宽时正好是官网的值），窄一些的条带上也排得下。
 * 竖屏的横带不这样：文字块左起 3.75rem、距底 1.8125rem，标题 1.6875rem，都是官网竖屏取值的一半
 * （官网竖屏以 750 宽为基准）。
 *
 * 是链接时，悬停会把图片放大到 1.1 倍、退掉盖在上面的暗层，并自下浮起一层主题色。文字不变色。
 */
export function Strip(props: StripProps) {
  const {
    src,
    alt = '',
    position,
    icon,
    sub,
    more = 'VIEW MORE >',
    tint,
    hoverTint,
    className,
    children,
    ...rest
  } = props
  const interactive = rest.href !== undefined
  const wash = hoverTint ?? tint

  const classes = cn(
    'group @container relative isolate box-border block aspect-[4/9] min-w-0 overflow-hidden font-ark-cjk-sans text-ark-fg no-underline',
    'portrait:aspect-[5/2]',
    // 条带贴着列表的边，轮廓画在内侧
    interactive && focusRingInset,
    className,
  )

  // 这几层都是定位元素，没有设 z-index，按书写顺序自下而上叠
  const content = (
    <>
      <img
        src={src}
        alt={alt}
        style={position === undefined ? undefined : { objectPosition: position }}
        className={cn(
          'absolute inset-0 m-0 block size-full max-w-none border-0 object-cover select-none',
          interactive &&
            'motion-safe:transition-transform motion-safe:duration-(--ark-motion-duration-slow) motion-safe:group-hover:scale-110',
        )}
      />
      <span
        aria-hidden="true"
        data-ark="strip-veil"
        className={cn(
          layer,
          'bg-ark-neutral-black opacity-20',
          interactive && [fade, 'group-hover:opacity-0'],
        )}
      />
      {tint !== undefined && (
        <span
          aria-hidden="true"
          data-ark="strip-tint"
          className={cn(
            layer,
            'bg-[linear-gradient(0deg,transparent,currentColor_30%,transparent_60%)] opacity-70',
            'portrait:bg-[linear-gradient(90deg,transparent,currentColor_20%,transparent_70%)] portrait:opacity-90',
          )}
          style={{ color: tint } as CSSProperties}
        />
      )}
      {interactive && wash !== undefined && (
        <span
          aria-hidden="true"
          data-ark="strip-wash"
          className={cn(
            layer,
            'bg-[linear-gradient(0deg,currentColor,transparent_50%)] opacity-0 group-hover:opacity-50 portrait:hidden',
            fade,
          )}
          style={{ color: wash } as CSSProperties}
        />
      )}
      <span aria-hidden="true" data-ark="strip-shade" className={cn(layer, shade)} />
      {/* 竖屏的横带上，文字块的位置和字号是固定的，不再跟着宽度走（官网实测，按 375 宽折算） */}
      <span className="absolute right-ark-3 bottom-[20.5556%] left-[27.9167cqw] grid justify-items-start portrait:bottom-[1.8125rem] portrait:left-[3.75rem]">
        <IconTitle
          as="span"
          size="lg"
          hang
          icon={icon}
          sub={sub}
          // 30rem 宽的条带上是 3.375rem；一圈黑色的晕让字从图里浮出来
          className="text-[length:clamp(1rem,11.25cqw,3.375rem)] drop-shadow-[0_0_0.5rem_#000] portrait:text-[1.6875rem]"
        >
          {children}
        </IconTitle>
        {more != null && more !== false && (
          <span className="font-ark-latin-wide text-[length:clamp(0.625rem,2.5cqw,0.75rem)] leading-ark-snug font-ark-medium">
            {more}
          </span>
        )}
        <span
          aria-hidden="true"
          data-ark="strip-rule"
          className="mt-[clamp(0.625rem,4.1667cqw,1.25rem)] block h-px w-[clamp(3.5rem,22.5cqw,6.75rem)] bg-current portrait:mt-[0.625rem] portrait:w-[3.375rem]"
        />
      </span>
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a data-ark="strip" data-ark-tone="dark" {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <div data-ark="strip" data-ark-tone="dark" {...rest} className={classes}>
      {content}
    </div>
  )
}
