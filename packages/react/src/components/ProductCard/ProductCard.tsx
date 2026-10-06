import { type ComponentProps, type MouseEventHandler, type ReactNode, useId } from 'react'
import { brighterMuted, colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type ProductCardTone = 'graphite' | 'paper'

export interface ProductCardProps extends Omit<ComponentProps<'div'>, 'title' | 'onClick'> {
  /** 商品图：一张图片或一个图标。组件库不带任何图片，请自备。 */
  media?: ReactNode
  /** 价格。数字自动加千分位，字符串原样输出。 */
  price: number | string
  /** 价格前的货币图标。它对读屏隐藏，货币的名称请给 `currencyLabel`。 */
  currency?: ReactNode
  /** 货币的名称，如“合成玉”。只给读屏。 */
  currencyLabel?: string
  /** 商品名下面的小字：数量、分类。 */
  sub?: ReactNode
  /** 售罄：商品图和价格压暗，盖上一条横带，不再可点。 */
  soldOut?: boolean
  /**
   * 售罄横带上的中文。
   * @default '售罄'
   */
  soldOutLabel?: ReactNode
  /**
   * 售罄横带上的英文小字。传 `null` 去掉。
   * @default 'SOLD OUT'
   */
  soldOutSub?: ReactNode
  /** 限时角标的内容，通常是剩余时间（可以放一个 `Countdown`）。给了就在左上角出现橙色角标。 */
  limited?: ReactNode
  /** 库存：自己已经有多少。兑换时不用再跳去仓库看。 */
  stock?: number | string
  /**
   * 库存前面的文字。
   * @default '库存'
   */
  stockLabel?: ReactNode
  /** 限购：还能买几次，如 `2/5`。 */
  limit?: ReactNode
  /**
   * 限购前面的文字。
   * @default '限购'
   */
  limitLabel?: ReactNode
  /**
   * 卡片的表面：石墨或纸白。
   * @default 'graphite'
   */
  tone?: ProductCardTone
  /** 给了就把整张卡片做成链接。 */
  href?: string
  /** 点卡片时调用，通常是打开购买确认。给了它整张卡片是一个按钮。 */
  onClick?: MouseEventHandler<HTMLElement>
}

const surfaces: Record<ProductCardTone, string> = {
  graphite: cn('bg-ark-overlay-panel-dark', brighterMuted),
  paper: 'bg-ark-overlay-panel-light',
}

const cover = cn(
  'absolute inset-0 z-1 m-0 box-border block cursor-pointer appearance-none border-0 bg-transparent p-0',
  focusRingInset,
)

const fact = 'flex items-baseline gap-ark-1'

/**
 * 商品卡片：采购中心是全游戏最接近常规扁平化设计的页面——卡片加投影，
 * 表达“这是可以拿走的东西”。价格贴在底部一条深色带里，右对齐。
 *
 * 做决定所需的信息就地给全：库存、限购次数、限时还剩多久，都写在卡片上，
 * 不让人来回跳转去查。`children` 是商品名。
 *
 * 给了 `href` 或 `onClick` 时整张卡片可点：点击区是盖在上面的一层，名称是商品名加价格。
 * 售罄的卡片不可点。默认 11rem 宽，用 `w-*` 调。
 */
export function ProductCard({
  media,
  price,
  currency,
  currencyLabel,
  sub,
  soldOut = false,
  soldOutLabel = '售罄',
  soldOutSub = 'SOLD OUT',
  limited,
  stock,
  stockLabel = '库存',
  limit,
  limitLabel = '限购',
  tone = 'graphite',
  href,
  onClick,
  className,
  children,
  ...rest
}: ProductCardProps) {
  const nameId = useId()
  const priceId = useId()
  const clickable = !soldOut && (href !== undefined || onClick !== undefined)
  const hasFacts = stock !== undefined || limit != null

  return (
    <div
      data-ark="product-card"
      data-ark-tone={tone === 'paper' ? 'light' : 'dark'}
      data-sold-out={soldOut ? '' : undefined}
      {...rest}
      className={cn(
        'group relative isolate box-border flex w-44 shrink-0 flex-col font-ark-cjk-sans text-ark-fg drop-shadow-ark-panel',
        surfaces[tone],
        className,
      )}
    >
      <div
        className={cn(
          'box-border grid aspect-[4/3] place-items-center p-ark-4 [&>img]:block [&>img]:max-h-full [&>img]:max-w-full',
          soldOut && 'opacity-40 grayscale',
        )}
      >
        {media}
      </div>

      {/* 售罄时只压暗商品图和价格：名字、库存这些文字仍然要读得清 */}
      <div className="grid gap-ark-1 px-ark-3 pb-ark-3">
        <span id={nameId} className="text-ark-label leading-ark-snug font-ark-bold">
          {children}
        </span>
        {sub != null && (
          <span className="text-ark-caption leading-ark-solid text-ark-fg-muted">{sub}</span>
        )}
        {hasFacts && (
          <dl className="m-0 mt-ark-1 flex flex-wrap gap-x-ark-3 gap-y-ark-1 text-ark-caption leading-ark-solid text-ark-fg-muted">
            {stock !== undefined && (
              <div className={fact}>
                <dt>{stockLabel}</dt>
                <dd className="m-0 font-ark-data font-ark-bold text-ark-fg">
                  {formatStatValue(stock)}
                </dd>
              </div>
            )}
            {limit != null && (
              <div className={fact}>
                <dt>{limitLabel}</dt>
                <dd className="m-0 font-ark-data font-ark-bold text-ark-fg">{limit}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* 价格带是固定的深色，放在纸白卡片上也一样 */}
      <div
        id={priceId}
        data-ark-tone="dark"
        className={cn(
          'mt-auto box-border flex h-8 items-center justify-end gap-ark-1 bg-ark-neutral-ink-950 px-ark-3 font-ark-data text-ark-body leading-ark-solid font-ark-bold text-ark-neutral-white',
          soldOut && 'text-ark-neutral-gray-500',
          // 悬停时价格带整块换成信号色
          clickable && [
            'group-hover:bg-ark-signal group-hover:text-ark-on-signal',
            colorTransition,
          ],
        )}
      >
        {currency != null && (
          <span
            aria-hidden="true"
            className="grid size-4 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
          >
            {currency}
          </span>
        )}
        {currencyLabel !== undefined && <span className="sr-only">{currencyLabel}</span>}
        {formatStatValue(price)}
      </div>

      {limited != null && (
        // 限时用橙色：小面积、高浓度，固定语义，不跟随可替换的信号色
        <span className="absolute top-0 left-0 box-border inline-flex h-5 items-center gap-ark-1 bg-ark-signal-accent px-ark-2 text-ark-caption leading-ark-solid font-ark-bold whitespace-nowrap text-ark-neutral-black">
          {limited}
        </span>
      )}

      {soldOut && (
        // 标记是一条横带，不旋转：全局只用 45°，印章式的小角度不在这套语言里
        <div
          data-ark-tone="dark"
          className="pointer-events-none absolute inset-x-0 top-[30%] box-border flex h-9 items-center justify-center gap-ark-2 border-y border-ark-neutral-white/30 bg-ark-neutral-black/85 leading-ark-solid text-ark-neutral-white"
        >
          <span className="text-ark-label font-ark-bold">{soldOutLabel}</span>
          {soldOutSub != null && (
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-neutral-gray-300">
              {soldOutSub}
            </span>
          )}
        </div>
      )}

      {clickable &&
        (href !== undefined ? (
          // biome-ignore lint/a11y/useAnchorContent: 名称由 aria-labelledby 指向商品名和价格，链接自己不放内容
          <a
            href={href}
            aria-labelledby={`${nameId} ${priceId}`}
            onClick={onClick}
            className={cover}
          />
        ) : (
          <button
            type="button"
            aria-labelledby={`${nameId} ${priceId}`}
            onClick={onClick}
            className={cover}
          />
        ))}
    </div>
  )
}
