import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import { formatStatValue } from '../Stat'

export type MoodBarVariant = 'thin' | 'labeled'

export interface MoodBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 当前心情，会被限制在 `0`–`max` 之间。 */
  value: number
  /**
   * 上限。
   * @default 24
   */
  max?: number
  /**
   * 低于这个值就算“低”：填充转红并换成斜纹。
   * @default 上限的四分之一
   */
  threshold?: number
  /**
   * - `thin`：4px 的直角细条，贴在头像底边
   * - `labeled`：1.5rem 高的粗条，左端白底写名称，右端一格写 `15/24`——实机进驻信息里的写法
   * @default 'thin'
   */
  variant?: MoodBarVariant
  /**
   * `labeled` 时写在左端的名称。它是字符串时也用作进度条默认的可访问名称。
   * @default '心情'
   */
  label?: ReactNode
}

// 低的时候不只换颜色：填充从平涂变成 45° 斜纹，色觉障碍的用户也看得出来
const lowFill =
  'bg-[repeating-linear-gradient(-45deg,var(--ark-color-signal-danger)_0_0.1875rem,color-mix(in_srgb,var(--ark-color-signal-danger)_45%,black)_0.1875rem_0.375rem)]'

const fill =
  'absolute inset-y-0 left-0 transition-[width] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none'

/**
 * 心情条：表示干员还能工作多久，低于阈值时转红。两种写法——
 * 贴在头像底边的 4px 细条（`OperatorAvatar` 的 `mood`），和进驻信息里带字的粗条。
 *
 * 红色是固定语义，不跟随可替换的信号色。默认的名称是“心情”，用 `aria-label` 改。
 */
export function MoodBar({
  value,
  max = 24,
  threshold = max / 4,
  variant = 'thin',
  label = '心情',
  className,
  ...rest
}: MoodBarProps) {
  const { clamped, percent } = clampProgress(value, max)
  const low = clamped < threshold
  const progress = {
    'data-ark': 'mood-bar',
    'data-low': low ? '' : undefined,
    'data-variant': variant,
    role: 'progressbar',
    'aria-label': typeof label === 'string' ? label : '心情',
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuenow': clamped,
  } as const

  if (variant === 'labeled') {
    return (
      // 三格：名称、轨道、数值。明暗是固定的，不跟随所在面板的明暗上下文。
      // 轨道和数值格用 gray-600 而不是实机的中灰：白字压在上面才够 4.5:1
      <div
        {...progress}
        {...rest}
        className={cn(
          'box-border grid h-6 w-full grid-cols-[auto_minmax(0,1fr)_auto] font-ark-cjk-sans text-ark-label leading-ark-solid',
          className,
        )}
      >
        {/* 名称压在白底上，和白色的填充连成一片 */}
        <span className="flex items-center bg-ark-neutral-white px-ark-2 font-ark-bold whitespace-nowrap text-ark-neutral-black">
          {label}
        </span>
        <span className="relative bg-ark-neutral-gray-600">
          <span
            data-ark="mood-bar-fill"
            className={cn(fill, low ? lowFill : 'bg-ark-neutral-white')}
            style={{ width: `${percent}%` }}
          />
        </span>
        <span className="flex items-center bg-ark-neutral-gray-600 px-ark-2 font-ark-data whitespace-nowrap text-ark-neutral-white">
          {/* 当前值大一号，分母小一号，两者基线对齐 */}
          <span className="flex items-baseline">
            <b className="text-[1rem] font-ark-regular">{formatStatValue(clamped)}</b>
            <span className="text-ark-caption">/{formatStatValue(max)}</span>
          </span>
        </span>
      </div>
    )
  }

  return (
    <div
      {...progress}
      {...rest}
      className={cn('relative box-border h-1 w-full bg-ark-neutral-black/60', className)}
    >
      <span
        data-ark="mood-bar-fill"
        className={cn(fill, low ? lowFill : 'bg-ark-fg')}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
