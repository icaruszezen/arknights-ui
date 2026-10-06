import { type ComponentProps, useMemo, useRef } from 'react'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'
import { useOffset } from '../../utils/useOffset'

export type TiltGroupSide = 'left' | 'right'

export interface TiltGroupProps extends ComponentProps<'div'> {
  /**
   * 这组面板在画面的哪一侧，决定往哪边倾。
   * - `right`：绕 Y 轴 -10°，向左后方倾，以右缘为轴
   * - `left`：绕 Y 轴 +10°，向右后方倾，以左缘为轴
   *
   * 左右各放一组，就是主界面那种“环抱”的视角。
   * @default 'right'
   */
  side?: TiltGroupSide
  /**
   * 随指针轻微摆动，幅度 ±2°。在触屏设备上、用户要求减少动效时不启用。
   * @default false
   */
  sway?: boolean
}

// 基础倾角取 token：左组为正，右组为负
const sides: Record<TiltGroupSide, string> = {
  left: 'origin-left [--ark-tilt-base:var(--ark-depth-tilt)]',
  right: 'origin-right [--ark-tilt-base:calc(var(--ark-depth-tilt)*-1)]',
}

// 摆动的幅度（度）。文档只说“几度以内”
const SWAY = 2

/**
 * 透视面板组：一组面板不正对屏幕，而是像悬浮在场景里的全息投影，整体向内倾斜。
 * 这是“画内界面”的关键——界面被解释为这个世界里真实存在的东西。
 *
 * 透视只做这一层：只有整组倾斜，里面的面板、文字保持正交，不再二次变形。
 * 倾斜后的点击区跟着看到的形状走。一屏只给一两组面板用，不要给每个元素都加。
 *
 * 竖屏时取消倾斜（面板请改为纵向堆叠，`PanelGrid` 会自己处理）。
 * 摆动默认关闭；打开后只跟指针，不读陀螺仪。
 */
export function TiltGroup({
  side = 'right',
  sway = false,
  ref,
  className,
  ...rest
}: TiltGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => mergeRefs(rootRef, ref), [ref])

  useOffset(rootRef, {
    source: 'window',
    enabled: sway,
    onChange: (element, x, y) => {
      // 指针往右，这组面板跟着往右转一点；指针往下，上缘往后仰一点
      element.style.setProperty('--ark-tilt-y', `${(x * SWAY).toFixed(2)}deg`)
      element.style.setProperty('--ark-tilt-x', `${(-y * SWAY).toFixed(2)}deg`)
    },
  })

  return (
    <div
      data-ark="tilt-group"
      data-side={side}
      {...rest}
      ref={setRef}
      className={cn(
        'box-border ark-tilt portrait:transform-none',
        sides[side],
        // 摆动时给一点过渡，指针每一帧的小位移不会显得生硬
        sway && 'transition-transform duration-(--ark-motion-duration-fast) ease-out',
        className,
      )}
    />
  )
}
