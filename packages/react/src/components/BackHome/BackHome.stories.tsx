import type { Meta, StoryObj } from '@storybook/react-vite'
import { type GlyphName, glyphs } from '../../../.storybook/glyphs'
import { QuickNav, QuickNavItem } from '../QuickNav'
import { BackHome } from './BackHome'

const meta = {
  title: '导航/BackHome',
  component: BackHome,
  // 贴在场景的左上角
  globals: { backgrounds: { value: 'scene' } },
  decorators: [
    Story => (
      <div className="-m-ark-6 h-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackHome>

export default meta
type Story = StoryObj<typeof meta>

const systems: readonly (readonly [string, string, GlyphName])[] = [
  ['home', '首页', 'diamond'],
  ['squads', '编队', 'blocks'],
  ['operator', '干员', 'peak'],
  ['terminal', '作战', 'target'],
  ['base', '基建', 'frame'],
  ['store', '采购中心', 'shield'],
]

const quickNav = (
  <QuickNav aria-label="快捷导航">
    {systems.map(([id, label, glyph]) => (
      <QuickNavItem key={id} href={`#${id}`} icon={glyphs[glyph]} current={id === 'operator'}>
        {label}
      </QuickNavItem>
    ))}
  </QuickNav>
)

/**
 * 两个并排的直角矩形：返回是深灰、细线箭头贴左，主页稍浅、更宽，图标居中。
 * 悬停整块反白。
 */
export const Default: Story = {}

/**
 * 隐藏式快捷导航：把 `QuickNav` 作为子元素传入，主页块就成了它的开关，展开时描一圈白边。
 * 平时不占空间，展开后可以直接跳到任何一个系统。按 Esc、点别处或选了一项之后收起。
 */
export const WithQuickNav: Story = {
  args: { children: quickNav, defaultExpanded: true },
}

/** 返回和主页都可以是链接。 */
export const AsLinks: Story = {
  args: { backHref: '#operators', homeHref: '#home', backLabel: '返回干员列表' },
}
