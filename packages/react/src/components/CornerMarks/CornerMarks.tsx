import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type CornerMarksProps = ComponentProps<'div'>

// 每个角标是一个只画两条边的小方块
const corners = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'right-0 bottom-0 border-r border-b',
  'bottom-0 left-0 border-b border-l',
]

/**
 * 四个 L 形角标框住一块内容，但不闭合：视线会自己把边框补全，画面更透气。
 *
 * 它像图纸上的定位标记。按页面类型控制密度，不要给每个元素都加。
 */
export function CornerMarks({ className, children, ...rest }: CornerMarksProps) {
  return (
    <div data-ark="corner-marks" {...rest} className={cn('relative box-border p-ark-4', className)}>
      {corners.map(corner => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn('pointer-events-none absolute box-border size-3.5 border-ark-fg', corner)}
        />
      ))}
      {children}
    </div>
  )
}
