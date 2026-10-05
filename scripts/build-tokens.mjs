// tokens/tokens.json -> tokens/tokens.css
// 用法：node scripts/build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens/tokens.json'), 'utf8'))
const meta = tokens.$meta
const labels = { measured: '实测', community: '社区', estimated: '估计' }

const lines = []
const walk = (node, path) => {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    const next = [...path, key]
    if (Object.hasOwn(child, 'value')) {
      const comment = [labels[child.source], child.note].filter(Boolean).join(' · ')
      lines.push(`  --${meta.prefix}-${next.join('-')}: ${child.value};${comment ? ` /* ${comment} */` : ''}`)
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

writeFileSync(resolve(root, 'tokens/tokens.css'), css)
console.log(`tokens.css: ${lines.filter(l => l.includes('--')).length} variables`)
