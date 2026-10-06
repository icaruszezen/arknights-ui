import { type ComponentProps, type ReactNode, useId } from 'react'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

export type NumberedSectionHeading = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface NumberedSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** 第几节。数字按 `pad` 补前导零，字符串原样输出。 */
  number: number | string
  /**
   * 补前导零到几位。
   * @default 2
   */
  pad?: number
  /** 小节名，如“活动说明”。 */
  title: ReactNode
  /** 标题行右端的英文小字。 */
  sub?: ReactNode
  /**
   * 小节名渲染成哪一级标题。
   * @default 'h3'
   */
  headingAs?: NumberedSectionHeading
}

/**
 * 编号小节：数据体的两位数字、中文小节名，下面一条 1px 细线，再下面是这一节的内容。
 * 公告长图是模板化的信息图——每一期只换主题色、页眉和底纹，这副分节的骨架不动。
 *
 * 内容从小节名的左缘写起，编号独占一列；竖屏时内容回到最左。
 * 整节以“编号 + 小节名”为名称，读屏可以在各节之间跳转。
 */
export function NumberedSection({
  number,
  pad = 2,
  title,
  sub,
  headingAs: Heading = 'h3',
  className,
  children,
  ...rest
}: NumberedSectionProps) {
  const numberId = useId()
  const titleId = useId()
  return (
    <section
      data-ark="numbered-section"
      aria-labelledby={`${numberId} ${titleId}`}
      {...rest}
      className={cn(
        'box-border grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-ark-3 font-ark-cjk-sans text-ark-fg',
        className,
      )}
    >
      {/* 数字比小节名大一倍：编号是这一行的主角 */}
      <span
        id={numberId}
        className="font-ark-data text-ark-h1 leading-ark-solid font-ark-bold text-ark-signal-fg"
      >
        {formatStatValue(number, pad)}
      </span>
      <div className="flex min-w-0 items-baseline justify-between gap-ark-4">
        <Heading id={titleId} className="m-0 text-ark-body-lg leading-ark-solid font-ark-bold">
          {title}
        </Heading>
        {sub != null && (
          <span className="shrink-0 font-ark-latin-condensed text-ark-caption leading-ark-solid font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
            {sub}
          </span>
        )}
      </div>
      <span aria-hidden="true" className="col-span-2 mt-ark-2 h-px bg-ark-rule" />
      {children != null && (
        <div className="col-start-2 box-border min-w-0 pt-ark-4 portrait:col-span-2 portrait:col-start-1">
          {children}
        </div>
      )}
    </section>
  )
}
