import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge 不认识自定义主题键。text-、font-、shadow- 这几个前缀各有两种含义
// （字号 / 颜色、字重 / 字体、投影 / 投影色），不登记的话 text-ark-body 会被当成颜色，
// 与 text-ark-fg 互相覆盖。键名需与 tokens.json 保持一致，cn.test.ts 会对照检查。
export const arkFontSizes = [
  'ark-ghost',
  'ark-hero',
  'ark-display',
  'ark-display-latin',
  'ark-h1',
  'ark-h2',
  'ark-nav',
  'ark-body-lg',
  'ark-body',
  'ark-label',
  'ark-caption',
  'ark-micro',
]
export const arkFontWeights = ['ark-regular', 'ark-medium', 'ark-bold', 'ark-heavy']
export const arkShadows = ['ark-drop', 'ark-panel', 'ark-hard']

const isArkKey = (value: string) => value.startsWith('ark-')

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: arkFontSizes,
      'font-weight': arkFontWeights,
      shadow: arkShadows,
      'drop-shadow': arkShadows,
      'text-shadow': arkShadows,
      tracking: [isArkKey],
      leading: [isArkKey],
      spacing: [isArkKey],
      radius: [isArkKey],
      blur: [isArkKey],
      ease: [isArkKey],
      animate: [isArkKey],
    },
  },
})

/** 合并类名；同一属性后写的覆盖先写的，使用方传入的 className 因此能覆盖组件默认值。 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
