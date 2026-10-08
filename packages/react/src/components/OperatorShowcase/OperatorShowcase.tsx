import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Codename, type CodenameElement } from '../Codename'
import { Divider } from '../Divider'
import { GhostTitle } from '../GhostTitle'
import { Portrait } from '../Portrait'
import { Scrim } from '../Scrim'
import { Stagger } from '../Stagger'

export interface OperatorShowcaseProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** 中文名，这一屏的标题。 */
  name: ReactNode
  /** 英文名，小字写在中文名上方。 */
  sub?: ReactNode
  /**
   * 文字区顶端的小标签，后面拖一条渐隐的细线。
   * @default 'PROFILE'
   */
  label?: ReactNode
  /** 名字旁边的阵营徽记，通常是一个 `Icon frame="triangle"`。组件库不带任何标识，请自备。 */
  emblem?: ReactNode
  /** 名字下面的一行小字：声优、所属这类信息。 */
  meta?: ReactNode
  /** 立绘的地址。请用带透明底的图：投影和重影都跟着轮廓走。 */
  src: string
  /**
   * 立绘的替代文字。旁边已经有名字，立绘通常只是陪衬。
   * @default ''
   */
  alt?: string
  /** 背景巨字：阵营名或 `RHODES` 这类英文，垫在最底层。 */
  ghost?: ReactNode
  /** 文字区最下面的一栏，通常放切换干员的 `ThumbnailStrip`。 */
  footer?: ReactNode
  /**
   * 名字渲染成哪个元素。
   * @default 'h2'
   */
  nameAs?: CodenameElement
}

/**
 * 官网干员屏的编排：左边是档案式的文字——小标签、英文名、中文名、徽记、简介，
 * 右边是出血的立绘，身后是同一张图放大去色的重影。只在文字一侧加遮罩。
 *
 * `children` 是简介，压在一块不透明的黑底上。文字逐项自左入场，立绘自右入场；
 * 换干员时给它换一个 `key`，入场会重播。
 *
 * 根元素需要一个高度（如 `h-[32rem]` 或铺满父元素），立绘占右侧五分之三。
 * 竖屏时立绘堆到文字上方，不再和文字并排；`footer` 比屏幕宽时自己横向滚动。
 * 这是组件库自己的竖屏编排，没有对照官网的竖屏。
 *
 * 本组件不带任何图片。请使用原创或已获授权的素材。
 */
export function OperatorShowcase({
  name,
  sub,
  label = 'PROFILE',
  emblem,
  meta,
  src,
  alt = '',
  ghost,
  footer,
  nameAs = 'h2',
  className,
  children,
  ...rest
}: OperatorShowcaseProps) {
  return (
    <section
      data-ark="operator-showcase"
      {...rest}
      className={cn(
        'relative isolate box-border grid min-h-96 overflow-hidden font-ark-cjk-sans text-ark-fg',
        // 竖屏：这一列不许被内容撑宽（一排缩略图会比屏幕宽）
        'portrait:min-h-0 portrait:grid-cols-[minmax(0,1fr)] portrait:content-start portrait:gap-ark-5 portrait:overflow-visible',
        className,
      )}
    >
      {ghost != null && (
        <GhostTitle className="absolute bottom-0 left-0 -z-3 portrait:hidden">{ghost}</GhostTitle>
      )}
      <Portrait
        src={src}
        alt={alt}
        ghost
        className={cn(
          'absolute inset-y-0 right-0 -z-2 aspect-auto h-full w-3/5',
          // 图片自右入场；减少动效时只淡入。竖屏时图片和屏幕一样宽，滑进来的那一下会撑出横向滚动条，也只淡入
          'landscape:motion-safe:animate-ark-enter-right motion-reduce:animate-ark-fade-in portrait:animate-ark-fade-in',
          'portrait:relative portrait:inset-auto portrait:z-auto portrait:h-80 portrait:w-full',
        )}
      />
      <Scrim side="left" className="-z-1 portrait:hidden" />
      <Stagger className="grid max-w-[33.625rem] content-center justify-items-start gap-ark-4 portrait:max-w-none portrait:grid-cols-[minmax(0,1fr)] portrait:[&>*]:max-w-full">
        {label != null && <Divider label={label} variant="fade" className="w-64 max-w-full" />}
        <div className="flex items-end gap-ark-5">
          {/* 官网实测：中文名是 Bold、不收字距，英文名 1.25rem 对中文名 3.75rem */}
          <Codename as={nameAs} size="lg" sub={sub} className="font-ark-bold tracking-ark-normal">
            {name}
          </Codename>
          {emblem != null && (
            // 徽记高 5rem，离名字 1.5rem（官网实测）
            <span className="flex shrink-0 text-[5rem] leading-ark-solid">{emblem}</span>
          )}
        </div>
        {meta != null && (
          <p className="m-0 text-ark-label leading-ark-snug text-ark-fg-secondary">{meta}</p>
        )}
        {children != null && (
          // 官网实测：不透明的黑底，1.125rem、行高 1.4、#ababab，左右各留 3.75rem
          <div
            data-ark-tone="dark"
            className="box-border bg-ark-neutral-black px-[3.75rem] pt-[0.875rem] pb-[1.125rem] text-ark-body leading-ark-snug text-ark-fg-muted portrait:px-ark-4"
          >
            {children}
          </div>
        )}
        {footer != null && (
          // 竖屏时放不下就自己横向滚动，不把整屏撑宽。四周留 4px 给焦点轮廓
          <div className="portrait:-m-1 portrait:max-w-[calc(100%+0.5rem)] portrait:overflow-x-auto portrait:p-1">
            {footer}
          </div>
        )}
      </Stagger>
    </section>
  )
}
