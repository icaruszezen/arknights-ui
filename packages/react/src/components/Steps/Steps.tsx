import { type ComponentProps, createContext, type ReactNode, useContext } from 'react'
import { CheckIcon } from '../../internal/icons'
import { toItems } from '../../internal/toItems'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../../utils/format'

export type StepsOrientation = 'horizontal' | 'vertical'
export type StepState = 'done' | 'current' | 'upcoming'

interface StepContextValue {
  index: number
  state: StepState
  orientation: StepsOrientation
  last: boolean
  doneLabel: string
}

const StepContext = createContext<StepContextValue | null>(null)

export interface StepsProps extends ComponentProps<'ol'> {
  /** 当前在第几步，从 0 起。它之前的算完成，之后的算还没到。给 `total` 以上的数表示全部完成。 */
  current: number
  /**
   * @default 'horizontal'
   */
  orientation?: StepsOrientation
  /**
   * 完成的那些步骤，读屏在编号后面补读的话。
   * @default '已完成'
   */
  doneLabel?: string
}

/**
 * 步骤：一根轴线串着几个方形的节点，每个节点一个补零的编号。
 * 完成的反色并换成对勾，当前的是信号色，还没到的只有一圈细边——状态靠形状和明暗，不只靠颜色。
 *
 * 子元素是若干个 `Step`，直接写在里面。它是一个有序列表；当前的那一步带 `aria-current="step"`。
 */
export function Steps({
  current,
  orientation = 'horizontal',
  doneLabel = '已完成',
  className,
  children,
  ...rest
}: StepsProps) {
  const items = toItems(children)
  return (
    <ol
      data-ark="steps"
      data-orientation={orientation}
      {...rest}
      className={cn(
        'm-0 box-border flex list-none p-0 font-ark-cjk-sans text-ark-fg',
        orientation === 'vertical' ? 'flex-col' : 'items-start',
        className,
      )}
    >
      {items.map(({ key, child, index }) => (
        <StepContext
          key={key}
          value={{
            index,
            state: index < current ? 'done' : index === current ? 'current' : 'upcoming',
            orientation,
            last: index === items.length - 1,
            doneLabel,
          }}
        >
          {child}
        </StepContext>
      ))}
    </ol>
  )
}

export interface StepProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** 这一步叫什么。 */
  title: ReactNode
  /** 名称旁边的英文小字。 */
  sub?: ReactNode
}

const nodes: Record<StepState, string> = {
  done: 'bg-ark-invert text-ark-on-invert',
  current: 'bg-ark-signal text-ark-on-signal',
  upcoming: 'border border-ark-rule-strong text-ark-fg-muted',
}

/** 一步。`children` 是这一步的补充说明，可以不给。只能放在 `Steps` 里。 */
export function Step({ title, sub, className, children, ...rest }: StepProps) {
  const step = useContext(StepContext)
  if (!step) throw new Error('<Step> 必须放在 <Steps> 里')
  const { index, state, orientation, last, doneLabel } = step
  const vertical = orientation === 'vertical'
  return (
    <li
      data-ark="step"
      data-state={state}
      aria-current={state === 'current' ? 'step' : undefined}
      {...rest}
      className={cn(
        'relative box-border flex min-w-0',
        vertical
          ? 'gap-ark-3 pb-ark-5 last:pb-0'
          : 'flex-1 flex-col gap-ark-3 pr-ark-4 last:flex-none last:pr-0',
        className,
      )}
    >
      <div className={cn('flex items-center', vertical ? 'flex-col self-stretch' : 'w-full')}>
        <span
          className={cn(
            'box-border grid size-8 shrink-0 place-items-center font-ark-data text-ark-label leading-ark-solid font-ark-bold',
            nodes[state],
          )}
        >
          {state === 'done' ? (
            <>
              <CheckIcon className="size-4" />
              <span className="sr-only">
                {formatStatValue(index + 1, 2)} {doneLabel}
              </span>
            </>
          ) : (
            formatStatValue(index + 1, 2)
          )}
        </span>
        {/* 通向下一步的线：走过的那一段是实的，还没走的淡一档 */}
        {!last && (
          <span
            aria-hidden="true"
            className={cn(
              'grow',
              vertical ? 'mt-ark-1 -mb-ark-4 w-px' : 'ml-ark-2 h-px',
              state === 'done' ? 'bg-ark-fg' : 'bg-ark-rule',
            )}
          />
        )}
      </div>
      <div className={cn('grid min-w-0 gap-ark-1', vertical && 'pt-1.5')}>
        <div className="flex flex-wrap items-baseline gap-x-ark-2">
          <span
            className={cn(
              'text-ark-label leading-ark-snug font-ark-bold',
              state === 'upcoming' && 'text-ark-fg-muted',
            )}
          >
            {title}
          </span>
          {sub != null && (
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {sub}
            </span>
          )}
        </div>
        {children != null && (
          <div className="text-ark-caption leading-ark-snug text-ark-fg-muted">{children}</div>
        )}
      </div>
    </li>
  )
}
