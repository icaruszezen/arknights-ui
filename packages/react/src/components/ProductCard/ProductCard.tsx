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
  /** 商品图下面的小字：数量、分类。 */
  sub?: ReactNode
  /** 售罄：整张卡片褪色，中间斜盖一条暗红的带，不再可点。 */
  soldOut?: boolean
  /**
   * 售罄带上的中文。
   * @default '售罄'
   */
  soldOutLabel?: ReactNode
  /**
   * 售罄带上的英文小字，写在中文的两侧。传 `null` 去掉。
   * @default 'OUT OF STOCK'
   */
  soldOutSub?: ReactNode
  /** 限时角标的内容，通常是剩余时间（可以放一个 `Countdown`）。给了就在商品图的左上角出现橙色角标。 */
  limited?: ReactNode
  /** 自己已经有多少，写在商品图下面。兑换时不用再跳去仓库看。 */
  stock?: number | string
  /**
   * 已有数量前面的文字。
   * @default '已有'
   */
  stockLabel?: ReactNode
  /** 还能买多少，写在商品图右上角的小块里，如 `15`。 */
  limit?: ReactNode
  /**
   * 剩余数量前面的文字。
   * @default '剩余'
   */
  limitLabel?: ReactNode
  /**
   * 卡片的表面：石墨或纸白。实机的商品卡片是白的。
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

// 名称带：纸白卡片上是石墨色（实机取色 #464646）；石墨卡片上再深一档，才分得出来
const titleBars: Record<ProductCardTone, string> = {
  graphite: 'bg-ark-neutral-ink-900',
  paper: 'bg-ark-neutral-graphite',
}

const cover = cn(
  'absolute inset-0 z-1 m-0 box-border block cursor-pointer appearance-none border-0 bg-transparent p-0',
  focusRingInset,
)

/**
 * 商品卡片：采购中心是全游戏最接近常规扁平化设计的页面——卡片加投影，
 * 表达“这是可以拿走的东西”。顶部一条深色带写商品名，中间是商品图，
 * 底部一条居中的价格带，四周留边。
 *
 * 做决定所需的信息就地给全：还能买多少写在商品图的右上角，自己已有多少写在图下面，
 * 限时还剩多久是左上角的角标，不让人来回跳转去查。`children` 是商品名。
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
  soldOutSub = 'OUT OF STOCK',
  limited,
  stock,
  stockLabel = '已有',
  limit,
  limitLabel = '剩余',
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
      {/* 名称带是固定的深色，放在纸白卡片上也一样。售罄时褪成灰底深字，名字仍然读得清 */}
      <div
        data-ark-tone={soldOut ? 'light' : 'dark'}
        className={cn(
          'box-border flex min-h-7 items-center justify-center px-ark-2 py-ark-1',
          soldOut ? 'bg-ark-neutral-gray-500 text-ark-neutral-black' : titleBars[tone],
          !soldOut && 'text-ark-neutral-white',
        )}
      >
        <span id={nameId} className="text-center text-ark-label leading-ark-snug font-ark-bold">
          {children}
        </span>
      </div>

      <div className="relative">
        <div
          className={cn(
            'box-border grid aspect-[4/3] place-items-center p-ark-4 [&>img]:block [&>img]:max-h-full [&>img]:max-w-full',
            soldOut && 'opacity-40 grayscale',
          )}
        >
          {media}
        </div>
        {limited != null && (
          // 限时用橙色：小面积、高浓度，固定语义，不跟随可替换的信号色
          <span className="absolute top-0 left-0 box-border inline-flex h-5 items-center gap-ark-1 bg-ark-signal-accent px-ark-2 text-ark-caption leading-ark-solid font-ark-bold whitespace-nowrap text-ark-neutral-black">
            {limited}
          </span>
        )}
        {limit != null && (
          // 还能买多少：右上角一个浅灰的小块（实机的“剩余15”）
          <dl className="absolute top-ark-1 right-ark-1 m-0 box-border flex h-5 items-center gap-0.5 bg-ark-neutral-gray-300 px-ark-1 text-ark-caption leading-ark-solid whitespace-nowrap text-ark-neutral-black">
            <dt>{limitLabel}</dt>
            <dd className="m-0 font-ark-data font-ark-bold">{limit}</dd>
          </dl>
        )}
      </div>

      {(sub != null || stock !== undefined) && (
        <div className="grid justify-items-center gap-ark-1 px-ark-3 pb-ark-2 text-center text-ark-caption leading-ark-solid text-ark-fg-muted">
          {sub != null && <span>{sub}</span>}
          {stock !== undefined && (
            <dl className="m-0 flex items-baseline gap-ark-1">
              <dt>{stockLabel}</dt>
              <dd className="m-0 font-ark-data font-ark-bold text-ark-fg">
                {formatStatValue(stock)}
              </dd>
            </dl>
          )}
        </div>
      )}

      {/* 价格带是固定的中灰（实机取色 #585858），居中，四周留边 */}
      <div
        id={priceId}
        data-ark-tone="dark"
        className={cn(
          'mx-ark-2 mt-auto mb-ark-2 box-border flex h-8 items-center justify-center gap-ark-1 px-ark-3 font-ark-data text-ark-body leading-ark-solid font-ark-bold',
          soldOut
            ? 'bg-ark-neutral-ink-700 text-ark-neutral-gray-400'
            : 'bg-ark-neutral-gray-600 text-ark-neutral-white',
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

      {soldOut && (
        // 售罄是斜盖上去的一条带（实机量得约 -12°），两端被卡片裁掉。
        // 这是全套语言里少数不走 45° 的地方：它是一枚印章，不是界面的结构线
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            data-ark="product-card-sold-out"
            className="absolute -inset-x-ark-4 top-[38%] box-border flex h-9 -rotate-12 items-center justify-center gap-ark-2 bg-ark-signal-alert leading-ark-solid whitespace-nowrap text-ark-neutral-white"
          >
            {soldOutSub != null && (
              <span
                aria-hidden="true"
                className="font-ark-latin-serif text-[0.625rem] tracking-ark-wide"
              >
                {soldOutSub}
              </span>
            )}
            <span className="font-ark-cjk-serif text-ark-body-lg font-ark-heavy">
              {soldOutLabel}
            </span>
            {soldOutSub != null && (
              <span className="font-ark-latin-serif text-[0.625rem] tracking-ark-wide">
                {soldOutSub}
              </span>
            )}
          </div>
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
