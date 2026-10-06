/**
 * 把进度值限制在 `0`–`max` 之间，并算出 0–100 的百分比。
 * `max` 不大于 0 时百分比为 0，不产生 NaN。
 */
export function clampProgress(value: number, max: number): { clamped: number; percent: number } {
  const clamped = Math.min(Math.max(value, 0), max)
  return { clamped, percent: max > 0 ? (clamped / max) * 100 : 0 }
}
