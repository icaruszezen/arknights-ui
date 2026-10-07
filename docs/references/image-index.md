# 官方图片外链索引

本仓库不存放任何官方图片。需要看实物时，从这里跳转到官方渠道或维基。

> 所有图片的版权归上海鹰角网络科技有限公司及相应权利人所有。请在原站点查看，不要转存到公开仓库。

## 怎么找图

| 想看 | 去哪 |
| --- | --- |
| 官网的版式、字体、配色 | 直接打开官网各分屏 |
| 游戏界面截图 | PRTS Wiki 对应系统的页面 |
| 活动主视觉、标题标识 | PRTS 活动一览、官网情报 |
| 干员立绘、时装 | PRTS 干员页、时装回廊 |
| 宣传片 | 官方哔哩哔哩账号 |
| 公告长图、干员介绍图 | 官方微博 |
| 专辑封面 | 塞壬唱片 |
| 官方漫画 | 泰拉记事社 |

## 官网

| 分屏 | 链接 | 可观察的设计点 | 对应文档 |
| --- | --- | --- | --- |
| 首页 | <https://ak.hypergryph.com/#index> | 主视觉与色块穿插、品牌字、右栏下载入口 | [官网](../modules/website.md) |
| 情报 | <https://ak.hypergryph.com/#information> | 新闻行、分类标签、主按钮、轮播进度条 | [数据展示](../elements/data-display.md)、[按钮](../elements/buttons.md) |
| 干员 | <https://ak.hypergryph.com/#operator> | 立绘出血、幽灵重影、中英文名排版、缩略图条 | [图片](../foundations/imagery.md) |
| 设定 | <https://ak.hypergryph.com/#world> | 条目列表、阶梯缩进、斜线网格、悬停幽灵字 | [底纹](../foundations/texture-and-pattern.md) |
| 泰拉万象 | <https://ak.hypergryph.com/#media> | 等距场景、标注点与标签 | [装饰元素](../elements/decorations.md) |
| 更多内容 | <https://ak.hypergryph.com/#more> | 条带切图、图标 + 双语标题 | [图标与符号](../foundations/iconography.md) |

## 游戏界面

| 系统 | 链接 | 可观察的设计点 | 对应文档 |
| --- | --- | --- | --- |
| 主界面 · 场景 | [首页场景一览 · PRTS](https://prts.wiki/w/%E9%A6%96%E9%A1%B5%E5%9C%BA%E6%99%AF%E4%B8%80%E8%A7%88) | 透视面板、黑白拼块、场景晕影 | [主界面](../modules/game/home.md) |
| 主界面 · 主题 | [界面主题一览 · PRTS](https://prts.wiki/w/%E7%95%8C%E9%9D%A2%E4%B8%BB%E9%A2%98%E4%B8%80%E8%A7%88) | 同一结构的多种皮肤 | [界面主题](../modules/game/themes.md) |
| 主界面 · 主题（英文） | [Home Screen/UI · Terra Wiki](https://arknights.wiki.gg/wiki/Home_Screen/UI) | 同上 | [界面主题](../modules/game/themes.md) |
| 干员 | [干员一览 · PRTS](https://prts.wiki/w/%E5%B9%B2%E5%91%98%E4%B8%80%E8%A7%88) | 卡片、职业图标、稀有度编码 | [干员](../modules/game/operator.md) |
| 关卡 | [关卡一览 · PRTS](https://prts.wiki/w/%E5%85%B3%E5%8D%A1%E4%B8%80%E8%A7%88) | 编号体系、章节 | [作战](../modules/game/battle.md) |
| 基建 | [罗德岛基建 · PRTS](https://prts.wiki/w/%E7%BD%97%E5%BE%B7%E5%B2%9B%E5%9F%BA%E5%BB%BA) | 剖面视图、设施类型色 | [基建](../modules/game/base.md) |
| 寻访 | [卡池一览 · PRTS](https://prts.wiki/w/%E5%8D%A1%E6%B1%A0%E4%B8%80%E8%A7%88) | 卡池横幅、标题标识 | [寻访与采购中心](../modules/game/gacha-and-store.md) |
| 剧情 | [剧情一览 · PRTS](https://prts.wiki/w/%E5%89%A7%E6%83%85%E4%B8%80%E8%A7%88) | 章节标题设计 | [剧情](../modules/game/story.md) |

### 控件级的实机参考

维基上的截图多是整屏的，看不清单个控件。要核对按钮、弹窗、标签页这类控件的形状和颜色，下面两处更直接：

| 来源 | 链接 | 能看到什么 | 对应文档 |
| --- | --- | --- | --- |
| MAA 的模板图 | [MaaAssistantArknights · resource/template](https://github.com/MaaAssistantArknights/MaaAssistantArknights/tree/dev-v2/resource/template) | 从 1280 × 720 的实机画面裁出的单个控件：`PopupConfirm` / `PopupCancel`（弹窗按钮）、`Battle/BattleFlag/PrtsErrorConfirm`（整条弹窗）、`ReturnButton/Return`（返回）、`Battle/StartButton/StartButton1`（开始行动）、`Depot/DepotMaterialTab*`（仓库分类）等 | [按钮](../elements/buttons.md)、[反馈](../elements/feedback.md)、[导航](../elements/navigation.md) |
| 机核文章的配图 | [《明日方舟》UI/UX 设计复盘](https://www.gcores.com/articles/123154) | 2436 × 1125 的实机截图：展开的快捷导航、基建的进驻信息抽屉、凭证交易所的兑换弹层、干员列表（星级、等级环）、干员详情（属性、标签）、仓库（分类）、基建总览（资源条） | [导航](../elements/navigation.md)、[面板与卡片](../elements/panels-and-cards.md)、[数据展示](../elements/data-display.md) |
| PRTS 的界面主题预览图 | [界面主题一览 · PRTS](https://prts.wiki/w/%E7%95%8C%E9%9D%A2%E4%B8%BB%E9%A2%98%E4%B8%80%E8%A7%88) | 1280 × 720 的主界面实机截图，每个主题一张：资源条、入口面板的三种底色、橙色条与橙色菱形、计数色块、等级环。原图可以直接取色 | [数据展示](../elements/data-display.md)、[面板与卡片](../elements/panels-and-cards.md)、[色彩](../foundations/color.md) |

模板图是自动化工具用来识别界面的素材，属于游戏画面的局部截图，版权同样归鹰角网络。只在原仓库查看，不要转存。

## 宣传物料

| 类型 | 链接 | 可观察的设计点 | 对应文档 |
| --- | --- | --- | --- |
| 活动主视觉 | [活动一览 · PRTS](https://prts.wiki/w/%E6%B4%BB%E5%8A%A8%E4%B8%80%E8%A7%88) | 标题标识、主题色、横幅构图 | [宣传物料](../modules/promotional.md) |
| 时装品牌 | [时装回廊 · PRTS](https://prts.wiki/w/%E6%97%B6%E8%A3%85%E5%9B%9E%E5%BB%8A) | 虚构品牌的 Logo 与主视觉 | [宣传物料](../modules/promotional.md) |
| 视频 | [明日方舟 · 哔哩哔哩](https://space.bilibili.com/161775300) | 宣传片的动态排版 | [宣传物料](../modules/promotional.md) |
| 图文 | [明日方舟 Arknights · 微博](https://weibo.com/arknights) | 公告长图、干员介绍图 | [宣传物料](../modules/promotional.md) |

## 衍生品牌

| 站点 | 链接 | 对应文档 |
| --- | --- | --- |
| 塞壬唱片 | <https://monster-siren.hypergryph.com/> | [衍生品牌](../modules/sub-brands.md) |
| 泰拉记事社 | <https://terra-historicus.hypergryph.com/> | [衍生品牌](../modules/sub-brands.md) |
| 鹰角网络 | <https://www.hypergryph.com/> | [衍生品牌](../modules/sub-brands.md) |
| 森空岛 | <https://www.skland.com/> | [衍生品牌](../modules/sub-brands.md) |

## 社区复刻（可交互）

想看这套风格在网页上“动起来”的样子：

| 项目 | 链接 | 说明 |
| --- | --- | --- |
| ak-ui 组件与示例 | <https://ak-ui.yyj.moe/en/components/> | 原创素材 |
| ak-ui 官网模式示例 | <https://ak-ui.yyj.moe/en/showcase/website.html> | 原创素材 |
| arknights-ui 主界面复刻 | <https://mashirozx.github.io/arknights-ui/> | 含游戏素材，仅供学习 |
| hexo-theme-arknights 演示 | <https://arknights.theme.hexo.yue.zone/> | 博客主题 |
| valaxy-theme-arknights 演示 | <https://arknights.valaxy.site> | 博客主题，原创素材 |

## 本仓库的自绘示意图

以下 SVG 为本仓库原创，仅使用几何图形与通用字体，可在 MIT 许可下自由使用。

| 文件 | 内容 |
| --- | --- |
| [color-palette.svg](../assets/color-palette.svg) | 色板 |
| [type-hierarchy.svg](../assets/type-hierarchy.svg) | 字体层级样张 |
| [geometry.svg](../assets/geometry.svg) | 几何语言 |
| [patterns.svg](../assets/patterns.svg) | 底纹库 |
| [panels.svg](../assets/panels.svg) | 面板与层级 |
| [imagery.svg](../assets/imagery.svg) | 图片构图 |
| [motion.svg](../assets/motion.svg) | 动效时序 |
| [buttons.svg](../assets/buttons.svg) | 按钮解剖 |
| [navigation.svg](../assets/navigation.svg) | 导航结构 |
| [data-display.svg](../assets/data-display.svg) | 数据展示 |
| [feedback.svg](../assets/feedback.svg) | 反馈元素 |
| [decorations.svg](../assets/decorations.svg) | 装饰元素 |
| [website-layout.svg](../assets/website-layout.svg) | 官网分屏线框 |
| [home-layout.svg](../assets/home-layout.svg) | 游戏主界面线框 |
| [operator-detail.svg](../assets/operator-detail.svg) | 干员详情线框 |
| [battle-hud.svg](../assets/battle-hud.svg) | 作战 HUD 线框 |

## 说明

- 外链可能因站点改版而失效。发现失效链接欢迎提 Issue。
- 部分站点有防盗链或访问限制，因此本仓库只给链接，不在文档中内嵌这些图片。
- 链接核对于 2026-10-06；“控件级的实机参考”一节补于 2026-10-07。
