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

/**
 * 同上，但只在触屏（指针不精确）时撑大。
 * 紧凑的控件排得很密时（表格行里的操作、工具栏），常驻的 44px 点击区会盖到上下相邻的控件上；
 * 鼠标指得准，不需要它。
 */
export const hitAreaCoarse =
  'pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:top-1/2 pointer-coarse:after:h-11 pointer-coarse:after:-translate-y-1/2'

/** 控件的五档尺寸，取值在 tokens 的 size.control 里。 */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** 控件的高度（最小高度：内容折行时可以撑开）。 */
export const controlHeight: Record<ControlSize, string> = {
  xs: 'min-h-(--ark-size-control-xs)',
  sm: 'min-h-(--ark-size-control-sm)',
  md: 'min-h-(--ark-size-control-md)',
  lg: 'min-h-(--ark-size-control-lg)',
  xl: 'min-h-(--ark-size-control-xl)',
}

/** 与高度同值的宽度：方形的控件（图标按钮、步进器的加减）。 */
export const controlSquare: Record<ControlSize, string> = {
  xs: 'size-(--ark-size-control-xs)',
  sm: 'size-(--ark-size-control-sm)',
  md: 'size-(--ark-size-control-md)',
  lg: 'size-(--ark-size-control-lg)',
  xl: 'size-(--ark-size-control-xl)',
}

/** 控件里文字的字号：越小的控件字越小，最小 12px。 */
export const controlText: Record<ControlSize, string> = {
  xs: 'text-ark-caption',
  sm: 'text-ark-label',
  md: 'text-ark-label',
  lg: 'text-ark-base',
  xl: 'text-ark-body-lg',
}

/** 禁用态：底色与文字都换成禁用的那一档，不响应悬停。写在原生可禁用的元素上。 */
export const disabledControl =
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-ark-disabled disabled:text-ark-on-disabled'

/** 横向滚动的容器：滚动条跟着细线的颜色走，不用系统默认的浅色轨道。 */
export const thinScrollbar =
  '[scrollbar-color:var(--ark-rule-strong)_transparent] [scrollbar-width:thin]'

/**
 * 半透明的深色面压在较亮的场景上会变浅，gray-400 的次要文字不再够 4.5:1，这里提一档。
 * 石墨面板、毛玻璃、抽屉、资源条这类自带半透明深色底的组件都要加。
 */
export const brighterMuted = '[--ark-fg-muted:var(--ark-color-neutral-gray-300)]'
