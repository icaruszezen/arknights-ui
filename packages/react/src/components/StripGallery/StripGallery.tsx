import type { ComponentProps, ReactNode } from 'react'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRingInset, triangleRight } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { IconTitle } from '../IconTitle'
import { Scrim } from '../Scrim'

export type StripGalleryProps = ComponentProps<'ul'>

/**
 * 条带切图：多个入口并排时，每个入口取原图的一条竖带，等宽排列，底部统一压黑。
 *
 * 子元素是若干个 `Strip`，各自包进一个列表项。条带默认是 2:5 的竖条，
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
        'm-0 box-border grid list-none auto-cols-fr grid-flow-col grid-rows-[minmax(0,1fr)] gap-ark-1 p-0',
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
  /** 标题左边的图标，通常是一个 `Icon`。 */
  icon?: ReactNode
  /** 标题下面的英文小字。 */
  sub?: ReactNode
  /**
   * 标题下面那行“查看更多”。传 `null` 去掉。
   * @default 'VIEW MORE'
   */
  more?: ReactNode
}

type StripAsAnchor = StripOwnProps &
  Omit<ComponentProps<'a'>, keyof StripOwnProps> & { href: string }
type StripAsBlock = StripOwnProps &
  Omit<ComponentProps<'div'>, keyof StripOwnProps> & { href?: undefined }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<div>`。 */
export type StripProps = StripAsAnchor | StripAsBlock

const hoverTransition = 'duration-(--ark-motion-duration-base) ease-ark-standard'

/**
 * 一条竖带：图片铺满，底部压黑，左下角是“图标 + 中文粗字 + 英文小字”、
 * 一行 VIEW MORE 和一条短横线。`children` 是中文标题。
 *
 * 图片的饱和度默认压到 70%，给信号色让路。是链接时，悬停恢复饱和度，
 * 文字和横线变成信号色，横线拉满。
 */
export function Strip(props: StripProps) {
  const {
    src,
    alt = '',
    position,
    icon,
    sub,
    more = 'VIEW MORE',
    className,
    children,
    ...rest
  } = props
  const interactive = rest.href !== undefined

  const classes = cn(
    'group relative isolate box-border flex aspect-[2/5] min-w-0 flex-col items-start justify-end overflow-hidden p-ark-4 font-ark-cjk-sans text-ark-fg no-underline',
    'portrait:aspect-[5/2]',
    // 条带贴着列表的边，轮廓画在内侧
    interactive && focusRingInset,
    className,
  )

  const content = (
    <>
      <img
        src={src}
        alt={alt}
        style={position === undefined ? undefined : { objectPosition: position }}
        className={cn(
          'absolute inset-0 -z-2 m-0 block size-full max-w-none border-0 object-cover saturate-[0.7] select-none',
          interactive && ['transition-[filter] group-hover:saturate-100', hoverTransition],
        )}
      />
      <Scrim side="bottom" className="-z-1" />
      <IconTitle
        as="span"
        icon={icon}
        sub={sub}
        className={cn(interactive && ['group-hover:text-ark-signal-fg', colorTransition])}
      >
        {children}
      </IconTitle>
      {more != null && more !== false && (
        <span
          className={cn(
            'mt-ark-3 inline-flex items-center gap-ark-2 font-ark-data text-ark-label leading-ark-solid font-ark-bold text-ark-fg-muted',
            interactive && ['group-hover:text-ark-signal-fg', colorTransition],
          )}
        >
          {more}
          <span aria-hidden="true" className={triangleRight} />
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn(
          'mt-ark-2 block h-px w-ark-7 bg-ark-fg',
          interactive && [
            'transition-[width,background-color] group-hover:w-full group-hover:bg-ark-signal',
            hoverTransition,
          ],
        )}
      />
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
