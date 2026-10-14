import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * 直径：0.75rem / 1rem / 1.5rem。
   * @default 'md'
   */
  size?: SpinnerSize
  /**
   * 给读屏的名称，如“正在保存”。给了才作为一个进度指示被读到；
   * 不给就是纯装饰——旁边已经有文字说明在加载时用。
   */
  label?: string
  /** 颜色跟随所在的文字，而不是“细线的轨道 + 信号色的一段”。放在按钮里时用。 */
  inherit?: boolean
}

const sizes: Record<SpinnerSize, string> = {
  sm: 'size-3 border-[1.5px]',
  md: 'size-4 border-2',
  lg: 'size-6 border-2',
}

/**
 * 旋转指示：进度未知时的短加载。1s 一圈、匀速（官网实测）；“减少动效”下停住。
 *
 * 它是这套界面里少数的圆形之一：圆只留给“一个点”的小件。
 */
export function Spinner({ size = 'md', label, inherit = false, className, ...rest }: SpinnerProps) {
  // 没有 aria-valuenow 的 progressbar 表示进度未知
  const semantics =
    label !== undefined
      ? ({ role: 'progressbar', 'aria-label': label } as const)
      : rest.role === undefined && rest['aria-labelledby'] === undefined
        ? ({ 'aria-hidden': true } as const)
        : undefined
  return (
    <span
      data-ark="spinner"
      {...semantics}
      {...rest}
      className={cn(
        'box-border inline-block shrink-0 rounded-full border-solid motion-safe:animate-ark-spin',
        sizes[size],
        inherit
          ? 'border-[color-mix(in_srgb,currentColor_30%,transparent)] border-t-current'
          : 'border-ark-rule border-t-ark-signal',
        className,
      )}
    />
  )
}
