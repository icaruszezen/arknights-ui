# @arknights-ui/react

《明日方舟》风格的 React 组件库。组件的每个取值都能追溯到仓库里的 [风格指导文档](../../docs/00-overview.md) 和 [Design Tokens](../../tokens/tokens.json)。

> **非官方项目。** 与上海鹰角网络科技有限公司无关。本包不含任何官方素材：没有 Logo、立绘、图标或字体文件，图形全部是代码画的几何形状。

目前是工作区内的私有包（`private: true`），尚未发布到 npm。

## 组件

通用元素六篇文档里写到的东西都有对应的组件，基础规范里能做成组件的部分也有。

**[按钮](../../docs/elements/buttons.md)**

| 组件 | 说明 |
| --- | --- |
| `Button` | 主 / 次 / 弱三个层级，加上成对使用的浅 / 深色块；双语两行、方向三角、选中态 |
| `ActionButton` | 深浅两块拼合的行动按钮：左块写代价，右块写动作 |

**[面板与卡片](../../docs/elements/panels-and-cards.md)**

| 组件 | 说明 |
| --- | --- |
| `Panel` / `Card` | 石墨、纸白、毛玻璃三种表面；强调边、切角、投影、半调网点 |
| `Drawer` | 从右侧滑入的抽屉，不压暗主画面，直接关闭 |
| `Sheet` | 在当前页面上呼出的毛玻璃浮层 |

**[导航](../../docs/elements/navigation.md)**

| 组件 | 说明 |
| --- | --- |
| `Nav` / `NavItem` | 双语顶栏，当前项只变色；竖屏收成全屏菜单 |
| `BackHome` | 左上角“返回 + 主页”两个斜切块，主页块可以展开一条快捷导航 |
| `QuickNav` / `QuickNavItem` | 横向的快捷导航条，当前项信号色加底条 |
| `ResourceBar` / `Resource` | 右上角的资源条，数据体数字压在半透明黑底上 |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | 反白块与底条两种写法，完整的键盘操作 |

**[数据展示](../../docs/elements/data-display.md)**

| 组件 | 说明 |
| --- | --- |
| `Stat` | 大号数据体数值，带分母、单位、千分位、前导零 |
| `ListRow` | 分类 / 日期 / 标题三栏的新闻行，可以整行是链接 |
| `Progress` | 细条、可分段的粗条、相对值条 |
| `RingProgress` | 环形进度，数字居中（等级环） |
| `Tag` | 实心、描边、中性三种形态，可切角 |
| `Rating` | 星级，星形或菱形 |
| `Badge` | 红点与数字角标 |

**[反馈](../../docs/elements/feedback.md)**

| 组件 | 说明 |
| --- | --- |
| `Dialog` | 通栏横带式确认弹窗 |
| `Notice` | 左侧色边分级的提示条 |
| `Loading` | 细进度条加百分比和状态文字；进度未知时是旋转指示加闪烁光标 |
| `Empty` | 虚线框空状态 |
| `RewardGlow` | 奖励图标背后的静态放射光 |

**[装饰元素](../../docs/elements/decorations.md)与[排版](../../docs/foundations/typography.md)**

| 组件 | 说明 |
| --- | --- |
| `Heading` | 中英成对的双语标题 |
| `Divider` | 细线、虚线、渐隐线，可带起点或标签 |
| `Counter` / `Serial` | `01 // 01 / 05` 式的计数与 `NO.0147` 式的序号 |
| `DateText` | `2026 // 10 / 03`，输出 `<time>` |
| `MicroText` | 微缩英文，可竖排 |
| `GhostTitle` | 背景巨字 |
| `CornerMarks` | 四个 L 形角标框住内容 |
| `Callout` | 标注点 + 折线 + 黑底标签，标签可以是链接 |
| `Barcode` | 条形码，真实的 Code 39 编码 |
| `Ticks` | 标尺刻度 |
| `Prose` | 档案类长文本：中文宋体配英文衬线，行高更大，可给小标题自动编号 |

**[图标与符号](../../docs/foundations/iconography.md)**

| 组件 | 说明 |
| --- | --- |
| `Icon` | 图标的画板：正方形、单色，可选方框或三角框。图形由使用方传入 |
| `Watermark` | 把一个标识放大、压低不透明度，垫在面板的留白处 |
| `IconTitle` | 图标 + 中文粗字 + 英文小字的入口组合 |

**[底纹](../../docs/foundations/texture-and-pattern.md)**

| 组件 | 说明 |
| --- | --- |
| `Pattern` | 半调网点、噪点、警戒条纹、斜线网格、扫描线，可朝一个方向渐疏 |
| `Glitch` | 故障：横向错位加色块，只在转场时播一次，不超过 1 秒 |

**[图片](../../docs/foundations/imagery.md)**

| 组件 | 说明 |
| --- | --- |
| `Portrait` | 立绘容器：出血、幽灵重影、向左下的投影 |
| `Scrim` | 只压文字一侧的黑色渐变遮罩 |
| `StripGallery` / `Strip` | 等宽竖带切图，底部压黑，每条是一个入口 |

**[布局与层级](../../docs/foundations/layout-and-depth.md)**

| 组件 | 说明 |
| --- | --- |
| `Shell` | 固定骨架：顶栏、右栏、背景巨字、滚动提示，换屏只换内容 |
| `ScrollHint` | 底部的滚动提示，也可以是“去下一屏”的入口 |
| `TiltGroup` | 透视面板组，可随指针摆动，竖屏取消 |
| `PanelGrid` / `PanelGridItem` | 大小不一的矩形错位拼合 |
| `Parallax` / `ParallaxLayer` | 多层视差，跟指针或跟滚动 |

**[动效](../../docs/foundations/motion.md)**

| 组件 | 说明 |
| --- | --- |
| `Stagger` | 逐项入场，每一项比前一项晚 70ms |
| `CountUp` | 数字滚动，可以直接放进 `Stat` |

每个组件的属性、示例和交互说明在 [Storybook](https://icaruszezen.github.io/arknights-ui/) 里，也可以在本地运行：

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

字体不随包分发。字体栈里依次是官网实际使用的字体和开源替代品，按需自行加载，授权见 [字体与排版 · 字体授权](../../docs/foundations/typography.md#字体授权)。没有加载时会回退到系统字体，版式比例不变。其中 `Heading` 的 `serif` 需要思源宋体或 Noto Serif SC 的 Heavy 字重才有“重磅”的效果；`Prose` 的正文用的也是这套宋体。

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

**交互。** 悬停是整块换色，300ms；焦点是外侧 2px 轮廓，切角不会把它裁掉；可见形状再小，点击区也不小于 44px；位移、旋转、闪烁类动效在 `prefers-reduced-motion` 下关闭，只保留透明度变化。

**弹层。** `Dialog`、`Drawer`、`Sheet` 都基于原生 `<dialog>`，自带焦点圈定和 Esc，关闭后焦点回到触发元素。它们是受控的：

```tsx
const [open, setOpen] = useState(false)

<Drawer open={open} onOpenChange={setOpen} title="制造站" sub="FACTORY">…</Drawer>
```

**装饰。** `MicroText`、`GhostTitle`、`Barcode`、`Ticks` 和 `CornerMarks` 的角标是纯装饰，默认带 `aria-hidden`，对比度有意压低。必须读到的信息不要交给它们；确实需要被读到时传 `aria-hidden={false}`。`Pattern`、`Watermark`，以及不放内容的 `Scrim`、不带链接的 `ScrollHint` 同样是装饰。`Icon` 默认也是，给了 `label` 才会被读到。

**固定的位置。** `Nav`、`BackHome`、`ResourceBar`、`GhostTitle`、`Callout` 都不自己定位。文档要求它们“永远在同一个地方”，但放在哪由页面决定，用 `className` 写（如 `fixed top-0 left-0`）。`Pattern`、`Portrait`、`ScrollHint` 也是这样。例外有三个：`Scrim` 默认铺满父元素，`Watermark` 默认贴在面板的一侧，`Shell` 默认铺满视口——它本身就是那副固定的骨架。

**底纹的颜色。** 除了黄黑的警戒条纹，底纹都取当前的文字色：放进纸白面板自动变深，也可以用 `text-*` 换成信号色。`Panel` 的 `halftone` 走的是同一套。

**图片与图标。** 组件库不带任何图片和图标。`Icon`、`Watermark`、`Portrait`、`Strip` 的图都由使用方提供，请使用原创或已获授权的素材。Storybook 里看到的是代码画的占位图。

**动效。** 入场、数字滚动、故障、视差、摆动都遵守 `prefers-reduced-motion`：减少动效时 `Stagger` 只淡入，`CountUp` 直接显示最终值，`Glitch`、`Parallax` 和 `TiltGroup` 的摆动不启动。跟指针走的效果在触屏设备上也不启用。

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
| `MicroText`、`GhostTitle` 的颜色 | 固定的 `#585858`、`#242424` | 次要文字色的 50%、前景色的 14% | 黑底上与原取值相同，放进面板时跟着换 |
| `Rating` 在纸白面板上 | `--ark-color-tier-5` | 金色压暗到 45% | 金色在浅底上看不清，做法同信号色文字 |
| `Badge` 的数字 | 未指定 | 红底黑字 | 白字压在 `#e33b3b` 上只有 4.24:1 |
| `BackHome` 的斜边 | 示意图里画得较缓 | 45° | 几何规范写的是全局只用 45° |
| `QuickNav` 的英文小字 | 示意图里约 9px | `0.75rem` | 字号阶里可读的最小一档 |
| `Nav` 的当前项 | 只变色，并建议补一个非颜色标记 | 默认只变色，`indicator` 补一条 4px 条 | 两种都给，由使用方决定 |
| `Counter` 的英文标签 | DemiBold（600） | Tailwind 自带的 `font-semibold` | token 里没有 600 这一档 |
| `Drawer` 的遮罩 | 未指定 | 透明，主画面不压暗 | 文档强调抽屉“不完全遮挡”主画面 |
| `Sheet` 的遮罩 | 可加模糊 | 只压暗，模糊留给浮层自身 | 与整页模糊的 `Dialog` 区分开 |
| `Barcode` | 条码作为装饰 | 真实的 Code 39 编码 | 装饰写真实内容；字符集因此限于大写字母、数字和少数符号 |
| 底纹的颜色 | 白或黑，固定 | 取当前文字色 | 放进面板时跟着明暗上下文换，也能换成信号色。警戒条纹的黄黑除外 |
| 斜线网格的浓度 | 白 5–15% | 方格 8%、对角线 14%；`Shell` 里再减半 | 取自示意图。铺满整屏时要压到“细看才有” |
| 噪点、扫描线、斜线网格的取值 | 只有参数范围，没有 token | 写在主题层的工具类里 | 没有改动 `tokens.json` |
| `Glitch` 的马赛克 | 局部画面被打成色块 | 叠一层信号色的色块，不对画面本身做像素化 | CSS 没有像素化滤镜，SVG 滤镜在大面积上开销大 |
| `TiltGroup` 的摆动 | 陀螺仪 / 鼠标 | 只跟指针 | iOS 上读陀螺仪要先弹权限请求，不该由一个装饰效果发起 |
| 透视、拼合、条带的窄屏处理 | 窄屏取消倾斜、纵向堆叠 | 按竖屏（`orientation: portrait`）切换 | 与 `Nav` 一致：官网按方向而不是按宽度切换 |
| `Icon` 的三角外框 | 全局只用 45° | 近等边三角形 | 沿用示意图里徽记外框的画法；45° 的三角太扁，放不下图形 |
| `Prose` 的行高 | “明显大于界面文字” | 1.9 | 文档没有给数值 |
| `Shell` 的右栏 | 未测量 | 宽 14rem，可用 `--ark-shell-rail` 改 | 按线框里右栏占屏宽的比例折算到 1920 基准 |
| `Shell` 的整体缩放 | 根字号 `100vw / 120`，整站等比缩放 | 不改根字号 | 组件不设置页面级样式；需要等比缩放时由页面自己设根字号 |

`Empty` 不在表里：文档原先写的 `gray-600` 文字在黑底上只有 2.95:1，这个问题已经在文档里更正并记录，见 [反馈 · 空状态](../../docs/elements/feedback.md#空状态)。

## 开发

在仓库根目录执行：

```bash
pnpm install
```

| 命令 | 作用 |
| --- | --- |
| `pnpm storybook` | 启动 Storybook（`http://localhost:6006`） |
| `pnpm build-storybook` | 构建静态 Storybook 到 `storybook-static/`；CI 发布到 GitHub Pages 的就是它 |
| `pnpm test` | 单元测试（Vitest + Testing Library） |
| `pnpm typecheck` | 类型检查 |
| `pnpm lint` | Biome 检查；`pnpm format` 自动修复 |
| `pnpm build` | 重新生成 tokens，再构建 `dist/` |

写组件时注意：

- 类名只写完整的静态字符串。Tailwind 按纯文本扫描源码，拼出来的类名不会生成样式。
- 不依赖全局重置。预编译样式表不带 Preflight，元素自带的边距、边框、`box-sizing` 要在类里写全（Storybook 也是这样配置的，看到的就是真实表现）。
- 颜色只用语义键（`text-ark-fg`、`bg-ark-signal`、`border-ark-rule` 等），它们会跟随明暗上下文。固定语义的颜色（稀有度、提示级别）才直接取调色板。
- 切角、斜边把背景画在 `::before` 上再裁切（`before:ark-cut-tr-md`、`before:ark-slant-r`），不要直接裁根元素。
- 弹层用 [`src/utils/useModalDialog.ts`](src/utils/useModalDialog.ts)。点遮罩靠“事件目标是 `<dialog>` 自身”来判断，所以内容要铺满 `<dialog>`，底色、描边都画在里面那一层。
- 动画都定义在 [`src/styles/theme.css`](src/styles/theme.css)：`animate-ark-spin`、`animate-ark-blink`、`animate-ark-fade-in`，入场的 `animate-ark-enter-left` / `-right` / `-up`，滚动提示的 `animate-ark-bob`，故障的 `animate-ark-glitch`（及 `-bars`、`-mosaic`）。只动透明度的 `fade-in` 可以直接用，其余都要包在 `motion-safe:` 里。
- 底纹、透视、视差图层、长文本的样式也是主题层里的工具类（`ark-pattern-*`、`ark-tilt`、`ark-parallax-layer`、`ark-prose`），和 `ark-cut-*` 一样可以带变体（`after:ark-pattern-halftone`）。复杂的 CSS 写成工具类，组件里只引用类名。
- JS 驱动的动效用 `src/utils/` 里的三个 hook：`useReducedMotion`、`useInView`、`useOffset`。监听挂在 effect 里，通过 CSS 变量改样式，不走 React 状态。
- 属性是联合类型的组件（`Button`、`ActionButton`、`ListRow`、`Strip`、`ScrollHint`），Story 里不要用 `decorators`，否则参数类型会被推成 `never`。
- Story 里的图片用 [`.storybook/art.ts`](.storybook/art.ts) 生成的占位图，不要引入任何图片文件。
- 测试里要控制 `matchMedia`、`IntersectionObserver` 的结果时，用 [`src/internal/testing.ts`](src/internal/testing.ts) 里的替身。数字滚动、指针跟随这类按帧走的逻辑，用假定时器时要把 `requestAnimationFrame` 和 `performance` 一起列进 `toFake`。
- Storybook 的无障碍面板不对 `GhostTitle`、`MicroText` 做对比度检查（见 `.storybook/preview.tsx`）。另外 axe 看不到 `::backdrop`，弹层打开时可能误报对比度不足。
- Storybook 运行期间新建的文件，里面的类可能不会立刻生成样式。保存一次任意已有的源文件，或重启 Storybook。

`tokens.json` 里增删字号、字重、投影后，要同步 [`src/utils/cn.ts`](src/utils/cn.ts) 里登记的键名，测试会提醒。
