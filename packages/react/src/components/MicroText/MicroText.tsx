import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export interface MicroTextProps extends ComponentProps<'span'> {
  /** 竖排：顺时针转 90°，贴着画面的边放。 */
  vertical?: boolean
}

/**
 * 微缩英文：6px 左右、字距拉得很开，当纹理用。小到不需要被读，但写的是真实内容
 * （品牌名、网址、栏目名），不要用乱码充数。
 *
 * 它是纯装饰，对比度有意压到最低，默认对读屏隐藏，避免被逐字母朗读。
 * 必须读到的信息不要放在这里。
 */
export function MicroText({ vertical = false, className, ...rest }: MicroTextProps) {
  return (
    <span
      data-ark="micro-text"
      aria-hidden="true"
      {...rest}
      className={cn(
        // 文档取值是固定的 #585858。这里取次要文字色的一半：黑底上约等于它，放进纸白面板时跟着换
        'inline-block font-ark-latin-wide text-ark-micro leading-ark-solid font-ark-medium tracking-ark-micro whitespace-nowrap text-ark-fg-muted/50 uppercase select-none',
        // 用书写方向而不是 rotate：盒子的宽高跟着变，贴边时不用再算偏移
        vertical && '[writing-mode:vertical-rl]',
        className,
      )}
    />
  )
}
