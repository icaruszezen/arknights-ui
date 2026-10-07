# 面板与卡片

> 两种表面：纸白与石墨。纸白说“看这里”，石墨说“我在这里”。

## 特征拆解

**1. 两种表面。** 游戏界面的面板只有两种底：接近白色的纸面（`#fdfdfb` 附近），和半透明的石墨灰（`#424242` 附近）。纸白面板上放深色的重磅文字，用于一屏中最重要的一两个入口；石墨面板上放白字，是其余所有东西的默认容器。

**2. 内容贴角。** 面板里的文字不居中。标题贴左下或左上，数值贴右上，其余大片留白。留白处常压一个放大的图标水印，或一片半调网点。

**3. 一条强调边。** 需要标记类别或选中状态时，在面板左侧或底部加一条 4–8px 的信号色边。只有一条。

**4. 卡片有投影，面板没有。** 采购中心、基建等列表型页面使用卡片 + 投影来表达“这是一个可以拿起来的东西”。主界面的面板则靠明暗和透视，不加投影。

**5. 抽屉从侧边进来。** 基建的设施详情、干员的技能详情以抽屉形式从右侧滑入，压住一部分主画面，但不完全遮挡：剩下的主画面被压暗，仍然看得见。基建的进驻信息抽屉是纸白的面，深色字。关闭时原路退回。

**6. 浮层盖在模糊的页面上。** 查看职业详情、时装等次级信息时，弹出半透明模糊的浮层，下层仍然隐约可见。采购、兑换的弹层则是不透明的——左半纸白放物品说明，右半石墨放价格和数量——但下面的整页同样被模糊并压暗，用户看得出自己没有离开原来的页面。

**7. 主题色标记归属。** 基建里不同设施（制造站、贸易站、发电站）的面板用各自的类型色做强调边和标题色，一眼可辨属于哪个系统。

## 规范

| 项 | 纸白面板 | 石墨面板 | 毛玻璃浮层 | 可信度 |
| --- | --- | --- | --- | --- |
| 底色 | `--ark-color-overlay-panel-light` | `--ark-color-overlay-panel-dark` | 黑 40–50% + `backdrop-filter: blur(0.5rem)` | 社区 / 实测 |
| 文字色 | `#323232` | `#ffffff` | `#ffffff` | 社区 |
| 标题字体 | 中文衬线 Heavy 或中文黑体 Bold | 同左 | 中文黑体 Bold | 社区 |
| 圆角 | `0` | `0` | `0` | 实测 |
| 描边 | 无 | 无 | `1px solid rgba(255,255,255,.3)` | 实测 |
| 投影 | 无（卡片用 `--ark-shadow-panel`） | 同左 | 无 | 社区 |
| 内边距 | `1–1.5rem` | `1–1.5rem` | `1.5rem` | 社区 |
| 强调边 | 左侧 `4px` 或 `0.5rem` 信号色 | 同左 | — | 实测 |
| 切角 | 可选，右上 `--ark-cut-md` | 同左 | 不切 | 社区 |

### 抽屉与浮层

| 项 | 抽屉 | 浮层 | 可信度 |
| --- | --- | --- | --- |
| 表面 | 石墨或纸白（基建的进驻信息是纸白） | 毛玻璃，或不透明的石墨 / 纸白（采购、兑换） | 社区（实机截图） |
| 遮罩 | 主画面压暗（`--ark-color-overlay-scrim`），不模糊 | 整页压暗并模糊（`--ark-blur-backdrop`） | 社区（实机截图） |
| 位置 | 贴右、满高，约占屏宽四成 | 居中 | 估计 |
| 关闭 | 点主画面、点关闭都直接关 | 点遮罩、点关闭都直接关 | 社区 |

> **2026-10-07 更正：** 原先的取值是“抽屉不压暗主画面”“浮层的遮罩只压暗、不模糊”。对照实机截图，抽屉旁边的主画面是压暗的，采购弹层下面的整页是模糊的。

### 卡片结构（估计）

```
┌─────────────────────────┐
│ ▍标题（中文，粗）        ◤│  ← 左侧强调边；右上可切角
│   SUBTITLE（英文，小）    │
│ ─────────────────────── │  ← 1px 细线
│                          │
│ 数值 258            图标 │  ← 数值用数据体
│ ░░░░░░░░░░░░░░░░░░░░░░░ │  ← 底部半调网点
└─────────────────────────┘
```

```css
.ark-card {
  position: relative;
  padding: var(--ark-space-5);
  background: var(--ark-color-overlay-panel-dark);
  color: var(--ark-color-neutral-white);
  border-left: var(--ark-line-strong) solid var(--ark-color-signal-info);
  box-shadow: var(--ark-shadow-panel);
}
.ark-card--paper {
  background: var(--ark-color-overlay-panel-light);
  color: var(--ark-color-neutral-paper-ink);
}
.ark-sheet {
  background: var(--ark-color-overlay-scrim);
  backdrop-filter: blur(var(--ark-blur-backdrop));
  border: var(--ark-line-hairline) solid var(--ark-color-line-hairline);
}
```

### 层级

| 层 | 内容 |
| --- | --- |
| 0 | 场景 / 背景图 |
| 1 | 压暗、晕影、模糊 |
| 2 | 石墨面板 |
| 3 | 纸白面板 |
| 4 | 信号色块（主按钮、强调边） |
| 5 | 毛玻璃弹层与其上的内容 |

## 示意图

![面板与层级](../assets/panels.svg)

## 官方参考

| 看什么 | 链接 | 说明 |
| --- | --- | --- |
| 黑白拼块的主界面面板 | [首页场景一览 · PRTS](https://prts.wiki/w/%E9%A6%96%E9%A1%B5%E5%9C%BA%E6%99%AF%E4%B8%80%E8%A7%88) | 截图右侧的面板组 |
| 官网的深色面板与细线 | [官网 · 干员](https://ak.hypergryph.com/#operator) | 干员简介的半透明黑底 |
| 网页复刻的面板实现 | [mashirozx/arknights-ui](https://github.com/mashirozx/arknights-ui) | `css/styles.css` 中的浅 / 深面板 |
| 卡片、面板的社区组件 | [ak-ui · Cards](https://ak-ui.yyj.moe/en/components/) | 可交互样例 |

## Do / Don't

| Do | Don't |
| --- | --- |
| 一屏最多一两块纸白 | 纸白和石墨各占一半 |
| 文字贴角，留出大片空白 | 把面板内容塞满并居中 |
| 强调边只加一条 | 四周描边 + 发光 + 内阴影同时出现 |
| 浮层用模糊保留下层 | 浮层用不透明实底 |
| 卡片才加投影 | 给每个面板都加柔和的大投影 |

## 来源

- [mashirozx/arknights-ui](https://github.com/mashirozx/arknights-ui)、[YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui)（面板色值与结构）
- [《明日方舟》UI/UX 分析——藏在好看背后的先进性](https://www.gameres.com/849200.html)（卡片阴影、毛玻璃、浮层）
- [《明日方舟》UI/UX 设计复盘](https://www.gcores.com/articles/123154)（基建抽屉；文中的实机截图用于核对抽屉与兑换弹层，2026-10-07）
- 官网样式表实测（2026-10-06）
