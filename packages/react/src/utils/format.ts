const thousands = new Intl.NumberFormat('en-US')

/** 数字加千分位逗号；指定 `pad` 时改为补前导零。字符串原样返回。 */
export function formatStatValue(value: number | string, pad?: number): string {
  if (typeof value === 'string') return value
  if (pad === undefined) return thousands.format(value)
  return `${value < 0 ? '-' : ''}${String(Math.abs(value)).padStart(pad, '0')}`
}
