// tokens/tokens.json -> tokens/tokens.css + tokens/tailwind.css
// 用法：node scripts/build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens/tokens.json'), 'utf8'))
const meta = tokens.$meta
const labels = { measured: '实测', community: '社区', estimated: '估计' }

// Tailwind v4 主题命名空间 <- token 路径前缀。
// 没有对应命名空间的 token（时长、线宽、切角、底纹等）不映射，
// 在类名里用变量简写直接引用，例如 duration-(--ark-motion-duration-base)。
const namespaces = [
  ['color', 'color'],
  ['font', 'font.family'],
  ['text', 'font.size'],
  ['font-weight', 'font.weight'],
  ['tracking', 'font.tracking'],
  ['leading', 'font.leading'],
  ['spacing', 'space'],
  ['radius', 'radius'],
  ['shadow', 'shadow'],
  ['drop-shadow', 'shadow'],
  ['text-shadow', 'shadow'],
  ['blur', 'blur'],
  ['ease', 'motion.easing'],
]

const remark = token => {
  const comment = [labels[token.source], token.note].filter(Boolean).join(' · ')
  return comment ? ` /* ${comment} */` : ''
}

const lines = []
const theme = new Map(namespaces.map(([namespace]) => [namespace, []]))
const walk = (node, path) => {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    // 语义层不是调色板的一部分，按明暗另外生成
    if (path.length === 0 && key === 'theme') continue
    const next = [...path, key]
    if (Object.hasOwn(child, 'value')) {
      lines.push(`  --${meta.prefix}-${next.join('-')}: ${child.value};${remark(child)}`)
      for (const [namespace, prefix] of namespaces) {
        const head = prefix.split('.')
        if (!head.every((segment, i) => next[i] === segment)) continue
        const name = next.slice(head.length).join('-')
        theme.get(namespace).push(`  --${namespace}-${meta.prefix}-${name}: var(--${meta.prefix}-${next.join('-')});`)
      }
    } else {
      if (path.length === 0) lines.push('', `  /* ${key} */`)
      walk(child, next)
    }
  }
}
walk(tokens, [])

// 语义层。dark 与 light 的键名必须相同；每一套里并排带着另一套的取值（--ark-inv-*），
// 给 data-ark-tone="inverse" 用：它不知道自己在哪个主题里，只管把 inv 的那一份拿来当正的。
const { shared, dark, light } = tokens.theme
const entries = group => Object.entries(group).filter(([key]) => !key.startsWith('$'))
const darkKeys = entries(dark).map(([key]) => key)
const lightKeys = entries(light).map(([key]) => key)
if (darkKeys.join() !== lightKeys.join()) {
  throw new Error('theme.dark 与 theme.light 的键名或顺序不一致')
}
// 画布是整页的事，反色面不需要它
const flipped = darkKeys.filter(key => key !== 'canvas')
const declare = (group, indent) =>
  entries(group).map(([key, token]) => `${indent}--${meta.prefix}-${key}: ${token.value};${remark(token)}`)
const scheme = (own, other, indent = '  ') => [
  ...declare(own, indent),
  `${indent}/* 反面的取值，data-ark-tone="inverse" 取用 */`,
  ...flipped.map(key => `${indent}--${meta.prefix}-inv-${key}: ${other[key].value};`),
]

const semantic = `
/*
 * 语义层：组件只引用这一层，不直接取调色板。
 * - 主题：data-ark-theme="dark | light | auto" 写在任意祖先上，不写就是暗色；auto 跟随系统。
 * - 明暗上下文：data-ark-tone="dark | light" 让一棵子树换一套取值（纸白面板就是这样）；
 *   "inverse" 换成与所在主题相反的那一套，只翻一层。
 */
:root {
${declare(shared, '  ').join('\n')}
}

:root,
[data-${meta.prefix}-theme="dark"],
[data-${meta.prefix}-tone="dark"] {
${scheme(dark, light).join('\n')}
}

[data-${meta.prefix}-theme="light"],
[data-${meta.prefix}-tone="light"] {
${scheme(light, dark).join('\n')}
}

@media (prefers-color-scheme: light) {
  [data-${meta.prefix}-theme="auto"] {
${scheme(light, dark, '    ').join('\n')}
  }
}

[data-${meta.prefix}-tone="inverse"] {
${flipped.map(key => `  --${meta.prefix}-${key}: var(--${meta.prefix}-inv-${key});`).join('\n')}
}
`

const css = `/*
 * ${meta.name}
 * 由 scripts/build-tokens.mjs 从 tokens/tokens.json 生成，请勿手改。
 * 实测来源：${meta.measuredFrom}（${meta.measuredAt}）
 * ${meta.disclaimer}
 */
:root {${lines.join('\n')}
}
${semantic}`

// 语义层里是颜色的键，同样映射成 Tailwind 的颜色（bg-ark-surface、text-ark-fg）
const semanticColors = [...entries(shared), ...entries(dark)]
  .filter(([, token]) => token.tailwind !== false)
  .map(([key]) => `  --color-${meta.prefix}-${key}: var(--${meta.prefix}-${key});`)

const groups = [...theme].map(([namespace, vars]) => [`  /* ${namespace} */`, ...vars].join('\n'))
groups.splice(1, 0, ['  /* color · 语义层 */', ...semanticColors].join('\n'))
const tailwind = `/*
 * ${meta.name} · Tailwind CSS v4 主题映射
 * 由 scripts/build-tokens.mjs 从 tokens/tokens.json 生成，请勿手改。
 * 需与 tokens.css 一起引入：这里的值全部指向 --${meta.prefix}-* 变量。
 * 键名统一带 ${meta.prefix}- 前缀，不会覆盖 Tailwind 的默认主题，例如
 * bg-${meta.prefix}-signal-info、text-${meta.prefix}-body、font-${meta.prefix}-data、p-${meta.prefix}-4。
 * ${meta.disclaimer}
 */
@theme inline {
${groups.join('\n\n')}
}
`

writeFileSync(resolve(root, 'tokens/tokens.css'), css)
writeFileSync(resolve(root, 'tokens/tailwind.css'), tailwind)
console.log(`tokens.css: ${lines.filter(l => l.includes('--')).length} variables`)
console.log(`tailwind.css: ${[...theme.values()].flat().length + semanticColors.length} theme variables`)
