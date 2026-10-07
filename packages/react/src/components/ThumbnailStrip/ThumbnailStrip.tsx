import type { ComponentProps } from 'react'
import { handleRadioGroupKeyDown, RadioGroupContext, useRadioItem } from '../../internal/radioGroup'
import { focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type ThumbnailStripOrientation = 'horizontal' | 'vertical'

export interface ThumbnailStripProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  /** 当前项。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始的当前项（非受控）。 */
  defaultValue?: string
  /** 当前项变化时调用。 */
  onValueChange?: (value: string) => void
  /**
   * 排列方向。
   * - `horizontal`：横排（官网干员屏左下角）
   * - `vertical`：竖排（寻访界面侧边的卡池缩略条）
   * @default 'horizontal'
   */
  orientation?: ThumbnailStripOrientation
}

const layouts: Record<ThumbnailStripOrientation, string> = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
}

/**
 * 缩略图条：几张带白框的小图排成一排，用来切换旁边的主图。当前项不靠边框标记，
 * 而是从它的右上角后面探出一块信号色的三角。
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
      <div
        data-ark="thumbnail-strip"
        role="radiogroup"
        aria-orientation={orientation}
        {...rest}
        onKeyDown={event => {
          onKeyDown?.(event)
          handleRadioGroupKeyDown(event)
        }}
        className={cn(
          // 三角往上探出 0.5rem、往右探出 0.375rem：上、右两边给它留出位置
          'box-border inline-flex gap-ark-2 pt-ark-2 pr-[0.375rem]',
          layouts[orientation],
          className,
        )}
      />
    </RadioGroupContext>
  )
}

export interface ThumbnailProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  /** 这一项的标识。 */
  value: string
  /** 图片地址。 */
  src: string
  /** 这一项的名称：写在缩略图的左下角，同时是它的可访问名称。 */
  label: string
  /**
   * 不把名称写在图上，只读给读屏。图上已经有字（卡池的标题标识）时用。
   * @default false
   */
  hideLabel?: boolean
  /**
   * 取原图的哪一块：图片的 `object-position`，如 `'50% 20%'`。
   * @default 脸落在上三分之一
   */
  position?: string
}

// 当前项的标记：直角边 2rem 的三角，垫在缩略图后面，只露出探到框外的那一角（官网实测）
const mark = cn(
  'before:absolute before:-top-ark-2 before:right-[-0.375rem] before:-z-1 before:size-8 before:bg-ark-signal before:[clip-path:polygon(0_0,100%_0,100%_100%)]',
  'before:opacity-0 aria-checked:before:opacity-100',
  'before:transition-opacity before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
)

/**
 * 一张缩略图：`7.125rem × 11.25rem`，一圈 `0.625rem` 的白框，名称写在左下角。
 * 尺寸是官网干员屏的实测值，用 `w-*`、`h-*` 调。只能放在 `ThumbnailStrip` 里。
 */
export function Thumbnail({
  value,
  src,
  label,
  hideLabel = false,
  position,
  className,
  onClick,
  ...rest
}: ThumbnailProps) {
  const { radioProps } = useRadioItem(value, 'Thumbnail', 'ThumbnailStrip', onClick)
  return (
    <button
      data-ark="thumbnail"
      {...rest}
      {...radioProps}
      className={cn(
        // isolate：三角用 -z-1 垫在图片后面，又不会掉到按钮自己的后面去
        'relative isolate m-0 box-border block h-[11.25rem] w-[7.125rem] shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-ark-neutral-white',
        mark,
        focusRing,
        className,
      )}
    >
      <img
        src={src}
        alt=""
        style={position === undefined ? undefined : { objectPosition: position }}
        className="absolute inset-0 m-0 block size-full max-w-none border-0 bg-ark-neutral-ink-900 object-cover object-[50%_15%] select-none"
      />
      {/* 白框压在图片上面，对读屏没有意义 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-[0.625rem] border-solid border-ark-neutral-white"
      />
      <span
        className={cn(
          hideLabel
            ? 'sr-only'
            : // 名称压在图上：上面一个小方点，四周一圈黑色的晕，白字才读得清
              'absolute bottom-ark-4 left-ark-4 grid max-w-[calc(100%-2rem)] gap-ark-2 font-ark-cjk-sans text-[1rem] leading-ark-solid font-ark-medium [text-shadow:0_0_0.5rem_#000,0_0_0.5rem_#000] before:size-[0.375rem] before:bg-current',
        )}
      >
        {label}
      </span>
    </button>
  )
}
