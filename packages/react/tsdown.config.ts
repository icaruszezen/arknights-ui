import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
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
