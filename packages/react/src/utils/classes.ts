// 多个组件共用的类名片段。Tailwind 按纯文本扫描源码，这里只能写完整的静态类名。

/** 焦点：外侧 2px 高对比轮廓。画在未被裁切的根元素上，切角不会把它裁掉。 */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ark-fg'

/** 颜色类过渡统一 300ms，曲线用默认 ease（官网实测）。 */
export const colorTransition =
  'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard'

/** 向右的实心三角，表示方向。颜色跟随文字。 */
export const triangleRight =
  'inline-block h-0 w-0 shrink-0 border-y-[0.3125rem] border-l-[0.4375rem] border-y-transparent border-l-current'
