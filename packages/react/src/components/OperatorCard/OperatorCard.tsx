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
  /** 稀有度。三处编码：左上角的星数、名字带上方那片网点的颜色、卡片底边的颜色条。 */
  rarity?: OperatorRarity
  /** 左上角的职业图标，通常是一个 `Icon`。组件库不带图标，请自备。 */
  classIcon?: ReactNode
  /** 等级，写在左下角的圆环里。 */
  level?: number
  /** 精英化阶段，写成 `E1`、`E2`，在等级圆环的上方；0 或不给就不显示。 */
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
  // @container：名字带上缘的落差按卡片的宽度算（20cqw）
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

// 网点取当前的文字色
const tierGlow: Record<OperatorRarity, string> = {
  1: 'text-ark-tier-1',
  2: 'text-ark-tier-2',
  3: 'text-ark-tier-3',
  4: 'text-ark-tier-4',
  5: 'text-ark-tier-5',
  6: 'text-ark-tier-6',
}

// 卡片可能是一个 <button>，里面只能放行内元素，所以立绘直接写成 <img>，
// 不套 Portrait（它的根是 <div>）。裁切方式同 Portrait 的 bust：铺满，脸落在上三分之一。
// 饱和度默认压到 80%，给信号色让路；能点的卡片悬停时恢复
const portraitBase =
  'absolute inset-0 -z-2 m-0 block size-full max-w-none border-0 object-cover object-[50%_15%] saturate-[0.8] select-none'
const portraitHover =
  'transition-[filter] duration-(--ark-motion-duration-base) ease-ark-standard group-hover:saturate-100'

// 名字带上方的一片半调网点：比默认的网点更密、更实，自下而上渐隐
const glow = cn(
  'pointer-events-none absolute inset-x-0 bottom-0 -z-1 h-3/5 ark-pattern-halftone',
  '[--ark-pattern-halftone:radial-gradient(circle,#000_1.25px,transparent_1.75px)_0_0/0.375rem_0.375rem]',
  '[--ark-pattern-fade:linear-gradient(to_top,#000_35%,transparent)]',
)

// 名字带：近黑色，上缘左高右低，落差是卡片宽度的五分之一（实机约 12°）。
// 底色画在 ::before 上再裁，带子自己不裁——里面的圆环和文字不能被切到
const band = cn(
  'relative isolate box-border grid min-h-[calc(20cqw+2.5rem)] grid-cols-[auto_minmax(0,1fr)] items-end gap-x-ark-2 px-ark-2 pt-ark-2 pb-ark-3',
  'before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-ink-900 before:[clip-path:polygon(0_0,100%_20cqw,100%_100%,0_100%)]',
)

/**
 * 干员卡片：一张竖长的胸像。左上是职业图标，星级紧跟在它后面；下面一条近黑色的带，
 * 上缘左高右低，等级写在左边的圆环里，代号右对齐。带子上方垫一片稀有度色的网点。
 *
 * 稀有度用星数、网点的颜色和底边色条三处编码，任何一种单独拿掉，信息仍然完整。
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
  const promoted = elite !== undefined && elite > 0

  const content = (
    <>
      {src !== undefined && (
        <img src={src} alt={alt} className={cn(portraitBase, clickable && portraitHover)} />
      )}
      {(classIcon != null || rarity !== undefined) && (
        // 卡片窄到放不下“图标 + 六颗星”时，星级自己换到下一行
        <span className="absolute top-0 left-0 flex max-w-full flex-wrap items-center gap-ark-1">
          {classIcon != null && (
            <span className="grid size-8 shrink-0 place-items-center bg-ark-neutral-black text-ark-neutral-white [&>svg]:block [&>svg]:size-5">
              {classIcon}
            </span>
          )}
          {rarity !== undefined && (
            <Rating value={rarity} size="sm" className={cn(classIcon == null && 'm-ark-2')} />
          )}
        </span>
      )}
      {rarity !== undefined && <span aria-hidden="true" className={cn(glow, tierGlow[rarity])} />}
      <span data-ark="operator-card-band" className={band}>
        <span className="grid justify-items-center gap-ark-1 leading-ark-solid">
          {promoted && (
            <span className="border border-ark-rule-strong px-ark-1 py-0.5 font-ark-data text-ark-caption font-ark-bold">
              <span className="sr-only">精英化阶段 {elite}</span>
              <span aria-hidden="true">E{elite}</span>
            </span>
          )}
          {level !== undefined && (
            // 等级圆环：黑色圆底，一圈星级的黄，LV 小字在数字上方
            <span className="box-border grid size-12 place-content-center justify-items-center gap-0.5 rounded-full bg-ark-neutral-black shadow-[inset_0_0_0_0.1875rem_var(--ark-color-tier-star)] @max-[9rem]:size-10">
              <span className="font-ark-latin-condensed text-[0.5rem] font-ark-medium tracking-ark-wide">
                LV
              </span>
              <b className="font-ark-data text-ark-body-lg font-ark-bold">{level}</b>
            </span>
          )}
        </span>
        <Codename
          as="span"
          size="sm"
          sub={sub}
          // 代号右对齐；英文名在卡片上排在代号下面：卡片从上往下读到底，最后是名字。
          // 卡片窄、名字长时会折成两行，text-balance 让两行一样长，不剩一个字孤零零地掉下去
          className={cn(
            'col-start-2 flex-col items-end text-right text-balance',
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
