import { create } from 'storybook/theming'

// Storybook 自身界面的配色，取值与 tokens.json 的中性色、信号色一致
export const arkTheme = create({
  base: 'dark',
  brandTitle: 'arknights-ui · 非官方',
  colorPrimary: '#18d1ff',
  colorSecondary: '#0098dc',
  appBg: '#121212',
  appContentBg: '#000000',
  appPreviewBg: '#000000',
  appBorderColor: '#333333',
  appBorderRadius: 0,
  barBg: '#1d1f20',
  barTextColor: '#ababab',
  barHoverColor: '#ffffff',
  barSelectedColor: '#18d1ff',
  textColor: '#ffffff',
  textMutedColor: '#ababab',
  inputBg: '#1d1f20',
  inputBorder: '#565656',
  inputTextColor: '#ffffff',
  inputBorderRadius: 0,
  fontBase: '"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  fontCode: '"JetBrains Mono", Consolas, monospace',
})
