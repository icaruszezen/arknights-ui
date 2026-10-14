import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing, hitArea } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type StoryControlsProps = ComponentProps<'div'>

/**
 * 画面角落里的一组控制键。剧情界面是一排半透明的小横条：自动、跳过、回顾、隐藏界面，
 * 小号，不抢画面。作战界面右上角的倍速、暂停、设置排法相同，但每个键是一块大方块，
 * 用 `StoryControl` 的 `shape="square"`。
 *
 * 子元素是若干个 `StoryControl`。定位交给使用方（通常是 `absolute top-ark-4 right-ark-4`）。
 * 请用 `aria-label` 说明这是哪一组控件。
 */
export function StoryControls({ className, ...rest }: StoryControlsProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: 这是一组并列的控件按钮，不是表单的 fieldset
    <div
      data-ark="story-controls"
      data-ark-tone="dark"
      role="group"
      {...rest}
      className={cn('box-border inline-flex gap-ark-1 font-ark-cjk-sans', className)}
    />
  )
}

export type StoryControlShape = 'bar' | 'square'

export interface StoryControlProps extends ComponentProps<'button'> {
  /** 开关项（如“自动”）当前是否打开：打开时反白，并输出 `aria-pressed`。普通按钮不给。 */
  pressed?: boolean
  /** 小图标。组件库不带图标，请自备；它对读屏隐藏。只放图标、不写文字时请给 `aria-label`。 */
  icon?: ReactNode
  /**
   * 形状。
   * - `bar`：28px 高的小横条，图标在文字前面——剧情界面的“跳过”
   * - `square`：5rem 见方的方块，文字在上、图标在下——作战界面的倍速（`2X` 加双三角）、暂停
   * @default 'bar'
   */
  shape?: StoryControlShape
}

const shapes: Record<StoryControlShape, string> = {
  // 可见的形状只有 28px 高，点击区撑到 44px
  bar: cn('h-7 gap-ark-1 px-ark-3 text-ark-caption font-ark-bold', hitArea),
  // 实机的方块折到 1280 宽约 79px，底下一圈软投影
  square:
    'size-20 flex-col-reverse justify-center gap-ark-2 p-0 font-ark-data text-ark-h2 font-ark-regular shadow-ark-panel',
}

const iconSize: Record<StoryControlShape, string> = {
  bar: 'size-3.5',
  square: 'size-7',
}

/**
 * 控件组里的一个按钮。横条可见的形状只有 28px 高，点击区撑到 44px——
 * 控件做小不是为了难点，密度来自编排而不是缩小点击区。
 */
export function StoryControl({
  pressed,
  icon,
  shape = 'bar',
  className,
  children,
  ...rest
}: StoryControlProps) {
  return (
    <button
      data-ark="story-control"
      data-shape={shape}
      type="button"
      aria-pressed={pressed}
      {...rest}
      className={cn(
        'relative m-0 box-border inline-flex cursor-pointer appearance-none items-center border-0 bg-ark-neutral-black/50 leading-ark-solid whitespace-nowrap text-ark-neutral-white select-none',
        shapes[shape],
        // 悬停整块反白；开关打开时保持反白
        'not-disabled:hover:bg-ark-neutral-white not-disabled:hover:text-ark-neutral-black',
        'aria-pressed:bg-ark-neutral-white aria-pressed:text-ark-neutral-black',
        'disabled:cursor-not-allowed disabled:text-ark-neutral-gray-500',
        colorTransition,
        focusRing,
        className,
      )}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className={cn(
            'grid shrink-0 place-items-center [&>svg]:block [&>svg]:size-full',
            iconSize[shape],
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
