import type { ComponentProps } from 'react'
import { CloseIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { type ArkColor, solidColor, textColor } from '../../utils/color'

export type TagVariant = 'solid' | 'outline' | 'neutral'
export type TagSize = 'sm' | 'md'

export interface TagProps extends Omit<ComponentProps<'span'>, 'color'> {
  /**
   * - `solid`：实心色块，最要紧的属性
   * - `outline`：描边，次要属性
   * - `neutral`：灰底，中性信息
   * @default 'neutral'
   */
  variant?: TagVariant
  /**
   * 颜色，作用在 `solid` 的底和 `outline` 的字与边上。
   * @default 'neutral'
   */
  color?: ArkColor
  /**
   * 高度：1.25rem / 1.5rem。
   * @default 'md'
   */
  size?: TagSize
  /** 圆头的小标签：贴在别的东西上的一枚标记，写一个字段的名字或一个状态。 */
  pill?: boolean
  /** 切掉右上角。`outline` 和 `pill` 不支持。 */
  cut?: boolean
  /** 给了就在末尾出现一个移除按钮（筛选条件、已选的项）。 */
  onRemove?: () => void
  /**
   * 移除按钮的名称。
   * @default '移除'
   */
  removeLabel?: string
}

const sizes: Record<TagSize, string> = {
  sm: 'h-5 px-ark-1 text-ark-caption',
  md: 'h-6 px-ark-2 text-ark-caption',
}

const cutLayer = 'isolate before:absolute before:inset-0 before:-z-1 before:ark-cut-tr-sm'
// 切角时底色画在 ::before 上
const cutSolid: Record<ArkColor, string> = {
  signal: 'text-ark-on-signal before:bg-ark-signal',
  neutral: 'text-ark-on-invert before:bg-ark-invert',
  danger: 'text-ark-on-danger before:bg-ark-danger',
  warning: 'text-ark-neutral-black before:bg-ark-signal-action',
  success: 'text-ark-neutral-black before:bg-ark-signal-success',
}

/**
 * 标签是小矩形。颜色之外，靠实心 / 描边 / 灰底三种形态区分主次。
 * 圆头（`pill`）只留给贴在别的东西上的小标记。
 */
export function Tag({
  variant = 'neutral',
  color = 'neutral',
  size = 'md',
  pill = false,
  cut = false,
  onRemove,
  removeLabel = '移除',
  className,
  children,
  ...rest
}: TagProps) {
  const useCut = cut && variant !== 'outline' && !pill
  return (
    <span
      data-ark="tag"
      {...rest}
      className={cn(
        'relative box-border inline-flex items-center gap-ark-1 align-middle font-ark-cjk-sans leading-ark-solid whitespace-nowrap',
        sizes[size],
        pill && 'rounded-full px-ark-2',
        variant === 'solid' && ['font-ark-bold', useCut ? cutSolid[color] : solidColor[color]],
        variant === 'outline' && ['border border-current font-ark-regular', textColor[color]],
        variant === 'neutral' && [
          'font-ark-regular text-ark-fg',
          useCut ? 'before:bg-ark-control' : 'bg-ark-control',
        ],
        useCut && cutLayer,
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            'relative -mr-ark-1 grid size-4 shrink-0 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-inherit opacity-70 hover:opacity-100',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
            // 图形只有 12px，点击区撑到整个标签的高度以上
            'after:absolute after:-inset-1',
          )}
        >
          <CloseIcon className="size-3" />
        </button>
      )}
    </span>
  )
}
