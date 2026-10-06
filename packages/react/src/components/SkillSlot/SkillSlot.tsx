import type { ComponentProps, MouseEventHandler, ReactNode } from 'react'
import { colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

interface SkillSlotOwnProps {
  /**
   * 这一格的名称，如“技能 2”。只给读屏：它和 `rank` 一起组成按钮的名称。
   * 图片自己带 `alt` 时可以不给。
   */
  label?: string
  /** 当前选中：换成信号色描边并加粗一圈。是按钮时同时输出 `aria-pressed`。 */
  selected?: boolean
  /** 左下角的小字：等级、专精（`RANK 7`、`M3`）。选中时跟着变成信号色。 */
  rank?: ReactNode
  /** 格子里的图形：一个内联 `<svg>` 或一张 `<img>`。图片会铺满格子。 */
  children?: ReactNode
}

type SkillSlotAsButton = SkillSlotOwnProps &
  Omit<ComponentProps<'button'>, keyof SkillSlotOwnProps> & {
    onClick: MouseEventHandler<HTMLButtonElement>
  }
type SkillSlotAsBlock = SkillSlotOwnProps &
  Omit<ComponentProps<'div'>, keyof SkillSlotOwnProps> & { onClick?: undefined }

/** 给了 `onClick` 渲染为 `<button type="button">`，否则只是一个展示用的 `<div>`。 */
export type SkillSlotProps = SkillSlotAsButton | SkillSlotAsBlock

const base =
  'relative isolate m-0 box-border inline-grid size-16 shrink-0 place-items-center overflow-hidden border border-ark-rule bg-ark-neutral-black/50 p-0 text-ark-fg'

// 选中：信号色描边，里面再压一圈 1px——颜色之外线也变粗了
const selectedFrame = 'border-ark-signal shadow-[inset_0_0_0_1px_var(--ark-signal)]'

const interactive = cn(
  'cursor-pointer appearance-none select-none hover:border-ark-fg hover:bg-ark-neutral-black/80',
  'disabled:cursor-not-allowed disabled:border-ark-neutral-ink-700 disabled:text-ark-neutral-gray-600 disabled:hover:bg-ark-neutral-black/50',
  colorTransition,
  focusRing,
)

/**
 * 技能格：黑色半透明的方块加 1px 细描边，当前选中的那一格换成信号色描边。
 * 技能、模组这类“几选一”的东西都用它，并排时留 4–8px 的缝。
 *
 * 它是图标的外框，不带任何图形——图形由使用方放进来，请使用原创或已获授权的素材。
 * 默认 4rem 见方，用 `size-*` 调。
 *
 * 是按钮时需要一个名称：给 `label`（如“技能 2”），或者用图片的 `alt`。
 * 不要用 `aria-label`：它会盖掉看得见的 `rank`，读到的和看到的就对不上了。
 */
export function SkillSlot(props: SkillSlotProps) {
  const { label, selected = false, rank, className, children, ...rest } = props

  const content = (
    <>
      {label !== undefined && <span className="sr-only">{label}</span>}
      {children != null && (
        <span className="absolute inset-0 -z-1 grid place-items-center [&>img]:block [&>img]:size-full [&>img]:object-cover [&>svg]:block [&>svg]:size-1/2">
          {children}
        </span>
      )}
      {rank != null && (
        <span
          className={cn(
            'absolute bottom-0 left-0 bg-ark-neutral-black/70 px-ark-1 py-0.5 font-ark-data text-ark-caption leading-ark-solid font-ark-regular whitespace-nowrap',
            selected && 'text-ark-signal-fg',
          )}
        >
          {rank}
        </span>
      )}
    </>
  )

  if (rest.onClick !== undefined) {
    return (
      <button
        data-ark="skill-slot"
        data-ark-tone="dark"
        type="button"
        aria-pressed={selected}
        {...rest}
        className={cn(base, interactive, selected && selectedFrame, className)}
      >
        {content}
      </button>
    )
  }
  return (
    <div
      data-ark="skill-slot"
      data-ark-tone="dark"
      data-selected={selected ? '' : undefined}
      {...rest}
      className={cn(base, selected && selectedFrame, className)}
    >
      {content}
    </div>
  )
}
