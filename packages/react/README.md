# @arknights-ui/react

《明日方舟》风格的 React 组件库，面向**网页和应用**：站点、工具、后台都能用它搭出来。风格来自仓库里那份 [风格指导文档](../../docs/00-overview.md) 的规则——直角、黑白灰加一个信号色、细线、中英成对、数据体的数字、悬停整块换色——而不是对游戏画面的复刻。取值在 [Design Tokens](../../tokens/tokens.json) 里。

> **非官方项目。** 与上海鹰角网络科技有限公司无关。本包不含任何官方素材：没有 Logo、立绘、图标或字体文件，图形全部是代码画的几何形状。

目前是工作区内的私有包（`private: true`），尚未发布到 npm。

包有两个入口：

| 入口 | 内容 |
| --- | --- |
| `@arknights-ui/react` | 主入口。网页 / 应用组件，暗色与亮色两套主题 |
| `@arknights-ui/react/game` | [游戏入口](#游戏入口)。照着实机画面做的组件，只按暗色设计，不随主入口演进 |

规则怎么落到网页上（尺寸档、明暗两套取值、浮层、表格），写在 [网页与应用](../../docs/modules/web-app.md) 一篇里。

## 组件

**[按钮](../../docs/elements/buttons.md)**

| 组件 | 说明 |
| --- | --- |
| `Button` | 六个层级（主 / 次 / 无底 / 灰底 / 反色 / 危险）、五档高度；双语两行、折线箭头、图标、选中态、处理中 |
| `IconButton` | 只有图形的方形按钮，名称由 `label` 给出 |

**[表单](../../docs/elements/forms.md)**

| 组件 | 说明 |
| --- | --- |
| `Field` / `FormSection` | 表单项：项名、控件、注释、报错排成固定的几处，并接好无障碍属性；小节是一条带斜纹的深色带 |
| `Input` / `Textarea` | 直角的色块，底边一条线，聚焦时换成信号色；可带前后缀、字数 |
| `Select` / `SelectOption` | 下拉：当前项深底、左缘信号色边，展开的选项是反色的面 |
| `Checkbox` | 方形的勾选框，选中整块换色；支持半选 |
| `RadioGroup` / `Radio` | 单选组：菱形的单选框 |
| `Switch` | 两格宽的直角开关：一格滑块，一格写着 ON / OFF |
| `Slider` | 细轨道加一块印着数值的矩形滑块 |
| `SegmentedControl` / `Segment` | 分段选项：两三个选项直接摆出来，选中的那块换成信号色 |
| `NumberStepper` | 数量步进器：最少、减、数值、加、最多 |

**[面板与浮层](../../docs/elements/panels-and-cards.md)**

| 组件 | 说明 |
| --- | --- |
| `Panel` | 一块直角的面：跟主题走的默认面 / 抬起的面 / 反色面，以及压在图上用的石墨、纸白、毛玻璃；强调边、切角、半调网点 |
| `Card` / `CardHeader` / `CardMedia` / `CardFooter` | 抬起一层、带投影的面板；可以整张是链接，可选 2px 小圆角 |
| `Modal` | 在当前页面上呼出的弹层：页头、可滚的正文、底栏；窄屏通栏贴底 |
| `Drawer` | 从右、左、下滑入的抽屉；主画面压暗但仍然可见 |
| `Popover` | 点一下在旁边展开的非模态浮层 |
| `Menu` / `MenuItem` / `MenuSeparator` / `MenuLabel` | 下拉菜单，完整的键盘操作 |
| `Tooltip` | 悬停或聚焦时出现的反色小提示 |

**[导航](../../docs/elements/navigation.md)**

| 组件 | 说明 |
| --- | --- |
| `Nav` / `NavItem` / `NavGroup` | 横排是双语顶栏，窄屏收成全屏菜单；竖排是侧栏的一列，当前项左缘一条信号色边 |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | 底条、实心块、分段块三种写法，横排或竖排，完整的键盘操作 |
| `Breadcrumb` / `BreadcrumbItem` | 面包屑，`首页 // 文档 / 按钮` |
| `Pagination` | 分页：补零的页码，当前页是信号色实块；也有 `‹ 03 / 12 ›` 的紧凑写法 |
| `Steps` / `Step` | 步骤：一根轴线串着方形的编号节点 |
| `EntryList` / `EntryListItem` | 大号的条目列表：中英同一行，逐条入场，悬停时右移并浮现巨型英文 |

**[数据展示](../../docs/elements/data-display.md)**

| 组件 | 说明 |
| --- | --- |
| `Stat` | 大号数据体数值，带分母、单位、千分位、前导零 |
| `Table` 一族 | 细线分行的表格：窄体表头、数字列靠右、可排序、可选中、表头可固定 |
| `ListRow` | 分类 / 日期 / 标题三栏的新闻行，可以整行是链接 |
| `KeyValueList` / `KeyValue` | 键值对：键粗体，值常规字重 |
| `Timeline` / `TimelineItem` | 刻度尺式的时间轴：只展示，或作为一组单选 |
| `Progress` | 细条、可分段的粗条、轮播条、相对值条；进度未知时来回走 |
| `RingProgress` | 环形进度，数字居中 |
| `Tag` | 实心、描边、灰底三种形态，五种颜色；圆头、切角、可移除 |
| `Badge` | 提醒标记（橙色菱形）与计数色块 |
| `Rating` | 一颗压一颗的星，或菱形 |
| `Avatar` | 方形头像，可带状态角标和信号色环 |
| `Accordion` / `AccordionItem` | 折叠面板，基于原生 `<details>` |
| `Countdown` | 数据体的 `HH:MM:SS` 倒计时，可以自己走 |
| `TimeRange` | `10月03日 16:00 - 10月17日 03:59`，数字用数据体 |

**[反馈](../../docs/elements/feedback.md)**

| 组件 | 说明 |
| --- | --- |
| `Dialog` | 确认弹窗：取消在左、确认在右，各带固定的图形。默认是居中的面板，也可以是通栏的横带 |
| `Notice` | 写在页面里的提示条；分级时左侧加一条色边 |
| `ToastProvider` / `useToast` | 一会儿就消失的轻提示，叠在视口一角，底下一条走时的细线 |
| `Loading` / `Spinner` | 带百分比的细进度条；进度未知时是旋转指示 |
| `Skeleton` | 内容没到之前先占位的灰块 |
| `Empty` / `EmptySlot` | “没有数据”的虚线框；“可以填的空位”是一个实线框的按钮 |

**[装饰元素](../../docs/elements/decorations.md)与[排版](../../docs/foundations/typography.md)**

| 组件 | 说明 |
| --- | --- |
| `Heading` | 中英成对的双语标题，下面可以加一条信号色的粗条 |
| `Codename` | 名字的排版：Heavy、收字距，英文小字在上 |
| `Prose` | 成段的文字：行高 1.4，可给小标题自动编号 |
| `NumberedSection` | 编号小节：两位数字、小节名、一条细线 |
| `Divider` | 细线、虚线、渐隐线，可带起点或标签 |
| `Counter` / `Serial` | `01 // 01 / 05` 式的计数；`NO.0147` 式的序号 |
| `DateText` | `2026 // 10 / 03`，输出 `<time>` |
| `MicroText` / `GhostTitle` | 微缩英文；背景巨字 |
| `CornerMarks` / `Callout` / `Barcode` / `Ticks` | 角标、标注、条形码（真实的 Code 39）、刻度 |

**[图标](../../docs/foundations/iconography.md)、[底纹](../../docs/foundations/texture-and-pattern.md)、[图片](../../docs/foundations/imagery.md)**

| 组件 | 说明 |
| --- | --- |
| `Icon` / `Watermark` / `IconTitle` | 图标的画板；放大压淡的水印；图标 + 标题的入口组合 |
| `Pattern` / `Glitch` | 半调、点阵、噪点、警戒条纹、网格、扫描线；只播一次的故障 |
| `Portrait` / `Scrim` | 人物图的容器：出血、重影、缓移；只压文字一侧的渐变遮罩 |
| `Carousel` / `CarouselSlide` | 16:9 轮播，下面一条进度条；可以自动轮播，带暂停 |
| `ThumbnailStrip` / `Thumbnail` | 带白框的缩略图切换 |
| `StripGallery` / `Strip` | 等宽竖带切图，每条一个主题色、一个入口 |

**[布局与层级](../../docs/foundations/layout-and-depth.md)、[动效](../../docs/foundations/motion.md)**

| 组件 | 说明 |
| --- | --- |
| `AppShell` | 应用的固定骨架：页头 + 侧栏 + 内容区；窄屏时侧栏收进抽屉 |
| `Shell` | 展示型站点的固定骨架：顶栏、右栏、一条随屏换位的横线、背景巨字 |
| `ProfileShowcase` | 档案式的文字加出血的人物图 |
| `PanelGrid` / `PanelGridItem` | 大小不一的矩形错位拼合 |
| `ScrollHint` / `TiltGroup` / `Parallax` | 滚动提示；透视面板组；多层视差 |
| `Stagger` / `CountUp` | 逐项入场；数字滚动 |

每个组件的属性、示例和交互说明在 [Storybook](https://icaruszezen.github.io/arknights-ui/) 里，也可以在本地运行：

```bash
pnpm storybook
```

Storybook 的“示例”一组里有几页完整的页面：仪表盘、设置页、文档页（亮色）、官网分屏、活动公告、情报面板。

### 游戏入口

`@arknights-ui/react/game` 里是照着实机画面做的 25 个组件，从主入口原样挪过来，**不再跟着主入口的设计演进**：

| 模块 | 组件 |
| --- | --- |
| 通用 | `ActionButton` · `BackHome` · `QuickNav` · `ResourceBar` · `RewardGlow` |
| [主界面](../../docs/modules/game/home.md) | `EntryPanel` · `EntryGrid` |
| [干员](../../docs/modules/game/operator.md) | `OperatorCard` · `ClassFilter` · `AttributeList` · `SkillSlot` |
| [作战](../../docs/modules/game/battle.md) | `StageMap` / `StageNode` · `SquadSlot` · `CostMeter` · `DeployCard` · `UnitBar` · `HudCounter` |
| [基建](../../docs/modules/game/base.md) | `RoomCard` · `OperatorAvatar` · `MoodBar` |
| [寻访与采购](../../docs/modules/game/gacha-and-store.md) | `Banner` · `ProductCard` |
| [剧情](../../docs/modules/game/story.md) | `DialogueBox` · `StoryControls` · `ChapterTitle` |

```tsx
import '@arknights-ui/react/game.css'
import { OperatorCard, StageMap } from '@arknights-ui/react/game'
```

- `game.css` 自带主题层，可以单独引入；和 `styles.css` 一起引入也没有问题。用 Tailwind 的项目不需要它，扫描 `dist` 时两个入口的类都会生成。
- 它们**只按暗色设计**，自己写死了深色的明暗上下文，放进亮色页面不会跟着翻。要用在亮色页面里，外面包一层 `data-ark-theme="dark"`。
- 尺寸按 1280 × 720 的实机画面换算，响应条件仍然是方向（`portrait:`），不是宽度。

## 接入

需要 React 19 及以上。样式有两种接法，选一种。

### 项目没有用 Tailwind

引入预编译的样式表即可。它不含全局重置，不会改动页面上的其他元素。

```tsx
import '@arknights-ui/react/styles.css'
import { Button } from '@arknights-ui/react'

export function Example() {
  return (
    <Button variant="primary" size="xl" sub="READ MORE" arrow>
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
<div class="bg-ark-surface p-ark-5 font-ark-data text-ark-label text-ark-fg">…</div>
```

### 主题、页面底色与字体

主题写在任意祖先元素的 `data-ark-theme` 上，不写就是暗色：

| 取值 | 效果 |
| --- | --- |
| `dark` | 黑底（官网的写法），默认 |
| `light` | 浅灰的底、纸白的面、深色的字 |
| `auto` | 跟随系统的 `prefers-color-scheme` |

```html
<html data-ark-theme="light">
```

组件不设置页面级样式，底色和字体需要自己定：

```css
body {
  background: var(--ark-canvas);
  color: var(--ark-fg);
  font-family: var(--ark-font-family-cjk-sans);
}
```

按文档的说法，沉浸型的页面（首页、展示型站点）用暗色，阅读与工具型的页面用亮色。

字体不随包分发。字体栈里依次是官网实际使用的字体和开源替代品，按需自行加载，授权见 [字体与排版 · 字体授权](../../docs/foundations/typography.md#字体授权)。没有加载时会回退到系统字体，版式比例不变。

## 约定

**一个信号色。** 组件用到的信号色都来自 `--ark-signal`，默认是官网的青蓝。在任意子树上覆盖它就能换色：

```tsx
<section style={{ '--ark-signal': 'var(--ark-color-signal-action)' }}>…</section>
```

**表面与明暗上下文。** `Panel`、`Card`、`Modal`、`Drawer` 的 `tone` 是同一组取值：

| `tone` | 是什么 |
| --- | --- |
| `surface` | 默认的面，跟着主题走 |
| `raised` | 抬起的一层，比默认的面亮一档 |
| `inverse` | 与所在主题相反的面：暗色主题里是纸白，亮色主题里是近黑。一屏最多一两块 |
| `graphite` / `paper` | 半透明的石墨灰 / 纸白，压在图片上用，不跟主题 |
| `frosted` | 毛玻璃 |

固定明暗的面（`inverse`、`graphite`、`paper`）会给子树设明暗上下文，放在里面的按钮、标签、分隔线自动换成对应的前景，不需要逐个指定。`inverse` 只翻一层：反色面里再套反色面不会翻回来。

**`tone` 与 `color`。** `tone` 只表示表面的明暗；“这一块用什么颜色标出来”统一叫 `color`，取值是 `signal`、`neutral`、`danger`、`warning`、`success`（`Tag`、`Badge`、`Progress`、`RingProgress`、`Stat`、`KeyValue`）。

**尺寸。** 控件的 `size` 是同一组档位，取值在 tokens 的 `size.control` 里：

| `size` | 高度 | 用在哪 |
| --- | --- | --- |
| `xs` | 1.5rem | 官网的 READ MORE 小条 |
| `sm` | 2rem | 工具栏、表格行里的操作 |
| `md` | 2.5rem | 默认 |
| `lg` | 3rem | 宽松的表单、弹窗的操作 |
| `xl` | 3.75rem | 官网那条双语的长按钮，落地页的主行动 |

不是每个控件五档都有（输入框是 `sm` / `md` / `lg`）。可见形状不到 44px 的几档，在触屏（`pointer: coarse`）上点击区会自动撑到 44px；用鼠标时不撑，免得密排的控件互相盖住。

**响应式。** 按宽度切换，不按方向：断点是 `md`（48rem）。`Nav` 的横排、`AppShell` 的侧栏、`Shell` 的骨架、`Modal` 的位置在这一档以下换成窄屏的编排。`Field` 的左右排按它自己所在容器的宽度切换（容器查询）。

**覆盖样式。** 所有组件都接受 `className`，同一属性后写的覆盖组件默认值：

```tsx
<Button className="px-ark-6">更宽的按钮</Button>
```

合并用的 `cn()` 也从包里导出，它认识 `ark-` 主题键（例如不会把字号 `text-ark-body` 和颜色 `text-ark-fg` 当成冲突）。它和 tailwind-merge 的默认行为有一处不同：后写的字号不会去掉先写的行高。

带原生输入框的控件（`Input`、`Textarea`、`Checkbox`、`Switch`、`Slider`、`NumberStepper`）的 `className` 和 `style` 作用在最外层，其余属性和 `ref` 交给里面的 `<input>`。

**稳定的选择器。** 每个组件的根节点带 `data-ark="<名称>"`，可以用来写选择器或做测试定位。

**交互。** 悬停是整块换色，300ms；焦点是外侧 2px 轮廓；位移、旋转、闪烁类动效在 `prefers-reduced-motion` 下关闭，只保留透明度变化。

**链接与路由。** 能渲染成链接的组件（`Button`、`NavItem`、`BreadcrumbItem`、`MenuItem`）接受 `as`，`Card` 接受 `linkAs`，用来换成路由库的 `Link`。它要能接收 `href`、`className` 和子元素：Next 的 `Link` 直接可用，React Router 的包一层把 `href` 转成 `to`。

**弹层。** `Dialog`、`Modal`、`Drawer` 都基于原生 `<dialog>`，自带焦点圈定和 Esc，关闭后焦点回到触发元素。它们是受控的：

```tsx
const [open, setOpen] = useState(false)

<Drawer open={open} onOpenChange={setOpen} title="构建详情" sub="BUILD #0147">…</Drawer>
```

**浮层。** `Tooltip`、`Popover`、`Menu`、`Select` 的浮层和 `Toast` 的那一栏用原生的 `popover`，打开时进浏览器的顶层：不会被 `overflow: hidden` 裁掉，开在 `Modal` 里也盖在它上面。位置由 [floating-ui](https://floating-ui.com/) 计算，放不下时自动翻面。它们可以受控（`open` / `onOpenChange`），也可以不管。浮层开在弹窗里时，Esc 先关浮层，再按一次才关弹窗。

`Popover`、`Menu`、`Tooltip` 的触发元素是你传进去的那个元素，组件会给它补上 `ref` 和事件：原生元素和本库的组件都可以，自己写的组件要把 `ref` 和这些属性转到 DOM 上。

**表单。** 控件底下都是原生的输入元素，只隐藏不移除：键盘、表单提交（`name`）、读屏都走它。放进 `Field` 时，项名、注释、报错自动接到控件上：

```tsx
<Field label="帧率" hint="更高的帧率更耗电" layout="row">
  <SegmentedControl name="fps" defaultValue="60">
    <Segment value="30">30 FPS</Segment>
    <Segment value="60">60 FPS</Segment>
  </SegmentedControl>
</Field>
```

**选中项。** `Tabs`、`SegmentedControl`、`RadioGroup`、`Select`、`Timeline`、`Pagination`、`Carousel`、`ThumbnailStrip` 都有一个“当前项”，两种用法二选一：给 `value`（分页是 `page`，轮播是 `index`）就由外部决定，并在 `onValueChange` 里更新它；不给就用 `defaultValue` 让组件自己记。

**逐个摆位的子元素。** `Nav`、`Breadcrumb`、`Steps`、`Accordion`、`Carousel`、`EntryList` 会把每个子元素各放进一格。子元素要直接写在里面或者传数组；包一层 Fragment 或自定义组件就只算一个。`Select` 例外，它会展开 Fragment。

**装饰。** `MicroText`、`GhostTitle`、`Barcode`、`Ticks`、`Skeleton` 和 `CornerMarks` 的角标是纯装饰，默认带 `aria-hidden`。`GhostTitle` 的对比度有意压低；必须读到的信息不要交给它们。`Pattern`、`Watermark`，以及不放内容的 `Scrim`、不带链接的 `ScrollHint` 同样是装饰。`Icon` 默认也是，给了 `label` 才会被读到。

**固定的位置。** `Nav`、`GhostTitle`、`Callout`、`Pattern`、`Portrait`、`ScrollHint` 都不自己定位，放在哪由页面决定，用 `className` 写。例外：`Scrim` 默认铺满父元素，`Watermark` 默认贴在面板的一侧，`Shell` 和 `AppShell` 默认铺满视口——它们本身就是固定的骨架。

**底纹的颜色。** 除了黄黑的警戒条纹，底纹都取当前的文字色：换主题、放进反色面时自动跟着换，也可以用 `text-*` 换成信号色。

**图片与图标。** 组件库不带任何图片和图标。`Icon`、`Watermark`、`Portrait`、`Strip`、`Avatar`、`CardMedia`、`CarouselSlide`、`Thumbnail` 的图都由使用方提供，请使用原创或已获授权的素材。Storybook 里看到的是代码画的占位图。

**动效。** 入场、数字滚动、故障、视差、摆动都遵守 `prefers-reduced-motion`：减少动效时 `Stagger` 只淡入，`CountUp` 直接显示最终值，`Glitch`、`Parallax` 和 `TiltGroup` 的摆动不启动，`Spinner` 和 `Skeleton` 停住。`Carousel` 的自动轮播默认关闭；打开后带一个暂停按钮。

**服务端组件。** 产物顶部带 `"use client"`，在 React Server Components 项目里可以直接引入。

**文案。** 组件里默认的中文（“关闭”“确认”“上一页”“最少”…）都可以用对应的 `*Label` / `*Text` 属性改写。

## 与文档的出入

文档描述的是官网和游戏画面；这个库要在别人的网页里用。下面是没有照搬的地方。

### 网页化带来的

这些是整套库的取向，细节见 [网页与应用](../../docs/modules/web-app.md)：

| 位置 | 文档 | 实现 | 原因 |
| --- | --- | --- | --- |
| 明暗 | 官网只有黑底；纸白与石墨是游戏面板的两种表面 | 暗色、亮色两套主题；默认的面跟主题走，暗色是官网的 `#1d1f20` | 阅读与工具型的页面需要亮色。石墨、纸白保留为压在图上用的表面 |
| 尺寸 | 官网主按钮固定 `14.375rem × 3.75rem`，整站按视口缩放根字号 | 五档 `size`，默认 2.5rem；官网的取值是其中的 `xl` | 应用里不能每个按钮都 60px 高，组件也不该改根字号 |
| 响应条件 | 官网按 `(orientation: portrait)` 切换 | 按宽度（48rem）或容器宽度 | 平板竖屏、半屏的窗口不该落到手机的布局 |
| 点击区 | 可见形状再小，点击区也不小于 44px | 触屏上撑到 44px，鼠标不撑 | 紧凑的控件密排时，常驻的 44px 会盖到相邻的控件上 |
| `Dialog` | 通栏的横带，纸白的内容带，黑与暗红的两个按钮 | 默认是居中的直角面板，上沿一条色边；横带是 `variant="band"` | 横贯整屏的带在应用里太重。取消在左、确认在右、各带固定的图形，这几条照做 |
| `Dialog` 的确认色 | 弹窗的确认是暗红（`#731111`） | 默认信号色；`color="danger"` 是告警红 | 暗红在游戏里标的是“要花掉东西”，网页上红色留给不可撤回的操作 |
| `Button` 的层级 | 主、次、弱三个；游戏内另有成对的黑与暗红 | 六个：加了无底、反色、危险；弱按钮改叫 `subtle`，底色跟主题 | 工具栏和表格里需要没有底的按钮；黑 / 暗红的那一对挪进了 `Dialog` |
| `Button` 的次按钮 | 实机的描边按钮底是深色半透明的 | 描边加 5% 的前景色做底 | 照实机补上了底，但跟主题走 |
| `Notice` | 半透明的黑条，实机只见到信息一级 | 不带彩色的控件底色，跟主题走；另有完成、警示、错误三级和关闭按钮 | 亮色页面上不能是一条黑；分级的色边仍是估计 |
| `Drawer` | 从右侧滑入；基建的抽屉是纸白 | 默认的面跟主题走；可以从左、下进来 | 侧栏导航和窄屏的操作面板也用它 |
| `Tabs` 的默认写法 | 官网新闻分类是实心块 | 默认底条，实心块是 `variant="block"` | 底条是应用里最常见的页签；实心块的尺寸是官网那一处的 |
| `Nav` 的全屏菜单 | 官网竖屏：一行 7.5rem（750 基准）| 一行 3.75rem，宽屏上 5rem | 取的是折到 375 宽以后的大小 |

### 表单

| 位置 | 文档 | 实现 | 原因 |
| --- | --- | --- | --- |
| 选中的蓝 | 实机是 `#0075a8` 配白字 | 信号色配它自己的前景色（默认青蓝配黑字） | 跟随 `--ark-signal`。要照实机做，覆盖 `--ark-signal` 为 `--ark-color-signal-info-ink`、`--ark-on-signal` 为白 |
| 控件的大小 | 分段选项 `138 × 48px`，开关 `172 × 40px`，滑块 `60 × 40px` | 这些是 `lg`；默认 `md` 小一档 | 实机的尺寸是为手指和 720p 定的 |
| `Switch` 的 `sm` | 状态格里总有 On / Off 的字 | 2.5rem 宽的 `sm` 没有字 | 放不下。位置和颜色两种编码还在 |
| `Slider` 的轨道 | 一条深色细线 | 走过的一段换成信号色 | 不读数字也看得出大概在哪 |
| `SegmentedControl` 的 `joined` | 块与块之间留缝、一条线串起来 | 另有连成一条的写法 | 工具栏里要省地方。`linked` 是默认，照文档 |
| `Radio` | 文档只有分段选项，没有单个的单选框 | 菱形 | 估计。菱形把它和方形的勾选框区分开，也是提醒标记用的形状 |
| `Checkbox`、`Input`、`Textarea` | 文档没有 | 直角的色块；输入框底边一条线，聚焦换信号色 | 估计，按“每个控件都是一块直角的色块”推出来的 |
| `Select` | 官网的下拉左边带一个播放按钮，上面一行小标签 | 只有当前项和选项两部分 | 那两样是语音播放条的，不是下拉的 |
| `Field` 的 `stack` | 设置页是项名在左、控件在右 | 另有项名在上的写法，并且是默认 | 普通表单的习惯。`layout="row"` 照文档 |
| 禁用、报错 | 截图里见不到 | 禁用用主题的禁用色；报错把底边换成红色，文字读给读屏 | 估计 |

### 新增的组件

文档里没有、按规则推出来的：`Table`、`Pagination`、`Breadcrumb`、`Steps`、`Accordion`、`Avatar`、`Skeleton`、`Tooltip`、`Popover`、`Menu`、`Toast`、`AppShell`、`IconButton`。它们的取值都是估计（本仓库的设计决定），依据写在 [网页与应用](../../docs/modules/web-app.md)。

`Timeline` 的刻度写法有出处（官网图集页，实测），但官网的是“年份页签 + 月份刻度”拼在一起的一个控件；这里只做了刻度那一半，年份用 `Tabs` 自己拼。

### 逐个组件

| 位置 | 文档 | 实现 | 原因 |
| --- | --- | --- | --- |
| `Stat` 的标签 | `gray-500` | `gray-400` | `gray-500` 在石墨面板上约 3.3:1 |
| 浅色面上的信号色文字 | — | 信号色压暗到 45% | 青蓝、黄在浅底上对比度不足。色块和底条不受影响 |
| 悬停的触发条件 | `(any-hover: hover)` | `(hover: hover)` | 用的是 Tailwind 内置的 `hover:`，意图相同 |
| `Divider` 的 `fade` | `--ark-pattern-fade-rule` | 从起点向末端渐隐，颜色跟随明暗上下文 | 原取值固定为白色且方向相反 |
| `GhostTitle` 的颜色 | 固定的 `#242424` | 前景色的 14% | 黑底上与原取值相同，放进面板时跟着换 |
| `GhostTitle` 的裁切 | 装进一个高 `0.95em` 的框里贴底放，裁掉溢出 | 字和一个空的占位块按基线对齐，占位块高 `0.84cap` | 官网的写法裁掉多少取决于字体的度量；这样写换什么字体都裁掉大写高的 16% |
| `Rating` 在浅色面上 | `--ark-color-tier-star` | 黄色压暗到 45% | 黄色在浅底上看不清，做法同信号色文字 |
| `Rating` 的硬边 | 星与星之间是一圈深色的描边 | 每颗星一道很小的硬边投影 | 效果相同，不用改图形 |
| `Badge` 的通知色 | 蓝底白字（取色 `#229ed5`） | `color="signal"`：信号色配它自己的前景色 | 白字压在这个蓝上只有 3:1 |
| `Drawer` 的左缘色边 | 实机的基建抽屉没有 | 默认不画，`accent` 打开 | 需要把类型色从房间标到抽屉时用 |
| `Nav` 的当前项 | 只变色，并建议补一个非颜色标记 | 默认只变色，`indicator` 补一条 4px 条 | 两种都给，由使用方决定 |
| `Counter` 的大数字与英文标签 | DemiBold（600） | Tailwind 自带的 `font-semibold` | token 里没有 600 这一档 |
| `Counter` 的排法 | 整块固定 10rem 宽，“当前 / 总数”压在大数字的右缘上约 1rem | 两者并排、不重叠，整块的宽度由内容决定；栏目名照样靠右 | 回退字体比官网的字宽，照搬会叠字 |
| `Counter` 的裁切 | `line-height: 0.55` 加 `overflow: hidden` | 数字和一个空的占位块按基线对齐，再下移 `0.2cap` | 同 `GhostTitle`：官网的写法换一个回退字体会连上缘一起裁 |
| `Counter` 的 `sm`、`Serial` | 官网没有 | 保留 | 没有实机出处，是估计 |
| `Tabs` 的底条 | 实机只见到“选中蓝字、未选中灰字” | 另加一条 4px 底条 | 颜色之外的第二种标记 |
| `Barcode` | 条码作为装饰 | 真实的 Code 39 编码 | 装饰写真实内容；字符集因此限于大写字母、数字和少数符号 |
| `Callout` 选中时的高亮 | 物件套一圈白框，背后垫一块信号色方块 | 没有，只换标签 | 那是场景里物件的高亮，不是标注的一部分 |
| `Heading` 的 `sm` | 官网没有这样的小标题 | 保留 | 没有实机出处，是估计 |
| `IconTitle` 的 `sm`、`md` | 官网只有中文 3.375rem 一种 | 按比例缩小，英文最小 0.75rem | 估计 |
| 底纹的颜色 | 白或黑，固定 | 取当前文字色 | 放进面板时跟着明暗上下文换，也能换成信号色。警戒条纹的黄黑除外 |
| 斜线网格的浓度 | 白 5–15% | 方格 8%、对角线 14%；`Shell` 里再减半 | 取自示意图。铺满整屏时要压到“细看才有”。官网的网格是 canvas 画的，取值读不到 |
| 半调的点距 | 官网的半调图量得约 15px（1920 基准），跟着视口缩放 | 固定 16px | 遮罩是一张 SVG，里面写不了 rem |
| 半调的浓度 | 浅灰的点，用叠加模式（`mix-blend-mode: overlay`）盖在画面上 | 当前文字色的 20%，普通叠放 | 跟随明暗上下文；混合模式会受层叠上下文影响 |
| 噪点、扫描线、斜线网格的取值 | 只有参数范围，没有 token | 写在主题层的工具类里 | 没有改动 `tokens.json` |
| `Glitch` 的马赛克 | 局部画面被打成色块 | 叠一层信号色的色块，不对画面本身做像素化 | CSS 没有像素化滤镜，SVG 滤镜在大面积上开销大 |
| `TiltGroup` 的摆动 | 陀螺仪 / 鼠标 | 只跟指针 | iOS 上读陀螺仪要先弹权限请求，不该由一个装饰效果发起 |
| `Icon` 的三角外框 | 全局只用 45° | 近等边三角形 | 官网干员屏的阵营徽记就是等边三角的比例；45° 的三角太扁，放不下图形 |
| `Prose` 的行长 | 官网公告正文一行约 72 个字 | 限制在 40 个字 | 一行太长不好读；用 `max-w-*` 可以改 |
| `Prose` 的 `serif`、`numbered` | 官网成段的文字都是黑体，小标题也没有 `01` 式的编号 | 作为选项保留 | 没有实机出处，是估计 |
| `Portrait` 的重影 | 另一张预先处理好的灰度图 | 默认由同一张图放大、去色、25% 得来；`ghostSrc` 可以另给一张 | 组件库不带图片 |
| `Strip` 的尺寸 | 条带固定 30rem 宽，文字用 rem | 条带设成容器，文字的位置和字号按条带的宽度走，标题最小 1rem | 条带多宽不由组件决定 |
| `Shell` 的整体缩放 | 页头的脚本按视口设根字号：横屏 `16px × min(宽 / 1920, 高 / 1080)`，竖屏 `16px × min(宽 / 750, 高 / 1334)`，整站等比缩放 | 不改根字号 | 组件不设置页面级样式；需要等比缩放时由页面自己设根字号（横屏 `min(100vw / 120, 100dvh / 67.5)`，竖屏 `min(100vw / 23.4375, 100dvh / 41.6875)`），或者调小 `--ark-shell-top`、`--ark-shell-bottom`、`--ark-shell-rail`。Storybook 里的整屏示例就是这样做的，见 [`.storybook/scale.tsx`](.storybook/scale.tsx) |
| `Shell` 的内容区 | 每屏固定一屏高，不滚动 | 内容区自己滚动 | 内容多少不由骨架决定 |
| 竖屏专用的取值 | 竖屏以 750 宽为基准，375 宽的手机上根字号是 8px：样式表里的 rem 实际只有同样数值在横屏的一半大 | 一律取官网的一半：`Shell` 的窄屏骨架、`Counter` 的竖排、`Nav` 的全屏菜单、`ScrollHint`、`Strip` 的文字块 | 组件不设根字号。折半以后，根字号 16px 时在 375 宽的手机上和官网一样大；页面要等比缩放时，竖屏的基准也相应是 375 × 667 |
| `Shell` 竖屏的常驻入口 | 首页右栏里的下载、社区、支付入口，竖屏时挪进首页的内容区 | `aside` 窄屏不显示 | 右栏只剩 2.875rem 宽，放不下；骨架不知道内容区里排了什么，要显示请自己在内容里再放一份 |
| `Shell` 竖屏的背景巨字 | 各屏位置不一样：挂在那一屏内容块的下面，情报屏不显示 | 一律挂在底带的上缘，左起 1.4375rem | 骨架不知道内容块有多高；不要巨字就不传 `ghost` |
| `Shell` 竖屏的横线 | 只有首页在下缘，其余各屏都在顶栏的下缘 | 默认和宽屏在同一边，用 `narrowLine` 另指定 | 哪一屏算“首页”由页面决定 |
| `Strip` 竖屏的小字 | 英文名 8px、`VIEW MORE` 6px（375 宽时） | 英文名不小于 12px，`VIEW MORE` 不小于 10px | 是链接上要读的字，不缩到读不清。标题、位置、横线照官网折半 |
| 场景组件的竖屏 | 设定屏直接显示一个条目和它的说明；干员屏的缩略图换成方图、名字贴着底边；新闻行另有一套字号 | `EntryList`、`ProfileShowcase`、`Thumbnail`、`ListRow` 仍是组件库自己的窄屏编排，只保证不把页面撑宽 | 每一个都是一次重新设计，这轮只照做了骨架 |
| `ScrollHint` 的颜色 | 首屏信号色，其余各屏 `#585858` | 装饰用时 `#585858`；可交互时是前景色，悬停变信号色 | `#585858` 压在黑底上不到 3:1，不能用在可点的东西上 |
| `ScrollHint` 首屏的标识 | 提示上方多一个站点标识 | 没有 | 组件库不带图片 |
| `Stagger` 的入场 | 菜单项自右 20%、每项 0.2s；设定条目自左整条、每项 0.8s | 默认自左 1.5rem、0.6s；间隔 70ms | 间隔和位移是实测值，时长取内容块入场的那一档 |
| `Loading` 的颜色 | 线和文字是 `#a4a4a4` | 次要文字色 | 跟随明暗上下文 |
| `Carousel` 的进度条 | 轨道左侧接一段 12rem 的渐隐线 | 没有这段线 | 那是官网版式的一部分，由页面自己决定 |
| `Carousel` 的自动轮播 | 官网自动轮播 | 默认关闭；打开后带暂停按钮 | 自动更新的内容要能暂停（WCAG 2.2.2） |
| `ProfileShowcase` 的中文名 | 代号 Heavy、字距 -0.1em | Bold、不收字距 | 这是官网的实测值；`Codename` 默认是游戏里的写法 |
| `Countdown` 超过一天 | `HH:MM:SS` | 小时不封顶（`51:00:09`），可以用 `format` 改写 | 文档没有说 |
| `Thumbnail` 的白框 | 官网的白框在图片后面，从立绘透明的地方露出来 | 压在图片上面 | 使用方的图不一定有透明底 |
| `Thumbnail` 切换时的闪白 | 官网换人时缩略图闪一下白 | 没有 | 闪烁类的动效能省则省 |
| `EntryList` 的入场 | 官网是整条从屏幕外滑进来（`translateX(-100%)`，0.8s） | 沿用入场动效的 1rem 位移，时长照 0.8s | 列表不一定贴着屏幕的左边 |
| `Carousel` 的翻页按钮和计数 | 官网的轮播上没有 | 有 | 键盘和读屏需要 |
| `KeyValue` 的强调色 | 读到的那篇公告用红色（`#c0392b`） | `color="signal"`，跟随信号色 | 每期一个主题色 |
| `NumberedSection` 的编号 | 公告正文用“一、”“二、” | 默认是数据体的 `01`；`number` 也接受字符串 | `01` 式的编号是界面语言的延伸，没有实机出处 |
| `TimeRange` 的年份 | 模板里不带年份 | 默认不带，`year` 打开 | 跨年的活动需要 |
| `ProfileShowcase` 缺的几样 | 官网干员屏还有阵营切换、语音播放条（带语种下拉）、名字背后的英文名、缩略图下面的滚动条 | 没有 | 新补的。英文名那一层可以先用 `GhostTitle` 垫在名字后面 |
| `Callout` 选中以后 | 官网泰拉万象屏选中物件后，标题组换成那个栏目的，并出现“查看详情”的主按钮；点进去是整页的二级页 | 只有标注本身的两种状态 | 那是页面的编排，由使用方用 `Heading`、`Button` 拼 |
| `Drawer` 与返回 | 抽屉开着时点返回，应当先关抽屉（文档对照原文改过这一条） | `Escape` 关抽屉；页面上的返回按钮怎么接由使用方决定 | 组件不知道页面的返回按钮在哪 |
| `Shell` 右栏挂的东西 | 官网干员屏的阵营切换贴在右栏竖线的右侧、底边压在横线上 | `aside` 只是右栏里的一块内容区 | 要挂在线上，由使用方自己定位 |

还有几个组件没有取到实机证据，维持着文档里估计的写法：`CornerMarks`、`Barcode`、`Glitch`、`Parallax`、`CountUp`。

### 游戏入口

这些行原样保留，说的是 `@arknights-ui/react/game` 里的组件：

| 位置 | 文档 | 实现 | 原因 |
| --- | --- | --- | --- |
| `Badge` 在面板角上 | 菱形完整地骑在角上 | `EntryPanel`、`RoomCard` 会裁掉探出去的一半，剩一个橙色的角 | 这两个组件要裁掉水印和背景图；实机的邮件图标上也是这样 |
| `ResourceBar` 的名称 | 实机没有文字名称 | 有图标时只读给读屏，没有图标时显示 | 组件库不带图标；图标不能没有名称 |
| `BackHome` 的宽度 | 实机裁图 142px 与 208px 宽（720p） | 9rem 与 13rem，竖屏收窄到 6rem 与 8rem | 竖屏放不下两块原宽 |
| `QuickNav` 的英文小字 | 实机没有英文 | 默认不显示，给了 `sub` 才有，`0.75rem` | 需要中英成对时可以打开 |
| `QuickNav` 的图标 | 实机每一项都有图标 | 由使用方传入，不给就只有名称 | 组件库不带图标 |
| `ActionButton` 的主色 | 实机是蓝底白字（`#0098dc`） | 跟随 `--ark-signal`，默认青蓝底黑字 | 白字压在这个蓝上只有 3.2:1，只够大号粗体用；需要时覆盖 `--ark-signal` 和 `--ark-on-signal` |
| `EntryPanel` 的悬停 | 游戏内没有悬停 | 石墨变浅灰、纸白变信号色，字换成深色 | 与成对的 `Button` 一致：悬停整块换色 |
| `EntryPanel` 的文字投影 | 社区复刻给大标题 `5px 5px 0 #8b8b8b` | 只有石墨面板上的入口名带硬投影 | 实机的纸白面板和蓝色面板上没有投影 |
| `EntryPanel` 的蓝 | 实机是蓝底白字（`#0da1d1`，约 3:1） | `tone="signal"`：信号色配它自己的前景色 | 同 `ActionButton` |
| `EntryPanel` 右上角的数值 | 实机的理智是入口名左边一块带底的大数字 | `aside` 放在右上角 | 入口名贴左上，右上角是剩下的空处 |
| `EntryGrid` 的行高 | 最大 / 中 / 小 | 基准行高的 2 倍、1.5 倍、1 倍 | 文档只给了相对大小，按线框折算 |
| `StageMap` 的连线 | 实机是两点之间直连的白线，角度任意 | 支线是“水平 → 45° → 水平”的折线；通向未解锁关卡的是暗的虚线 | 连线不测量 DOM，固定成 45° 才画得准；虚线是明暗之外的第二种标记 |
| `StageNode` 的六边形 | 实机压在白条的左端 | 压在一格黑底上 | 信号色在白底上不到 2:1 |
| `StageNode` 选中 | 黑底白字 | 再加一圈 1px 的白边 | 实机的地图是亮的；压在深色背景上时黑条的边界会消失 |
| `StageNode` 右端的缩略图 | 实机每个节点右端有一个圆形的掉落图 | 没有 | 组件库不带图片 |
| `StageMap` 的列距 | 未指定 | 固定为行距的 2 倍 | 连线不测量 DOM，比例固定才能保证斜线是 45° |
| `HudCounter` 的图标 | 实机的击杀图标下面压着一行极小的 `ENEMY` | 没有这行字 | 太小，读不清；名称另外读给读屏 |
| `DeployCard` 的色线 | 实机的卡片顶端和底边各有一条色线 | 没有 | 黄、蓝、绿各自代表什么没有弄清 |
| `DeployCard` 的干员名 | 卡面上没有文字 | 名字和状态只读给读屏 | 卡面太小放不下；图标不能没有名称 |
| `RoomCard` 的提醒 | 实机是右上角一个圆形的图标气泡，加一圈类型色的光晕 | 一圈类型色描边，加橙色的角或计数色块 | 沿用 `Badge`；不做光晕 |
| `RoomCard`、`ProductCard` 的圆角 | 实机的房间卡片、商品卡片有很小的圆角，购买按钮是圆头的。文档在 2026-10-14 改了措辞：骨架上的东西直角，圆角只给少数功能性的小件，清单见[几何语言](../../docs/foundations/geometry.md#圆角出现在哪) | 直角 | 组件还没有跟着改。要照实机做，给这两个组件加 `rounded-ark-subtle`（2px）即可 |
| `OperatorAvatar` 的圆环 | 圆环表达效果优劣 | 走过的比例是 `buffLevel / buffMax`，默认分三级 | 文档没有给档位 |
| `MoodBar` 的阈值 | 低于阈值转红 | 默认是上限的四分之一；低的时候同时换成斜纹 | 文档没有给数值；状态不只靠颜色区分 |
| `MoodBar` 带字款的灰 | 实机没填到的部分是中灰 | `gray-600` | 白字压在中灰上不到 4.5:1 |
| `ProductCard` 的售罄 | 整张卡片褪色，斜盖一条暗红的带 | 商品图和价格带褪色，名称带换成灰底深字；斜带照做（−12°） | 名字仍然要读得清 |
| `ProductCard` 的默认表面 | 实机的商品卡片是白的 | 默认石墨，`tone="paper"` 换成纸白 | 石墨是游戏界面里其余所有东西的默认容器 |
| `ProductCard` 的限时角标 | 商店里没有取到限时商品的图 | 橙色的小标签 | 估计。实机上见到的限时标记只有主界面上绿色圆头的小块 |
| `Banner` 的行动按钮 | 两个并排 | 放在文字对面的下角，放不下时折行 | 文档没有给位置 |
| `DialogueBox` 的字号 | 说话人较小 | 说话人 1rem，正文 1.25rem | 文档没有给数值 |
| `ChapterTitle` 的字体 | Didot、Bodoni、Trajan 一类 | 英文衬线的字体栈，用 `--ark-chapter-font` 换 | 这些字体不随包分发 |
| `ClassFilter`、`AttributeList` 的名称 | 实机只有图标，没有文字 | 默认显示名称；`iconOnly`、给了 `icon` 才只读给读屏 | 组件库不带图标；图标不能没有名称 |
| `ClassFilter` 的选中 | 实机是蓝色（旧版弹层是蓝色实底白字） | 信号色实底配它自己的前景色 | 同 `ActionButton` |
| `OperatorCard` 的底边色条 | 实机只有左下角一小段稀有度色的箭头纹 | 一整条 4px 的色条 | 星数之外的第二种编码，卡片很小时也看得清 |
| `OperatorCard` 的精英化 | 实机是一枚徽记 | `E1`、`E2` 的小标 | 组件库不带图标 |
| `SkillSlot` 的描边 | 实机的当前技能只有右上角的蓝色三角加对勾 | 三角之外保留一圈信号色描边 | 格子里的图形由使用方给，颜色不可控时描边更稳 |

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
| `pnpm build` | 重新生成 tokens，再构建 `dist/`：`index.js`、`game.js`、`styles.css`、`game.css`、`theme.css` |

目录：

```
src/
  index.ts          主入口
  components/       主入口的组件，一个组件一个目录（组件、测试、Story、index.ts）
  game/             游戏入口的组件和它们的整屏示例
  internal/         不导出的共用件：图标、单选组、表单项的接线、方向键处理
  utils/            cn、颜色与表面、浮层定位、受控状态、日期…
  styles/           theme.css（主题层）、index.css / game.css（两个预编译入口）
```

写组件时注意：

- **先按网页想。** 主入口的组件要在两套主题下都成立，有 `size` 的给全档位，响应用宽度或容器查询。实机的取值是参考，不是要求；照实机做的东西放 `src/game/`。
- 类名只写完整的静态字符串。Tailwind 按纯文本扫描源码，拼出来的类名不会生成样式。
- 不依赖全局重置。预编译样式表不带 Preflight，元素自带的边距、边框、`box-sizing` 要在类里写全（Storybook 也是这样配置的，看到的就是真实表现）。
- 颜色只用语义键（`bg-ark-surface`、`bg-ark-control`、`text-ark-fg`、`bg-ark-signal`、`border-ark-rule` 等），它们会跟随主题和明暗上下文。固定语义的颜色（稀有度、提示级别）才直接取调色板；压在图片上的东西（`Scrim`、`Strip`、`Carousel`）可以写死深色。
- 语义层的取值在 [`tokens.json`](../../tokens/tokens.json) 的 `theme` 里，暗、亮各一套，键名必须相同；`tokens.css` 里的选择器（`data-ark-theme`、`data-ark-tone`，以及 `inverse` 用的 `--ark-inv-*`）由 [`scripts/build-tokens.mjs`](../../scripts/build-tokens.mjs) 生成。没有用 `light-dark()`：它经 Tailwind 的构建链降级后，子树能不能正常翻面没有验证过。
- 表面的类和要设的明暗上下文在 [`src/utils/surface.ts`](src/utils/surface.ts)，颜色强调的类在 [`src/utils/color.ts`](src/utils/color.ts)，控件尺寸、焦点轮廓、点击区在 [`src/utils/classes.ts`](src/utils/classes.ts)。
- 切角把背景画在 `::before` 上再裁切（`before:ark-cut-tr-md`），不要直接裁根元素。主题层里的四个斜边工具类（`ark-slant-*`）没有组件在用，留给使用方做装饰。
- 表单控件：原生输入框铺在外观上面、`opacity-0`，外观画在它后面的兄弟元素上，用 `peer-*` 读它的状态。放进 `Field` 的接线用 [`src/internal/field.ts`](src/internal/field.ts) 的 `useFieldControl`（单个控件）或 `useFieldGroup`（一组）。
- 浮层用 [`src/utils/useFloating.ts`](src/utils/useFloating.ts)：浮层按 `open` 条件渲染，带 `popover="manual"`，`showPopover()` 要加守卫（测试用的 happy-dom 没有它）。点外面、Esc 的关闭在 hook 里。
- 弹层用 [`src/utils/useModalDialog.ts`](src/utils/useModalDialog.ts)。点遮罩靠“事件目标是 `<dialog>` 自身”来判断，所以内容要铺满 `<dialog>`，底色、描边都画在里面那一层。
- 有“当前项”的组件用 [`src/utils/useControllableState.ts`](src/utils/useControllableState.ts) 处理受控 / 非受控；“只有一项在 Tab 序列里、其余用方向键到达”的键盘处理在 [`src/internal/roving.ts`](src/internal/roving.ts)。
- 按子元素逐个摆位的组件用 `toItems()`。它不展开 Fragment，测试和 Story 里要传数组。
- 日期和时间的解析在 [`src/utils/date.ts`](src/utils/date.ts)：`YYYY-MM-DD` 开头的字符串按字面取，不经过 `Date`，服务端和浏览器的结果才一定相同。
- 动画都定义在 [`src/styles/theme.css`](src/styles/theme.css)。只动透明度的 `animate-ark-fade-in` 可以直接用，其余都要包在 `motion-safe:` 里。复杂的 CSS 写成工具类（`ark-pattern-*`、`ark-prose`…），组件里只引用类名。
- [`src/utils/cn.ts`](src/utils/cn.ts) 里去掉了 tailwind-merge“字号会连行高一起覆盖”的规则。`tokens.json` 里增删字号、字重、投影后，要同步这里登记的键名，测试会提醒。
- 要把一行字裁掉固定的一截（`Counter` 的大数字、`GhostTitle` 的 `clip`），不要用“行高比字矮再裁掉溢出”：让字（行高设为 0）和一个空的占位块在 `flex` 里按基线对齐，占位块的高度用 `cap` 单位写。
- 半调的遮罩是一张内联 SVG，由 [`src/internal/halftone.ts`](src/internal/halftone.ts) 生成。`tokens.json` 里 `pattern.halftone` 的值是它的一份输出，改了生成的函数要把这个值一起换掉，测试会提醒。
- JS 驱动的动效用 `src/utils/` 里的三个 hook：`useReducedMotion`、`useInView`、`useOffset`。监听挂在 effect 里，通过 CSS 变量改样式，不走 React 状态。
- 测试断言语义（角色、可访问名、状态、`data-*`），少断言类名：外观一改，按类名写的断言会成片地坏。一个组件一份测试文件。
- 属性是联合类型的组件（`Button`、`ListRow`、`Strip`、`ScrollHint`、`MenuItem`、`BreadcrumbItem`），Story 里不要用 `decorators`，否则参数类型会被推成 `never`。
- Story 里的图片用 [`.storybook/art.ts`](.storybook/art.ts) 生成的占位图，不要引入任何图片文件；图标用 [`.storybook/glyphs.tsx`](.storybook/glyphs.tsx) 里自绘的几何图形。Storybook 的工具栏可以切主题和信号色；标题在 `游戏/` 下的 Story 固定是暗色。
- 按整屏设计的示例（官网分屏、游戏入口的那几页）在 meta 上挂 [`.storybook/scale.tsx`](.storybook/scale.tsx) 的 `fitScreen`，根字号随画布等比缩放。网页 / 应用的示例不缩放，靠自己的响应式排进画布。
- 测试里要控制 `matchMedia`、`IntersectionObserver` 的结果时，用 [`src/internal/testing.ts`](src/internal/testing.ts) 里的替身。按帧走的逻辑用假定时器时，要把 `requestAnimationFrame` 和 `performance` 一起列进 `toFake`。
- Storybook 的无障碍面板不对 `GhostTitle`、`MicroText` 做对比度检查（见 `.storybook/preview.tsx`）。另外 axe 看不到 `::backdrop`，弹层打开时可能误报对比度不足。
- Storybook 运行期间新建的文件，里面的类可能不会立刻生成样式。重启 Storybook。
