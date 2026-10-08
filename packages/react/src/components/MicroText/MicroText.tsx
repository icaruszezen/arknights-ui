import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export interface MicroTextProps extends ComponentProps<'span'> {
  /** 竖排：顺时针转 90°，贴着画面的边放。 */
  vertical?: boolean
}

/**
 * 微缩英文：6px、字距拉得很开，当纹理用。小到不需要被读，但写的是真实内容
 * （品牌名、网址、栏目名），不要用乱码充数。
 *
 * 它是纯装饰，默认对读屏隐藏，避免被逐字母朗读。必须读到的信息不要放在这里。
 *
 * 颜色跟随所在的文字：官网唯一的一处 0.375rem（右栏计数里那行品牌名）就是白的。
 * 想压暗就自己加一个 `text-*`。
 */
export function MicroText({ vertical = false, className, ...rest }: MicroTextProps) {
  return (
    <span
      data-ark="micro-text"
      aria-hidden="true"
      {...rest}
      className={cn(
        'inline-block font-ark-latin-wide text-ark-micro leading-ark-solid font-ark-medium tracking-ark-micro whitespace-nowrap uppercase select-none',
        // 用书写方向而不是 rotate：盒子的宽高跟着变，贴边时不用再算偏移
        vertical && '[writing-mode:vertical-rl]',
        className,
      )}
    />
  )
}
