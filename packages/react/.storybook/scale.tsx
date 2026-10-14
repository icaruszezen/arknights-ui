import type { Decorator } from '@storybook/react-vite'

interface Base {
  /** 这张设计稿在什么条件下生效。 */
  query: string
  /** 多大的画面下 1rem = 16px，写成 rem（1920 ÷ 16 = 120）。宽在前，高在后。 */
  size: readonly [number, number]
}

const bases: Record<'site' | 'game', readonly Base[]> = {
  // 官网的脚本按两张设计稿算根字号：横屏 1920 × 1080，竖屏 750 × 1334，各取宽、高两个比例里小的那个。
  // 组件的窄屏取值是官网竖屏的一半，所以这里的窄屏基准也折半成 375 × 667。
  // 主入口的组件按宽度切换（48rem），这里跟着按宽度选设计稿
  site: [
    { query: '(min-width: 48rem)', size: [120, 67.5] },
    { query: '(max-width: 47.999rem)', size: [23.4375, 41.6875] },
  ],
  // 游戏内：组件的取值按 1280 × 720 换算。游戏只有横屏，竖屏不缩放
  game: [{ query: '(orientation: landscape)', size: [80, 45] }],
}

const rule = ({ query, size: [width, height] }: Base) =>
  `@media ${query} { :root { font-size: min(100vw / ${width}, 100dvh / ${height}); } }`

/**
 * 整屏示例用的装饰器：让根字号随画布等比缩放，画布多大都是同一个版面。
 *
 * 组件自己不改根字号，这件事要由页面来做，这里就是“页面”。Storybook 的画布常常只有屏幕的一半大，
 * 不缩放的话，按整屏设计的示例只看得到一个角。离开这个 Story 时样式跟着卸载，不影响别的 Story。
 */
export function fitScreen(base: keyof typeof bases): Decorator {
  const css = bases[base].map(rule).join('\n')
  return Story => (
    <>
      <style>{css}</style>
      <Story />
    </>
  )
}
