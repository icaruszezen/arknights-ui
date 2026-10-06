import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import { formatStatValue } from '../Stat'

export type AttributeListProps = ComponentProps<'dl'>

/**
 * 属性表：干员详情页左侧的生命上限、攻击、防御那一列。标签在左，数值右对齐，
 * 每一项下方一条 2px 的相对值条。
 *
 * 子元素是若干个 `Attribute`。整体是一个描述列表：标签是 `<dt>`，数值是 `<dd>`。
 * 宽度由使用方决定（如 `w-48`）。
 */
export function AttributeList({ className, ...rest }: AttributeListProps) {
  return (
    <dl
      data-ark="attribute-list"
      {...rest}
      className={cn('m-0 box-border grid gap-ark-3 font-ark-cjk-sans text-ark-fg', className)}
    />
  )
}

export interface AttributeProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 属性名，如“生命上限”。 */
  label: ReactNode
  /** 数值。数字自动加千分位，字符串和节点原样输出。 */
  value: ReactNode
  /** 单位，跟在数值后面。 */
  unit?: ReactNode
  /**
   * 相对值：这个数值在同类里的相对高低，0 到 1。给了就在这一项下方画一条 2px 的细条，
   * 不用读数字就能比较。它只是数值的第二种表达，对读屏隐藏。
   */
  meter?: number
}

// 细条画在这一行的两个伪元素上：::before 是轨道，::after 是相对值。
// 不另加元素——描述列表里的一组只能有 <dt> 和 <dd>
const meterLayer = cn(
  'pb-1.5',
  'before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-ark-fg/25',
  'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-(--ark-attribute-meter) after:bg-ark-fg',
  'after:transition-[width] after:duration-(--ark-motion-duration-base) after:ease-ark-standard motion-reduce:after:transition-none',
)

/** 属性表里的一项。只能放在 `AttributeList` 里。 */
export function Attribute({
  label,
  value,
  unit,
  meter,
  className,
  style,
  ...rest
}: AttributeProps) {
  const hasMeter = meter !== undefined
  return (
    <div
      data-ark="attribute"
      {...rest}
      className={cn(
        'relative box-border grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-ark-4',
        hasMeter && meterLayer,
        className,
      )}
      style={
        hasMeter
          ? ({
              '--ark-attribute-meter': `${clampProgress(meter, 1).percent}%`,
              ...style,
            } as CSSProperties)
          : style
      }
    >
      <dt className="m-0 text-ark-label leading-ark-solid font-ark-regular text-ark-fg-secondary">
        {label}
      </dt>
      <dd className="m-0 flex items-baseline font-ark-data text-ark-body leading-ark-solid font-ark-bold">
        {typeof value === 'number' ? formatStatValue(value) : value}
        {unit != null && (
          <span className="ml-ark-1 text-ark-caption font-ark-regular text-ark-fg-muted">
            {unit}
          </span>
        )}
      </dd>
    </div>
  )
}
