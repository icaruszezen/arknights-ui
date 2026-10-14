import { brighterMuted } from './classes'

/**
 * 表面。面板、卡片、抽屉、弹层共用这一组。
 * - `surface`：默认的面，跟着主题走（暗色近黑、亮色纸白）
 * - `raised`：抬起的一层，比默认的面亮一档
 * - `inverse`：与所在主题相反的面，说“看这里”。暗色主题里是纸白，亮色主题里是近黑
 * - `graphite`：半透明的石墨灰，压在图片或场景上用，不跟主题
 * - `paper`：半透明的纸白，不跟主题
 * - `frosted`：毛玻璃，模糊并保留下层
 */
export type SurfaceTone = 'surface' | 'raised' | 'inverse' | 'graphite' | 'paper' | 'frosted'

export const surfaceClass: Record<SurfaceTone, string> = {
  surface: 'bg-ark-surface',
  raised: 'bg-ark-surface-raised',
  // 同一个类：data-ark-tone="inverse" 把这个元素上的 --ark-surface 换成了反面的取值
  inverse: 'bg-ark-surface',
  graphite: `bg-ark-overlay-panel-dark ${brighterMuted}`,
  paper: 'bg-ark-overlay-panel-light',
  // 75%：再透一点，次要文字压在较亮的画面上就不够 4.5:1 了
  frosted: 'bg-ark-surface/75 backdrop-blur-ark-backdrop',
}

/** 这种表面要给子树设的明暗上下文；跟着主题走的不设。 */
export const surfaceContext: Record<SurfaceTone, 'dark' | 'light' | 'inverse' | undefined> = {
  surface: undefined,
  raised: undefined,
  inverse: 'inverse',
  graphite: 'dark',
  paper: 'light',
  frosted: undefined,
}
