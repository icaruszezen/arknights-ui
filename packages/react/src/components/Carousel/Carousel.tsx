import {
  type ComponentProps,
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { PauseIcon } from '../../internal/icons'
import { toItems } from '../../internal/toItems'
import {
  colorTransition,
  focusRing,
  focusRingInset,
  triangleLeft,
  triangleRight,
} from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'
import { useReducedMotion } from '../../utils/useReducedMotion'
import { Counter } from '../Counter'
import { Progress } from '../Progress'
import { Scrim } from '../Scrim'

export interface CarouselProps extends ComponentProps<'section'> {
  /** 当前是第几张，从 0 起。受控：请在 `onIndexChange` 里更新它。 */
  index?: number
  /**
   * 一开始是第几张（非受控）。
   * @default 0
   */
  defaultIndex?: number
  /** 换到另一张时调用。 */
  onIndexChange?: (index: number) => void
  /**
   * 每隔多少毫秒自动换下一张。不给就不自动轮播。
   * 打开后多一个暂停按钮；指针悬停、焦点在里面、页面不可见时不走，
   * 用户要求减少动效时完全不启动。
   */
  autoplay?: number
  /**
   * 首尾相接：最后一张的下一张是第一张。
   * @default true
   */
  loop?: boolean
  /**
   * 进度条右边的计数（`02 // 02 / 05`）。
   * @default true
   */
  counter?: boolean
  /**
   * “上一张”按钮的名称。
   * @default '上一张'
   */
  prevLabel?: string
  /**
   * “下一张”按钮的名称。
   * @default '下一张'
   */
  nextLabel?: string
  /**
   * 自动轮播进行中时，暂停按钮的名称。
   * @default '暂停轮播'
   */
  pauseLabel?: string
  /**
   * 自动轮播暂停后，继续按钮的名称。
   * @default '继续轮播'
   */
  playLabel?: string
}

// 横向滑过这么远（像素）才算翻页
const SWIPE_DISTANCE = 48

const control = cn(
  'm-0 box-border grid size-11 shrink-0 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-ark-fg',
  'hover:bg-ark-invert hover:text-ark-on-invert',
  'disabled:cursor-not-allowed disabled:text-ark-neutral-gray-600 disabled:hover:bg-transparent',
  colorTransition,
  focusRing,
)

/**
 * 轮播：一张 16:9 的大图，下面一条 0.5rem 高的进度条——中灰的轨道上一段同高的信号色，
 * 停在当前这一张的位置。同级之间切换用水平位移。
 *
 * 子元素每个是一张幻灯片，通常用 `CarouselSlide`，也可以放任意内容。
 * 需要一个名称：请传 `aria-label`。比例由 `--ark-carousel-ratio` 决定，默认 `16 / 9`。
 * 官网的轮播右边出血到右栏的竖线，这由页面用负边距去做。
 *
 * 翻页用右下角的两个按钮；触屏上也可以横向滑动。非当前的幻灯片不接收焦点和点击。
 */
export function Carousel({
  index,
  defaultIndex = 0,
  onIndexChange,
  autoplay,
  loop = true,
  counter = true,
  prevLabel = '上一张',
  nextLabel = '下一张',
  pauseLabel = '暂停轮播',
  playLabel = '继续轮播',
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: CarouselProps) {
  const slides = toItems(children)
  const count = slides.length
  const [requested, setIndex] = useControllableState(index, defaultIndex, onIndexChange)
  // 越界的序号收回到范围内
  const current = count === 0 ? 0 : Math.min(Math.max(requested, 0), count - 1)
  const atStart = !loop && current === 0
  const atEnd = !loop && current >= count - 1

  const go = (next: number) => {
    if (count === 0) return
    setIndex(loop ? (next + count) % count : Math.min(Math.max(next, 0), count - 1))
  }

  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const auto = autoplay !== undefined && autoplay > 0 && count > 1
  // rotating：用户没有按暂停；running：此刻真的在计时
  const rotating = auto && !paused && !reduced
  const running = rotating && !hovered && !focused && !atEnd

  // go 每次渲染都是新的，放进 ref 里，不让它重启计时
  const latestGo = useRef(go)
  useEffect(() => {
    latestGo.current = go
  })

  // 依赖里有 current：手动翻页之后重新计时，不会刚翻过去就又被换掉
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      // 页面不可见时不走：回来时不会发现已经翻过去好几张
      if (!document.hidden) latestGo.current(current + 1)
    }, autoplay)
    return () => clearInterval(timer)
  }, [running, autoplay, current])

  // 触屏横向滑动翻页。鼠标不算：有按钮可用，拖动还会和选中文字、点链接冲突
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swiped.current = false
    swipeStart.current =
      event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    // 明显是横向的才算，纵向的滑动留给页面滚动
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return
    swiped.current = true
    go(current + (dx < 0 ? 1 : -1))
  }

  // 换页时把“第几张 / 共几张”念出来；自动轮播进行中不念，免得每隔几秒打断一次
  const position = (
    <div aria-live={rotating ? 'off' : 'polite'} aria-atomic="true" className="flex shrink-0">
      {counter ? (
        <Counter size="sm" value={current + 1} total={count} />
      ) : (
        <span className="sr-only">
          {current + 1} / {count}
        </span>
      )}
    </div>
  )

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: 使用方会给 aria-label，有名称的 <section> 就是 region，可以带 aria-roledescription
    // biome-ignore lint/a11y/noStaticElementInteractions: 这里的悬停和焦点事件只用来暂停自动轮播，不是可以操作的东西
    <section
      data-ark="carousel"
      aria-roledescription="carousel"
      {...rest}
      onPointerEnter={event => {
        onPointerEnter?.(event)
        if (event.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={event => {
        onPointerLeave?.(event)
        setHovered(false)
      }}
      onFocus={event => {
        onFocus?.(event)
        setFocused(true)
      }}
      onBlur={event => {
        onBlur?.(event)
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      className={cn('box-border grid gap-ark-3 font-ark-cjk-sans text-ark-fg', className)}
    >
      {/* 滑动只是翻页的另一种方式，键盘和读屏用下面的“上一张 / 下一张”按钮 */}
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeStart.current = null
        }}
        // 刚滑完一次时，手指抬起会在幻灯片上补一个 click：拦下来，不然链接会跟着跳转
        onClickCapture={event => {
          if (!swiped.current) return
          swiped.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
        // touch-pan-y：纵向滑动仍然滚动页面，横向的交给上面的处理
        className="relative isolate box-border aspect-[var(--ark-carousel-ratio,16/9)] touch-pan-y overflow-hidden bg-ark-neutral-ink-900"
      >
        <div
          className="flex h-full translate-x-[calc(var(--ark-carousel-index)*-100%)] transition-[translate] duration-(--ark-motion-duration-slow) ease-ark-standard motion-reduce:transition-none"
          style={{ '--ark-carousel-index': current } as CSSProperties}
        >
          {slides.map(({ key, child, index: slide }) => (
            // biome-ignore lint/a11y/useSemanticElements: 幻灯片按 WAI-ARIA 轮播模式标成 group，不是表单的 fieldset
            <div
              key={key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slide + 1} / ${count}`}
              // 移出画面的幻灯片不接收焦点和点击，读屏也跳过
              inert={slide !== current}
              className="relative box-border h-full w-full shrink-0 grow-0 basis-full"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-ark-4">
        {/* 位置已经由计数读出，这一条只是它的图形：中灰轨道上一段信号色，停在当前页的位置 */}
        <Progress
          aria-hidden="true"
          variant="rail"
          span={1}
          value={current + 1}
          max={Math.max(count, 1)}
          className="min-w-0 grow basis-0"
        />
        {count > 0 && position}
        {count > 1 && (
          <div className="flex shrink-0">
            {auto && (
              <button
                type="button"
                aria-label={paused ? playLabel : pauseLabel}
                onClick={() => setPaused(!paused)}
                className={control}
              >
                {paused ? (
                  <span aria-hidden="true" className={triangleRight} />
                ) : (
                  <PauseIcon className="size-5" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label={prevLabel}
              disabled={atStart}
              onClick={() => go(current - 1)}
              className={control}
            >
              <span aria-hidden="true" className={triangleLeft} />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              disabled={atEnd}
              onClick={() => go(current + 1)}
              className={control}
            >
              <span aria-hidden="true" className={triangleRight} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

interface CarouselSlideOwnProps {
  /** 图片地址。 */
  src: string
  /**
   * 替代文字。图上压了标题时，图片通常只是陪衬。
   * @default ''
   */
  alt?: string
  /**
   * 取原图的哪一块：图片的 `object-position`，如 `'70% 30%'`。
   * @default 居中
   */
  position?: string
}

type CarouselSlideAsAnchor = CarouselSlideOwnProps &
  Omit<ComponentProps<'a'>, keyof CarouselSlideOwnProps> & { href: string }
type CarouselSlideAsBlock = CarouselSlideOwnProps &
  Omit<ComponentProps<'div'>, keyof CarouselSlideOwnProps> & { href?: undefined }

/** 传入 `href` 时渲染为 `<a>`，否则渲染为 `<div>`。 */
export type CarouselSlideProps = CarouselSlideAsAnchor | CarouselSlideAsBlock

/**
 * 一张图片幻灯片：图片铺满。有 `children` 时把它压在左下角，并只在底部加一片黑色渐变——
 * 图上压字只压文字一侧。传入 `href` 整张都是链接。
 */
export function CarouselSlide(props: CarouselSlideProps) {
  const { src, alt = '', position, className, children, ...rest } = props
  const classes = cn(
    'relative isolate box-border block size-full overflow-hidden font-ark-cjk-sans text-ark-fg no-underline',
    // 幻灯片贴着会裁掉溢出内容的容器，轮廓画在内侧
    rest.href !== undefined && focusRingInset,
    className,
  )

  const content = (
    <>
      <img
        src={src}
        alt={alt}
        style={position === undefined ? undefined : { objectPosition: position }}
        className="absolute inset-0 -z-2 m-0 block size-full max-w-none border-0 object-cover select-none"
      />
      {children != null && children !== false && (
        <Scrim className="flex flex-col items-start justify-end gap-ark-2 p-ark-5">
          {children}
        </Scrim>
      )}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a data-ark="carousel-slide" data-ark-tone="dark" {...rest} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <div data-ark="carousel-slide" data-ark-tone="dark" {...rest} className={classes}>
      {content}
    </div>
  )
}
