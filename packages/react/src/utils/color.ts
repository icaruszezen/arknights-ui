// 颜色强调。`tone` 一词留给表面的明暗，组件上表示“这一块用什么颜色标出来”的属性统一叫 `color`。
// Tailwind 按纯文本扫描源码，这里只能写完整的静态类名。

/**
 * - `signal`：信号色，跟随 `--ark-signal`
 * - `neutral`：前景色，不带彩色
 * - `danger`：红，危险与报错
 * - `warning`：黄，警示与进度
 * - `success`：绿，完成
 */
export type ArkColor = 'signal' | 'neutral' | 'danger' | 'warning' | 'success'

/** 一条或一块纯色：进度段、色边、状态点。 */
export const fillColor: Record<ArkColor, string> = {
  signal: 'bg-ark-signal',
  neutral: 'bg-ark-fg',
  danger: 'bg-ark-signal-danger',
  warning: 'bg-ark-signal-action',
  success: 'bg-ark-signal-success',
}

/** 用作文字：浅色面上会压暗，保证对比度。 */
export const textColor: Record<ArkColor, string> = {
  signal: 'text-ark-signal-fg',
  neutral: 'text-ark-fg',
  danger: 'text-ark-danger-fg',
  warning: 'text-ark-warning-fg',
  success: 'text-ark-success-fg',
}

/** 实心色块加压在上面的文字。黄和绿上面压黑字，红上面压白字。 */
export const solidColor: Record<ArkColor, string> = {
  signal: 'bg-ark-signal text-ark-on-signal',
  neutral: 'bg-ark-invert text-ark-on-invert',
  danger: 'bg-ark-danger text-ark-on-danger',
  warning: 'bg-ark-signal-action text-ark-neutral-black',
  success: 'bg-ark-signal-success text-ark-neutral-black',
}

/** 一条色边的颜色（配合 border-l-* 等使用）。 */
export const borderColor: Record<ArkColor, string> = {
  signal: 'border-ark-signal',
  neutral: 'border-ark-fg',
  danger: 'border-ark-signal-danger',
  warning: 'border-ark-signal-action',
  success: 'border-ark-signal-success',
}
