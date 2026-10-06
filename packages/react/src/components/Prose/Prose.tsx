import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type ProseElement = 'div' | 'article' | 'section'

export interface ProseProps extends ComponentProps<'div'> {
  /**
   * 渲染成哪个元素。
   * @default 'div'
   */
  as?: ProseElement
  /**
   * 给二级标题自动编号：`01`、`02`……数据体、信号色。档案条目用编号和细线分节。
   * @default false
   */
  numbered?: boolean
}

/**
 * 档案类长文本：干员档案、世界观文本这类要坐下来读的东西。
 * 界面用黑体，文书用宋体——中文宋体配英文衬线，行高明显大于界面文字，行长受控。
 *
 * 里面直接写普通的 `<h2>`、`<p>`、`<ul>`、`<blockquote>`、`<hr>`，样式由它统一给。
 * 每个二级标题上方有一条细线，把正文分成一节一节。
 * 这些规则的特异性为 0，子元素上自己写的类可以直接覆盖。
 *
 * 字体不随包分发：没有加载思源宋体时回退到系统的宋体。
 */
export function Prose({ as = 'div', numbered = false, className, ...rest }: ProseProps) {
  // 可选元素共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  return (
    <Comp
      data-ark="prose"
      {...rest}
      className={cn(
        // 40em：中文一行约 40 个字
        'box-border ark-prose max-w-[40em] text-ark-body text-ark-fg',
        numbered && 'ark-prose-numbered',
        className,
      )}
    />
  )
}
