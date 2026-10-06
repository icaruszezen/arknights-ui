import type { ComponentProps, ReactNode } from 'react'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type HudCounterProps = ComponentProps<'dl'>

/**
 * 作战界面顶部正中的战况：一块半透明黑底的倒梯形，里面是敌方击杀数和我方生命点数。
 * HUD 的信息全部贴边，战场留在中间。
 *
 * 子元素是若干个 `HudCounterItem`。整体是一个描述列表：名称是 `<dt>`，数字是 `<dd>`。
 * 定位交给使用方（通常是 `absolute top-0 left-1/2 -translate-x-1/2`）。
 * 两条斜边是 45°，所以底边比顶边窄两个高度。
 */
export function HudCounter({ className, ...rest }: HudCounterProps) {
  return (
    <dl
      data-ark="hud-counter"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        // 2.5rem 高；左右各留出一条斜边的宽度，数字才不会被斜边切到
        'relative isolate m-0 box-border inline-flex h-10 items-center gap-ark-5 px-[calc(var(--ark-slant)+var(--ark-space-2))] font-ark-cjk-sans text-ark-fg [--ark-slant:2.5rem]',
        // 底板画在 ::before 上再裁成倒梯形，根元素不裁
        'before:absolute before:inset-0 before:-z-1 before:bg-ark-neutral-black/60 before:ark-slant-in',
        brighterMuted,
        className,
      )}
    />
  )
}

export type HudSide = 'enemy' | 'ally'

export interface HudCounterItemProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 这个数字属于哪一方：敌方配红色的菱形，我方配蓝色的方块。 */
  side: HudSide
  /** 这个数字是什么，如“击杀”“生命点数”。只给读屏：画面上由图形和颜色表达。 */
  label: ReactNode
  /** 当前值。 */
  value: number | string
  /** 总数，写成小而灰的分母（击杀 `12/47`）。 */
  max?: number | string
  /** 换掉默认的图形。它对读屏隐藏。 */
  icon?: ReactNode
}

// 敌我的颜色是固定语义，不跟随可替换的信号色
const sideColor: Record<HudSide, string> = {
  enemy: 'text-ark-signal-danger',
  ally: 'text-ark-signal-info-deep',
}

// 颜色之外再给一种编码：敌方是菱形，我方是方块
const sideGlyph: Record<HudSide, ReactNode> = {
  enemy: <path d="M6 .5 11.5 6 6 11.5.5 6z" />,
  ally: <path d="M1.5 1.5h9v9h-9z" />,
}

/** 战况里的一项：一个小图形加数据体的数字。只能放在 `HudCounter` 里。 */
export function HudCounterItem({
  side,
  label,
  value,
  max,
  icon,
  className,
  ...rest
}: HudCounterItemProps) {
  return (
    <div
      data-ark="hud-counter-item"
      data-side={side}
      {...rest}
      className={cn('box-border flex items-center gap-ark-2 whitespace-nowrap', className)}
    >
      <dt className="flex items-center">
        <span
          aria-hidden="true"
          className={cn(
            'grid size-3 place-items-center [&>svg]:block [&>svg]:size-full',
            sideColor[side],
          )}
        >
          {icon ?? (
            <svg aria-hidden="true" viewBox="0 0 12 12" className="fill-current">
              {sideGlyph[side]}
            </svg>
          )}
        </span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="m-0 flex items-baseline font-ark-data text-ark-h2 leading-ark-solid">
        <b className="font-ark-bold">{formatStatValue(value)}</b>
        {max !== undefined && (
          <span className="text-ark-label font-ark-regular text-ark-fg-muted">
            /{formatStatValue(max)}
          </span>
        )}
      </dd>
    </div>
  )
}
