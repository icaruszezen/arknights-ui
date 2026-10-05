# 按钮

> 按钮是一块色面，不是一个胶囊。直角、平涂、双语两行，悬停时整块换色。

## 特征拆解

**1. 实心色块。** 主按钮是一整块青蓝，上面压黑字。没有圆角、没有渐变、没有投影。它看起来更像一张贴在画面上的标签，而不是一个“可以按下去”的立体物。

**2. 双语两行。** 中文在上（粗、大），英文在下（小、数据体）。英文不是装饰：它给按钮增加了一条水平的底线，让色块在视觉上更稳。

**3. 方向三角。** 带跳转含义的按钮在右侧放一个实心三角，或在文字后加 `>`。

**4. 三个层级。**

| 层级 | 外观 | 用途 |
| --- | --- | --- |
| 主按钮 | 信号色实心块 + 黑字 | 一屏只有一个：更多情报、开始行动 |
| 次按钮 | 1px 白色半透明描边 + 白字 | 并列的次要操作 |
| 弱按钮 | 灰底小条 + 小号英文 | READ MORE、VIEW MORE |

**5. 悬停对调。** 主按钮悬停后底色由青蓝变白；描边按钮悬停后变成白底黑字。300ms，同时过渡 `color` 与 `background-color`。

**6. 游戏内：深浅拼块。** 游戏里的行动按钮由两块拼成：左边一块深色写代价（消耗的理智、合成玉），右边一块主色写动作。确认 / 取消成对出现时，确认是浅色块，取消是深色块，等宽对开。

**7. 代价写在按钮里。** “开始行动 -18”“寻访十次 6000”——点了会花掉什么，直接印在按钮上，不需要再读别处。

## 规范

| 项 | 主按钮 | 次按钮 | 弱按钮 | 可信度 |
| --- | --- | --- | --- | --- |
| 底色 | `--ark-color-signal-info` | 透明 | `--ark-color-neutral-gray-600` | 实测 |
| 文字色 | `#000` | `#fff` | `--ark-color-neutral-gray-300` | 实测 |
| 描边 | 无 | `1px solid rgba(255,255,255,.5)` | 无 | 实测 |
| 中文 | 思源黑体 Bold，`1.25rem` | 思源黑体，`1rem` | — | 实测 |
| 英文 | Bender Bold，`0.875rem` | — | Bender Bold，`0.875rem` | 实测 |
| 圆角 | `0` | `0` | `0`，可切一角 | 实测 / 社区 |
| 悬停 | 底色 → 白 | 底色 → 白，文字 → 黑 | 底色 → 白，文字 → 黑 | 实测 |
| 过渡 | `color .3s, background-color .3s` | 同左 | 同左 | 实测 |
| 最小点击区 | 44 × 44px | 44 × 44px | 44 × 44px（可见形状可以更小） | 社区 |

### 状态

| 状态 | 表现 |
| --- | --- |
| 默认 | 见上表 |
| 悬停 | 前景与背景对调 |
| 按下 | 位移 1–2px 或亮度降低（估计） |
| 选中 | 信号色描边 + 底部 4px 信号色条 |
| 禁用 | 底色 `#333333`，文字 `#8d8d8d`，不响应悬停 |
| 焦点 | 外侧 2–3px 高对比轮廓，不被切角裁掉 |

```html
<a class="ark-btn" href="#">
  <span class="ark-btn__zh">更多情报</span>
  <span class="ark-btn__en">READ MORE</span>
</a>
```

```css
.ark-btn {
  display: inline-grid; gap: var(--ark-space-1);
  padding: var(--ark-space-3) var(--ark-space-5);
  background: var(--ark-color-signal-info);
  color: #000;
  transition: color var(--ark-motion-duration-base),
              background-color var(--ark-motion-duration-base);
}
.ark-btn__zh { font: 700 var(--ark-font-size-body-lg)/1 var(--ark-font-family-cjk-sans); }
.ark-btn__en { font: 700 var(--ark-font-size-label)/1 var(--ark-font-family-data); }
@media (any-hover: hover) {
  .ark-btn:hover { background: var(--ark-color-neutral-white); }
}
```

## 示意图

![按钮解剖](../assets/buttons.svg)

## 官方参考

| 看什么 | 链接 | 说明 |
| --- | --- | --- |
| 主按钮（青蓝实心 + 双语） | [官网 · 情报](https://ak.hypergryph.com/#information) | 左下“更多情报 / READ MORE” |
| 弱按钮 | [官网 · 情报](https://ak.hypergryph.com/#information) | 列表下方的灰色 READ MORE |
| VIEW MORE + 短横线 | [官网 · 更多内容](https://ak.hypergryph.com/#more) | 四个入口的底部 |
| 社区实现 | [ak-ui · Buttons](https://ak-ui.yyj.moe/en/components/) | 可交互的按钮样例 |

## Do / Don't

| Do | Don't |
| --- | --- |
| 一屏一个主按钮 | 多个实心信号色按钮并排 |
| 直角、平涂 | 圆角胶囊、渐变、内发光 |
| 悬停整块换色 | 悬停只加一道发光描边 |
| 把代价写进按钮 | 让用户点了才知道要花什么 |
| 确认浅、取消深，位置固定 | 确认与取消的左右位置随场景变化 |

## 来源

- 官网计算样式实测（2026-10-06）
- [ak-ui · Official website UI study](https://ak-ui.yyj.moe/en/guide/official-site-study.html)
- 游戏内样式为观察归纳（估计）
