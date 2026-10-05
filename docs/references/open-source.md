# 开源项目盘点

GitHub 上与《明日方舟》视觉风格相关的开源项目。数据通过 GitHub API 查询于 2026-10-06，星数与更新时间会变化。

> 表中“含官方素材”一栏标注该仓库是否直接存放了游戏立绘、界面贴图等。这类仓库可以读代码学写法，但不要把其中的素材复制到自己的公开项目里。

## 一、设计系统与组件

把风格抽象成规则、token 或可复用组件的项目。最值得读。

| 项目 | ★ | 许可 | 技术 | 最近更新 | 含官方素材 | 一句话 |
| --- | --- | --- | --- | --- | --- | --- |
| [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui) | 58 | MIT | SCSS / Vue | 2026-09 | 否 | 非官方的风格基础：语义 token、框架无关的 CSS、组件准则、可安装的 Agent Skill |
| [Cromemadnd/ArknightsUI-React-Template](https://github.com/Cromemadnd/ArknightsUI-React-Template) | 10 | MIT | React 19 / Tailwind / Headless UI | 2025-04 | 部分（背景与音频取自 PRTS，注明来源） | 主界面风格的 React 模板，含鼠标驱动的 3D 变换 |
| [SeptThirteen/Arknights-UI-Style](https://github.com/SeptThirteen/Arknights-UI-Style) | 0 | 未声明 | 原生 HTML / CSS / JS | 2026-09 | 否 | 终端风格个人主页：斜切角、警示条纹、点阵、编号徽章、双语区块标题 |
| [tkesgar/ark-royal](https://github.com/tkesgar/ark-royal) | 4 | MIT | React | 2020-01 | 是（截图） | 生成自定义角色的仿游戏截图 |

### 重点：ak-ui

[文档站](https://ak-ui.yyj.moe/) · [设计语言](https://ak-ui.yyj.moe/en/guide/design-language.html) · [Design tokens](https://ak-ui.yyj.moe/en/guide/tokens.html) · [官网 UI 研究](https://ak-ui.yyj.moe/en/guide/official-site-study.html)

这是目前思路最完整的一个。它明确声明目标不是逐像素复刻某个游戏画面，而是把背后的工业几何与战术信息语言转化为可适配其他产品的约束。可借鉴之处：

- **语义 token 分层。** 调色板（`--ak-color-*`）与语义角色（`--ak-surface-*`、`--ak-text-*`、`--ak-signal-*`）分开；组件只引用语义层。
- **三级风格强度。** `accent`（点到为止）/ `system`（完整组件语言，默认）/ `terminal`（沉浸式）。同一套规则可以轻用也可以重用。
- **六条原则。** 层级先于装饰；不对称而有目的的几何；颜色即信号；排版承担结构；分层的表面；果断的交互反馈。
- **常见失败模式清单。** 例如：不分青红皂白的黑底青边发光；每个元素都切角、倾斜、编号、大写；以“游戏感密度”为由把控件做得很小；把桌面布局原样缩到手机。
- **原创性边界。** 只使用原创、已授权或用户提供的图像；不复制游戏 Logo、立绘、纹理、图标。
- **官网实测文档。** 记录了测量日期、视口和具体数值，并注明哪些是实测、哪些是自己的设计决定。

它的取值（供对照，非官方）：

| 项 | 值 |
| --- | --- |
| 蓝 / 黄 | `#2bf` / `#ffd802` |
| 深蓝 / 浅蓝 | `#0075a8` / `#3ff7ff` |
| 材料档位五色 | `#9c9c9c` `#d8dd5a` `#4aabea` `#cfc2d1` `#f1c644` |
| 强调橙 | `#f6540e` |
| 画布 / 反色面 | `#111315` / `#17191b` |
| 切角三档 | `0.375rem` / `0.75rem` / `1.5rem` |
| 动效三档 | `120ms` / `200ms` / `420ms` |
| 缓动 | `cubic-bezier(0.2, 0, 0, 1)`、`cubic-bezier(0.2, 0.8, 0.2, 1)` |
| 透视 | `30em` |
| 字体 | Noto Sans SC、Noto Serif SC、等宽系统栈 |

## 二、界面复刻

以还原游戏主界面为目标的项目。适合学习具体的 CSS 实现（尤其是透视）。

| 项目 | ★ | 许可 | 技术 | 最近更新 | 含官方素材 | 一句话 |
| --- | --- | --- | --- | --- | --- | --- |
| [mashirozx/arknights-ui](https://github.com/mashirozx/arknights-ui) | 388 | MIT | HTML / CSS | 2023-01 | 是（README 注明素材为逆向所得，仅供学习，请勿商用） | H5 复刻的游戏主界面，这一类项目的源头。[Demo](https://mashirozx.github.io/arknights-ui/) |
| [ngc7331/arknights-ui-remastered](https://github.com/ngc7331/arknights-ui-remastered) | 21 | MIT | CSS / Vue | 2022-06 | 是 | 上一项的重制版 |
| [kyuna0312/kyuna_arknights_ui](https://github.com/kyuna0312/kyuna_arknights_ui) | 2 | 未声明 | CSS / JS | 2022-05 | 是 | 同源的 H5 复刻练习 |

### 重点：mashirozx/arknights-ui

`css/styles.css` 里能直接读到主界面的关键参数：

```css
.left  { transform: perspective(30em) rotateY(10deg)  scale(0.9); }
.right { transform: perspective(30em) rotateY(-10deg) scale(0.9); }
```

| 项 | 值 |
| --- | --- |
| 浅色面板 | `#fdfdfb`、`#ebeceb`、`#e9e9e9` |
| 深色面板 | `#424242`、`#3c3c3c`、`#454545` |
| 面板文字 | `#323232`（浅底）、白（深底） |
| 蓝 / 橙 | `#05a7dc` / `#ff5e19` |
| 字体 | Noto Sans SC（信息）、Noto Serif SC（面板大字） |
| 大字投影 | `text-shadow: #8b8b8b 5px 5px 0` |
| 边框渐变 | `linear-gradient(#05a7dc, #454545, #05a7dc)` |

它证实了一件事：主界面入口的大字用的是**中文衬线体**，信息文字用黑体。

## 三、博客与站点主题

| 项目 | ★ | 许可 | 技术 | 最近更新 | 含官方素材 | 一句话 |
| --- | --- | --- | --- | --- | --- | --- |
| [Yue-plus/hexo-theme-arknights](https://github.com/Yue-plus/hexo-theme-arknights) | 873 | MIT | Hexo / Pug / Stylus | 2026-07 | 少量 | 罗德岛阵营风格的 Hexo 主题，星数最高。[Demo](https://arknights.theme.hexo.yue.zone/) |
| [valaxyjs/valaxy-theme-arknights](https://github.com/valaxyjs/valaxy-theme-arknights) | 4 | MIT | Valaxy / Vue | 2026-09 | 否（声明为原创） | 基于 ak-ui CSS Core 的 Valaxy 博客主题。[Demo](https://arknights.valaxy.site) |
| [ETOgaosion/hugo-theme-arknights](https://github.com/ETOgaosion/hugo-theme-arknights) | 3 | GPL-3.0 | Hugo | 2025-09 | 未核实 | Hugo 主题 |
| [yororoA/Ark](https://github.com/yororoA/Ark) | 1 | MIT | Next.js / React / Tailwind | 2026-10 | 未核实 | 博客 UI，开发中 |
| [bwwq/arknights-blog](https://github.com/bwwq/arknights-blog) | 6 | 未声明 | JavaScript | 2025-11 | 未核实 | 博客 |
| [Alpha1022/hexo-theme-arknights](https://github.com/Alpha1022/hexo-theme-arknights) | 6 | 未声明 | — | 2019-07 | — | 仅有设计思路的早期构想 |

### 重点：Yue-plus/hexo-theme-arknights

明 / 暗两套 CSS 变量（`source/css/_core/color/dark.styl`、`light.styl`），是“同一结构两套取值”的现成例子：

| 变量 | 暗色 | 亮色 |
| --- | --- | --- |
| 高亮 | `#2bf` | `#2bf` |
| 副色 | `#fe2` | `#fe2` |
| 强调 | `#C0392B` | `#C0392B` |
| 背景 | `#141516` | `#f4f5f6` |
| 文字 | `#c4c4c4` | `#222` |
| 半透明面 | `rgba(20,21,22,.8)` | `rgba(244,245,246,.8)` |

字体用 JetBrains Mono + Bender，过渡统一 `0.3s`——与官网实测的默认时长一致。

## 四、字体与资源索引

不是 UI 项目，但做设计调研时会用到。

| 项目 | ★ | 许可 | 最近更新 | 说明 |
| --- | --- | --- | --- | --- |
| [TimWangZi/The-font-of-Arknights](https://github.com/TimWangZi/The-font-of-Arknights) | 40 | 未声明 | 2020-06 | 整理了游戏使用的字体及其使用场合。仓库内含字体文件，各字体授权不同，使用前自行确认 |
| [Kengxxiao/ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData) | 1835 | 未声明 | 2026-09 | 游戏文本与数值数据（解包所得） |
| [yuanyan3060/ArknightsGameResource](https://github.com/yuanyan3060/ArknightsGameResource) | 588 | AGPL-3.0 | 2026-09 | 客户端素材（解包所得） |
| [isHarryh/Ark-Unpacker](https://github.com/isHarryh/Ark-Unpacker) | 693 | BSD-3-Clause | 2026-09 | 资源批量解包工具 |

> 后三项涉及解包的游戏数据与素材，版权属于鹰角网络。仓库的开源许可只覆盖其代码或整理工作，不改变素材本身的权利归属。本仓库不搬运其中任何内容。

## 五、风格化的工具类项目

不以“复刻风格”为目的，但界面有明显的同源气质，可以看风格在真实工具里如何落地。

| 项目 | ★ | 许可 | 技术 | 说明 |
| --- | --- | --- | --- | --- |
| [arkntools/arknights-toolbox](https://github.com/arkntools/arknights-toolbox) | 694 | MIT | Vue | 明日方舟工具箱。[站点](https://arkntools.app) |
| [050644zf/ArknightsStoryTextReader](https://github.com/050644zf/ArknightsStoryTextReader) | 454 | MIT | Vue | 剧情文本阅读器。[站点](https://astr.pages.dev) |
| [penguin-statistics/frontend-v2](https://github.com/penguin-statistics/frontend-v2) | 415 | MIT | Vue | 企鹅物流数据统计前端。[站点](https://penguin-stats.io) |

## 延伸：《终末地》风格

本仓库不展开《明日方舟：终末地》。其视觉语言与本体同源但更偏 HUD：酸性黄、四角切角、菱形与括号形角饰、故障与扫描动画。感兴趣可以看 [VBeatDead/ReEnd-Components](https://github.com/VBeatDead/ReEnd-Components)（MIT，React + Tailwind + Radix，70 余个组件）。

## 怎么用这些项目

| 你想做什么 | 看哪个 |
| --- | --- |
| 理解“这套风格的规则是什么” | ak-ui 的设计语言文档 |
| 抄一套可用的 token 起步 | ak-ui `_tokens.scss`、本仓库 [`tokens.json`](../../tokens/tokens.json) |
| 学主界面的 3D 透视怎么写 | mashirozx/arknights-ui `css/styles.css` |
| 做明暗双主题 | hexo-theme-arknights 的 color 目录 |
| 给 AI 编程助手一份风格约束 | ak-ui 的 `skills/ak-ui/` |
| 在 React 里起一个页面 | ArknightsUI-React-Template |
| 零依赖的单页示例 | SeptThirteen/Arknights-UI-Style |

## 观察

1. **两条路线。** 早期项目以“复刻”为主（把游戏画面搬到网页上，直接使用解包素材）；近期项目转向“提炼”（抽象规则与 token，使用原创素材）。后者更可持续，也没有版权包袱。
2. **取色高度一致。** 多个互不相关的项目都把蓝取在 `#2bf` 附近、黄取在 `#fe2`–`#ffd802`、深色面取在 `#141516`–`#424242`、透视取 `30em`。这些值可以视为社区共识。
3. **与官网实测的差异。** 官网的青蓝 `#18d1ff` 比社区常用的 `#2bf` 更偏青。前者是官网的品牌色，后者是对游戏内蓝色的近似，两者并不矛盾。
4. **字体普遍用替代品。** Noto Sans / Serif SC（等价于思源）加 JetBrains Mono 是最常见的免费组合。

## 来源

- GitHub API（`gh api repos/<owner>/<repo>`），2026-10-06
- 各仓库 README 与样式源码
