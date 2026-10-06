import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '../../utils/cn'

// Code 39（又称 3 of 9）：每个字符 9 个单元，5 条 4 空交替、以条开头，其中恰好 3 个是宽的。
// 编码表按规则生成而不是抄一张 44 行的表，对照的是 https://en.wikipedia.org/wiki/Code_39 。
// 下面的字符串里 1 表示宽、0 表示窄。

// 两条宽条的位置按 1、2、4、7、0 的权重编出 1–10（two-out-of-five）
const twoOfFive = [
  '10001',
  '01001',
  '11000',
  '00101',
  '10100',
  '01100',
  '00011',
  '10010',
  '01010',
  '00110',
]
// 唯一的那个宽空在第几个空位，把字符分成四组；每组内按上面的 1–10 排
const groups = [
  ['0100', '1234567890'],
  ['0010', 'ABCDEFGHIJ'],
  ['0001', 'KLMNOPQRST'],
  ['1000', 'UVWXYZ-. *'],
] as const
// 后来加的四个标点：五条全窄，四个空里三个宽
const punctuation = [
  ['1110', '$'],
  ['1101', '/'],
  ['1011', '+'],
  ['0111', '%'],
] as const

// 把 5 条和 4 空交错成“条 空 条 空 …… 条”
const interleave = (bars: string, spaces: string) =>
  [...bars].map((bar, index) => bar + (spaces[index] ?? '')).join('')

/** 字符 → 9 个单元的宽窄。`*` 是起止符，不能出现在内容里。 */
export const code39Patterns: ReadonlyMap<string, string> = new Map([
  ...groups.flatMap(([spaces, chars]) =>
    [...chars].map((char, index) => [char, interleave(twoOfFive[index] ?? '', spaces)] as const),
  ),
  ...punctuation.map(([spaces, char]) => [char, interleave('00000', spaces)] as const),
])

// 宽窄比 3:1。屏幕上窄条只有 1px 左右，规范要求这种尺寸下比例大于 2.2:1
const WIDE = 3

export interface Code39 {
  /** 实际编进去的内容：转成大写、去掉不支持的字符之后。 */
  text: string
  /** 每一条的 `[起点, 宽度]`，单位是窄条的宽度。 */
  bars: [x: number, width: number][]
  /** 整个条码的宽度，单位同上。 */
  units: number
}

/** 把字符串编成 Code 39，首尾自动加起止符。小写转大写，不支持的字符丢弃。 */
export function encodeCode39(value: string): Code39 {
  const text = [...value.toUpperCase()]
    .filter(char => char !== '*' && code39Patterns.has(char))
    .join('')
  const bars: Code39['bars'] = []
  let x = 0
  for (const char of `*${text}*`) {
    const pattern = code39Patterns.get(char) ?? ''
    for (let index = 0; index < pattern.length; index++) {
      const width = pattern[index] === '1' ? WIDE : 1
      if (index % 2 === 0) bars.push([x, width])
      x += width
    }
    // 字符之间隔一个窄空，少了它扫不出来
    x += 1
  }
  return { text, bars, units: x - 1 }
}

export interface BarcodeProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * 要编进条码的内容。可用大写字母、数字、空格和 `- . $ / + %`；
   * 小写自动转大写，其余字符丢弃。没有可编码的字符时不渲染。
   */
  value: string
  /**
   * 在条码下方印出实际编码的内容。
   * @default true
   */
  text?: boolean
}

/**
 * 条形码。装饰都“有来历”：这是一条真实的 Code 39 条码，编的就是传入的内容，扫得出来。
 * 它强化“工业制品 / 档案 / 货物”的语感，只在沉浸型页面里偶尔出现。
 *
 * 默认对读屏隐藏。窄条的宽度由 `--ark-barcode-unit`（默认 1px）决定，
 * 高度由 `--ark-barcode-height`（默认 2rem）决定。要拿去扫的话，两侧各留 10 个窄条宽的空白。
 */
export function Barcode({ value, text = true, className, style, ...rest }: BarcodeProps) {
  const code = encodeCode39(value)
  if (code.text === '') return null
  return (
    <span
      data-ark="barcode"
      aria-hidden="true"
      {...rest}
      className={cn('inline-grid w-fit justify-items-start gap-ark-1 text-ark-fg', className)}
      style={{ '--ark-barcode-units': code.units, ...style } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${code.units} 1`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        className="block h-[var(--ark-barcode-height,2rem)] w-[calc(var(--ark-barcode-units)*var(--ark-barcode-unit,0.0625rem))] fill-current"
      >
        <path d={code.bars.map(([x, width]) => `M${x} 0h${width}v1h-${width}z`).join('')} />
      </svg>
      {text && (
        <span className="font-ark-data text-ark-micro leading-ark-solid tracking-ark-micro whitespace-pre">
          {code.text}
        </span>
      )}
    </span>
  )
}
