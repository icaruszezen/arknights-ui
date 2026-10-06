import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { GhostTitle } from '../GhostTitle'
import { Heading, type HeadingElement } from '../Heading'
import { Parallax, type ParallaxSource } from '../Parallax'
import { Scrim } from '../Scrim'

export type BannerSide = 'left' | 'right'

export interface BannerProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 卡池名，这张横幅的标题。给了 `logo` 时它只留给读屏。 */
  title: ReactNode
  /** 标题上方的英文。给了 `logo` 时不显示。 */
  sub?: ReactNode
  /**
   * 标题标识：每个卡池、每个活动专门设计的那个中英双语的标题字。
   * 风格可以各不相同，但放进来之后位置和尺寸是固定的（6rem 高）。
   * 组件库不带任何标识，请使用原创或已获授权的素材。
   */
  logo?: ReactNode
  /** 标题上方的小标签，如“限定寻访”。 */
  tag?: ReactNode
  /** 标题下面的开放时间，通常是一个 `TimeRange`。 */
  period?: ReactNode
  /** 行动按钮：通常是并排的两个 `ActionButton`，代价直接印在按钮上。 */
  actions?: ReactNode
  /** 次级入口：概率、规则这类小字链接，放在角落。 */
  links?: ReactNode
  /**
   * 标题与规则在哪一侧。人物偏另一侧，遮罩只压文字这一侧。
   * @default 'left'
   */
  side?: BannerSide
  /** 背景巨字，垫在人物身后。 */
  ghost?: ReactNode
  /**
   * 视差跟着什么走，见 `Parallax`。
   * @default 'pointer'
   */
  source?: ParallaxSource
  /**
   * 标题渲染成哪个元素。
   * @default 'h2'
   */
  titleAs?: HeadingElement
}

// 文字在哪一侧，规则链接就在那一侧的下角，行动按钮在对面：按钮压在人物的下半身上，不和标题抢位置
const layouts: Record<BannerSide, { text: string; footer: string; ghost: string }> = {
  left: { text: 'justify-self-start', footer: 'flex-row', ghost: 'right-ark-6' },
  right: { text: 'justify-self-end', footer: 'flex-row-reverse', ghost: 'left-ark-6' },
}

/**
 * 寻访的卡池横幅：一张主视觉撑满，人物偏一侧，另一侧留给标题与规则。
 * 这是全游戏最“有戏”的界面——大图、视差、仪式感，也是扁平界面里少数主动制造纵深的地方。
 *
 * `children` 是视差图层：若干个 `ParallaxLayer`，大小不同的立绘前后叠放，
 * 以不同的幅度位移。2–4 层为宜。其余内容通过属性放进固定的位置：
 * 标题在一侧正中，规则链接在这一侧的下角，行动按钮在对面的下角。放不下时底部那一行自动折行。
 *
 * 默认 16:9，用 `aspect-*` 或 `h-*` 调。切换卡池用 `Carousel` 加竖排的 `ThumbnailStrip`。
 */
export function Banner({
  title,
  sub,
  logo,
  tag,
  period,
  actions,
  links,
  side = 'left',
  ghost,
  source,
  titleAs = 'h2',
  className,
  children,
  ...rest
}: BannerProps) {
  const layout = layouts[side]
  // 各级标题与 p、div 共用同一组属性，这里按 h2 处理类型
  const Title = titleAs as 'h2'
  return (
    <Parallax
      data-ark="banner"
      data-ark-tone="dark"
      source={source}
      {...rest}
      className={cn(
        // 两行：标题区撑满，底部一行放规则链接和行动按钮
        'grid aspect-video min-h-80 grid-rows-[minmax(0,1fr)_auto] bg-ark-neutral-black font-ark-cjk-sans text-ark-fg',
        className,
      )}
    >
      {ghost != null && (
        <GhostTitle className={cn('absolute bottom-ark-4 -z-2', layout.ghost)}>{ghost}</GhostTitle>
      )}
      {children}
      {/* 只压文字一侧，人物那一侧保持原样 */}
      <Scrim side={side} className="-z-1 from-ark-neutral-black/85" />

      <div
        className={cn(
          'relative box-border grid max-w-[55%] content-center justify-items-start gap-ark-4 px-ark-7 pt-ark-7 pb-ark-4 portrait:max-w-none',
          layout.text,
        )}
      >
        {tag}
        {logo != null ? (
          <>
            <Title className="sr-only">{title}</Title>
            <div
              aria-hidden="true"
              className="flex h-24 max-w-full items-center [&>*]:block [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full"
            >
              {logo}
            </div>
          </>
        ) : (
          <Heading as={titleAs} size="lg" sub={sub}>
            {title}
          </Heading>
        )}
        {period != null && (
          <p className="m-0 text-ark-label leading-ark-snug text-ark-fg-secondary">{period}</p>
        )}
      </div>

      {(actions != null || links != null) && (
        <div
          className={cn(
            'relative box-border flex flex-wrap items-end justify-between gap-ark-4 px-ark-7 pb-ark-6',
            layout.footer,
          )}
        >
          <div className="flex flex-wrap gap-ark-4 pb-ark-1 text-ark-caption leading-ark-solid text-ark-fg-muted">
            {links}
          </div>
          <div className="flex flex-wrap items-end gap-ark-2">{actions}</div>
        </div>
      )}
    </Parallax>
  )
}
