import type { ComponentProps, ReactNode } from 'react'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type ResourceBarProps = ComponentProps<'dl'>

/**
 * 资源条：贴在右上角的一排资源数量，和左上角的“返回 + 主页”一样位置固定。
 * 定位交给使用方（通常是 `fixed top-0 right-0`）。
 *
 * 子元素是若干个 `Resource`。整体是一个描述列表：名称是 `<dt>`，数量是 `<dd>`。
 */
export function ResourceBar({ className, ...rest }: ResourceBarProps) {
  return (
    <dl
      data-ark="resource-bar"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        'm-0 box-border inline-flex flex-wrap justify-end gap-ark-1 font-ark-cjk-sans text-ark-fg',
        brighterMuted,
        className,
      )}
    />
  )
}

export interface ResourceProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 资源的名称，如“龙门币”。 */
  label: ReactNode
  /** 数量。数字自动加千分位，字符串原样输出。 */
  value: number | string
  /** 上限，写成小而灰的分母（理智 `131/135`）。 */
  max?: number | string
  /** 名称前的小图标。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
}

/** 资源条里的一项：半透明黑底上的名称和数据体数字。只能放在 `ResourceBar` 里。 */
export function Resource({ label, value, max, icon, className, ...rest }: ResourceProps) {
  return (
    <div
      data-ark="resource"
      {...rest}
      className={cn(
        // 黑 65%：压在场景上仍然够暗，白色数字读得清
        'box-border flex h-8 items-center gap-ark-2 bg-ark-neutral-black/65 px-ark-3 whitespace-nowrap',
        className,
      )}
    >
      <dt className="flex items-center gap-ark-1 text-ark-caption leading-ark-solid font-ark-regular text-ark-fg-muted">
        {icon != null && (
          <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center">
            {icon}
          </span>
        )}
        {label}
      </dt>
      <dd className="m-0 flex items-baseline font-ark-data text-ark-label leading-ark-solid">
        <b className="font-ark-bold">{formatStatValue(value)}</b>
        {max !== undefined && (
          <span className="text-ark-caption font-ark-regular text-ark-fg-muted">
            /{formatStatValue(max)}
          </span>
        )}
      </dd>
    </div>
  )
}
