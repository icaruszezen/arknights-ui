import type { Preview } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
// 开源替代字体（OFL），只在 Storybook 里加载，不进组件库产物。中文走系统回退字体。
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import './preview.css'
import { arkTheme } from './theme'

const canvases: Record<string, { name: string; value: string }> = {
  canvas: { name: '画布 · 纯黑', value: '#000000' },
  ink: { name: '近黑面板', value: '#121212' },
  scene: { name: '场景 · 灰蓝', value: '#465560' },
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    docs: { theme: arkTheme },
    a11y: {
      test: 'todo',
      config: {
        rules: [
          {
            // 背景巨字和微缩英文是纯装饰：对读屏隐藏，对比度有意压到最低。
            // WCAG 1.4.3 对纯装饰不设对比度要求，这条检查不套用到它们身上
            id: 'color-contrast',
            selector: '*:not([data-ark="ghost-title"], [data-ark="micro-text"])',
          },
        ],
      },
    },
    backgrounds: { options: canvases },
    options: {
      storySort: {
        order: ['示例', '按钮', '面板与卡片', '导航', '数据展示', '反馈', '排版与装饰'],
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'canvas' },
    signal: 'info',
  },
  globalTypes: {
    signal: {
      description: '信号色：每个场景只有一个，覆盖 --ark-signal 即可切换',
      toolbar: {
        title: '信号色',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'info', title: '青蓝 · 官网' },
          { value: 'info-game', title: '蓝 · 游戏内' },
          { value: 'action', title: '黄 · 行动' },
          { value: 'accent', title: '橙 · 强调' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const canvas = canvases[context.globals.backgrounds?.value] ?? canvases.canvas
      return (
        <div
          className="box-border p-ark-6 font-ark-cjk-sans text-ark-fg"
          style={
            {
              // 背景由这层自己涂：工具栏涂在 iframe 上的底色，a11y 面板的对比度检查读不到
              backgroundColor: canvas?.value,
              minHeight: context.viewMode === 'story' ? '100vh' : undefined,
              '--ark-signal': `var(--ark-color-signal-${context.globals.signal})`,
            } as CSSProperties
          }
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
