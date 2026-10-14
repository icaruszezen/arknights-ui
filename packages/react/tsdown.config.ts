import { defineConfig } from 'tsdown'

export default defineConfig({
  // 两个入口：主入口是网页 / 应用组件，game 是照实机画面做的那一组
  entry: { index: 'src/index.ts', game: 'src/game/index.ts' },
  // 只为库源码生成类型，不含 stories 与测试
  tsconfig: 'tsconfig.build.json',
  format: 'esm',
  platform: 'browser',
  dts: true,
  sourcemap: true,
  // Tabs、Dialog 用到状态与副作用；整包标记为 client，RSC 项目可直接引入
  banner: { js: '"use client";' },
  copy: 'src/styles/theme.css',
})
