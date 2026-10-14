import type { ComponentProps, ReactNode } from 'react'
import { focusRingInset, triangleDown } from '../../utils/classes'
import { cn } from '../../utils/cn'

export interface DialogueBoxProps extends ComponentProps<'div'> {
  /** 说话人的名字，写在左边，较小、偏灰。旁白不给。 */
  speaker?: ReactNode
  /** 推进到下一句时调用。给了它，整片文字区是一个按钮，点一下或按回车继续。 */
  onAdvance?: () => void
  /**
   * 推进按钮的名称，读屏会念出来。
   * @default '继续'
   */
  advanceLabel?: string
  /** 正文末尾闪烁的小三角，表示“后面还有”。默认在有 `onAdvance` 时显示。 */
  indicator?: boolean
}

/**
 * 剧情的文字区：没有“框”。它是屏幕底部一片自下而上的黑色渐变，没有边框，没有圆角气泡——
 * 阅读时让界面消失，比一个精致的对话框更不打扰。说话人在左，正文在右。
 *
 * 和 `Scrim` 一样默认贴在父元素的底边（父元素需要是定位元素），高度不低于父元素的 35%。
 * `children` 是正文。换下一句时直接换内容，新的一句会读给读屏。竖屏时说话人挪到正文上方。
 */
export function DialogueBox({
  speaker,
  onAdvance,
  advanceLabel = '继续',
  indicator = onAdvance !== undefined,
  className,
  children,
  ...rest
}: DialogueBoxProps) {
  return (
    <div
      data-ark="dialogue-box"
      data-ark-tone="dark"
      {...rest}
      className={cn(
        'absolute inset-x-0 bottom-0 box-border grid min-h-[35%] content-end bg-linear-to-t from-ark-neutral-black via-ark-neutral-black/85 to-transparent px-[8%] pt-ark-8 pb-ark-7 font-ark-cjk-sans text-ark-fg',
        className,
      )}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-[minmax(5rem,16%)_minmax(0,1fr)] items-baseline gap-x-ark-6 gap-y-ark-2 portrait:grid-cols-1"
      >
        {/* 旁白没有说话人，这一格仍然留着：正文的左边线不跟着跳 */}
        <p className="m-0 text-right text-[1rem] leading-ark-body text-ark-fg-muted portrait:text-left">
          {speaker}
        </p>
        <p className="m-0 text-ark-body-lg leading-ark-body">
          {children}
          {indicator && (
            // 光标式的闪烁：1s step-end，没有缓动
            <span
              aria-hidden="true"
              className={cn(
                triangleDown,
                'ml-ark-2 align-middle text-ark-signal motion-safe:animate-ark-blink',
              )}
            />
          )}
        </p>
      </div>
      {onAdvance !== undefined && (
        <button
          type="button"
          aria-label={advanceLabel}
          onClick={onAdvance}
          className={cn(
            'absolute inset-0 m-0 box-border block cursor-pointer appearance-none border-0 bg-transparent p-0',
            // 文字区贴着画面的边，轮廓画在内侧
            focusRingInset,
          )}
        />
      )}
    </div>
  )
}
