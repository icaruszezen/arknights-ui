# @arknights-ui/react

《明日方舟》风格的 React 组件库。组件的每个取值都能追溯到仓库里的 [风格指导文档](../../docs/00-overview.md) 和 [Design Tokens](../../tokens/tokens.json)。

> **非官方项目。** 与上海鹰角网络科技有限公司无关。本包不含任何官方素材：没有 Logo、立绘、图标或字体文件，图形全部是代码画的几何形状。

目前是工作区内的私有包（`private: true`），尚未发布到 npm。

## 组件

通用元素六篇文档里写到的东西都有对应的组件，基础规范里能做成组件的部分也有。场景模块的八篇（官网、主界面、干员、作战、基建、寻访与采购、剧情、宣传物料）各有一组[场景组件](#场景组件)。

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

### 场景组件

场景组件把上面的通用组件按某个模块的编排拼好。它们同样不带任何素材，立绘、头像、图标、标题标识都由使用方提供。

**[官网](../../docs/modules/website.md)**

| 组件 | 说明 |
| --- | --- |
| `Carousel` / `CarouselSlide` | 16:9 轮播，下面一条细进度条；可以自动轮播，带暂停 |
| `OperatorShowcase` | 干员屏的编排：档案式的文字，加出血的立绘和重影 |
| `ThumbnailStrip` / `Thumbnail` | 缩略图切换，当前项上方一条信号色短条；可以竖排 |
| `WorldEntryList` / `WorldEntry` | 阶梯缩进的名词条目，悬停时背后浮现巨型英文 |

**[游戏 · 主界面](../../docs/modules/game/home.md)**

| 组件 | 说明 |
| --- | --- |
| `EntryPanel` | 入口面板：重磅的中文衬线贴左下，英文注脚，右上角红点 |
| `EntryGrid` | 右面板组“一、二、三、三”的四行编排，入口的字号跟着所在的行走 |

**[游戏 · 干员](../../docs/modules/game/operator.md)**

| 组件 | 说明 |
| --- | --- |
| `OperatorCard` | 竖长的胸像卡片，信息压在四角；星数加底边色条双重编码稀有度 |
| `ClassFilter` / `ClassFilterItem` | 职业筛选：图标一排，当前项反白 |
| `AttributeList` / `Attribute` | 属性表：标签在左、数值右对齐，下方 2px 的相对值条 |
| `SkillSlot` | 技能格：黑色半透明方块，选中的换成信号色描边 |
| `Codename` | 代号排版：Heavy、字距 -0.1em，英文小字在上 |

**[游戏 · 作战](../../docs/modules/game/battle.md)**

| 组件 | 说明 |
| --- | --- |
| `StageMap` / `StageNode` | 关卡地图：带编号的节点用细线相连，支线以 45° 折线分叉 |
| `SquadSlot` | 编队里的一个位置：放一张干员卡片，空位是带加号的虚线框 |
| `CostMeter` | 费用：全屏最大的数字，上方的细条是回复进度 |
| `DeployCard` | 可部署干员卡：左上角写费用，选中上浮，费用不足或冷却时压暗 |
| `UnitBar` | 单位头顶的生命条和技力条 |
| `HudCounter` / `HudCounterItem` | 顶部正中的战况：敌方击杀数与我方生命点数 |

**[游戏 · 基建](../../docs/modules/game/base.md)**

| 组件 | 说明 |
| --- | --- |
| `RoomCard` | 房间卡片：类型色描边，房间就是入口 |
| `OperatorAvatar` | 头像格：右下角的加成图标与圆环，底边的心情条 |
| `MoodBar` | 心情条，低于阈值时转红并换成斜纹 |
| `Countdown` | 数据体的 `HH:MM:SS` 倒计时，可以自己走 |

**[游戏 · 寻访与采购中心](../../docs/modules/game/gacha-and-store.md)**

| 组件 | 说明 |
| --- | --- |
| `Banner` | 卡池横幅：多层视差，标题与规则在一侧，行动按钮在对面的下角 |
| `ProductCard` | 商品卡片：价格带、售罄、限时角标、库存与限购 |

**[游戏 · 剧情](../../docs/modules/game/story.md)**

| 组件 | 说明 |
| --- | --- |
| `DialogueBox` | 没有框的文字区：底部一片黑色渐变，说话人在左、正文在右 |
| `StoryControls` / `StoryControl` | 角落里的一组半透明小按钮 |
| `ChapterTitle` | 章节标题：拉丁衬线大写的英文，加较轻的中文和章节编号 |

**[宣传物料](../../docs/modules/promotional.md)**

| 组件 | 说明 |
| --- | --- |
| `NumberedSection` | 编号小节：数据体的两位数字、小节名、一条细线 |
| `KeyValueList` / `KeyValue` | 键值对：键偏灰，值用粗体或主题色 |
| `TimeRange` | `10月03日 16:00 - 10月17日 03:59`，数字用数据体 |

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

**类型色。** 基建里每种设施有固定的颜色，实现上就是在子树上换信号色。`RoomCard` 的 `kind` 会覆盖自己的 `--ark-signal`，放在里面的进度条、头像的加成圆环跟着换；把导出的 `roomSignal` 里同一个类加到 `Drawer` 上，颜色就从房间一路标到抽屉：

```tsx
<RoomCard kind="factory" title="制造站" onClick={() => setOpen(true)} />
<Drawer open={open} onOpenChange={setOpen} title="制造站" className={roomSignal.factory}>…</Drawer>
```

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

**选中项。** `Tabs`、`Carousel`、`ThumbnailStrip`、`ClassFilter`、`StageMap` 都有一个“当前项”，两种用法二选一：给 `value`（轮播是 `index`）就由外部决定，并在 `onValueChange` 里更新它；不给就用 `defaultValue` 让组件自己记。`ThumbnailStrip` 和 `ClassFilter` 是单选组：Tab 进到当前项，方向键移动并立即切换。

**可点的卡片。** `EntryPanel` 传入 `href` 渲染为 `<a>`，否则是 `<button>`。`OperatorCard`、`CarouselSlide`、`WorldEntry` 传入 `href` 渲染为 `<a>`；`OperatorCard`、`SkillSlot` 给了 `onClick` 渲染为 `<button>`；都不给就只是展示。`RoomCard` 和 `ProductCard` 里面可以放任意内容，所以它们的点击区是盖在上面的一层，名称来自标题；卡片里另有需要单独点的东西时，给它加 `relative z-2`。

**逐个摆位的子元素。** `EntryGrid`、`Carousel`、`StageMap`、`WorldEntryList` 会把每个子元素各放进一格。子元素要直接写在里面或者传数组；包一层 Fragment 或自定义组件就只算一个。

**装饰。** `MicroText`、`GhostTitle`、`Barcode`、`Ticks` 和 `CornerMarks` 的角标是纯装饰，默认带 `aria-hidden`，对比度有意压低。必须读到的信息不要交给它们；确实需要被读到时传 `aria-hidden={false}`。`Pattern`、`Watermark`，以及不放内容的 `Scrim`、不带链接的 `ScrollHint` 同样是装饰。`Icon` 默认也是，给了 `label` 才会被读到。场景组件里，`ChapterTitle` 的 `caption`、`AttributeList` 的相对值条、`Carousel` 的进度条都是对已有信息的第二次表述，同样对读屏隐藏。

**只给读屏的文字。** 有几处画面上只有图形和数字，名称另外读给读屏：`DeployCard` 的干员名和“费用不足”“再部署冷却”，`HudCounterItem` 的“击杀”“生命点数”，`StageNode` 的“已通关”“当前”“未解锁”，`OperatorCard` 的精英化阶段。想换一种说法时用各自的 `label` 类属性，或者直接给 `aria-label`。

**固定的位置。** `Nav`、`BackHome`、`ResourceBar`、`GhostTitle`、`Callout` 都不自己定位。文档要求它们“永远在同一个地方”，但放在哪由页面决定，用 `className` 写（如 `fixed top-0 left-0`）。`Pattern`、`Portrait`、`ScrollHint` 也是这样，作战和剧情的 `HudCounter`、`CostMeter`、`UnitBar`、`StoryControls` 同理。例外有四个：`Scrim` 默认铺满父元素，`Watermark` 默认贴在面板的一侧，`DialogueBox` 默认贴在父元素的底边，`Shell` 默认铺满视口——它本身就是那副固定的骨架。

**底纹的颜色。** 除了黄黑的警戒条纹，底纹都取当前的文字色：放进纸白面板自动变深，也可以用 `text-*` 换成信号色。`Panel` 的 `halftone` 走的是同一套。

**图片与图标。** 组件库不带任何图片和图标。`Icon`、`Watermark`、`Portrait`、`Strip` 的图都由使用方提供，请使用原创或已获授权的素材。场景组件也一样：立绘和头像（`OperatorCard`、`OperatorShowcase`、`OperatorAvatar`、`DeployCard`、`Thumbnail`）、职业与技能图标（`ClassFilterItem`、`SkillSlot`）、主视觉与商品图（`CarouselSlide`、`Banner`、`ProductCard`）、卡池的标题标识（`Banner` 的 `logo`）都要自备。Storybook 里看到的是代码画的占位图。

**动效。** 入场、数字滚动、故障、视差、摆动都遵守 `prefers-reduced-motion`：减少动效时 `Stagger` 只淡入，`CountUp` 直接显示最终值，`Glitch`、`Parallax` 和 `TiltGroup` 的摆动不启动。跟指针走的效果在触屏设备上也不启用。`Carousel` 的自动轮播默认关闭；打开后带一个暂停按钮，指针悬停、焦点在里面、页面不可见时不走，减少动效时完全不启动，换页也不做位移。

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
| `Carousel` 的进度条 | 青蓝段表示当前 | 走到第几张就涨到几分之几，用的是 `Progress` 的细条 | 线框里的青蓝段从左端画起，按累计进度处理 |
| `Carousel` 的自动轮播 | 官网自动轮播 | 默认关闭；打开后带暂停按钮 | 自动更新的内容要能暂停（WCAG 2.2.2） |
| `OperatorShowcase` 的中文名 | 代号 Heavy、字距 -0.1em | Bold、不收字距 | 这是官网的实测值；`Codename` 默认是游戏里的写法 |
| `EntryPanel` 的悬停 | 游戏内没有悬停 | 石墨变浅灰、纸白变信号色，字换成深色 | 与成对的 `Button` 一致：悬停整块换色 |
| `EntryPanel` 的文字投影 | `5px 5px 0 #8b8b8b`（大标题） | 只给纸白面板最大的一档，取 `gray-500` | 小一些的字上 5px 的偏移会糊成一片 |
| `EntryGrid` 的行高 | 最大 / 中 / 小 | 基准行高的 2 倍、1.5 倍、1 倍 | 文档只给了相对大小，按线框折算 |
| `StageMap` 的连线 | 细线相连，支线向上下分叉 | 支线是“水平 → 45° → 水平”的折线；通向未解锁关卡的是暗的虚线 | 全局只用 45°；虚线是明暗之外的第二种标记 |
| `StageMap` 的列距 | 未指定 | 固定为行距的 2 倍 | 连线不测量 DOM，比例固定才能保证斜线是 45° |
| `HudCounter`、`CostMeter` 的斜边 | 示意图里画得较缓 | 45° | 同 `BackHome` |
| `HudCounter` 的分母 | 示意图里与当前值同大 | 小而灰 | 数据展示的规则：当前值大而亮，分母小而灰 |
| `DeployCard` 的干员名 | 卡面上没有文字 | 名字和状态只读给读屏 | 卡面太小放不下；图标不能没有名称 |
| `RoomCard` 发电站的绿 | 绿，没有色值 | `--ark-color-signal-success` | token 里唯一的绿 |
| `OperatorAvatar` 的圆环 | 圆环表达效果优劣 | 走过的比例是 `buffLevel / buffMax`，默认分三级 | 文档没有给档位 |
| `MoodBar` 的阈值 | 低于阈值转红 | 默认是上限的四分之一；低的时候同时换成斜纹 | 文档没有给数值；状态不只靠颜色区分 |
| `Countdown` 超过一天 | `HH:MM:SS` | 小时不封顶（`51:00:09`），可以用 `format` 改写 | 文档没有说 |
| `ProductCard` 的售罄 | 整体压暗并盖上标记 | 只压暗商品图和价格，标记是一条不旋转的横带 | 名字和库存仍然要读得清；全局只用 45°，印章式的小角度不在这套语言里 |
| `Banner` 的行动按钮 | 两个并排 | 放在文字对面的下角，放不下时折行 | 文档没有给位置 |
| `DialogueBox` 的字号 | 说话人较小 | 说话人 1rem，正文 1.25rem | 文档没有给数值 |
| `ChapterTitle` 的字体 | Didot、Bodoni、Trajan 一类 | 英文衬线的字体栈，用 `--ark-chapter-font` 换 | 这些字体不随包分发 |
| `ClassFilter`、`ThumbnailStrip` 的语义 | 未指定 | 单选组，方向键切换 | 同一时刻只有一个当前项 |
| `TimeRange` 的年份 | 模板里不带年份 | 默认不带，`year` 打开 | 跨年的活动需要 |

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
- 切角、斜边把背景画在 `::before` 上再裁切（`before:ark-cut-tr-md`、`before:ark-slant-r`），不要直接裁根元素。斜边有四种：`ark-slant-r`、`ark-slant-x`，以及 HUD 底板用的 `ark-slant-l`（只斜左边）和 `ark-slant-in`（倒梯形）；水平偏移取 `--ark-slant`，要设成元素自身的高度才是 45°。
- 根元素可能是 `<button>` 的组件（`OperatorCard`、`EntryPanel`、`DeployCard`、`SkillSlot`），里面只放 `<span>`、`<img>` 这类行内元素，不套根是 `<div>` 的组件。内容槽开放的卡片（`RoomCard`、`ProductCard`）把点击区做成盖在上面的一层空按钮或空链接，用 `aria-labelledby` 取名。
- 有“当前项”的组件用 [`src/utils/useControllableState.ts`](src/utils/useControllableState.ts) 处理受控 / 非受控；单选组的上下文和方向键处理在 [`src/internal/radioGroup.tsx`](src/internal/radioGroup.tsx)。
- 按子元素逐个摆位的组件用 `toItems()`。它不展开 Fragment，测试和 Story 里要传数组。`StageMap` 还会读子元素的属性来算位置和连线，所以节点必须是直接子元素。
- 日期和时间的解析在 [`src/utils/date.ts`](src/utils/date.ts)：`YYYY-MM-DD` 开头的字符串按字面取，不经过 `Date`，服务端和浏览器的结果才一定相同。
- 弹层用 [`src/utils/useModalDialog.ts`](src/utils/useModalDialog.ts)。点遮罩靠“事件目标是 `<dialog>` 自身”来判断，所以内容要铺满 `<dialog>`，底色、描边都画在里面那一层。
- 动画都定义在 [`src/styles/theme.css`](src/styles/theme.css)：`animate-ark-spin`、`animate-ark-blink`、`animate-ark-fade-in`，入场的 `animate-ark-enter-left` / `-right` / `-up`，滚动提示的 `animate-ark-bob`，故障的 `animate-ark-glitch`（及 `-bars`、`-mosaic`）。只动透明度的 `fade-in` 可以直接用，其余都要包在 `motion-safe:` 里。
- 底纹、透视、视差图层、长文本的样式也是主题层里的工具类（`ark-pattern-*`、`ark-tilt`、`ark-parallax-layer`、`ark-prose`），和 `ark-cut-*` 一样可以带变体（`after:ark-pattern-halftone`）。复杂的 CSS 写成工具类，组件里只引用类名。
- JS 驱动的动效用 `src/utils/` 里的三个 hook：`useReducedMotion`、`useInView`、`useOffset`。监听挂在 effect 里，通过 CSS 变量改样式，不走 React 状态。
- 属性是联合类型的组件（`Button`、`ActionButton`、`ListRow`、`Strip`、`ScrollHint`），Story 里不要用 `decorators`，否则参数类型会被推成 `never`。
- Story 里的图片用 [`.storybook/art.ts`](.storybook/art.ts) 生成的占位图，不要引入任何图片文件；图标用 [`.storybook/glyphs.tsx`](.storybook/glyphs.tsx) 里自绘的几何图形。
- 测试里要控制 `matchMedia`、`IntersectionObserver` 的结果时，用 [`src/internal/testing.ts`](src/internal/testing.ts) 里的替身。数字滚动、指针跟随这类按帧走的逻辑，用假定时器时要把 `requestAnimationFrame` 和 `performance` 一起列进 `toFake`。
- Storybook 的无障碍面板不对 `GhostTitle`、`MicroText` 做对比度检查（见 `.storybook/preview.tsx`）。另外 axe 看不到 `::backdrop`，弹层打开时可能误报对比度不足。
- Storybook 运行期间新建的文件，里面的类可能不会立刻生成样式。保存一次任意已有的源文件，或重启 Storybook。

`tokens.json` 里增删字号、字重、投影后，要同步 [`src/utils/cn.ts`](src/utils/cn.ts) 里登记的键名，测试会提醒。
