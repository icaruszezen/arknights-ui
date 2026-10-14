import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'

export type UnitBarSide = 'ally' | 'enemy'

export interface UnitBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前生命，会被限制在 `0`–`max` 之间。 */
  value: number
  /**
   * 生命上限。
   * @default 100
   */
  max?: number
  /** 当前技力。给了才画下面那条技力条。 */
  skill?: number
  /**
   * 技力上限。
   * @default 100
   */
  skillMax?: number
  /**
   * 阵营，决定生命条的颜色：我方蓝，敌方红。
   * @default 'ally'
   */
  side?: UnitBarSide
  /**
   * 生命条的名称。同屏有多个单位时请写清是谁的，如“占位干员甲的生命”。
   * @default '生命'
   */
  label?: string
  /**
   * 技力条的名称。
   * @default '技力'
   */
  skillLabel?: string
}

// 敌我、技力的颜色是固定语义，不跟随可替换的信号色
const lifeFill: Record<UnitBarSide, string> = {
  ally: 'bg-ark-tier-3',
  enemy: 'bg-ark-signal-danger',
}

const fill =
  'absolute inset-y-0 left-0 transition-[width] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none'

/**
 * 战场上单位头顶的两条细条：上面 4px 是生命，下面 3px 是技力，颜色不同。
 * 条很细、直角、黑色轨道，贴在单位的上方或下方，不遮挡战场。
 *
 * 它不自己定位，放在哪由使用方决定（通常是 `absolute` 加在单位的容器上）。
 * 默认 2.5rem 宽，用 `w-*` 调。
 */
export function UnitBar({
  value,
  max = 100,
  skill,
  skillMax = 100,
  side = 'ally',
  label = '生命',
  skillLabel = '技力',
  className,
  ...rest
}: UnitBarProps) {
  const life = clampProgress(value, max)
  const charge = skill === undefined ? undefined : clampProgress(skill, skillMax)
  return (
    <div
      data-ark="unit-bar"
      data-side={side}
      {...rest}
      className={cn('box-border grid w-10 gap-px', className)}
    >
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={life.clamped}
        className="relative h-1 bg-ark-neutral-black"
      >
        <span className={cn(fill, lifeFill[side])} style={{ width: `${life.percent}%` }} />
      </div>
      {charge !== undefined && (
        <div
          role="progressbar"
          aria-label={skillLabel}
          aria-valuemin={0}
          aria-valuemax={skillMax}
          aria-valuenow={charge.clamped}
          className="relative h-[3px] bg-ark-neutral-black"
        >
          <span className={cn(fill, 'bg-ark-tier-2')} style={{ width: `${charge.percent}%` }} />
        </div>
      )}
    </div>
  )
}
