# @arknights-ui/react

《明日方舟》风格的 React 组件库。组件的每个取值都能追溯到仓库里的 [风格指导文档](../../docs/00-overview.md) 和 [Design Tokens](../../tokens/tokens.json)。

> **非官方项目。** 与上海鹰角网络科技有限公司无关。本包不含任何官方素材：没有 Logo、立绘、图标或字体文件，图形全部是代码画的几何形状。

目前是工作区内的私有包（`private: true`），尚未发布到 npm。

## 组件

| 组件 | 说明 | 依据 |
| --- | --- | --- |
| `Button` | 主 / 次 / 弱三个层级，加上成对使用的浅 / 深色块；双语两行、方向三角、选中态 | [按钮](../../docs/elements/buttons.md) |
| `Tag` | 实心、描边、中性三种形态，可切角 | [数据展示](../../docs/elements/data-display.md) |
| `Panel` / `Card` | 石墨、纸白、毛玻璃三种表面；强调边、切角、投影、半调网点 | [面板与卡片](../../docs/elements/panels-and-cards.md) |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | 反白块与底条两种写法，完整的键盘操作 | [导航](../../docs/elements/navigation.md) |
| `Stat` | 大号数据体数值，带分母、单位、千分位、前导零 | [数据展示](../../docs/elements/data-display.md) |
| `Progress` | 细条、可分段的粗条、相对值条 | [数据展示](../../docs/elements/data-display.md) |
| `Notice` | 左侧色边分级的提示条 | [反馈](../../docs/elements/feedback.md) |
| `Dialog` | 通栏横带式确认弹窗，基于原生 `<dialog>` | [反馈](../../docs/elements/feedback.md) |
| `Empty` | 虚线框空状态 | [反馈](../../docs/elements/feedback.md) |
| `Divider` | 细线、虚线、渐隐线，可带起点或标签 | [装饰元素](../../docs/elements/decorations.md) |
| `Heading` | 中英成对的双语标题 | [字体与排版](../../docs/foundations/typography.md) |

每个组件的属性、示例和交互说明在 Storybook 里：

```bash
pnpm storybook
```

## 接入

需要 React 19 及以上。样式有两种接法，选一种。

### 项目没有用 Tailwind

引入预编译的样式表即可。它不含全局重置，不会改动页面上的其他元素。

```tsx
import '@arknights-ui/react/styles.css'
import { Button } from '@arknights-ui/react'

export function Example() {
  return (
    <Button variant="primary" sub="READ MORE" arrow>
      更多情报
    </Button>
  )
}
```

### 项目用了 Tailwind CSS v4

在入口 CSS 里引入主题层，并让 Tailwind 扫描组件产物。这样组件用到的类由你的 Tailwind 一起生成，不会重复。

```css
@import "tailwindcss";
@import "@arknights-ui/react/theme.css";
@source "../node_modules/@arknights-ui/react/dist";
```

主题键全部带 `ark-` 前缀，不会覆盖 Tailwind 的默认主题。你自己的代码里也可以直接用：

```html
<div class="bg-ark-neutral-ink-900 p-ark-5 font-ark-data text-ark-label text-ark-fg">…</div>
```

### 页面底色与字体

组件不设置页面级样式，这两样需要自己定：

```css
body {
  background: var(--ark-color-neutral-black);
  color: var(--ark-fg);
  font-family: var(--ark-font-family-cjk-sans);
}
```

字体不随包分发。字体栈里依次是官网实际使用的字体和开源替代品，按需自行加载，授权见 [字体与排版 · 字体授权](../../docs/foundations/typography.md#字体授权)。没有加载时会回退到系统字体，版式比例不变。其中 `Heading` 的 `serif` 需要思源宋体或 Noto Serif SC 的 Heavy 字重才有“重磅”的效果。

## 约定

**一个信号色。** 组件用到的信号色都来自 `--ark-signal`，默认是官网的青蓝。在任意子树上覆盖它就能换色：

```tsx
<section style={{ '--ark-signal': 'var(--ark-color-signal-action)' }}>…</section>
```

**明暗上下文。** `Panel` 会告诉子组件自己是深是浅。放进纸白面板（`tone="paper"`）的按钮、标签、分隔线自动换成深色前景，不需要逐个指定。

**覆盖样式。** 所有组件都接受 `className`，同一属性后写的覆盖组件默认值：

```tsx
<Button className="px-ark-6">更宽的按钮</Button>
```

合并用的 `cn()` 也从包里导出，它认识 `ark-` 主题键（例如不会把字号 `text-ark-body` 和颜色 `text-ark-fg` 当成冲突）。

**稳定的选择器。** 每个组件的根节点带 `data-ark="<名称>"`，可以用来写选择器或做测试定位。

**交互。** 悬停是整块换色，300ms；焦点是外侧 2px 轮廓，切角不会把它裁掉；可见形状再小，点击区也不小于 44px；位移类动效在 `prefers-reduced-motion` 下关闭。

**服务端组件。** 产物顶部带 `"use client"`，在 React Server Components 项目里可以直接引入。

## 与文档的出入

实现时有几处没有照搬文档取值，多数是为了对比度：

| 位置 | 文档 | 实现 | 原因 |
| --- | --- | --- | --- |
| `Stat` 的标签 | `gray-500` | `gray-400` | `gray-500` 在石墨面板上约 3.3:1 |
| 深色面板上的次要文字 | — | 比画布上亮一档 | 半透明石墨压在较亮的场景上会变浅 |
| 纸白面板上的信号色文字 | — | 信号色压暗到 45% | 青蓝、黄在浅底上对比度不足。色块和底条不受影响 |
| 悬停的触发条件 | `(any-hover: hover)` | `(hover: hover)` | 用的是 Tailwind 内置的 `hover:`，意图相同 |
| `Divider` 的 `fade` | `--ark-pattern-fade-rule` | 从起点向末端渐隐，颜色跟随明暗上下文 | 原取值固定为白色且方向相反 |

`Empty` 不在表里：文档原先写的 `gray-600` 文字在黑底上只有 2.95:1，这个问题已经在文档里更正并记录，见 [反馈 · 空状态](../../docs/elements/feedback.md#空状态)。

## 开发

在仓库根目录执行：

```bash
pnpm install
```

| 命令 | 作用 |
| --- | --- |
| `pnpm storybook` | 启动 Storybook（`http://localhost:6006`） |
| `pnpm test` | 单元测试（Vitest + Testing Library） |
| `pnpm typecheck` | 类型检查 |
| `pnpm lint` | Biome 检查；`pnpm format` 自动修复 |
| `pnpm build` | 重新生成 tokens，再构建 `dist/` |

写组件时注意：

- 类名只写完整的静态字符串。Tailwind 按纯文本扫描源码，拼出来的类名不会生成样式。
- 不依赖全局重置。预编译样式表不带 Preflight，元素自带的边距、边框、`box-sizing` 要在类里写全（Storybook 也是这样配置的，看到的就是真实表现）。
- 颜色只用语义键（`text-ark-fg`、`bg-ark-signal`、`border-ark-rule` 等），它们会跟随明暗上下文。固定语义的颜色（稀有度、提示级别）才直接取调色板。
- 切角把背景画在 `::before` 上再裁切（`before:ark-cut-tr-md`），不要直接裁根元素。
- Storybook 运行期间新建的文件，里面的类可能不会立刻生成样式。保存一次任意已有的源文件，或重启 Storybook。

`tokens.json` 里增删字号、字重、投影后，要同步 [`src/utils/cn.ts`](src/utils/cn.ts) 里登记的键名，测试会提醒。
