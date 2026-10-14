import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export interface SkeletonProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * - `block`：一整块，大小用 `className` 给（图片、卡片、头像的位置）
   * - `text`：几行文字的位置，每行一条，最后一行短一截
   * @default 'block'
   */
  variant?: 'block' | 'text'
  /**
   * `text` 画几行。
   * @default 3
   */
  lines?: number
}

const bar = 'block bg-ark-fg/10 motion-safe:animate-ark-breathe'

/**
 * 骨架：内容还没到的时候，先把它的位置和大小占出来——直角的灰块，明暗缓缓起伏。
 * 内容来了之后版面不跳。
 *
 * 纯装饰，对读屏隐藏。正在加载这件事请在容器上说明（`aria-busy="true"`），不要靠它。
 */
export function Skeleton({ variant = 'block', lines = 3, className, ...rest }: SkeletonProps) {
  if (variant === 'text') {
    return (
      <span
        data-ark="skeleton"
        aria-hidden="true"
        {...rest}
        className={cn('box-border grid w-full gap-ark-2', className)}
      >
        {Array.from({ length: Math.max(1, lines) }, (_, index) => index).map(line => (
          <span
            key={line}
            className={cn(bar, 'h-3', line === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full')}
          />
        ))}
      </span>
    )
  }
  return (
    <span
      data-ark="skeleton"
      aria-hidden="true"
      {...rest}
      className={cn(bar, 'box-border h-4 w-full', className)}
    />
  )
}
