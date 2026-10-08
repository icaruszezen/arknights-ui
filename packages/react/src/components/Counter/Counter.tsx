import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type CounterSize = 'sm' | 'md'
export type CounterVertical = 'portrait' | 'always' | 'never'

export interface CounterProps extends Omit<ComponentProps<'p'>, 'children'> {
  /** 当前是第几个。 */
  value: number
  /** 一共几个。编号永远带总数，不写一个孤零零的 `01`。 */
  total: number
  /**
   * 补前导零到几位。
   * @default 2
   */
  pad?: number
  /** 跟在后面的名称，通常是栏目的英文名（`INFORMATION`）。 */
  label?: ReactNode
  /**
   * “当前 / 总数”下面的一行微缩字，官网写的是品牌名。纯装饰，对读屏隐藏。只在 `md` 显示。
   */
  micro?: ReactNode
  /**
   * - `md`：宽体大数字 5.4rem，下缘被裁掉一截；右边是“当前 / 总数”，名称在下面靠右
   *   （官网右栏的写法，实测）
   * - `sm`：数据体数字 1.5rem，全部排成一行（轮播、列表项。估计，没有实机出处）
   * @default 'md'
   */
  size?: CounterSize
  /**
   * 什么时候换成窄栏里的竖排写法（只对 `md` 起作用）：大数字缩到 1.8rem、居中，
   * “当前 / 总数”和名称竖着写，贴在右下角、压在数字上，微缩字不显示。整块只有 2rem 宽。
   * - `portrait`：竖屏时（官网的做法：竖屏的右栏只有一个菜单按钮那么宽）
   * - `always`：始终竖排
   * - `never`：始终横排
   * @default 'never'
   */
  vertical?: CounterVertical
}

const root: Record<CounterSize, string> = {
  sm: 'inline-flex items-baseline-last gap-ark-3',
  // 两列：大数字和“当前 / 总数”并排，名称在下面占满一行、靠右
  md: 'inline-grid grid-cols-[auto_auto] justify-items-end',
}

// 官网的大数字是 Novecento Sans Wide DemiBold，不是数据体。sm 和后面的斜杠排在同一行，仍然用数据体
const big: Record<CounterSize, string> = {
  sm: 'font-ark-data text-ark-h2 leading-ark-solid font-ark-bold',
  md: 'font-ark-latin-wide text-[5.4rem] font-semibold',
}

const restSize: Record<CounterSize, string> = {
  sm: 'text-ark-label',
  md: 'text-ark-body',
}

const labelText: Record<CounterSize, string> = {
  sm: 'text-ark-caption',
  // 1.125rem：官网在 1280 宽时量到的 12px，折回 1920 基准
  md: 'col-span-2 justify-self-end text-ark-body',
}

const restBase = 'font-ark-data leading-ark-solid font-ark-regular whitespace-nowrap'

// 窄栏里的竖排写法。取值是官网竖屏的一半：官网竖屏以 750 宽为基准，这里按 375 宽算（见 README）。
// portrait 那一份和 always 逐项相同，只是每个类前面多一个 portrait:
const narrow: Record<Exclude<CounterVertical, 'never'>, Record<string, string>> = {
  always: {
    root: 'relative block w-8',
    // 数字比这一块宽：居中，两边各裁掉一点
    big: 'w-full min-w-0 justify-center text-[1.8rem]',
    // 仍然是一列 flex：竖排的那行字作为 flex 项贴底，不会被行框的降部垫高
    aside: 'absolute right-0 bottom-0 pb-0',
    count: 'text-[0.5rem] [writing-mode:vertical-rl]',
    micro: 'hidden',
    label: 'absolute right-3 bottom-0 text-[0.3125rem] [writing-mode:vertical-rl]',
  },
  portrait: {
    root: 'portrait:relative portrait:block portrait:w-8',
    big: 'portrait:w-full portrait:min-w-0 portrait:justify-center portrait:text-[1.8rem]',
    aside: 'portrait:absolute portrait:right-0 portrait:bottom-0 portrait:pb-0',
    count: 'portrait:text-[0.5rem] portrait:[writing-mode:vertical-rl]',
    micro: 'portrait:hidden',
    label:
      'portrait:absolute portrait:right-3 portrait:bottom-0 portrait:text-[0.3125rem] portrait:[writing-mode:vertical-rl]',
  },
}

/**
 * 计数写作 `01 // 01 / 05`：一个大号数字，后面跟“当前 / 总数”。
 * 任何可以数的东西（分屏、轮播、列表项、章节）都可以这样标，它相当于纵向的面包屑。
 *
 * `md` 的大数字不完整：下缘被裁掉大写高的五分之一，和背景巨字一样像被一条水平线切过。
 * 官网是用 `line-height: 0.55` 加 `overflow: hidden` 裁的，那样裁掉多少取决于字体的度量，
 * 换一个回退字体就会连上缘一起裁。这里让数字和一个空的占位块按基线对齐——容器的下缘于是正好落在
 * 基线上——再把数字往下挪，裁掉的就只有下缘，换什么字体都一样。
 *
 * 官网竖屏的右栏只有一个菜单按钮那么宽，计数在那里换了一种写法：数字缩小、居中，后面两行竖着写，
 * 压在数字上。放进 `Shell` 的右栏时请加 `vertical="portrait"`。
 */
export function Counter({
  value,
  total,
  pad = 2,
  label,
  micro,
  size = 'md',
  vertical = 'never',
  className,
  ...rest
}: CounterProps) {
  const current = formatStatValue(value, pad)
  const count = `// ${current} / ${formatStatValue(total, pad)}`
  const hasMicro = micro != null && micro !== false
  const tall = size === 'md' && vertical !== 'never' ? narrow[vertical] : undefined
  return (
    <p
      data-ark="counter"
      data-vertical={tall ? vertical : undefined}
      {...rest}
      className={cn('m-0 box-border text-ark-fg', root[size], tall?.root, className)}
    >
      {/* 读屏只需要“第几个 / 共几个”：视觉上的写法会被念成两遍 01 和一串斜杠 */}
      <span className="sr-only">
        {value} / {total}
      </span>
      {size === 'md' ? (
        <>
          <b
            aria-hidden="true"
            className={cn(
              // min-w-max：裁切溢出的盒子在网格里最小可以缩到 0，整块被挤窄时数字会探到外面去
              'flex min-w-max items-baseline overflow-hidden text-ark-signal-fg',
              big.md,
              tall?.big,
            )}
          >
            {/* 行高为 0 的这一行不撑高容器；往下挪 0.2 个大写高，这一截就落到容器外面 */}
            <span className="translate-y-[0.14em] leading-[0] supports-[height:1cap]:translate-y-[0.2cap]">
              {current}
            </span>
            {/* 占位块：没有内容，基线就是它的下缘。它的高度是容器的高度 */}
            <span className="h-[0.56em] w-0 supports-[height:1cap]:h-[0.8cap]" />
          </b>
          <span
            aria-hidden="true"
            className={cn(
              'flex flex-col items-end gap-[0.1rem] self-end',
              // “当前 / 总数”和微缩字都压在大数字的高度以内，贴着裁切线的上方
              hasMicro ? 'pb-[0.32rem]' : 'pb-[0.79rem]',
              tall?.aside,
            )}
          >
            <span className={cn(restBase, restSize.md, tall?.count)}>{count}</span>
            {hasMicro && (
              <span
                className={cn(
                  'font-ark-latin-wide text-ark-micro leading-ark-solid font-ark-medium tracking-ark-micro whitespace-nowrap uppercase',
                  tall?.micro,
                )}
              >
                {micro}
              </span>
            )}
          </span>
        </>
      ) : (
        <>
          <b aria-hidden="true" className={cn('text-ark-signal-fg', big.sm)}>
            {current}
          </b>
          <span aria-hidden="true" className={cn(restBase, restSize.sm)}>
            {count}
          </span>
        </>
      )}
      {label != null && (
        // DemiBold：token 里没有 600 这一档，用 Tailwind 自带的
        <span
          className={cn(
            'font-ark-latin-wide leading-ark-solid font-semibold tracking-ark-wide whitespace-nowrap uppercase',
            labelText[size],
            tall?.label,
          )}
        >
          {label}
        </span>
      )}
    </p>
  )
}

export interface SerialProps extends Omit<ComponentProps<'span'>, 'children' | 'prefix'> {
  /** 前缀，如 `NO.`、`VOL.`。 */
  prefix?: ReactNode
  /** 序号。数字按 `pad` 补前导零，字符串原样输出。 */
  value: number | string
  /** 补前导零到几位（`NO.0147` 是 4）。不设就不补。 */
  pad?: number
}

/**
 * 序号：`NO.0147`、`VOL.69`。像设备铭牌上的编号，写的应当是真的编号。
 * 颜色继承自所在的文字。这个写法没有实机出处，是估计。
 */
export function Serial({ prefix, value, pad, className, ...rest }: SerialProps) {
  return (
    <span
      data-ark="serial"
      {...rest}
      className={cn(
        'font-ark-data text-ark-label leading-ark-solid font-ark-regular whitespace-nowrap',
        className,
      )}
    >
      {prefix}
      {/* 序号不加千分位 */}
      {pad === undefined ? String(value) : formatStatValue(value, pad)}
    </span>
  )
}
