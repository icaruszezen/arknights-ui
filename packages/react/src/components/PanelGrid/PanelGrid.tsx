import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type PanelGridGap = 'sm' | 'md' | 'lg'

export interface PanelGridProps extends ComponentProps<'div'> {
  /**
   * 块与块之间的缝，面板之间不加描边。
   * - `lg`：1rem。主界面各个入口面板之间的缝（实机截图：1080p 下 24px，折到 720p 是 16px）
   * - `md`：0.5rem
   * - `sm`：0.25rem。同一组里的子面板之间（实机的“公开招募 / 干员寻访”两块之间约 3px）
   * @default 'lg'
   */
  gap?: PanelGridGap
}

const gaps: Record<PanelGridGap, string> = {
  sm: 'gap-ark-1',
  md: 'gap-ark-2',
  lg: 'gap-ark-4',
}

/**
 * 错位拼合：矩形不排成等大的网格，而是大小不一地拼在一起——
 * 一块大的配两三块小的，或者一行三等分下面接一行两等分。
 * 最重要的入口最大、最亮，面积直接对应优先级。
 *
 * 子元素是若干个 `PanelGridItem`，各自说明占一行的几分之几、占几行高。
 * 一行的基准高度由 `--ark-panel-grid-row` 决定，默认 5rem。
 * 竖屏时改成一列纵向堆叠，而不是把横屏的拼法整体缩小。
 */
export function PanelGrid({ gap = 'lg', className, ...rest }: PanelGridProps) {
  return (
    <div
      data-ark="panel-grid"
      {...rest}
      className={cn(
        // 12 列：二、三、四等分都能整除
        'box-border grid auto-rows-[minmax(var(--ark-panel-grid-row,5rem),auto)] grid-cols-12',
        'portrait:grid-cols-1',
        gaps[gap],
        className,
      )}
    />
  )
}

export type PanelGridSpan = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'

export interface PanelGridItemProps extends ComponentProps<'div'> {
  /**
   * 占一行的几分之几。
   * @default 'full'
   */
  span?: PanelGridSpan
  /**
   * 占几行高。大块配小块时，大的那块占两到三行。
   * @default 1
   */
  rows?: 1 | 2 | 3
}

const spans: Record<PanelGridSpan, string> = {
  full: 'col-span-12',
  '1/2': 'col-span-6',
  '1/3': 'col-span-4',
  '2/3': 'col-span-8',
  '1/4': 'col-span-3',
  '3/4': 'col-span-9',
}

const rowSpans = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
}

/**
 * 拼合里的一格。它自己不画任何东西，只负责占位：放进来的面板（或图片、按钮）自动撑满这一格。
 * 只能放在 `PanelGrid` 里。
 */
export function PanelGridItem({ span = 'full', rows = 1, className, ...rest }: PanelGridItemProps) {
  return (
    <div
      data-ark="panel-grid-item"
      {...rest}
      className={cn(
        'box-border grid min-w-0',
        spans[span],
        rowSpans[rows],
        'portrait:col-span-1 portrait:row-span-1',
        className,
      )}
    />
  )
}
