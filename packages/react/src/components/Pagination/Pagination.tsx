import type { ComponentProps } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../../internal/icons'
import { colorTransition, focusRing, hitAreaCoarse } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../../utils/format'
import { useControllableState } from '../../utils/useControllableState'

export type PaginationVariant = 'full' | 'compact'
export type PaginationSize = 'sm' | 'md'

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  /** 一共几页。 */
  pageCount: number
  /** 当前页，从 1 起。受控：请在 `onPageChange` 里更新它。 */
  page?: number
  /**
   * 一开始在第几页（非受控）。
   * @default 1
   */
  defaultPage?: number
  /** 换页时调用。 */
  onPageChange?: (page: number) => void
  /**
   * - `full`：上一页、页码、下一页；页码太多时中间用省略号
   * - `compact`：只有 `‹ 03 / 12 ›`，窄的地方用
   * @default 'full'
   */
  variant?: PaginationVariant
  /**
   * 当前页两边各留几个页码。
   * @default 1
   */
  siblings?: number
  /**
   * 每格的边长：2rem / 2.5rem。
   * @default 'md'
   */
  size?: PaginationSize
  /**
   * @default '上一页'
   */
  prevLabel?: string
  /**
   * @default '下一页'
   */
  nextLabel?: string
  /**
   * 页码前后补给读屏的字，看不见。读到的是“第 03 页”：看得见的页码是名称的一部分。
   * @default ['第 ', ' 页']
   */
  pageLabel?: readonly [string, string]
}

const cells: Record<PaginationSize, string> = {
  sm: 'h-(--ark-size-control-sm) min-w-(--ark-size-control-sm) text-ark-caption',
  md: 'h-(--ark-size-control-md) min-w-(--ark-size-control-md) text-ark-label',
}

const cell = cn(
  'relative m-0 box-border inline-grid cursor-pointer appearance-none place-items-center border-0 bg-transparent px-ark-1 font-ark-data leading-ark-solid font-ark-bold text-ark-fg select-none',
  'hover:bg-ark-invert hover:text-ark-on-invert',
  'disabled:cursor-not-allowed disabled:bg-transparent disabled:text-ark-on-disabled',
  // 当前页是信号色的实块，悬停不变
  'aria-[current=page]:bg-ark-signal aria-[current=page]:text-ark-on-signal',
  colorTransition,
  focusRing,
  hitAreaCoarse,
)

/** 要显示哪些页码；`null` 是一处省略号。首尾两页始终显示。 */
function pagesToShow(page: number, count: number, siblings: number): (number | null)[] {
  const from = Math.max(2, page - siblings)
  const to = Math.min(count - 1, page + siblings)
  const pages: (number | null)[] = [1]
  // 只隔了一页就直接写出来，不用省略号占一格
  if (from === 3) pages.push(2)
  else if (from > 3) pages.push(null)
  for (let current = from; current <= to; current++) pages.push(current)
  if (to === count - 2) pages.push(count - 1)
  else if (to < count - 2) pages.push(null)
  if (count > 1) pages.push(count)
  return pages
}

/**
 * 分页。页码用数据体、补零到两位，当前页是一块信号色的实块；其余悬停时整块反色。
 * 到了头，对应的方向键变成禁用。
 *
 * 它是一个导航地标，请用 `aria-label` 说明翻的是什么（默认“分页”）。
 */
export function Pagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  variant = 'full',
  siblings = 1,
  size = 'md',
  prevLabel = '上一页',
  nextLabel = '下一页',
  pageLabel = ['第 ', ' 页'],
  className,
  ...rest
}: PaginationProps) {
  const count = Math.max(1, Math.floor(pageCount))
  const [value, setValue] = useControllableState(page, defaultPage, onPageChange)
  const current = Math.min(Math.max(1, value), count)
  const go = (next: number) => setValue(Math.min(Math.max(1, next), count))
  const pad = Math.max(2, String(count).length)

  const prev = (
    <button
      type="button"
      aria-label={prevLabel}
      disabled={current <= 1}
      onClick={() => go(current - 1)}
      className={cn(cell, cells[size])}
    >
      <ChevronLeftIcon className="h-3 w-1.5" />
    </button>
  )
  const next = (
    <button
      type="button"
      aria-label={nextLabel}
      disabled={current >= count}
      onClick={() => go(current + 1)}
      className={cn(cell, cells[size])}
    >
      <ChevronRightIcon className="h-3 w-1.5" />
    </button>
  )

  return (
    <nav
      data-ark="pagination"
      aria-label="分页"
      {...rest}
      className={cn('box-border inline-flex items-center gap-0.5', className)}
    >
      {prev}
      {variant === 'compact' ? (
        // 读屏读到的是“第 3 页，共 12 页”这个意思：当前页在前、总数在后
        <span
          aria-live="polite"
          className={cn(
            'inline-flex items-baseline gap-ark-1 px-ark-2 font-ark-data leading-ark-solid',
            size === 'sm' ? 'text-ark-caption' : 'text-ark-label',
          )}
        >
          <b className="font-ark-bold text-ark-fg">{formatStatValue(current, pad)}</b>
          <span className="text-ark-fg-muted">/ {formatStatValue(count, pad)}</span>
        </span>
      ) : (
        <ol className="m-0 flex list-none items-center gap-0.5 p-0">
          {pagesToShow(current, count, Math.max(0, siblings)).map((item, index) =>
            item === null ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: 省略号没有自己的值，前后各一处，位置就是它的身份
              <li key={`gap-${index}`} aria-hidden="true">
                <span
                  className={cn('inline-grid place-items-center text-ark-fg-muted', cells[size])}
                >
                  …
                </span>
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  aria-current={item === current ? 'page' : undefined}
                  onClick={() => go(item)}
                  className={cn(cell, cells[size])}
                >
                  <span className="sr-only">{pageLabel[0]}</span>
                  {formatStatValue(item, pad)}
                  <span className="sr-only">{pageLabel[1]}</span>
                </button>
              </li>
            ),
          )}
        </ol>
      )}
      {next}
    </nav>
  )
}
