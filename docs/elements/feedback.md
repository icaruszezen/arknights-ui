# 反馈

> 弹窗是横贯屏幕的一条带，不是悬在中间的一个盒子。提示靠左侧一条色边说明级别。

## 特征拆解

**1. 通栏横带式弹窗。** 游戏内的确认弹窗不是居中的圆角卡片，而是一条横贯屏幕的深色带：中间写问题，下方是左右对开的两个大按钮。上下两侧露出被压暗的原页面。

**2. 按钮对开，位置固定。** 取消在左（深色块），确认在右（浅色块），各占一半宽度。全游戏一致，形成肌肉记忆。

**3. 次级系统在原页面上呼出。** 签到、邮件、设置等不跳转新页面，而是在当前页面上以浮层形式出现，背景模糊。用户始终知道自己在哪。

**4. 抽屉直接关闭。** 抽屉式页面应当“点返回即关闭”。早期基建的抽屉在关闭时带二次确认，被评论文章指为不符合常见产品逻辑——反馈层级不应比操作本身更重。

**5. 提示条用色边分级。** 信息用蓝边，警示用黄边（可加一条警戒条纹），错误用红边。底色保持深色，不整条变色。

**6. 加载展示内容。** 长加载时铺满插画，短加载用一条细进度条加百分比和英文状态文字。

**7. 奖励有光。** 获得物品时，物品图标背后有一圈静态的放射光。这是少数允许“发光”的时刻，因为它标记的是一次正向结果。

**8. 可点击的东西要看得出来。** 评论文章指出干员详情页左侧的属性、信赖、攻击范围其实可以点击，但外观与不可点击的文字没有区别。可交互元素至少需要一个视觉线索（描边、箭头、底色）。

## 规范

### 弹窗（估计）

| 项 | 值 |
| --- | --- |
| 遮罩 | `--ark-color-overlay-scrim` 至 `--ark-color-overlay-scrim-strong`，可加 `backdrop-filter: blur(0.5rem)` |
| 内容带 | 通栏，`--ark-color-neutral-graphite-deep` 约 95% 不透明，上沿 1–2px 亮线 |
| 文字 | 居中，中文 `1rem–1.125rem`；补充数值用数据体小字 |
| 按钮 | 两块等宽：左 `--ark-color-neutral-graphite` 白字，右 `--ark-color-neutral-paper` 深字 |
| 按钮高度 | 不低于 44px |
| 入场 | 内容带纵向展开或淡入，`--ark-motion-duration-base` |

### 提示条

| 级别 | 左边色 | 附加 | 可信度 |
| --- | --- | --- | --- |
| 信息 | `--ark-color-signal-info` | — | 估计 |
| 警示 | `--ark-color-signal-action` | 顶部 `--ark-pattern-hazard` 窄边 | 估计 |
| 错误 | `--ark-color-signal-danger` | — | 估计 |
| 底色 | `--ark-color-neutral-ink-900` | — | 估计 |

### 加载

| 项 | 值 | 可信度 |
| --- | --- | --- |
| 进度条 | 轨道 1–2px 白 30%，进度 4px 信号色 | 估计 |
| 状态文字 | 数据体大写，`0.75rem`，如 `LOADING ASSETS...` | 估计 |
| 百分比 | 数据体，右对齐 | 估计 |
| 旋转指示 | `1s linear infinite` | 实测（官网轮播预加载） |
| 光标闪烁 | `1s step-end` | 实测 |

### 空状态

虚线框 + 窄体英文 `NO DATA` + 中文小字说明。不放插画。它是画面里最安静的一块，但文字必须读得清。

| 项 | 取值 | 可信度 |
| --- | --- | --- |
| 文字（`NO DATA` 与说明） | 所在表面的次要文字色：黑底 `--ark-color-neutral-gray-400`，石墨面板 `--ark-color-neutral-gray-300`，纸白面板 `--ark-color-neutral-gray-600` | 估计 |
| 虚线框 | `1px dashed`，颜色取文字色的 50% 不透明度；黑底上约等于 `--ark-color-neutral-gray-600` | 估计 |

> **已知问题：原取值对比度不足（2026-10-06 记录）。** 这一节原先写的是三样“全部使用 `--ark-color-neutral-gray-600`”。给 React 组件做无障碍检查（axe-core）时发现，`#585858` 的文字在纯黑底上只有 2.95:1，达不到 WCAG 2 AA 对正文要求的 4.5:1；放进石墨面板只剩 1.53:1。没有说明文字时 `NO DATA` 是唯一的信息，问题最明显。
>
> 现在的取值是本仓库为满足对比度做的设计决定，不是从游戏里量出来的。虚线框是装饰，不受 4.5:1 约束，所以保持原来的暗度。

各档灰用作文字时的对比度（按 WCAG 2 公式计算，加粗的是该表面上的取值）：

| 文字色 | 纯黑画布 | 石墨面板 | 纸白面板 |
| --- | --- | --- | --- |
| `gray-600` `#585858`（原取值） | 2.95 | 1.53 | **5.57** |
| `gray-500` `#8d8d8d` | 6.33 | 3.29 | 2.60 |
| `gray-400` `#ababab` | **9.14** | 4.75 | 1.80 |
| `gray-300` `#d2d2d2` | 13.89 | **7.22** | 1.18 |

石墨、纸白面板是半透明的，表中按压在纯黑底上计算（约 `#3d3d3d`、`#e4e4e2`）。石墨面板下面的场景越亮，对比度越低：压在 `#465560` 上时 `gray-400` 只有 4.29，所以石墨面板取 `gray-300`。

“纯黑画布”一列的取值对 `#333333` 及更深的底色都成立（`gray-400` 在 `#333333` 上是 5.50）。直接压在更亮的场景图上就不够了，在 `#465560` 上只有 3.35；这时先加遮罩或放进面板，做法见 [图片](../foundations/imagery.md)。

```html
<dialog class="ark-dialog">
  <p>是否消耗 1 份应急理智合剂恢复理智？</p>
  <form method="dialog">
    <button value="cancel">取消</button>
    <button value="ok">确认</button>
  </form>
</dialog>
```

```css
.ark-dialog { width: 100vw; max-width: none; margin: auto 0; padding: 0; border: 0;
              background: var(--ark-color-neutral-graphite-deep); color: #fff; text-align: center; }
.ark-dialog::backdrop { background: var(--ark-color-overlay-scrim);
                        backdrop-filter: blur(var(--ark-blur-backdrop)); }
.ark-dialog form { display: grid; grid-template-columns: 1fr 1fr; }
.ark-dialog button { min-height: 2.75rem; border: 0; font: 700 1rem/1 var(--ark-font-family-cjk-sans); }
.ark-dialog button[value="cancel"] { background: var(--ark-color-neutral-graphite); color: #fff; }
.ark-dialog button[value="ok"]     { background: var(--ark-color-neutral-paper); color: var(--ark-color-neutral-paper-ink); }
```

## 示意图

![反馈元素](../assets/feedback.svg)

## 官方参考

| 看什么 | 链接 | 说明 |
| --- | --- | --- |
| 浮层与层级简化 | [UI/UX 分析（GameRes）](https://www.gameres.com/849200.html) | “过场衔接技巧与系统结构”一节 |
| 抽屉关闭逻辑、可点击区域不明显 | [《明日方舟》UI/UX 设计复盘](https://www.gcores.com/articles/123154) | “不足 2”“不足 3” |
| 弹层的社区实现 | [ak-ui · Components](https://ak-ui.yyj.moe/en/components/) | Dialog、Notice、Loading |

## Do / Don't

| Do | Don't |
| --- | --- |
| 弹窗通栏，露出上下的原页面 | 居中圆角小卡片 |
| 确认右、取消左，全站一致 | 危险操作时把按钮顺序反过来 |
| 用色边区分提示级别 | 整条提示变成大红大黄 |
| 可点击元素给出视觉线索 | 让可点击文字与普通文字长得一样 |
| 反馈的重量与操作相称 | 关闭一个抽屉也要二次确认 |
| 空状态的文字用所在表面的次要文字色 | 为了“安静”把文字压到 4.5:1 以下 |

## 来源

- [《明日方舟》UI/UX 分析——藏在好看背后的先进性](https://www.gameres.com/849200.html)
- [《明日方舟》UI/UX 设计复盘](https://www.gcores.com/articles/123154)
- 官网样式表实测（2026-10-06）；游戏内弹窗结构为观察归纳
- 空状态的对比度：axe-core 检查与 WCAG 2 对比度公式计算（2026-10-06）
