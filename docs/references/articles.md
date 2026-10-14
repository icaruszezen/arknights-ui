# 分析文章与资料索引

本仓库引用过的文章与资料。标注了各自最有价值的部分，方便按需阅读。

## UI / UX 分析

| 文章 | 作者 / 出处 | 时间 | 看点 |
| --- | --- | --- | --- |
| [《明日方舟》UI/UX 分析——藏在好看背后的先进性](https://www.gameres.com/849200.html) | AJ / 腾讯游戏学院（GameRes 转载） | 2019-07-18 | 流传最广的一篇。六个角度：画内界面、类 Fluent Design 的质感、扁平化中的深度、装饰字体、焦距与底图、过场衔接；末尾一节谈不足。小节原题见下。[indienova 版](https://ldt.indienova.com/indie-game-development/arknights-ui-ux-design/) |
| [《明日方舟》UI/UX 设计复盘](https://www.gcores.com/articles/123154) | 蓝湿父 / 机核 | 2020-04-30 | 偏交互与功能迭代：七项优化、四项不足，都有具体界面例子。小节原题见下 |
| [从 TA 的视角看 UI #1——明日方舟美术设计分析](https://zhuanlan.zhihu.com/p/570566718) | Naxts / 知乎专栏 | 2022-10-04 | 技术美术视角。干员信息的字体字重字距、皮肤品牌的视觉识别、关卡美术与主创的建筑系出身。“视觉方面”六小节是对 GameRes 一文的转述 |
| [明日方舟 UI 图案以及 LOGO 的设计是什么美术风格？](https://www.zhihu.com/question/489842081) | 知乎问答 | 2021 | 与同类游戏界面的横向比较：矩形、单色 Logo、投影、半调、烟尘 |
| [“舟味”从何而来？解析明日方舟设计美学（UI/UX 设计篇）](https://janniewang.net/wp-content/uploads/2023/09/UIUX-analysis-for-Arknights.pdf) | PDF | 2023-09 | 设计规范角度的分析（本仓库未能提取其正文，仅列出供参考） |
| [Exploring the Impact of UI/UX Design on Player Experience in Arknights](https://binus.ac.id/bekasi/2025/05/exploring-the-impact-of-ui-ux-design-on-player-experience-in-arknights/) | BINUS University | 2025-05 | 英文，从玩家体验角度的概述 |

### 两篇常被引用的文章的小节原题

各篇文档引用这两篇时，一律用下表的简称，方便回到原文对照。

GameRes《UI/UX 分析》：

| 简称 | 原题 | 本仓库引用了什么 |
| --- | --- | --- |
| “Diegetic Interface……沉浸感”一节 | Diegetic Interface 风格的主看板观瞄投影设计如何增强沉浸感？ | 画内界面、陀螺仪、设备信息入戏；与《全境封锁》《死亡空间》的比较 |
| “类 Fluent Design……”一节 | 类 Fluent Design 设计思想的多元质感在哪些细节中勾勒？ | 毛玻璃、光、材质 |
| “界面扁平化后……深度”一节 | 界面扁平化后如何追求交互空间和所承载内容的深度？ | 卡片与阴影、寻访界面的视差 |
| “风格化的装饰字体……”一节 | 风格化的装饰字体如何同时成功地表达古典骑士精神与科幻军工风？ | 章节标题的字体（Didot、Bodoni、Trajan）与那段批评；基建里的 Bender |
| “焦距控制和底图处理……”一节 | 焦距控制和底图处理等平面设计基础手法如何塑造统一的视觉识别？ | 采购中心介绍插画的焦距、散点与粗条纹的底图、局部马赛克化（干员报到界面、剿灭作战的背景地图）与《刺客信条》的比较 |
| “过场衔接技巧……”一节 | 有哪些过场衔接技巧降低了页面层级的数量，并构建了场景化的系统结构？ | 干员养成页的九种过场、基建的设施主题色、场所化的导航 |
| “未来展望”一节 | 对于页面与交互的未来展望 | 两点不足：非局内页面偏静态，对操作的反馈不够；交互方式以点击按钮为主，偏保守 |

机核《UI/UX 设计复盘》：

| 简称 | 原题 |
| --- | --- |
| 优化 1 | 次级页面的隐藏式导航栏 |
| 优化 2 | 基建内干员加成标签优化 |
| 优化 3 | 贸易站订单批量交付 |
| 优化 4 | 家具商店优化 |
| 优化 5 | 凭证交易所样式改版 |
| 优化 6 | 访问好友基建返回逻辑的修正 |
| 优化 7 | 增加仓库分类 |
| 不足 1 | 代理作战 UI 阻挡界面 |
| 不足 2 | 基建抽屉式页面的关闭逻辑问题 |
| 不足 3 | 干员详情页可互动区域不明显 |
| 不足 4 | 兑换物品时缺少已有库存数量 |

## 官网

| 文章 | 作者 / 出处 | 看点 |
| --- | --- | --- |
| [Official website UI study](https://ak-ui.yyj.moe/en/guide/official-site-study.html) | ak-ui 文档 | 对官网的逐项测量：字体声明、字号、字距、颜色、过渡、竖屏行为，注明测量日期与视口 |
| [Website coverage & examples](https://ak-ui.yyj.moe/en/guide/official-site-examples.html) | ak-ui 文档 | 哪些官网模式被独立实现，以及动效的具体数值 |
| [尝试优化《明日方舟》官方网站的设计](https://www.gcores.com/articles/135723) | 蓝湿父 / 机核，2021-04-07 | 第三方改版练习。“元素提取”一节总结了三条：界面以黑白灰为主；以矩形为主，辅以少量的圆形元素；游戏内标题以思源宋体为主，其他文字用思源黑体。另逐页列出旧版官网可改进之处 |

## 平面设计与宣传

| 文章 | 作者 / 出处 | 时间 | 看点 |
| --- | --- | --- | --- |
| [我在明日方舟里面学平面设计](https://zhuanlan.zhihu.com/p/145684354) | 奏奏子 / 知乎专栏 | 2020-06 | 逐个拆解“时装回廊”中十余个虚构服装品牌的 Logo、字体与主视觉 |
| [《明日方舟》概念宣传片中的视听精彩](https://www.gcores.com/articles/92876) | 呵呵帝HED / 机核 | 2017-09-19 | 概念宣传片的美术风格概述，以及主美此前的作品。文中没有谈宣传片里的文字排版 |

## 设计语言文档（社区）

| 文档 | 出处 | 看点 |
| --- | --- | --- |
| [Design language](https://ak-ui.yyj.moe/en/guide/design-language.html) | ak-ui | 把风格写成可执行的规则：原则、三级强度、组合规则、品牌适配、原创性边界、常见失败模式 |
| [Design tokens](https://ak-ui.yyj.moe/en/guide/tokens.html) | ak-ui | 语义 token 的分层方式 |

## 维基与数据

| 资料 | 说明 |
| --- | --- |
| [PRTS Wiki](https://prts.wiki/) | 玩家共建的中文维基。界面主题、首页场景、活动、时装、干员等页面有大量截图与官方图 |
| [界面主题一览 · PRTS](https://prts.wiki/w/%E7%95%8C%E9%9D%A2%E4%B8%BB%E9%A2%98%E4%B8%80%E8%A7%88) | 全部界面主题的预览、说明与获取方式 |
| [首页场景一览 · PRTS](https://prts.wiki/w/%E9%A6%96%E9%A1%B5%E5%9C%BA%E6%99%AF%E4%B8%80%E8%A7%88) | 主界面背景场景 |
| [Arknights Terra Wiki](https://arknights.wiki.gg/) | 英文维基 |
| [Home Screen/UI · Arknights Terra Wiki](https://arknights.wiki.gg/wiki/Home_Screen/UI) | 主界面 UI 主题的英文资料 |

## 字体

| 资料 | 说明 |
| --- | --- |
| [TimWangZi/The-font-of-Arknights](https://github.com/TimWangZi/The-font-of-Arknights) | 游戏所用字体及使用场合的整理 |
| [Source Han Sans](https://github.com/adobe-fonts/source-han-sans) / [Source Han Serif](https://github.com/adobe-fonts/source-han-serif) | 思源黑体、思源宋体，SIL OFL |
| [Oswald · Google Fonts](https://fonts.google.com/specimen/Oswald) | 官网导航所用窄体，SIL OFL |
| [Novecento Wide · Font Squirrel](https://www.fontsquirrel.com/fonts/novecento-wide) | 官网品牌字所用宽体 |

## 设计概念的延伸阅读

文中出现的几个概念，想深入可以按关键词查找：

| 概念 | 说明 |
| --- | --- |
| Diegetic Interface（画内界面） | 界面作为游戏世界内真实存在的物体。常举的例子是《死亡空间》《全境封锁》 |
| Fluent Design | 微软 2017 年提出的设计系统，五要素为 Light、Depth、Motion、Material、Scale；亚克力（Acrylic）毛玻璃是其标志 |
| Vignette（晕影） | 画面四周压暗、中心提亮，引导视线 |
| Halftone（半调） | 用大小不一的网点模拟连续色调的印刷技术 |
| Out-of-focus foreground framing | 前景失焦取景，用模糊的前景元素框住清晰的主体 |
| Swiss / International Typographic Style | 国际主义平面风格：栅格、无衬线体、左对齐、客观的信息呈现。本作的版式习惯与之相近 |
| Techwear（机能风） | 强调功能性的服装风格，黑白灰为主、局部亮色。常被用来形容本作的角色与界面配色 |

## 说明

- 文章观点属于各自作者。本仓库在引用时已改写为自己的表述，并在各篇的“来源”中注明出处。
- 部分站点（知乎、indienova、PRTS）对自动抓取有限制，链接需要在浏览器中打开。
- 链接有效性核对于 2026-10-06；2026-10-14 重新核对了一遍，全部可以打开。同日回到 GameRes、机核三篇和知乎专栏一篇的原文，核对了各篇文档里的转述，补上了作者、日期和小节原题。
