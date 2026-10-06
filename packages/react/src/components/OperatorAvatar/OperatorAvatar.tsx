import type { ComponentProps, ReactNode } from 'react'
import { PlusIcon } from '../../internal/icons'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import { MoodBar } from '../MoodBar'

export interface OperatorAvatarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 头像的地址：脸落在上三分之一。不给就是一个带加号的空位。 */
  src?: string
  /**
   * 头像的替代文字，通常是干员的名字。旁边已经写了名字时传空字符串。
   * 空位没有图片，给了它就把它当作空位的名称（如“空位”）读出来。
   * @default ''
   */
  alt?: string
  /** 右下角的加成图标：图形说明“是哪一类加成”。组件库不带图标，请自备。 */
  buff?: ReactNode
  /**
   * 加成有多强，`1` 到 `buffMax`。给了就在图标外面画一圈圆环，走过的比例就是强弱。
   */
  buffLevel?: number
  /**
   * 加成最强是几级。
   * @default 3
   */
  buffMax?: number
  /** 给读屏的说明，如“制造效率 +25%”。不给时加成图标对读屏隐藏。 */
  buffLabel?: string
  /** 心情。给了就在头像底边贴一条 `MoodBar`。 */
  mood?: number
  /**
   * 心情的上限。
   * @default 24
   */
  moodMax?: number
}

/**
 * 干员头像格：正方形的头像，右下角叠一个加成图标和一圈圆环。
 *
 * 小图标上做了二维编码：图形表达“是什么”，圆环表达“有多强”。
 * 这是基建迭代了三版的结论——文字标签小了认不出，统一的图标又分不出强弱。
 *
 * 圆环用信号色，放进覆盖了 `--ark-signal` 的房间或抽屉里就跟着换成类型色。
 * 默认 3.5rem 见方，用 `size-*` 调；多个并排时留 4px 的缝。
 */
export function OperatorAvatar({
  src,
  alt = '',
  buff,
  buffLevel,
  buffMax = 3,
  buffLabel,
  mood,
  moodMax,
  className,
  ...rest
}: OperatorAvatarProps) {
  const empty = src === undefined
  return (
    <div
      data-ark="operator-avatar"
      data-ark-tone="dark"
      data-empty={empty ? '' : undefined}
      // 空位没有图片可以挂 alt，名称挂在格子自己身上；aria-label 只在带 role 的元素上有效
      {...(empty && alt !== '' ? { role: 'img', 'aria-label': alt } : undefined)}
      {...rest}
      className={cn(
        'relative isolate box-border inline-grid size-14 shrink-0 place-items-center text-ark-fg',
        empty
          ? 'border border-dashed border-ark-fg-muted/50 text-ark-fg-muted'
          : 'bg-ark-neutral-graphite',
        className,
      )}
    >
      {empty ? (
        <PlusIcon className="size-1/3" />
      ) : (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 -z-1 m-0 block size-full max-w-none border-0 object-cover object-[50%_15%] select-none"
        />
      )}
      {mood !== undefined && (
        <MoodBar value={mood} max={moodMax} className="absolute inset-x-0 bottom-0" />
      )}
      {buff != null && (
        <span
          // aria-label 只在带 role 的元素上有效，两样必须一起出现
          {...(buffLabel !== undefined
            ? { role: 'img', 'aria-label': buffLabel }
            : { 'aria-hidden': true })}
          // 往外探出 4px，压住头像的右下角
          className="absolute -right-1 -bottom-1 grid size-[45%] place-items-center rounded-full bg-ark-neutral-black"
        >
          {buffLevel !== undefined && (
            // 圆的起点在 3 点方向，转 -90° 挪到 12 点
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute inset-0 block size-full -rotate-90"
            >
              <circle cx="12" cy="12" r="10.75" strokeWidth="2.5" className="stroke-ark-fg/25" />
              <circle
                cx="12"
                cy="12"
                r="10.75"
                strokeWidth="2.5"
                // 把周长归一成 100，虚线的偏移量就是没走完的百分比
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - clampProgress(buffLevel, buffMax).percent}
                className="stroke-ark-signal"
              />
            </svg>
          )}
          <span className="grid size-1/2 place-items-center [&>svg]:block [&>svg]:size-full">
            {buff}
          </span>
        </span>
      )}
    </div>
  )
}
