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
   * 这个写法没有实机出处，是估计。
   * @default false
   */
  numbered?: boolean
  /**
   * 文书的写法：中文宋体配英文衬线，1.125rem、行高 1.9。没有实机出处，是估计。
   * @default false
   */
  serif?: boolean
}

/**
 * 成段的文字：公告正文、干员档案、世界观文本这类要坐下来读的东西。
 * 黑体 1rem、行高 1.4、段距 1em——官网的公告正文就是这样排的（实测），干员简介和设定说明的行高也是 1.4。
 * 行长限制在 40 个字以内（官网一行约 72 个字，太长）。
 *
 * 里面直接写普通的 `<h2>`、`<p>`、`<ul>`、`<blockquote>`、`<hr>`，样式由它统一给。
 * 每个二级标题上方有一条细线，把正文分成一节一节。
 * 这些规则的特异性为 0，子元素上自己写的类可以直接覆盖。
 *
 * `serif` 换成宋体。字体不随包分发：没有加载思源宋体时回退到系统的宋体。
 */
export function Prose({
  as = 'div',
  numbered = false,
  serif = false,
  className,
  ...rest
}: ProseProps) {
  // 可选元素共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  return (
    <Comp
      data-ark="prose"
      {...rest}
      className={cn(
        // 40em：中文一行约 40 个字
        'box-border ark-prose max-w-[40em] text-ark-fg',
        // 宋体的字体栈写在工具类里，两种字体的类不同时出现
        serif ? 'ark-prose-serif text-ark-body' : 'font-ark-cjk-sans text-[1rem]',
        numbered && 'ark-prose-numbered',
        className,
      )}
    />
  )
}
