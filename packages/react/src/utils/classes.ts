// 多个组件共用的类名片段。Tailwind 按纯文本扫描源码，这里只能写完整的静态类名。

/** 焦点：外侧 2px 高对比轮廓。画在未被裁切的根元素上，切角不会把它裁掉。 */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ark-fg'

/** 焦点轮廓画在内侧：元素贴着会裁掉溢出内容的容器（可滚动的横条、铺满的弹层）时用。 */
export const focusRingInset =
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ark-fg'

/** 颜色类过渡统一 300ms，曲线用默认 ease（官网实测）。 */
export const colorTransition =
  'transition-colors duration-(--ark-motion-duration-base) ease-ark-standard'

/** 向右的实心三角，表示方向。颜色跟随文字。 */
export const triangleRight =
  'inline-block h-0 w-0 shrink-0 border-y-[0.3125rem] border-l-[0.4375rem] border-y-transparent border-l-current'

/** 向左的实心三角，表示“上一个”。颜色跟随文字。 */
export const triangleLeft =
  'inline-block h-0 w-0 shrink-0 border-y-[0.3125rem] border-r-[0.4375rem] border-y-transparent border-r-current'

/** 向下的实心三角，表示“点了会展开”。颜色跟随文字。 */
export const triangleDown =
  'inline-block h-0 w-0 shrink-0 border-x-[0.3125rem] border-t-[0.4375rem] border-x-transparent border-t-current'

/** 可见形状不足 44px 高时，用 ::after 把点击区撑到 44px。元素自身需要是定位元素。 */
export const hitArea =
  'after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2'

/** 横向滚动的容器：滚动条跟着细线的颜色走，不用系统默认的浅色轨道。 */
export const thinScrollbar =
  '[scrollbar-color:var(--ark-rule-strong)_transparent] [scrollbar-width:thin]'

/**
 * 半透明的深色面压在较亮的场景上会变浅，gray-400 的次要文字不再够 4.5:1，这里提一档。
 * 石墨面板、毛玻璃、抽屉、资源条这类自带半透明深色底的组件都要加。
 */
export const brighterMuted = '[--ark-fg-muted:var(--ark-color-neutral-gray-300)]'
