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

const lines = []
const theme = new Map(namespaces.map(([namespace]) => [namespace, []]))
const walk = (node, path) => {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    const next = [...path, key]
    if (Object.hasOwn(child, 'value')) {
      const comment = [labels[child.source], child.note].filter(Boolean).join(' · ')
      lines.push(`  --${meta.prefix}-${next.join('-')}: ${child.value};${comment ? ` /* ${comment} */` : ''}`)
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

const css = `/*
 * ${meta.name}
 * 由 scripts/build-tokens.mjs 从 tokens/tokens.json 生成，请勿手改。
 * 实测来源：${meta.measuredFrom}（${meta.measuredAt}）
 * ${meta.disclaimer}
 */
:root {${lines.join('\n')}
}
`

const groups = [...theme].map(([namespace, vars]) => [`  /* ${namespace} */`, ...vars].join('\n'))
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
console.log(`tailwind.css: ${[...theme.values()].flat().length} theme variables`)
