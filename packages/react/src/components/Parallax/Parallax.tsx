import { type ComponentProps, type CSSProperties, useMemo, useRef } from 'react'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useOffset } from '../../utils/useOffset'

export type ParallaxSource = 'pointer' | 'scroll'

export interface ParallaxProps extends ComponentProps<'div'> {
  /**
   * 视点跟着什么走。
   * - `pointer`：指针在容器里的位置；指针离开后各层回到原位
   * - `scroll`：容器滚过视口的进度，只有纵向
   * @default 'pointer'
   */
  source?: ParallaxSource
}

/**
 * 多层视差：几层平面以不同的幅度位移，配合大小差异读出远近。
 * 这是扁平界面里少数主动制造纵深的地方——不需要 3D，两三层不同速度的平面就够了。
 *
 * 子元素是若干个 `ParallaxLayer`，各自用 `depth` 说明自己有多近。2–4 层为宜。
 * 位移的最大幅度由 `--ark-parallax-range` 决定，默认 2rem；图层会移出自己的位置，
 * 铺满的背景层请做得比容器大一圈。容器会裁掉移出去的部分。
 *
 * 用户要求减少动效时各层不动；跟指针的方式在触屏设备上不启用。
 */
export function Parallax({ source = 'pointer', ref, className, ...rest }: ParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => mergeRefs(rootRef, ref), [ref])

  useOffset(rootRef, {
    source,
    enabled: true,
    onChange: (element, x, y) => {
      element.style.setProperty('--ark-parallax-x', x.toFixed(3))
      element.style.setProperty('--ark-parallax-y', y.toFixed(3))
    },
  })

  return (
    <div
      data-ark="parallax"
      data-source={source}
      {...rest}
      ref={setRef}
      className={cn('relative isolate box-border overflow-hidden', className)}
    />
  )
}

export interface ParallaxLayerProps extends ComponentProps<'div'> {
  /**
   * 这一层有多近：`0` 不动（最远的背景），`1` 位移最大（最近的前景）。
   * 位移的方向与视点相反——指针往右，近处的东西往左让得更多。
   * 给负数则反过来，跟着视点走。
   */
  depth: number
}

/** 视差里的一层。位置和大小由使用方决定（通常是 `absolute`）。只能放在 `Parallax` 里。 */
export function ParallaxLayer({ depth, className, style, ...rest }: ParallaxLayerProps) {
  return (
    <div
      data-ark="parallax-layer"
      {...rest}
      className={cn(
        'box-border ark-parallax-layer',
        // 跟指针时给一点过渡，免得每一帧的小位移显得生硬；跟滚动时不要，否则会拖影
        'transition-[translate] duration-(--ark-motion-duration-fast) ease-out',
        'in-data-[source=scroll]:transition-none',
        className,
      )}
      style={{ '--ark-parallax-depth': depth, ...style } as CSSProperties}
    />
  )
}
