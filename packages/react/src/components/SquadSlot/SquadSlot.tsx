import type { ComponentProps } from 'react'
import { PlusIcon } from '../../internal/icons'
import { colorTransition, focusRingInset } from '../../utils/classes'
import { cn } from '../../utils/cn'

export interface SquadSlotProps extends ComponentProps<'div'> {
  /** 点空位时调用，通常是打开干员选择。给了它，空位是一个按钮。 */
  onAdd?: () => void
  /**
   * 空位按钮的名称，读屏会念出来。
   * @default '添加干员'
   */
  addLabel?: string
}

const placeholder =
  'm-0 box-border grid place-items-center border border-dashed border-ark-fg-muted/50 bg-transparent p-0 text-ark-fg-muted'

/**
 * 编队里的一个位置：放一张 `OperatorCard`；没有干员时是一个带加号的虚线框。
 * 干员卡片横向排列，空位和卡片一样大，整排的节奏不会断。
 *
 * `children` 是这个位置上的卡片，会被撑满到位置的大小。默认 10rem 宽、1:2，
 * 和 `OperatorCard` 的默认大小一致；用 `w-*`、`aspect-*` 调，里面的卡片跟着变。
 */
export function SquadSlot({
  onAdd,
  addLabel = '添加干员',
  className,
  children,
  ...rest
}: SquadSlotProps) {
  const empty = children == null || children === false
  return (
    <div
      data-ark="squad-slot"
      data-empty={empty ? '' : undefined}
      {...rest}
      className={cn(
        // 里面的那一个元素（卡片或空位）撑满这个位置
        'relative box-border grid aspect-[1/2] w-40 shrink-0 *:aspect-auto *:size-full',
        className,
      )}
    >
      {!empty ? (
        children
      ) : onAdd !== undefined ? (
        <button
          type="button"
          aria-label={addLabel}
          onClick={onAdd}
          className={cn(
            placeholder,
            'cursor-pointer appearance-none hover:border-ark-signal hover:border-solid hover:text-ark-signal-fg',
            colorTransition,
            // 位置之间只留很窄的缝，轮廓画在内侧
            focusRingInset,
          )}
        >
          <PlusIcon className="size-8" />
        </button>
      ) : (
        <span aria-hidden="true" className={placeholder}>
          <PlusIcon className="size-8" />
        </span>
      )}
    </div>
  )
}
