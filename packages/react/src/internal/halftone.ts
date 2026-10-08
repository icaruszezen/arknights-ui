// 半调网点的遮罩：点径随浓度变化，由密到疏不是变淡，而是变小。
//
// 官网整屏盖着一张半调图（2026-10-08 画到 canvas 上量）：点距约 15px（1920 基准），
// 网格转了约 20°，最密处相邻的点相切，往外越来越小直到消失，浓度约两成。
//
// CSS 的遮罩只能相乘，做不出“变小”，所以用一张内联 SVG：一层方向渐变垫底，
// 上面盖一层 50% 的柔边圆点，两者的亮度之和过半的地方才留下——渐变越亮，圆点留下的就越大。
// 取阈值靠 feColorMatrix。SVG 里写不了 rem，点距固定是 16px，不随根字号缩放。

export type HalftoneDirection =
  | 'none'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

/** 点距（px）。 */
export const HALFTONE_PITCH = 16
/** 网格的转角（度）。 */
export const HALFTONE_ANGLE = 20

// 渐变在包围盒里的走向：从最密的一端指向消失的一端
const vectors: Record<Exclude<HalftoneDirection, 'none'>, [number, number, number, number]> = {
  top: [0, 1, 0, 0],
  right: [0, 0, 1, 0],
  bottom: [0, 0, 0, 1],
  left: [1, 0, 0, 0],
  'top-right': [0, 1, 1, 0],
  'top-left': [1, 1, 0, 0],
  'bottom-right': [0, 0, 1, 1],
  'bottom-left': [1, 0, 0, 1],
}

function svg(direction: HalftoneDirection): string {
  const pitch = HALFTONE_PITCH
  // 不渐疏时垫一层中灰：所有的点一样大，直径是点距的一半
  let density = "<rect width='100%' height='100%' fill='#808080'/>"
  let gradient = ''
  if (direction !== 'none') {
    const [x1, y1, x2, y2] = vectors[direction]
    // 走到 60% 处消失，取值同原先的渐隐遮罩
    gradient = `<linearGradient id='g' x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}'><stop stop-color='#fff'/><stop offset='.6' stop-color='#000'/></linearGradient>`
    density = "<rect width='100%' height='100%' fill='url(#g)'/>"
  }
  return [
    "<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>",
    '<defs>',
    // 一个点：中心白、边缘黑的柔边圆，半径是点距的一半
    "<radialGradient id='d'><stop stop-color='#fff'/><stop offset='1' stop-color='#000'/></radialGradient>",
    `<pattern id='p' width='${pitch}' height='${pitch}' patternUnits='userSpaceOnUse' patternTransform='rotate(${HALFTONE_ANGLE})'><rect width='${pitch}' height='${pitch}' fill='url(#d)'/></pattern>`,
    gradient,
    // 亮度过半的留下（斜率 12，边缘留一像素多的过渡），再把浓度压到 20%
    "<filter id='t' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'>",
    "<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 12 0 0 0 -6'/>",
    "<feComponentTransfer><feFuncA type='linear' slope='.2'/></feComponentTransfer>",
    '</filter>',
    '</defs>',
    `<g filter='url(#t)'>${density}<rect width='100%' height='100%' fill='url(#p)' opacity='.5'/></g>`,
    '</svg>',
  ].join('')
}

const encode = (source: string) =>
  source.replace(/%/g, '%25').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23')

/**
 * 一层遮罩的完整写法（图片、位置、大小），可以直接赋给 `--ark-pattern-halftone`。
 * `direction` 是朝哪边渐疏；`none` 是等大的点。
 */
export function halftoneMask(direction: HalftoneDirection = 'top-right'): string {
  return `url("data:image/svg+xml,${encode(svg(direction))}") 0 0 / 100% 100% no-repeat`
}
