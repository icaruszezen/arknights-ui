import type { ComponentProps, ReactNode } from 'react'
import { useFieldControl } from '../../internal/field'
import { cn } from '../../utils/cn'

export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'children'> {
  /** 旁边的文字，同时是这个开关的名称。不给时请传 `aria-label`，放在 `Field` 里则不用。 */
  children?: ReactNode
  /**
   * - `sm`：2.5rem × 1.25rem，没有字，只靠滑块的位置和颜色
   * - `md`：4rem × 1.75rem，状态格里写 ON / OFF
   * - `lg`：10.75rem × 2.75rem，实机设置页的大小
   * @default 'md'
   */
  size?: SwitchSize
  /**
   * 开着时状态格里的字。
   * @default 'ON'
   */
  onLabel?: ReactNode
  /**
   * 关着时状态格里的字。
   * @default 'OFF'
   */
  offLabel?: ReactNode
  /** 开关状态变化时调用。 */
  onCheckedChange?: (checked: boolean) => void
}

const bodies: Record<SwitchSize, string> = {
  sm: 'h-5 w-10',
  md: 'h-7 w-16 text-ark-caption',
  lg: 'h-11 w-[10.75rem] text-ark-label',
}

/**
 * 开关是一条两格宽的直角块：一格是滑块，另一格写着当前的状态。
 * 开着的时候，状态格是信号色的 `ON`，滑块在右；关着的时候滑块在左，状态格是深色的 `OFF`。
 * 它没有圆头，也没有“小圆球在轨道里滑”的造型。
 *
 * 状态不只靠颜色：还有字和滑块的位置。底下是带 `role="switch"` 的原生勾选框。
 * `className` 作用在最外层的 `<label>`，其余属性和 `ref` 交给 `<input>`。
 */
export function Switch({
  children,
  size = 'md',
  onLabel = 'ON',
  offLabel = 'OFF',
  onCheckedChange,
  onChange,
  className,
  style,
  ...rest
}: SwitchProps) {
  const control = useFieldControl(rest)
  const labelled = size !== 'sm'
  return (
    <label
      data-ark="switch"
      className={cn(
        'box-border inline-flex cursor-pointer items-center gap-ark-3 font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
        'has-disabled:cursor-not-allowed has-disabled:text-ark-on-disabled',
        className,
      )}
      style={style}
    >
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          // biome-ignore lint/a11y/useAriaPropsForRole: 原生勾选框自己带选中状态，浏览器会把它映射成开关的 aria-checked
          role="switch"
          {...control}
          onChange={event => {
            onChange?.(event)
            onCheckedChange?.(event.currentTarget.checked)
          }}
          className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          data-ark="switch-body"
          className={cn(
            'pointer-events-none relative block overflow-hidden bg-ark-control font-ark-data leading-ark-solid font-ark-bold text-ark-fg',
            'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard',
            bodies[size],
            'peer-checked:bg-ark-signal peer-checked:text-ark-on-signal',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ark-fg',
            'peer-disabled:bg-ark-disabled peer-disabled:text-ark-on-disabled',
            // 滑块占一格：关在左，开时平移到右边那一格
            'peer-checked:[&>[data-part=thumb]]:translate-x-full peer-disabled:[&>[data-part=thumb]]:bg-ark-on-disabled',
            // 两个状态字各在一格里，只显示露出来的那个
            'peer-checked:[&>[data-part=on]]:opacity-100 peer-checked:[&>[data-part=off]]:opacity-0',
          )}
        >
          {labelled && (
            <>
              <span
                data-part="on"
                className="absolute inset-y-0 left-0 grid w-1/2 place-items-center opacity-0 transition-opacity duration-(--ark-motion-duration-base)"
              >
                {onLabel}
              </span>
              <span
                data-part="off"
                className="absolute inset-y-0 right-0 grid w-1/2 place-items-center transition-opacity duration-(--ark-motion-duration-base)"
              >
                {offLabel}
              </span>
            </>
          )}
          <span
            data-part="thumb"
            className="absolute inset-y-0 left-0 w-1/2 bg-ark-invert transition-[translate,background-color] duration-(--ark-motion-duration-base) ease-ark-standard motion-reduce:transition-none"
          />
        </span>
      </span>
      {children != null && <span className="min-w-0">{children}</span>}
    </label>
  )
}
