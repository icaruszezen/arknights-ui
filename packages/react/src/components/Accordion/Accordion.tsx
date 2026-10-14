import { type ComponentProps, createContext, type ReactNode, useContext, useId } from 'react'
import { ChevronDownIcon } from '../../internal/icons'
import { toItems } from '../../internal/toItems'
import { colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../../utils/format'

interface AccordionContextValue {
  /** 互斥时各项共用的 name：浏览器保证同名的 `<details>` 只开一个。 */
  name: string | undefined
  numbered: boolean
  index: number
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export interface AccordionProps extends ComponentProps<'div'> {
  /** 同一时刻只展开一项：展开一项时别的自动收起。 */
  exclusive?: boolean
  /** 每一项前面加一个补零的编号（`01`、`02`…），数据体、信号色。 */
  numbered?: boolean
}

/**
 * 折叠面板：一列可以展开的条目，条目之间只有一条细线。
 *
 * 每一项是原生的 `<details>`：展开收起、键盘、页内查找都是浏览器自带的，不需要脚本；
 * `exclusive` 用的是 `<details name>` 的互斥。子元素是若干个 `AccordionItem`。
 */
export function Accordion({
  exclusive = false,
  numbered = false,
  className,
  children,
  ...rest
}: AccordionProps) {
  const name = useId()
  return (
    <div
      data-ark="accordion"
      {...rest}
      className={cn('box-border border-t border-ark-rule font-ark-cjk-sans text-ark-fg', className)}
    >
      {toItems(children).map(({ key, child, index }) => (
        <AccordionContext key={key} value={{ name: exclusive ? name : undefined, numbered, index }}>
          {child}
        </AccordionContext>
      ))}
    </div>
  )
}

export interface AccordionItemProps extends Omit<ComponentProps<'details'>, 'title' | 'onToggle'> {
  /** 这一项的标题，一直看得见。 */
  title: ReactNode
  /** 标题后面的英文小字。 */
  sub?: ReactNode
  /** 是否展开。受控：请在 `onOpenChange` 里更新它。不给就由浏览器自己记。 */
  open?: boolean
  /** 一开始是否展开（非受控）。 */
  defaultOpen?: boolean
  /** 展开或收起时调用。 */
  onOpenChange?: (open: boolean) => void
}

/** 折叠面板里的一项。`children` 是展开后的内容。只能放在 `Accordion` 里。 */
export function AccordionItem({
  title,
  sub,
  open,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const accordion = useContext(AccordionContext)
  if (!accordion) throw new Error('<AccordionItem> 必须放在 <Accordion> 里')
  return (
    <details
      data-ark="accordion-item"
      name={accordion.name}
      open={open ?? defaultOpen}
      {...rest}
      onToggle={event => onOpenChange?.(event.currentTarget.open)}
      className={cn('group box-border border-b border-ark-rule', className)}
    >
      <summary
        className={cn(
          // 去掉自带的小三角，用自己的折线箭头
          'box-border flex min-h-12 cursor-pointer list-none items-center gap-ark-3 px-ark-1 py-ark-2 text-ark-base leading-ark-snug font-ark-bold select-none [&::-webkit-details-marker]:hidden',
          'hover:text-ark-signal-fg',
          colorTransition,
          focusRingInset,
        )}
      >
        {accordion.numbered && (
          <span aria-hidden="true" className="font-ark-data text-ark-signal-fg">
            {formatStatValue(accordion.index + 1, 2)}
          </span>
        )}
        <span className="flex min-w-0 grow flex-wrap items-baseline gap-x-ark-2">
          {title}
          {sub != null && (
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {sub}
            </span>
          )}
        </span>
        <ChevronDownIcon className="h-1.5 w-3 shrink-0 transition-[rotate] duration-(--ark-motion-duration-base) group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="box-border px-ark-1 pt-ark-1 pb-ark-4 text-ark-label leading-ark-body text-ark-fg-secondary">
        {children}
      </div>
    </details>
  )
}
