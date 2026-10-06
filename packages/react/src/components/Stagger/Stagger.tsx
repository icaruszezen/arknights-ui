import { type ComponentProps, type CSSProperties, useMemo, useRef } from 'react'
import { toItems } from '../../internal/toItems'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useInView } from '../../utils/useInView'

export type StaggerFrom = 'left' | 'right' | 'bottom' | 'none'
export type StaggerElement = 'div' | 'ul' | 'ol'

export interface StaggerProps extends ComponentProps<'div'> {
  /**
   * 渲染成哪个元素。列表时每一项包在 `<li>` 里。
   * @default 'div'
   */
  as?: StaggerElement
  /**
   * 从哪边进来。文字自左、图片自右；装饰原地淡入用 `none`。
   * @default 'left'
   */
  from?: StaggerFrom
  /**
   * 什么时候入场。
   * - `mount`：挂载就开始
   * - `visible`：滚进视口才开始，之前保持隐藏
   * @default 'mount'
   */
  trigger?: 'mount' | 'visible'
  /**
   * 第一项之前先等多久（毫秒）。用来和别的元素排先后：标题组先滑入，列表逐项跟进。
   * @default 0
   */
  delay?: number
}

// 位移加淡入，600ms；减少动效时只留透明度变化
const enter: Record<StaggerFrom, string> = {
  left: 'motion-safe:animate-ark-enter-left motion-reduce:animate-ark-fade-in',
  right: 'motion-safe:animate-ark-enter-right motion-reduce:animate-ark-fade-in',
  bottom: 'motion-safe:animate-ark-enter-up motion-reduce:animate-ark-fade-in',
  // 装饰的淡入取 slow 档，比菜单项的 fast 档从容
  none: 'animate-ark-fade-in [animation-duration:var(--ark-motion-duration-slow)]',
}

/**
 * 逐项入场：子元素不是同时出现，而是一个接一个，每一项比前一项晚 70ms。
 * 大的东西先动、慢动，列表逐项跟进——入场有先后，画面才有编排。
 *
 * 每个子元素会被包进一层（列表时是 `<li>`），延迟写在这一层上，所以布局类
 * （`grid gap-ark-3` 之类）写在 `Stagger` 自己身上就行。间隔取 `--ark-motion-stagger`。
 * 想重播就换一个 `key` 让它重新挂载。
 */
export function Stagger({
  as = 'div',
  from = 'left',
  trigger = 'mount',
  delay = 0,
  ref,
  className,
  style,
  children,
  ...rest
}: StaggerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => mergeRefs(rootRef, ref), [ref])
  const entered = useInView(rootRef, trigger === 'visible')

  // div、ul、ol 共用同一组属性，这里按 div 处理类型
  const Comp = as as 'div'
  const list = as !== 'div'
  const Item = (list ? 'li' : 'div') as 'div'

  return (
    <Comp
      data-ark="stagger"
      {...rest}
      ref={setRef}
      className={cn('box-border', list && 'm-0 list-none p-0', className)}
      style={{ '--ark-stagger-delay': `${delay}ms`, ...style } as CSSProperties}
    >
      {toItems(children).map(({ key, child, index }) => (
        <Item
          key={key}
          className={cn('box-border', entered ? enter[from] : 'opacity-0')}
          style={{
            animationDelay: `calc(var(--ark-stagger-delay, 0ms) + var(--ark-motion-stagger) * ${index})`,
          }}
        >
          {child}
        </Item>
      ))}
    </Comp>
  )
}
