import type { ComponentProps, ReactNode } from 'react'
import { CrosshairIcon, TowerIcon } from '../../internal/icons'
import { brighterMuted } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type HudCounterProps = ComponentProps<'dl'>

/**
 * 作战界面顶部正中的战况：一块半透明黑底的直角矩形，里面是敌方击杀数和我方生命点数，
 * 两端和两项之间各一条短竖线。HUD 的信息全部贴边，战场留在中间。
 *
 * 子元素是若干个 `HudCounterItem`。整体是一个描述列表：名称是 `<dt>`，数字是 `<dd>`。
 * 定位交给使用方（通常是 `absolute top-0 left-1/2 -translate-x-1/2`）。
 */
export function HudCounter({ className, ...rest }: HudCounterProps) {
  return (
    <dl
      data-ark="hud-counter"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        // 2.25rem 高（实机约 2.125rem）
        'relative m-0 box-border inline-flex h-9 items-center bg-ark-neutral-black/60 font-ark-cjk-sans text-ark-fg',
        // 两端的短竖线：1px 宽、半高。画在伪元素上——描述列表里不能直接放别的元素
        'before:absolute before:top-1/4 before:left-0 before:h-1/2 before:w-px before:bg-ark-fg/70',
        'after:absolute after:top-1/4 after:right-0 after:h-1/2 after:w-px after:bg-ark-fg/70',
        brighterMuted,
        className,
      )}
    />
  )
}

export type HudSide = 'enemy' | 'ally'

export interface HudCounterItemProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 这个数字属于哪一方：敌方配橙色的准星，我方配蓝色的塔，生命点数的数字是浅红。 */
  side: HudSide
  /** 这个数字是什么，如“击杀”“生命点数”。只给读屏：画面上由图形和颜色表达。 */
  label: ReactNode
  /** 当前值。 */
  value: number | string
  /** 总数，和当前值一样大，写成 `12/47`。 */
  max?: number | string
  /** 换掉默认的图形。它对读屏隐藏。 */
  icon?: ReactNode
}

// 敌我的颜色是固定语义，不跟随可替换的信号色
const sideColor: Record<HudSide, string> = {
  enemy: 'text-ark-side-enemy',
  ally: 'text-ark-signal-info-deep',
}

// 颜色之外再给一种编码：敌方是准星，我方是塔
const sideGlyph: Record<HudSide, ReactNode> = {
  enemy: <CrosshairIcon />,
  ally: <TowerIcon />,
}

// 实机上生命点数的数字是浅红，击杀数是白的
const sideValue: Record<HudSide, string> = {
  enemy: '',
  ally: 'text-ark-side-life',
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
      className={cn(
        // 撑满底板的高度：两项之间的竖线才和两端的一样高
        'relative box-border flex h-full items-center gap-ark-3 px-ark-5 whitespace-nowrap',
        // 两项之间的短竖线
        'not-first:before:absolute not-first:before:top-1/4 not-first:before:left-0 not-first:before:h-1/2 not-first:before:w-px not-first:before:bg-ark-fg/70',
        className,
      )}
    >
      <dt className="flex items-center">
        <span
          aria-hidden="true"
          className={cn(
            'grid size-6 place-items-center [&>svg]:block [&>svg]:size-full',
            sideColor[side],
          )}
        >
          {icon ?? sideGlyph[side]}
        </span>
        <span className="sr-only">{label}</span>
      </dt>
      {/* 分子分母同大同色：实机写作 0/63，细体 */}
      <dd
        className={cn(
          'm-0 font-ark-data text-ark-body-lg leading-ark-solid font-ark-regular',
          sideValue[side],
        )}
      >
        {formatStatValue(value)}
        {max !== undefined && <>/{formatStatValue(max)}</>}
      </dd>
    </div>
  )
}
