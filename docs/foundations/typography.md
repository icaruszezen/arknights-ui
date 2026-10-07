# 字体与排版

> 英文窄体做骨架，中文粗黑做主体，伪等宽体写数据。中英两行一组，是最容易辨认的“舟味”。

## 特征拆解

**1. 每种字体只做一件事。** 官网一共加载了四个字族，分工非常清楚：

| 角色 | 官网实际字体 | 用在哪 |
| --- | --- | --- |
| 窄体英文 | Oswald（Medium / DemiBold） | 导航、栏目标签、背景幽灵标题 |
| 宽体英文 | Novecento Sans Wide（Medium → UltraBold） | 品牌大字、与中文大标题配对的英文、微缩装饰文字 |
| 数据体 | Bender（Regular / Bold） | 日期、计数、编号、READ MORE |
| 中文 | 思源黑体（Regular → Heavy） | 全部中文 |

游戏内另有两个角色：**中文衬线**（思源宋体，用于主界面的大号指令和章节标题）与**英文衬线**（Times New Roman、Georgia，以及章节标题里的 Didot / Bodoni 式现代衬线和后来的 Trajan，用于剧情与正式语境）。

**2. 中英成组，英文不是翻译而是结构。** 导航是“英文在上 22px、中文在下 14px”；大标题是“英文宽体在上、中文粗黑在下”；游戏主界面的旧版是“中文大字 + 英文小注脚”（现行界面把小字换成了同一种语言的灰色小字，如“干员 / 角色管理”）。两种文字的字号永远不相等，一主一辅，形成固定的节奏。

**3. 行高压到 1。** 官网样式表中 `line-height: 1` 出现的次数是其他值的两倍以上。标题、标签、数字一律不留行间空白，块与块之间的距离由间距控制。只有正文段落使用 1.6。

**4. 字距是一种表情。** 巨型幽灵标题收紧到 `-0.05em`；干员代号收紧到约 `-0.1em`（社区整理：思源黑体 Heavy、字间距 -100）；微缩装饰英文反向拉开到 `0.5em`；栏目标签微拉到 `0.1em`。

**5. 字号跨度极大。** 同一屏里最大的字（7rem 的幽灵标题）与最小的字（0.375rem 的装饰英文）相差近 19 倍。中间档位并不多，层级靠“跳”而不是“渐变”。

**6. 数字的写法是设计的一部分。** 日期写作 `2026 // 10 / 03`，双斜杠与单斜杠混用；计数写作 `01 // 01 / 05`，带前导零和总数。详见 [装饰元素](../elements/decorations.md)。

**7. 衬线体用来制造“警戒”与“庄重”。** 游戏主界面的“作战”“编队”等大字是重磅中文衬线，笔画粗细对比强，与工业场景搭配时有告示牌的意味。章节标题则用拉丁衬线传达势力气质：早期章节用现代衬线，后续章节换成更古典的 Trajan 并收紧字距，与设定更贴合。

## 规范

### 字体栈

| 角色 | 字体栈 | Token | 可信度 |
| --- | --- | --- | --- |
| 窄体英文 | `"Oswald", "Bahnschrift", "Arial Narrow", sans-serif` | `--ark-font-family-latin-condensed` | 实测 |
| 宽体英文 | `"Novecento Sans Wide", "Montserrat", sans-serif` | `--ark-font-family-latin-wide` | 实测 |
| 数据体 | `"Bender", "JetBrains Mono", Consolas, monospace` | `--ark-font-family-data` | 实测 |
| 中文黑体 | `"Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif` | `--ark-font-family-cjk-sans` | 实测 |
| 中文宋体 | `"Source Han Serif SC", "Noto Serif SC", serif` | `--ark-font-family-cjk-serif` | 社区 |
| 英文衬线 | `"Times New Roman", Georgia, serif` | `--ark-font-family-latin-serif` | 社区 |

### 字号阶

官网以 1920 宽为基准（`1rem = 16px`），根字号随视口等比缩放（`100vw / 120`）。

| 层级 | rem | 1920 下 | 字体角色 | Token | 可信度 |
| --- | --- | --- | --- | --- | --- |
| 幽灵标题 | 7 | 112px | 窄体英文 | `--ark-font-size-ghost` | 实测 |
| 首屏品牌字 | 5.5 | 88px | 宽体英文 UltraBold | `--ark-font-size-hero` | 实测 |
| 中文大标题 / 干员名 | 3.75 | 60px | 中文黑体 Bold | `--ark-font-size-display` | 实测 |
| 配对英文大标题 | 3.125 | 50px | 宽体英文 Bold | `--ark-font-size-display-latin` | 实测 |
| 条目标题 | 2.5 | 40px | 中文黑体 Bold | `--ark-font-size-h1` | 实测 |
| 小节标签 | 1.5 | 24px | 窄体英文 | `--ark-font-size-h2` | 实测 |
| 导航英文 | 1.375 | 22px | 窄体英文 | `--ark-font-size-nav` | 实测 |
| 按钮中文 / 英文副标 | 1.25 | 20px | 中文黑体 Bold / 宽体英文 | `--ark-font-size-body-lg` | 实测 |
| 分类 / 正文 | 1.125 | 18px | 中文黑体 | `--ark-font-size-body` | 实测 |
| 导航中文 / READ MORE | 0.875 | 14px | 中文黑体 Medium / 数据体 | `--ark-font-size-label` | 实测 |
| 注释 | 0.75 | 12px | — | `--ark-font-size-caption` | 实测 |
| 装饰微字 | 0.375 | 6px | 宽体英文 | `--ark-font-size-micro` | 实测 |

### 字距与行高

| 场景 | 值 | Token | 可信度 |
| --- | --- | --- | --- |
| 幽灵标题 | `-0.05em` | `--ark-font-tracking-tight` | 实测 |
| 干员代号（Heavy） | `-0.1em` | `--ark-font-tracking-cjk-tight` | 社区 |
| 栏目英文标签 | `0.1em` | `--ark-font-tracking-wide` | 实测 |
| 装饰微字 | `0.5em` | `--ark-font-tracking-micro` | 实测 |
| 新闻标题 | `2px` | — | 实测 |
| 日期 | `1px` | — | 实测 |
| 标题 / 标签行高 | `1` | `--ark-font-leading-solid` | 实测 |
| 正文行高 | `1.6` | `--ark-font-leading-body` | 实测 |

### 中英混排规则

| 组合 | 上行 | 下行 | 字号比（上 : 下） |
| --- | --- | --- | --- |
| 导航项 | 英文窄体 | 中文 Medium | 约 1.6 : 1 |
| 大标题 | 英文宽体 Bold | 中文 Bold | 约 0.83 : 1 |
| 干员名 | 英文宽体 Bold（小） | 中文 Bold（大） | 约 1 : 3 |
| 按钮 | 中文 Bold | 英文数据体 | 约 1.4 : 1 |
| 游戏主界面入口 | 中文衬线（大） | 英文窄体（小） | 约 3 : 1（估计） |

## 示意图

![字体层级样张](../assets/type-hierarchy.svg)

> 示意图使用系统回退字体渲染，字形与官方字体不同，只表达层级与比例。

## 字体授权

本仓库不存放任何字体文件。使用前请自行确认授权。

| 字体 | 授权 | 获取 |
| --- | --- | --- |
| 思源黑体 / Source Han Sans | SIL OFL 1.1 | [adobe-fonts/source-han-sans](https://github.com/adobe-fonts/source-han-sans) |
| 思源宋体 / Source Han Serif | SIL OFL 1.1 | [adobe-fonts/source-han-serif](https://github.com/adobe-fonts/source-han-serif) |
| Oswald | SIL OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Oswald) |
| Novecento Wide | 免费授权（含商用），见授权页 | [Font Squirrel](https://www.fontsquirrel.com/fonts/novecento-wide) |
| Bender | 社区整理称可商用，来源待核实 | [TimWangZi/The-font-of-Arknights](https://github.com/TimWangZi/The-font-of-Arknights) 的说明 |
| Times New Roman / Georgia | 系统自带，商业授权各自独立 | — |

没有 Bender 时，JetBrains Mono 是社区最常用的替代（hexo-theme-arknights 即如此）；没有 Novecento 时可用 Montserrat；没有 Oswald 时 Windows 自带的 Bahnschrift 观感接近。

## 官方参考

| 看什么 | 链接 | 说明 |
| --- | --- | --- |
| 双语导航、幽灵标题 | [官网 · 情报](https://ak.hypergryph.com/#information) | 背景的 BREAKING NEWS 与顶部导航 |
| 英文宽体 + 中文粗黑的大标题 | [官网 · 泰拉万象](https://ak.hypergryph.com/#media) | ABOUT TERRA / 泰拉万象 |
| 干员中英文名的大小关系 | [官网 · 干员](https://ak.hypergryph.com/#operator) | 英文名 1.25rem、中文名 3.75rem |
| 思源宋体在品牌站的使用 | [塞壬唱片](https://monster-siren.hypergryph.com/) | 实测加载 SourceHanSerifCN Heavy / Regular |

## Do / Don't

| Do | Don't |
| --- | --- |
| 中英成对出现，一主一辅 | 把英文做成和中文一样大的翻译 |
| 标题行高用 1，用间距拉开块 | 给标题留 1.5 倍行高 |
| 数字、日期、编号统一用数据体 | 数字混在黑体里 |
| 字号按档位“跳” | 相邻层级只差 2px |
| 装饰英文写真实的词（品牌名、网址、栏目名） | 用 Lorem ipsum 或乱码充数 |
| 大写用于短标签 | 整段正文全大写、全斜体 |

## 来源

- 官网样式表与计算样式实测（2026-10-06）
- [TimWangZi/The-font-of-Arknights](https://github.com/TimWangZi/The-font-of-Arknights)
- [《明日方舟》UI/UX 分析——藏在好看背后的先进性](https://www.gameres.com/849200.html)（章节标题字体分析）
- [从 TA 的视角看 UI #1](https://zhuanlan.zhihu.com/p/570566718)（干员代号字重字距）
- [ak-ui · Official website UI study](https://ak-ui.yyj.moe/en/guide/official-site-study.html)
