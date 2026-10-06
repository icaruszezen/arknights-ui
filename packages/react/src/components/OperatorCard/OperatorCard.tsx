import type { ComponentProps, MouseEventHandler, ReactNode } from 'react'
import { colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { Codename } from '../Codename'
import { Rating } from '../Rating'

export type OperatorRarity = 1 | 2 | 3 | 4 | 5 | 6

interface OperatorCardOwnProps {
  /** 立绘的地址：胸像，脸落在上三分之一。不给就只有一块石墨底。 */
  src?: string
  /**
   * 立绘的替代文字。卡片上已经有代号，立绘通常只是陪衬。
   * @default ''
   */
  alt?: string
  /** 稀有度。双重编码：右上角的星数，加卡片底边的颜色条。 */
  rarity?: OperatorRarity
  /** 左上角的职业图标，通常是一个 `Icon`。组件库不带图标，请自备。 */
  classIcon?: ReactNode
  /** 等级，写在代号上方。 */
  level?: number
  /** 精英化阶段，写成 `E1`、`E2`；0 或不给就不显示。 */
  elite?: number
  /** 代号下面的英文名。 */
  sub?: ReactNode
  /** 选中：内侧一圈信号色描边。是按钮时同时输出 `aria-pressed`。 */
  selected?: boolean
}

type OperatorCardAsAnchor = OperatorCardOwnProps &
  Omit<ComponentProps<'a'>, keyof OperatorCardOwnProps> & { href: string }
type OperatorCardAsButton = OperatorCardOwnProps &
  Omit<ComponentProps<'button'>, keyof OperatorCardOwnProps> & {
    href?: undefined
    onClick: MouseEventHandler<HTMLButtonElement>
  }
type OperatorCardAsBlock = OperatorCardOwnProps &
  Omit<ComponentProps<'div'>, keyof OperatorCardOwnProps> & {
    href?: undefined
    onClick?: undefined
  }

/**
 * 传入 `href` 渲染为 `<a>`；给了 `onClick` 渲染为 `<button type="button">`；
 * 两样都不给就只是一张展示用的卡片。`children` 是代号。
 */
export type OperatorCardProps = OperatorCardAsAnchor | OperatorCardAsButton | OperatorCardAsBlock

const base =
  // @container：卡片自己是容器，里面的星级按卡片的宽度决定放在哪
  'group @container relative isolate m-0 box-border flex aspect-[1/2] w-40 shrink-0 flex-col justify-end overflow-hidden border-0 bg-ark-neutral-graphite p-0 text-left font-ark-cjk-sans text-ark-fg no-underline'

const interactive = cn('cursor-pointer appearance-none select-none', focusRingInset)

// 稀有度色是固定语义，不跟随可替换的信号色
const tierBar: Record<OperatorRarity, string> = {
  1: 'bg-ark-tier-1',
  2: 'bg-ark-tier-2',
  3: 'bg-ark-tier-3',
  4: 'bg-ark-tier-4',
  5: 'bg-ark-tier-5',
  6: 'bg-ark-tier-6',
}

// 卡片可能是一个 <button>，里面只能放行内元素，所以立绘和遮罩直接写成 <img> 和 <span>，
// 不套 Portrait、Scrim（它们的根是 <div>）。裁切方式同 Portrait 的 bust：铺满，脸落在上三分之一。
// 饱和度默认压到 80%，给信号色让路；能点的卡片悬停时恢复
const portraitBase =
  'absolute inset-0 -z-2 m-0 block size-full max-w-none border-0 object-cover object-[50%_15%] saturate-[0.8] select-none'
const portraitHover =
  'transition-[filter] duration-(--ark-motion-duration-base) ease-ark-standard group-hover:saturate-100'

// 只压下半部：贴底 0.5rem 是实黑，到卡片 55% 的高度渐隐完
const scrim =
  'pointer-events-none absolute inset-0 -z-1 bg-[linear-gradient(to_top,var(--ark-color-neutral-black)_0.5rem,transparent_55%)]'

/**
 * 干员卡片：一张竖长的胸像，信息压在四角——左上职业图标，右上星级，
 * 左下等级与精英化阶段，底部代号。下半部压一片黑色渐变，保证白字读得清。
 *
 * 稀有度用星数和底边色条双重编码，任何一种单独拿掉，信息仍然完整。
 * 默认 10rem 宽、1:2，用 `w-*` 和 `aspect-*` 调；多张并排时留 4px 的缝。
 */
export function OperatorCard(props: OperatorCardProps) {
  const {
    src,
    alt = '',
    rarity,
    classIcon,
    level,
    elite,
    sub,
    selected = false,
    className,
    children,
    ...rest
  } = props
  const clickable = rest.href !== undefined || rest.onClick !== undefined

  const content = (
    <>
      {src !== undefined && (
        <img src={src} alt={alt} className={cn(portraitBase, clickable && portraitHover)} />
      )}
      <span aria-hidden="true" className={scrim} />
      {classIcon != null && (
        <span className="absolute top-0 left-0 grid size-8 place-items-center bg-ark-neutral-black text-ark-neutral-white [&>svg]:block [&>svg]:size-5">
          {classIcon}
        </span>
      )}
      {rarity !== undefined && (
        // 卡片窄到放不下“图标 + 六颗星”时，星级下移一行，不压住职业图标
        <Rating
          value={rarity}
          size="sm"
          className="absolute top-ark-2 right-ark-2 @max-[8.5rem]:top-10"
        />
      )}
      <span className="grid gap-ark-1 px-ark-2 pb-ark-3">
        {(level !== undefined || (elite !== undefined && elite > 0)) && (
          <span className="flex items-baseline gap-ark-2 leading-ark-solid">
            {elite !== undefined && elite > 0 && (
              <span className="border border-ark-rule-strong px-ark-1 py-0.5 font-ark-data text-ark-caption font-ark-bold">
                <span className="sr-only">精英化阶段 {elite}</span>
                <span aria-hidden="true">E{elite}</span>
              </span>
            )}
            {level !== undefined && (
              <span className="flex items-baseline gap-ark-1">
                <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted">
                  LV
                </span>
                <b className="font-ark-data text-ark-body-lg font-ark-bold">{level}</b>
              </span>
            )}
          </span>
        )}
        <Codename
          as="span"
          size="sm"
          sub={sub}
          // 英文名在卡片上排在代号下面：卡片从上往下读到底，最后是名字
          className={cn(
            'flex-col',
            clickable && ['group-hover:text-ark-signal-fg', colorTransition],
          )}
        >
          {children}
        </Codename>
      </span>
      {rarity !== undefined && (
        <span
          aria-hidden="true"
          className={cn('absolute inset-x-0 bottom-0 h-(--ark-line-strong)', tierBar[rarity])}
        />
      )}
      {selected && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-2 border-ark-signal"
        />
      )}
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a
        data-ark="operator-card"
        data-ark-tone="dark"
        aria-current={selected ? 'true' : undefined}
        {...rest}
        className={cn(base, interactive, className)}
      >
        {content}
      </a>
    )
  }
  if (rest.onClick !== undefined) {
    return (
      <button
        data-ark="operator-card"
        data-ark-tone="dark"
        type="button"
        aria-pressed={selected}
        {...rest}
        className={cn(base, interactive, className)}
      >
        {content}
      </button>
    )
  }
  return (
    <div
      data-ark="operator-card"
      data-ark-tone="dark"
      data-selected={selected ? '' : undefined}
      {...rest}
      className={cn(base, className)}
    >
      {content}
    </div>
  )
}
