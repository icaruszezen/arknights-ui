# 衍生品牌

> 同一家公司的几个站点，共用一套字体家族和双语习惯，各自换一个主色和一种明暗。

实测对象均为各站首页，2026-10-06，视口 1280 × 720，读取页面加载的字体与高频颜色。只统计了首页，结论是粗粒度的。

## 总览

| 站点 | 明暗 | 主色 | 标志性字体 | 气质 |
| --- | --- | --- | --- | --- |
| [明日方舟官网](https://ak.hypergryph.com/) | 暗 `#000000` | 青蓝 `#18d1ff` | Oswald、Novecento Sans Wide、Bender、思源黑体 | 工业、终端 |
| [塞壬唱片](https://monster-siren.hypergryph.com/) | 暗 `#09090b` | 无彩色，冷灰 `#c6c9ce` | Geometos、Novecento Sans Wide、Bender、思源宋体、思源黑体 | 唱片厂牌、冷峻 |
| [泰拉记事社 / 鹰角漫画](https://terra-historicus.hypergryph.com/) | 亮 `#ffffff` | 绯红 `#b0243b` + 明黄 `#fff000` | Geometos、Gilroy ExtraBold、Novecento Sans Wide、思源黑体 | 出版物、漫画刊物 |
| [鹰角网络官网](https://www.hypergryph.com/) | 暗，黑 88% 面板 | 无彩色，黑白 | Geometos、Bender、思源黑体 | 公司门面、极简 |
| [森空岛](https://www.skland.com/) | 亮 `#f2f2f2` | 青柠 `#c8eb21` / `#90c208` | Akrobat、Novecento Sans Wide、系统黑体 | 社区、工具 |

## 共同点

**1. 字体家族贯穿始终。** 五个站点里，Novecento Sans Wide 出现在四个，思源黑体（或其等价的 Noto Sans SC）出现在全部，Bender 与 Geometos 各出现在三个。换站点时主色和明暗都变了，但一看字就知道是同一家。

**2. 双语标题。** 鹰角官网的栏目是“关于我们 ABOUT US”“作品 PROJECTS”“加入我们 CAREER”“联系我们 CONTACT US”；漫画站的导航是英文的 `ABOUT TERRA`；塞壬唱片的站点标题带一句英文标语。中英成对是公司层面的习惯，不只是《明日方舟》一个产品的风格。

**3. 一站一色（或无色）。** 每个站点至多一组主色，其余全部是黑白灰。两个最“公司”的站点（鹰角官网、塞壬唱片）干脆不用彩色。

**4. 直角与细线。** 都没有大圆角；分区靠细线和明暗。

## 各站要点

### 塞壬唱片 Monster Siren Records

游戏内音乐的发行厂牌，站点是一个带播放器的音乐站。

| 项 | 实测 |
| --- | --- |
| 底色 | `#09090b`（比官网的纯黑略带一点蓝） |
| 主文字 | `#c6c9ce`（冷灰，而不是纯白） |
| 面板 | `rgba(45,46,47,.8)`、`rgba(6,6,6,.8)` 等半透明深色 |
| 字体 | Geometos（英文展示）、Novecento Sans Wide（Normal / UltraLight）、Bender、思源宋体 CN（Heavy / Regular）、思源黑体 CN（Regular / Medium / Bold） |

- 与官网最大的不同是**整体无彩色**，文字也压成冷灰，更安静。
- **思源宋体**在这里正式登场，用于需要“质感”的标题，与 Geometos 这种几何展示体搭配。
- Novecento 用到了 UltraLight 字重——极细的宽体大写，是唱片封面式的排法。

对应 token：`--ark-color-brand-siren-bg`、`--ark-color-brand-siren-text`。

### 泰拉记事社 Terra Historicus

官方漫画平台。`terra-historicus.hypergryph.com` 现在会跳转到 `comic.hypergryph.com`，后者同时收录《明日方舟》与《终末地》的内容（导航为 `ABOUT TERRA` / `ABOUT TALOS-II`）。

| 项 | 实测 |
| --- | --- |
| 底色 | `#ffffff` |
| 强调色 | 绯红 `#b0243b`、明黄 `#fff000` |
| 深色块 | `#383838`、`#333333` |
| 字体 | Geometos、Gilroy ExtraBold、Novecento Sans Wide Bold、思源黑体 CN（Regular → Heavy） |

- 五个站点里唯一的**白底 + 双强调色**。红与黄的搭配带有印刷刊物、漫画杂志的味道。
- Gilroy ExtraBold 是一款圆润的几何无衬线体，比官网的 Oswald 亲和得多。

对应 token：`--ark-color-brand-comic-crimson`、`--ark-color-brand-comic-yellow`。

### 鹰角网络官网 Hypergryph

公司门面。

| 项 | 实测 |
| --- | --- |
| 面板 | `rgba(0,0,0,.88)` 的黑色半透明块，叠在全屏图片上 |
| 文字 | `#ffffff` |
| 字体 | 思源黑体（Regular / Bold）、Noto Sans SC、Geometos、Bender |
| 结构 | 全屏轮播 + 关于我们 / 作品 / 加入我们 / 联系我们 四段，每段中英双语标题 |

- 最克制的一个：黑、白、图片，没有品牌色。
- 88% 不透明度的黑色面板是一个值得记下的数值——比纯黑透一点，能隐约看到下面的图。

### 森空岛 Skland

官方玩家社区，是一个内容与工具型的产品（帖子、攻略、签到、数据查询）。

| 项 | 实测 |
| --- | --- |
| 底色 | `#f2f2f2`、`#f6f6f6`、`#ffffff` |
| 文字 | `#222222`，并用 25% / 50% / 70% 三档不透明度区分层级 |
| 主色 | 青柠 `#c8eb21`（实心块）、`#90c208`（文字） |
| 字体 | 正文用系统黑体栈（PingFang SC、Noto Sans SC…）；另加载 Akrobat、Novecento Sans Wide 等展示体 |

- **正文回到系统字体。** 社区产品的可读性和加载速度优先，品牌字体只用于标题和数字。
- **用不透明度做文字层级**（同一个 `#222222` 的 25% / 50% / 70% / 100%），比定义四个灰色更容易维护。
- 青柠色作为实心块时配深色文字；作为文字时换成更深的 `#90c208` 以保证对比度——同一个品牌色准备两个明度。

对应 token：`--ark-color-brand-skland-lime`、`--ark-color-brand-skland-lime-deep`、`--ark-color-brand-skland-bg`、`--ark-color-brand-skland-text`。

### 游戏内的“衍生”

- **界面主题**：同一套结构的多种皮肤，见 [游戏 · 界面主题](game/themes.md)。
- **虚构时装品牌**：见 [宣传物料](promotional.md#7-虚构品牌的完整识别)。
- **周边品牌**：分析文章提到鹰角另设有独立的周边子品牌，跳出游戏本身建立新的品牌识别。本仓库未作调研。

## 做多品牌 / 多产品时可借鉴的做法

1. **用字体家族做“血缘”。** 颜色和明暗可以随产品变，字体保持一致。
2. **按产品性质决定明暗。** 沉浸型（游戏、音乐）用暗色；阅读与工具型（漫画、社区）用亮色。
3. **主色准备两个明度。** 一个做色块，一个做文字。
4. **工具型产品的正文用系统字体。**
5. **公司门面可以没有品牌色。** 黑白 + 好图片就够了。

## 官方参考

| 站点 | 链接 |
| --- | --- |
| 明日方舟官网 | <https://ak.hypergryph.com/> |
| 塞壬唱片 | <https://monster-siren.hypergryph.com/> |
| 泰拉记事社 | <https://terra-historicus.hypergryph.com/> |
| 鹰角网络 | <https://www.hypergryph.com/> |
| 森空岛 | <https://www.skland.com/> |

## 来源

- 各站首页实测（2026-10-06）
- [从 TA 的视角看 UI #1](https://zhuanlan.zhihu.com/p/570566718)（品牌布局）
