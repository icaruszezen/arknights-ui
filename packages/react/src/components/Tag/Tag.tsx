import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type TagVariant = 'solid' | 'outline' | 'neutral'

export interface TagProps extends ComponentProps<'span'> {
  /**
   * - `solid`：反白实心，主要属性（职业）
   * - `outline`：信号色描边，次要属性（定位）
   * - `neutral`：石墨底白字，中性信息
   * @default 'neutral'
   */
  variant?: TagVariant
  /** 切掉右上角。`outline` 不支持。 */
  cut?: boolean
}

const base =
  'relative box-border inline-flex h-6 items-center px-ark-2 align-middle font-ark-cjk-sans text-ark-caption leading-ark-solid whitespace-nowrap'

const text: Record<TagVariant, string> = {
  solid: 'font-ark-bold text-ark-on-invert',
  outline: 'border border-current font-ark-regular text-ark-signal-fg',
  neutral: 'font-ark-regular text-ark-neutral-white',
}

const flat: Record<TagVariant, string> = {
  solid: 'bg-ark-invert',
  outline: '',
  neutral: 'bg-ark-neutral-graphite',
}

const cutLayer = 'isolate before:absolute before:inset-0 before:-z-1 before:ark-cut-tr-sm'
const cutBackground: Record<TagVariant, string> = {
  solid: 'before:bg-ark-invert',
  outline: '',
  neutral: 'before:bg-ark-neutral-graphite',
}

/** 标签是小矩形。颜色之外，靠实心 / 描边 / 灰底三种形态区分主次。 */
export function Tag({ variant = 'neutral', cut = false, className, ...rest }: TagProps) {
  const useCut = cut && variant !== 'outline'
  return (
    <span
      data-ark="tag"
      {...rest}
      className={cn(
        base,
        text[variant],
        useCut ? [cutLayer, cutBackground[variant]] : flat[variant],
        className,
      )}
    />
  )
}
