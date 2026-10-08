import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type PortraitCrop = 'full' | 'bust'

export interface PortraitProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 立绘的地址。请用带透明底的图：重影和投影都跟着轮廓走。 */
  src: string
  /** 替代文字。立绘只是陪衬、旁边已经有名字时传空字符串。 */
  alt: string
  /**
   * 身后的幽灵重影：一张放大 2.4 倍、去色、不透明度 25% 的图，像一个巨大的影子，
   * 把主图和背景拉开距离。官网干员屏的重影亮度约两成，只比背景亮一两档。
   * @default false
   */
  ghost?: boolean
  /**
   * 重影用的图。官网的重影不是同一张立绘，而是另一张预先处理好的灰度图（另一阶段的立绘）；
   * 不给就用 `src`。
   */
  ghostSrc?: string
  /**
   * 向左下的投影。官网的大立绘没有投影——这个取值是缩略图的——所以默认关闭，
   * 小尺寸的头像、缩略图再打开。
   * @default false
   */
  shadow?: boolean
  /**
   * 入场后的缓移：10 秒里自左移回原位（3rem），只走一次。官网干员屏换人时立绘就这样慢慢滑过来。
   * 用户要求减少动效时不动。
   * @default false
   */
  drift?: boolean
  /**
   * 裁切方式。
   * - `full`：全身。头顶贴着框的上缘，腿部被框的下缘切掉
   * - `bust`：胸像。铺满框，脸落在上三分之一（卡片用）
   * @default 'full'
   */
  crop?: PortraitCrop
  /** 传给主图的 `srcset`。 */
  srcSet?: string
  /** 传给主图的 `sizes`。 */
  sizes?: string
  /** 传给图片的 `loading`。 */
  loading?: 'eager' | 'lazy'
  /** 传给图片的 `decoding`。 */
  decoding?: 'sync' | 'async' | 'auto'
}

const image = 'm-0 block max-w-none border-0 select-none'

// 默认比例：全身约 1:2，胸像是缩略图的 3:4。框的宽高都给定时比例不起作用
const frames: Record<PortraitCrop, string> = {
  full: 'aspect-[1/2]',
  bust: 'aspect-[3/4]',
}

const crops: Record<PortraitCrop, string> = {
  // 图比框高出一截，贴顶放：超出的部分就是被切掉的腿
  full: 'h-[calc(100%+var(--ark-portrait-bleed,15%))] object-contain object-top',
  bust: 'h-full object-cover object-[50%_15%]',
}

/**
 * 立绘容器。立绘从不被完整地装进一个方框里：它被框的边缘切掉一部分，
 * 画面因此显得比屏幕更大。
 *
 * 根元素就是那个裁切框，大小和位置由使用方决定（如 `absolute right-0 bottom-0 h-full w-1/2`）；
 * 不给大小时按默认比例撑开。全身立绘超出框的高度由 `--ark-portrait-bleed` 决定，默认 15%。
 *
 * 本组件不带任何图片。请使用原创或已获授权的素材。
 */
export function Portrait({
  src,
  alt,
  ghost = false,
  ghostSrc,
  shadow = false,
  drift = false,
  crop = 'full',
  srcSet,
  sizes,
  loading,
  decoding,
  className,
  ...rest
}: PortraitProps) {
  return (
    <div
      data-ark="portrait"
      {...rest}
      className={cn('relative isolate box-border overflow-hidden', frames[crop], className)}
    >
      {ghost && (
        // 重影只是主图的影子，不需要被读到，也不必按视口选图
        <img
          src={ghostSrc ?? src}
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding={decoding}
          className={cn(
            image,
            'pointer-events-none absolute inset-0 -z-1 size-full scale-[2.4] object-contain opacity-25 grayscale',
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        className={cn(
          image,
          'absolute inset-x-0 top-0 w-full',
          crops[crop],
          shadow && 'drop-shadow-ark-drop',
          drift && 'motion-safe:animate-ark-drift',
        )}
      />
    </div>
  )
}
