// Story 用的自绘几何图形：只有直线和 45° 斜线，线宽统一、端点平头。
// 它们只是占位，不对应任何官方的职业图标、阵营标识或道具图标。
// 放在 .storybook/ 下，只有 Storybook 会用到，不进组件库产物。

const stroke = { stroke: 'currentColor', strokeWidth: 2.5 } as const

export const glyphs = {
  /** 菱形框 */
  diamond: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" {...stroke} />
    </svg>
  ),
  /** 实心三角 */
  peak: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3 21 21H3z" fill="currentColor" />
    </svg>
  ),
  /** 四个方块，缺一角 */
  blocks: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5v5h-5z" fill="currentColor" />
    </svg>
  ),
  /** 三条长短不一的横线 */
  bars: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h12M3 18h15" stroke="currentColor" strokeWidth="3" />
    </svg>
  ),
  /** 十字 */
  cross: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="4" />
    </svg>
  ),
  /** 两道向上的折线 */
  chevrons: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 13l8-8 8 8M4 20l8-8 8 8" {...stroke} />
    </svg>
  ),
  /** 方框套方块 */
  frame: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 3h18v18H3zM6 6v12h12V6zM9.5 9.5h5v5h-5z" fill="currentColor" fillRule="evenodd" />
    </svg>
  ),
  /** 三道 45° 斜线 */
  slashes: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 13 13 3M5 21 21 5M11 21l10-10" {...stroke} />
    </svg>
  ),
  /** 下缘 45° 收尖的盾形 */
  shield: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 3h16v10l-8 8-8-8z" fill="currentColor" />
    </svg>
  ),
  /** 向右的实心三角：播放、一倍速 */
  play: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 4 20 12 6 20z" fill="currentColor" />
    </svg>
  ),
  /** 两个向右的实心三角：快进、二倍速 */
  forward: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M2 5 12 12 2 19zM12 5l10 7-10 7z" fill="currentColor" />
    </svg>
  ),
  /** 两条竖条：暂停 */
  pause: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />
    </svg>
  ),
  /** 八边形套方孔：设置 */
  gear: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M8.5 3h7L21 8.5v7L15.5 21h-7L3 15.5v-7zM9 9v6h6V9z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  /** 中心一个方点的方框 */
  target: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16v16H4z" {...stroke} />
      <path d="M10 10h4v4h-4z" fill="currentColor" />
    </svg>
  ),
} as const

export type GlyphName = keyof typeof glyphs
