import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type DividerVariant = 'solid' | 'dash' | 'fade'
export type DividerStart = 'none' | 'bar' | 'square'
export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * - `solid`：1px 细线
   * - `dash`：虚线，用于次级分隔
   * - `fade`：从起点向末端渐隐
   * @default 'solid'
   */
  variant?: DividerVariant
  /**
   * 分隔线的“起点”。
   * - `bar`：4px × 3rem 的信号色短粗段
   * - `square`：8px 方块
   * @default 'none'
   */
  start?: DividerStart
  /** 以一个英文标签开头（如 PROFILE），后面才是细线。仅横向。 */
  label?: ReactNode
  /**
   * 方向。竖线需要父容器给出高度（如放在一行 flex 里）。
   * @default 'horizontal'
   */
  orientation?: DividerOrientation
}

// fade 没有直接用 --ark-pattern-fade-rule：那个取值固定为白色、且从右向左渐隐；
// 这里跟随明暗上下文，并从起点一侧开始
const line: Record<DividerOrientation, Record<DividerVariant, string>> = {
  horizontal: {
    solid: 'h-px bg-ark-rule',
    dash: 'h-px bg-(image:--ark-pattern-dash)',
    fade: 'h-px bg-linear-to-r from-ark-rule to-transparent',
  },
  vertical: {
    solid: 'w-px bg-ark-rule',
    dash: 'w-px bg-[repeating-linear-gradient(180deg,#b2b2b2_0_0.25rem,transparent_0_0.5rem)]',
    fade: 'w-px bg-linear-to-b from-ark-rule to-transparent',
  },
}

/**
 * 分区靠 1px 细线，而不是给每个区域加底色。
 *
 * 一条分隔线很少从头到尾均匀：给它一个起点（短粗段、方块或标签），或让一端渐隐。
 */
export function Divider({
  variant = 'solid',
  start = 'none',
  label,
  orientation = 'horizontal',
  className,
  ...rest
}: DividerProps) {
  const vertical = orientation === 'vertical'
  const labelled = label != null && !vertical
  // 带标签时它是一行可读的文字，不再是纯分隔符
  const semantics = labelled
    ? undefined
    : ({ role: 'separator', 'aria-orientation': orientation } as const)
  return (
    <div
      data-ark="divider"
      {...semantics}
      {...rest}
      className={cn(
        'box-border flex items-center',
        vertical ? 'flex-col self-stretch' : 'w-full',
        className,
      )}
    >
      {start === 'bar' && (
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 bg-ark-signal',
            vertical ? 'h-ark-7 w-(--ark-line-strong)' : 'h-(--ark-line-strong) w-ark-7',
          )}
        />
      )}
      {start === 'square' && <span aria-hidden="true" className="size-2 shrink-0 bg-ark-fg" />}
      {labelled && (
        <span className="shrink-0 pr-ark-3 font-ark-latin-condensed text-ark-label leading-ark-solid font-ark-medium text-ark-fg">
          {label}
        </span>
      )}
      <span aria-hidden="true" className={cn('grow', line[orientation][variant])} />
    </div>
  )
}
