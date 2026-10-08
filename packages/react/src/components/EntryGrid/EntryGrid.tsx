import type { ComponentProps } from 'react'
import { toItems } from '../../internal/toItems'
import { type EntryPanelSize, EntrySizeContext } from '../EntryPanel/EntryPanel'
import { PanelGrid, type PanelGridGap, PanelGridItem, type PanelGridSpan } from '../PanelGrid'

export type EntryGridRow = 1 | 2 | 3 | 4

export interface EntryGridProps extends ComponentProps<'div'> {
  /**
   * 每一行放几个入口，自上而下。子元素按顺序填进去；超出的部分沿用最后一行的个数。
   * @default [1, 2, 3, 3]
   */
  rows?: readonly EntryGridRow[]
  /**
   * 面板之间的缝：0.25rem / 0.5rem / 1rem。实机主界面各入口之间是 1rem。
   * @default 'lg'
   */
  gap?: PanelGridGap
}

const DEFAULT_ROWS: readonly EntryGridRow[] = [1, 2, 3, 3]

const spans: Record<EntryGridRow, PanelGridSpan> = {
  1: 'full',
  2: '1/2',
  3: '1/3',
  4: '1/4',
}

// 第一行最高、字最大；第二行次之；其余各行一样。行高是基准行高的 2 倍、1.5 倍、1 倍
const tiers: readonly { size: EntryPanelSize; rows: 1 | 2; height?: string }[] = [
  { size: 'lg', rows: 2 },
  { size: 'md', rows: 1, height: 'min-h-[calc(var(--ark-panel-grid-row,5rem)*1.5)]' },
  { size: 'sm', rows: 1 },
]

/**
 * 主界面右面板组的编排：入口按“一、二、三、三”排成四行，大小不一地拼在一起。
 * 第一个入口独占一行，最大、字也最大；越往下越小——面积直接对应优先级，
 * 所以子元素请按重要程度排。
 *
 * 子元素是若干个 `EntryPanel`，各自的默认字号跟着所在的行走。
 * 一行的基准高度由 `--ark-panel-grid-row` 决定，默认 5rem。竖屏时改成一列纵向堆叠。
 *
 * 它只管拼合，不带透视：需要“画内界面”那种倾斜时，在外面套一个 `TiltGroup side="right"`。
 */
export function EntryGrid({ rows = DEFAULT_ROWS, gap = 'lg', children, ...rest }: EntryGridProps) {
  const layout = rows.length > 0 ? rows : DEFAULT_ROWS
  let row = 0
  let filled = 0
  const cells = toItems(children).map(item => {
    const perRow = layout[Math.min(row, layout.length - 1)] ?? 3
    const tier = tiers[Math.min(row, tiers.length - 1)] ?? { size: 'sm' as const, rows: 1 as const }
    filled += 1
    if (filled === perRow) {
      row += 1
      filled = 0
    }
    return { ...item, span: spans[perRow], tier }
  })

  return (
    <PanelGrid data-ark="entry-grid" gap={gap} {...rest}>
      {cells.map(({ key, child, span, tier }) => (
        <PanelGridItem key={key} span={span} rows={tier.rows} className={tier.height}>
          <EntrySizeContext value={tier.size}>{child}</EntrySizeContext>
        </PanelGridItem>
      ))}
    </PanelGrid>
  )
}
