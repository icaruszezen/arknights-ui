# 设计总纲

> 一句话：**工业终端的骨架，国际主义的版式，二次元的内容。** 黑白灰打底，一个信号色点睛；直角矩形拼合，细线分区；中英成对，数字说话。

## 风格定位

《明日方舟》的视觉常被玩家称为“性冷淡”“舟味”。拆开来看，它是几种成熟设计语言的组合：

| 来源 | 取了什么 | 在哪能看到 |
| --- | --- | --- |
| 扁平化设计 | 去掉拟物细节，平涂色面，卡片与阴影表达层级 | 采购中心、基建的卡片 |
| 国际主义平面风格 | 栅格、左对齐、无衬线体、黑白灰加一个强调色、信息优先 | 官网版式、干员档案 |
| 画内界面（Diegetic UI） | 界面是世界里真实存在的终端投影，带透视、会摆动 | 游戏主界面 |
| 类 Fluent Design 的质感 | 毛玻璃、景深、光，让扁平的界面有层次 | 弹层、浮窗 |
| 工业与工程图语言 | 警戒条纹、编号、刻度、角标、伪等宽字体 | 基建、作战 HUD、装饰元素 |
| 印刷与漫画 | 半调网点、噪点、出血 | 所有底纹 |
| 机能风（Techwear） | 黑白灰 + 局部亮色，强调功能性 | 配色、角色设计 |

分析文章提到，主创有建筑学背景，这常被用来解释画面里的图纸感：关卡用白色体块表示建筑、用等高线表示地形，界面用细线、角标和编号组织信息。

它不是赛博朋克（没有霓虹与故障的堆砌），也不是一般意义上的科幻 HUD（没有满屏的发光边框与六边形）。它更接近**一份排版考究的工业文档**。

## 关键词

`克制` `直角` `黑白灰` `单一信号色` `中英双语` `细线` `巨字` `编号` `半调` `出血` `不对称` `画内界面`

## 十条原则

**1. 层级先于装饰。**
先用大小、粗细、明暗、对齐把主次排清楚，再考虑加线、加底纹。任何一屏都应该有一个明确的主角。

**2. 黑白灰承担九成。**
中性色负责结构，彩色只负责“标记”。官网样式表里，青蓝之外的任何彩色都不超过两次。

**3. 一个信号色。**
每个场景（一个站点、一个活动、一个主题）只选一个高饱和色。黄、橙、红只按语义小面积出现。

**4. 直角矩形是基本单位。**
不用圆角。需要强调时切一个角，或加一条色边。全局只用 45° 一种斜度。

**5. 线比面多。**
用 1px 细线分区，而不是给每个区域加底色或描边盒子。粗线留给激活态。

**6. 中英成对，一主一辅。**
英文不是翻译，是版式结构的一部分。两种文字的字号永远不相等。

**7. 一种字体做一件事。**
窄体写标签，宽体写品牌，数据体写数字，黑体写中文，衬线体写庄重。

**8. 数字是主角。**
数值要大、要用数据体、要带分母和前导零。日期和编号有固定的写法。

**9. 图片出血，文字压线。**
图片越过容器边界；背景巨字被内容切掉一部分；遮罩只压文字一侧。

**10. 动得快，动得直。**
默认 300ms，悬停整块换色，入场有先后。环境动效压到最轻，特效只在有理由的时刻出现。

## 三个场景的侧重

同一套语言，在三个场景里的浓度不同：

| | 官网 | 游戏界面 | 宣传物料 |
| --- | --- | --- | --- |
| 明暗 | 纯黑底 | 场景图 + 黑白拼块 | 随题材变化 |
| 信号色 | 青蓝，全站唯一 | 蓝为主，黄橙红按语义 | 每期一个主题色 |
| 字体 | 无衬线为主 | 加入中文衬线、拉丁衬线 | 每个标题单独设计 |
| 透视 | 无 | 主界面面板组倾斜 | 无 |
| 信息密度 | 低，每屏一个主角 | 高，但每块内部留白 | 中，模板化分节 |
| 装饰 | 幽灵标题、计数、微缩英文 | 水印图标、半调、类型色 | 底纹、条码、角标 |
| 文档 | [官网](modules/website.md) | [游戏](modules/game/home.md) | [宣传物料](modules/promotional.md) |

官网是这套语言最“干净”的版本，最适合作为网页设计的起点；游戏界面是最“完整”的版本；宣传物料是最“自由”的版本。

## 常见误区

想做出“舟味”却容易做偏的地方（部分整理自 ak-ui 的失败模式清单）：

| 误区 | 实际情况 |
| --- | --- |
| 黑底 + 青色发光边框 = 明日方舟 | 几乎没有发光。信号色是平涂的色块和细线 |
| 每个元素都切角、倾斜、编号、大写 | 这些都是点缀。大多数元素就是普通的直角矩形 |
| 铺满警戒条纹和故障效果 | 条纹只做窄边；故障只在转场和特定剧情出现 |
| 装饰性的假数据越多越有科技感 | 装饰文字写的都是真实内容，而且对比度很低 |
| 控件做小一点更有“游戏感” | 游戏内的点击区其实很大；密度来自信息编排而不是缩小控件 |
| 把桌面布局缩小就是移动端 | 官网竖屏是另一套布局 |
| 用了蓝色就得把品牌色全换掉 | 结构与表皮可以分开，见 [界面主题](modules/game/themes.md) |
| 把游戏立绘和 Logo 贴上去 | 风格来自规则而不是素材。去掉官方素材后应当仍然成立 |

## 如何使用这份文档

**做网页 / 应用：** 从 [色彩](foundations/color.md)、[字体与排版](foundations/typography.md)、[几何语言](foundations/geometry.md) 开始，引入 [`tokens.css`](../tokens/tokens.css)，再按需查 [通用元素](#文档地图)。参考 [官网](modules/website.md) 的整体编排。

**做平面 / 海报：** 重点看 [图片](foundations/imagery.md)、[底纹](foundations/texture-and-pattern.md)、[装饰元素](elements/decorations.md)、[宣传物料](modules/promotional.md)。

**做游戏界面：** 看 [布局与层级](foundations/layout-and-depth.md) 和 `modules/game/` 下各篇。

**做主题 / 换肤：** 看 [界面主题](modules/game/themes.md) 与 [衍生品牌](modules/sub-brands.md)。

**想直接用现成的：** 看 [开源项目盘点](references/open-source.md)。

### 风格强度

不是所有项目都需要“满配”。借用 ak-ui 的三级划分：

| 强度 | 用什么 | 适合 |
| --- | --- | --- |
| 点到为止 | 配色原则、字体搭配、直角、一处切角或细线 | 文档、博客、普通产品页 |
| 完整 | 加上面板系统、双语标题、编号、底纹、果断的交互反馈 | 专题页、作品集、工具 |
| 沉浸 | 再加透视、视差、背景巨字、微缩英文、分屏编排 | 首页、展示型站点、仪表盘 |

## 可信度约定

全仓库的数值都标注了来源：

| 标记 | 含义 |
| --- | --- |
| **实测** | 2026-10-06 从官方网站的样式表或计算样式中直接读出 |
| **社区** | 来自开源项目或分析文章，是他人的取值或整理，非官方 |
| **估计** | 根据截图与观察归纳，只能作为起点 |

**游戏内界面没有做过像素级测量**，相关数值全部是社区或估计。官网的数值可信度最高。

2026-10-07 起，按钮、弹窗、返回 + 主页、快捷导航、标签页、抽屉这几样控件对照了实机裁图与截图，标作“社区（实机裁图）”：形状和颜色来自真实画面，但图是社区项目裁的，尺寸只精确到 1280 × 720 下的像素。来源见 [官方图片外链索引](references/image-index.md#控件级的实机参考)。

## 文档地图

```
foundations/   基础规范
  color · typography · layout-and-depth · geometry
  texture-and-pattern · iconography · imagery · motion
elements/      通用元素
  buttons · panels-and-cards · navigation
  data-display · feedback · decorations
modules/       场景模块
  website
  game/ home · operator · battle · base · gacha-and-store · story · themes
  promotional · sub-brands
references/    参考资料
  open-source · articles · image-index
```

| 基础规范 | 通用元素 | 场景模块 | 参考资料 |
| --- | --- | --- | --- |
| [色彩](foundations/color.md) | [按钮](elements/buttons.md) | [官网](modules/website.md) | [开源项目盘点](references/open-source.md) |
| [字体与排版](foundations/typography.md) | [面板与卡片](elements/panels-and-cards.md) | [游戏 · 主界面](modules/game/home.md) | [分析文章索引](references/articles.md) |
| [布局与层级](foundations/layout-and-depth.md) | [导航](elements/navigation.md) | [游戏 · 干员](modules/game/operator.md) | [官方图片外链索引](references/image-index.md) |
| [几何语言](foundations/geometry.md) | [数据展示](elements/data-display.md) | [游戏 · 作战](modules/game/battle.md) | |
| [底纹](foundations/texture-and-pattern.md) | [反馈](elements/feedback.md) | [游戏 · 基建](modules/game/base.md) | |
| [图标与符号](foundations/iconography.md) | [装饰元素](elements/decorations.md) | [游戏 · 寻访与采购中心](modules/game/gacha-and-store.md) | |
| [图片](foundations/imagery.md) | | [游戏 · 剧情](modules/game/story.md) | |
| [动效](foundations/motion.md) | | [游戏 · 界面主题](modules/game/themes.md) | |
| | | [宣传物料](modules/promotional.md) | |
| | | [衍生品牌](modules/sub-brands.md) | |

## 来源

- 官网实测（2026-10-06）
- [《明日方舟》UI/UX 分析——藏在好看背后的先进性](https://www.gameres.com/849200.html)
- [从 TA 的视角看 UI #1](https://zhuanlan.zhihu.com/p/570566718)
- [明日方舟 UI 图案以及 LOGO 的设计是什么美术风格？](https://www.zhihu.com/question/489842081)
- [ak-ui · Design language](https://ak-ui.yyj.moe/en/guide/design-language.html)
