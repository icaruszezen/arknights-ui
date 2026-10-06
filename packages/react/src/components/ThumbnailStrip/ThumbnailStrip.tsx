import { type ComponentProps, createContext, useContext } from 'react'
import { handleRadioGroupKeyDown, RadioGroupContext, useRadioItem } from '../../internal/radioGroup'
import { focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type ThumbnailStripOrientation = 'horizontal' | 'vertical'

const OrientationContext = createContext<ThumbnailStripOrientation>('horizontal')

export interface ThumbnailStripProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  /** 当前项。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始的当前项（非受控）。 */
  defaultValue?: string
  /** 当前项变化时调用。 */
  onValueChange?: (value: string) => void
  /**
   * 排列方向。
   * - `horizontal`：横排，当前项上方一条短条（官网干员屏左下角）
   * - `vertical`：竖排，短条在左侧（寻访界面侧边的卡池缩略条）
   * @default 'horizontal'
   */
  orientation?: ThumbnailStripOrientation
}

// 留出短条的位置：4px 的条加 4px 的缝
const layouts: Record<ThumbnailStripOrientation, string> = {
  horizontal: 'flex-row pt-ark-2',
  vertical: 'flex-col pl-ark-2',
}

/**
 * 缩略图条：几张小图排成一排，用来切换旁边的主图。当前项不靠边框标记，
 * 而是在它上方加一条信号色的短条。
 *
 * 子元素是若干个 `Thumbnail`，同一时刻只有一个当前项。它是一个单选组：
 * Tab 进到当前项，方向键移动并立即切换。请用 `aria-label` 说明切换的是什么。
 */
export function ThumbnailStrip({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  onKeyDown,
  ...rest
}: ThumbnailStripProps) {
  const [current, select] = useControllableState<string | undefined>(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })
  return (
    <RadioGroupContext value={{ value: current, select }}>
      <OrientationContext value={orientation}>
        <div
          data-ark="thumbnail-strip"
          role="radiogroup"
          aria-orientation={orientation}
          {...rest}
          onKeyDown={event => {
            onKeyDown?.(event)
            handleRadioGroupKeyDown(event)
          }}
          className={cn('box-border inline-flex gap-ark-2', layouts[orientation], className)}
        />
      </OrientationContext>
    </RadioGroupContext>
  )
}

export interface ThumbnailProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  /** 这一项的标识。 */
  value: string
  /** 图片地址。 */
  src: string
  /** 这一项的名称，读屏会念出来（缩略图上没有文字）。 */
  label: string
  /**
   * 取原图的哪一块：图片的 `object-position`，如 `'50% 20%'`。
   * @default 脸落在上三分之一
   */
  position?: string
}

// 短条画在 ::before 上，贴在缩略图之外；当前项才显示
const bar = cn(
  'before:absolute before:bg-ark-signal before:opacity-0 aria-checked:before:opacity-100',
  'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
)
const bars: Record<ThumbnailStripOrientation, string> = {
  horizontal: 'before:inset-x-0 before:-top-ark-2 before:h-(--ark-line-strong)',
  vertical: 'before:inset-y-0 before:-left-ark-2 before:w-(--ark-line-strong)',
}

/**
 * 一张缩略图，3:4。非当前项压暗、降低饱和度，悬停时恢复。
 * 默认 4rem 宽，用 `w-*` 调。只能放在 `ThumbnailStrip` 里。
 */
export function Thumbnail({
  value,
  src,
  label,
  position,
  className,
  onClick,
  ...rest
}: ThumbnailProps) {
  const orientation = useContext(OrientationContext)
  const { radioProps } = useRadioItem(value, 'Thumbnail', 'ThumbnailStrip', onClick)
  return (
    <button
      data-ark="thumbnail"
      aria-label={label}
      {...rest}
      {...radioProps}
      className={cn(
        'group relative m-0 box-border block aspect-[3/4] w-16 shrink-0 cursor-pointer appearance-none border-0 bg-ark-neutral-ink-900 p-0',
        bar,
        bars[orientation],
        focusRing,
        className,
      )}
    >
      <img
        src={src}
        alt=""
        style={position === undefined ? undefined : { objectPosition: position }}
        className={cn(
          'm-0 block size-full max-w-none border-0 object-cover object-[50%_15%] select-none',
          'opacity-50 saturate-[0.7] group-hover:opacity-100 group-aria-checked:opacity-100 group-aria-checked:saturate-100',
          'transition-[opacity,filter] duration-(--ark-motion-duration-base) ease-ark-standard',
        )}
      />
    </button>
  )
}
