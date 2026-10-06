import type { ComponentProps, ReactNode } from 'react'
import { colorTransition, focusRing, hitArea } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type StoryControlsProps = ComponentProps<'div'>

/**
 * 剧情界面角落里的一组小按钮：自动、跳过、回顾、隐藏界面。半透明、小号，不抢画面。
 * 作战界面右上角的倍速、暂停、设置也是这种排法。
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

export interface StoryControlProps extends ComponentProps<'button'> {
  /** 开关项（如“自动”）当前是否打开：打开时反白，并输出 `aria-pressed`。普通按钮不给。 */
  pressed?: boolean
  /** 文字前的小图标。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
}

/**
 * 控件组里的一个按钮。可见的形状只有 28px 高，点击区撑到 44px——
 * 控件做小不是为了难点，密度来自编排而不是缩小点击区。
 */
export function StoryControl({ pressed, icon, className, children, ...rest }: StoryControlProps) {
  return (
    <button
      data-ark="story-control"
      type="button"
      aria-pressed={pressed}
      {...rest}
      className={cn(
        'relative m-0 box-border inline-flex h-7 cursor-pointer appearance-none items-center gap-ark-1 border-0 bg-ark-neutral-black/50 px-ark-3 text-ark-caption leading-ark-solid font-ark-bold whitespace-nowrap text-ark-neutral-white select-none',
        // 悬停整块反白；开关打开时保持反白
        'not-disabled:hover:bg-ark-neutral-white not-disabled:hover:text-ark-neutral-black',
        'aria-pressed:bg-ark-neutral-white aria-pressed:text-ark-neutral-black',
        'disabled:cursor-not-allowed disabled:text-ark-neutral-gray-500',
        colorTransition,
        focusRing,
        hitArea,
        className,
      )}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="grid size-3.5 shrink-0 place-items-center [&>svg]:block [&>svg]:size-full"
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
