/**
 * CSS `cubic-bezier(x1, y1, x2, y2)` 的 JS 版：给进度 `t`（0–1），返回缓动后的进度。
 * 曲线以参数形式给出，先由横坐标二分反解参数，再代入纵坐标。
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  // 端点固定为 (0, 0) 和 (1, 1) 的三次贝塞尔在参数 s 处的一个坐标
  const at = (s: number, p1: number, p2: number) =>
    3 * (1 - s) ** 2 * s * p1 + 3 * (1 - s) * s ** 2 * p2 + s ** 3

  return (t: number): number => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let low = 0
    let high = 1
    // x1、x2 都在 0–1 之间时横坐标单调，二分 24 次足够精确到小数点后七位
    for (let i = 0; i < 24; i++) {
      const middle = (low + high) / 2
      if (at(middle, x1, x2) < t) low = middle
      else high = middle
    }
    return at((low + high) / 2, y1, y2)
  }
}

/** `--ark-motion-easing-mechanical`：起步干脆、收尾平缓，“机器在工作”的那种曲线。 */
export const mechanical = cubicBezier(0.2, 0, 0, 1)
