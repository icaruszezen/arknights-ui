# 装饰元素

> 装饰都“有来历”：编号是真的编号，小字是真的网址。它们像设备铭牌上的信息，不像花边。

## 特征拆解

**1. 编号带前导零和总数。** 官网右栏的 `01 // 01 / 05` 是最典型的写法：一个大号数字，后面跟“当前 / 总数”。任何可以数的东西（分屏、轮播、列表项、章节）都可以这样标。

**2. 日期的斜杠有节奏。** 官网日期写作 `2026 // 10 / 03`：年和月之间是双斜杠，月和日之间是单斜杠，斜杠两侧留空格。它把一个普通的日期变成了一个有辨识度的图形。

**3. 微缩英文当纹理。** 画面边角有很多 6px 左右、字距拉得很开的英文：品牌名、网址、版权标记。它们小到不需要被读，但写的都是真实内容。竖排时旋转 90° 贴边。

**4. 角标不闭合。** 用四个 L 形角标框住一块内容，而不是画一个完整的矩形。视线会自动补全边框，画面更透气。

**5. 分隔线有“起点”。** 一条分隔线很少是从头到尾均匀的。它往往以一小段粗色条、一个小方块或一个英文标签开头，后面才是细线；或者一端渐隐。

**6. 标注点 + 折线 + 标签。** 在图片或场景上做标注时：一个空心小方块（内嵌实心点）标出位置，引一条先水平后斜向的折线，末端是一个黑底信号色文字的小标签。

**7. 条码、刻度、坐标。** 条形码、标尺刻度、经纬度式的数字偶尔出现在宣传物料和品牌视觉里，强化“工业制品 / 档案 / 货物”的语感。其中一些还被玩家当作解谜线索。

**8. 背景巨字。** 每屏背后的巨型英文（见 [字体与排版](../foundations/typography.md)）本身也是装饰，同时是这一屏的标题。

**9. 装饰重复了信息。** 好的装饰是对内容的第二次表述：栏目名用巨字再写一次，编号用大数字再写一次。去掉它们信息不缺，留着它们层次更多。

## 规范

| 元素 | 写法 | 可信度 |
| --- | --- | --- |
| 计数 | `NN // NN / NN`：大数字 Novecento Sans Wide DemiBold `5.4rem`、信号色；“// 当前 / 总数” Bender Regular `1.125rem`、白色，在数字右侧；栏目名 Novecento Sans Wide DemiBold `1.125rem`、字距 `0.1em`，在数字下面 | 实测 |
| 日期 | `YYYY // MM / DD`，Bender Regular，字距 `1px` | 实测 |
| 序号 | `NO.0147`、`VOL.69`，数据体 | 估计 |
| 微缩英文 | Novecento Sans Wide Medium，`0.375rem`，字距 `0.5em`，`#585858`–`#ababab` | 实测 |
| 版权标记 | `© HYPERGRYPH` 式，数据体 Bold，中灰（`#a4a4a4` 附近） | 估计 |
| 角标 | L 形，边长 12–16px，线宽 1–2px，白色 | 估计 |
| 标注点 | 外框 8–10px 空心方，内点 4px 信号色 | 估计 |
| 标注标签 | 黑底，Oswald Medium `1.25rem`，信号色文字，内边距 `0 0.5rem 0 0.25rem` | 实测 |
| 分隔线起点 | `4px × 3rem` 信号色段，或 8px 白色方块 | 估计 |
| 虚线 | `--ark-pattern-dash` | 实测 |
| 渐隐线 | `--ark-pattern-fade-rule` | 实测 |
| 背景巨字 | Oswald Medium `7rem`，字距 `-0.05em`，`#242424` | 实测 |

```html
<p class="ark-counter">
  <b>01</b>
  <span>// 01 / 05</span>
  <span lang="en">INFORMATION</span>
</p>
<time class="ark-date" datetime="2026-10-03">2026 // 10 / 03</time>
```

```css
.ark-counter b { font: 600 5.4rem/0.8 var(--ark-font-family-latin-wide); color: var(--ark-color-signal-info); }
.ark-counter span { font: 400 var(--ark-font-size-body)/1 var(--ark-font-family-data); }
.ark-counter [lang="en"] { display: block;
                           font: 600 var(--ark-font-size-body)/1 var(--ark-font-family-latin-wide);
                           letter-spacing: var(--ark-font-tracking-wide); }
.ark-date { font: 400 1rem/1 var(--ark-font-family-data); letter-spacing: 1px; }
.ark-micro { font: 500 var(--ark-font-size-micro)/1 var(--ark-font-family-latin-wide);
             letter-spacing: var(--ark-font-tracking-micro); color: var(--ark-color-neutral-gray-600); }
```

### 密度

| 场景 | 建议 |
| --- | --- |
| 内容型页面（文章、文档） | 只保留编号与分隔线起点 |
| 展示型页面（首页、专题） | 加上背景巨字、角标、微缩英文 |
| 沉浸型页面（终端、仪表盘） | 可再加条码、刻度、标注点 |

这三档对应 ak-ui 提出的 `accent / system / terminal` 三级强度。

### 无障碍

- 纯装饰的微缩英文加 `aria-hidden="true"`，避免屏幕阅读器逐字母朗读。
- 日期用 `<time datetime>` 提供标准格式。
- 背景巨字若与标题重复，标记为装饰；若是唯一的标题，则保证对比度并使用真实的标题标签（官网的 `#242424` 对黑底对比度很低，只能作为装饰）。

## 示意图

![装饰元素](../assets/decorations.svg)

## 官方参考

| 看什么 | 链接 | 说明 |
| --- | --- | --- |
| 右栏计数、日期写法 | [官网 · 情报](https://ak.hypergryph.com/#information) | 右侧 `01 // 01 / 05`，新闻日期 |
| 微缩英文、版权标记 | [官网 · 首页](https://ak.hypergryph.com/#index) | 左下角与右栏的小字 |
| 标注点 + 黑底标签 | [官网 · 泰拉万象](https://ak.hypergryph.com/#media) | GALLERY / MONSTER SIREN 等标签 |
| 背景巨字 | [官网 · 设定](https://ak.hypergryph.com/#world) | WORLD |
| 条码、数字串在品牌视觉中的使用 | [我在明日方舟里面学平面设计](https://zhuanlan.zhihu.com/p/145684354) | 0011 系列的条形码与数字 |

## Do / Don't

| Do | Don't |
| --- | --- |
| 装饰文字写真实内容 | 乱码、Lorem ipsum、无意义的十六进制串 |
| 编号带总数 | 只写一个孤零零的 “01” |
| 装饰压到最低对比度 | 装饰比正文还亮 |
| 按页面类型控制密度 | 每个元素都编号、都加角标、都大写 |
| 分隔线给一个起点 | 满屏均匀的整条横线 |

## 来源

- 官网计算样式实测（2026-10-06）；右栏计数的字体与字号在 2026-10-07 重新读取并更正（原先写的是“大数字 Bender Bold”）
- [ak-ui · Design language](https://ak-ui.yyj.moe/en/guide/design-language.html)（强度分级、常见失败模式）
- [我在明日方舟里面学平面设计](https://zhuanlan.zhihu.com/p/145684354)
