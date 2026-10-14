import type { ChangeEvent, ComponentProps, CSSProperties } from 'react'
import { useFieldControl } from '../../internal/field'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type SliderSize = 'md' | 'lg'

export interface SliderProps
  extends Omit<
    ComponentProps<'input'>,
    'type' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'children'
  > {
  /** 当前值。受控：请在 `onValueChange` 里更新它。 */
  value?: number
  /** 一开始的值（非受控）。默认是 `min`。 */
  defaultValue?: number
  /**
   * @default 0
   */
  min?: number
  /**
   * @default 100
   */
  max?: number
  /**
   * @default 1
   */
  step?: number
  /** 值变化时调用（拖动过程中连续触发）。 */
  onValueChange?: (value: number) => void
  /**
   * 印在滑块上的文字，同时作为 `aria-valuetext` 读给读屏。默认就是数字本身。
   * 例如 `value => `${value}%``。
   */
  formatValue?: (value: number) => string
  /**
   * 滑块的大小：2.75rem × 1.75rem / 3.75rem × 2.5rem（后者是实机设置页的大小）。
   * @default 'md'
   */
  size?: SliderSize
}

const sizes: Record<SliderSize, { root: string; thumb: string; width: string }> = {
  md: { root: 'h-7', thumb: 'text-ark-caption', width: '2.75rem' },
  lg: { root: 'h-10', thumb: 'text-ark-label', width: '3.75rem' },
}

/**
 * 滑条：轨道是一条很细的线，滑块是一块直角的矩形，当前的数值直接印在上面——不需要在旁边另放一个数字。
 *
 * 底下是原生的 `<input type="range">`，铺满整条、只隐藏不移除：拖动、方向键、Home / End、读屏都走它。
 * 它的滑块和画出来的那一块同宽，所以指针按在哪里，滑块的中心就在哪里。
 * `className` 作用在最外层，其余属性和 `ref` 交给 `<input>`。请用 `aria-label` 命名，放在 `Field` 里则不用。
 */
export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  formatValue = String,
  size = 'md',
  onChange,
  className,
  style,
  ...rest
}: SliderProps) {
  const control = useFieldControl(rest)
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange)
  const clamped = Math.min(Math.max(current, min), max)
  const ratio = max > min ? (clamped - min) / (max - min) : 0
  const text = formatValue(clamped)
  const { root, thumb, width } = sizes[size]

  return (
    <span
      data-ark="slider"
      className={cn('relative box-border block w-full font-ark-cjk-sans', root, className)}
      style={
        { '--ark-slider-thumb': width, '--ark-slider-ratio': ratio, ...style } as CSSProperties
      }
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        aria-valuetext={text}
        {...control}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange?.(event)
          setCurrent(event.currentTarget.valueAsNumber)
        }}
        className={cn(
          'peer absolute inset-0 z-1 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed',
          // 原生滑块和画出来的同宽：值与指针位置的换算才对得上
          '[&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-(--ark-slider-thumb) [&::-webkit-slider-thumb]:appearance-none',
          '[&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-(--ark-slider-thumb) [&::-moz-range-thumb]:border-0',
        )}
      />
      {/* 轨道：3px 的细线；走过的一段换成信号色 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-ark-control peer-disabled:bg-ark-disabled"
      />
      <span
        aria-hidden="true"
        data-ark="slider-fill"
        className="pointer-events-none absolute top-1/2 left-0 h-[3px] w-[calc((100%-var(--ark-slider-thumb))*var(--ark-slider-ratio)+var(--ark-slider-thumb)/2)] -translate-y-1/2 bg-ark-signal peer-disabled:bg-ark-on-disabled"
      />
      <span
        aria-hidden="true"
        data-ark="slider-thumb"
        className={cn(
          'pointer-events-none absolute inset-y-0 left-[calc((100%-var(--ark-slider-thumb))*var(--ark-slider-ratio))] grid w-(--ark-slider-thumb) place-items-center bg-ark-invert font-ark-data leading-ark-solid font-ark-bold text-ark-on-invert',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ark-fg',
          'peer-disabled:bg-ark-disabled peer-disabled:text-ark-fg-muted',
          thumb,
        )}
      >
        {text}
      </span>
    </span>
  )
}
