import { type ComponentProps, type CSSProperties, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { useReducedMotion } from '../../utils/useReducedMotion'

export interface GlitchProps extends ComponentProps<'div'> {
  /**
   * 每次这个值变化就播放一次。通常传切屏的序号或内容的 `key`：
   * 内容换掉的那一刻，故障正好盖住这次切换。
   */
  trigger?: unknown
  /**
   * 挂载时也播放一次。
   * @default false
   */
  appear?: boolean
  /**
   * 播放多久（毫秒）。上限 1000：故障不常驻，超过的部分会被截掉。
   * @default 600
   */
  duration?: number
  /** 播完时调用。不播放（减少动效）时也会调用，方便把后续的步骤接在后面。 */
  onDone?: () => void
}

// 文档：故障与闪烁效果持续时间控制在 1 秒内
const MAX_DURATION = 1000

/**
 * 故障：画面出现横向错位，局部被打成色块，像信号不稳。只用于转场——加载结束、切屏、
 * 剧情里“信号不稳”的那一下——一次不超过 1 秒，播完就恢复原样。不要让它常驻。
 *
 * 把会变化的内容包进来，用 `trigger` 告诉它什么时候播。播放期间内容整块被裁成横带只出现三次，
 * 其余是逐帧的小幅错位；上面叠一层横条和一层信号色的色块。
 *
 * 用户要求减少动效时完全不播放。两层叠加是纯装饰，不影响读屏和点击。
 */
export function Glitch({
  trigger,
  appear = false,
  duration = 600,
  onDone,
  className,
  style,
  children,
  ...rest
}: GlitchProps) {
  const reduced = useReducedMotion()
  const ms = Math.min(Math.max(duration, 0), MAX_DURATION)

  // 第几次播放，0 表示没在播。trigger 变化时在渲染期间直接递增，不经过 effect：
  // 这样内容更新和故障开始落在同一次提交里
  const [run, setRun] = useState(appear ? 1 : 0)
  const [seen, setSeen] = useState(trigger)
  if (!Object.is(seen, trigger)) {
    setSeen(trigger)
    setRun(count => count + 1)
  }

  // 回调每次渲染都可能是新的，放进 ref 里，不让它重启计时
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  })

  const playing = run > 0 && !reduced && ms > 0

  // 用定时器收尾，不等 animationend：页面不渲染时动画事件不会来
  useEffect(() => {
    if (run === 0) return
    if (!playing) {
      setRun(0)
      done.current?.()
      return
    }
    const timer = setTimeout(() => {
      setRun(0)
      done.current?.()
    }, ms)
    return () => clearTimeout(timer)
  }, [run, playing, ms])

  return (
    <div
      data-ark="glitch"
      data-playing={playing ? '' : undefined}
      {...rest}
      className={cn(
        'relative isolate box-border',
        playing && 'motion-safe:animate-ark-glitch',
        className,
      )}
      style={{ '--ark-glitch-duration': `${ms}ms`, ...style } as CSSProperties}
    >
      {children}
      {playing && (
        <>
          <span
            // 每次播放都重新挂载，动画从头开始
            key={`bars-${run}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-1 ark-glitch-bars motion-safe:animate-ark-glitch-bars motion-reduce:hidden"
          />
          <span
            key={`mosaic-${run}`}
            aria-hidden="true"
            className="pointer-events-none absolute z-1 h-12 w-20 ark-glitch-mosaic motion-safe:animate-ark-glitch-mosaic motion-reduce:hidden"
          />
        </>
      )}
    </div>
  )
}
