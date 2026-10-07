import type { Meta, StoryObj } from '@storybook/react-vite'
import { type GlyphName, glyphs } from '../../../.storybook/glyphs'
import { QuickNav, QuickNavItem } from './QuickNav'

const meta = {
  title: '导航/QuickNav',
  component: QuickNav,
  subcomponents: { QuickNavItem },
  args: { 'aria-label': '快捷导航' },
  // 横条是半透明的，放在场景上才看得出来
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof QuickNav>

export default meta
type Story = StoryObj<typeof meta>

const systems: readonly (readonly [string, string, string, GlyphName])[] = [
  ['home', '首页', 'HOME', 'diamond'],
  ['squads', '编队', 'SQUADS', 'blocks'],
  ['operator', '干员', 'OPERATOR', 'peak'],
  ['terminal', '作战', 'TERMINAL', 'target'],
  ['intel', '情报', 'INTEL', 'bars'],
  ['base', '基建', 'BASE', 'frame'],
  ['store', '采购中心', 'STORE', 'shield'],
]

/**
 * 黑色半透明的带上一根轴线，串着一排圆形节点；名称和图标上下交错地挂在两侧。
 * 当前项是信号色，节点外面多两圈同心圆。它提供从任意页面直达任意系统的捷径。
 */
export const Default: Story = {
  render: args => (
    <QuickNav {...args}>
      {systems.map(([id, label, , glyph]) => (
        <QuickNavItem key={id} href={`#${id}`} icon={glyphs[glyph]} current={id === 'operator'}>
          {label}
        </QuickNavItem>
      ))}
    </QuickNav>
  ),
}

/** 没有图标时只剩名称。 */
export const TextOnly: Story = {
  render: args => (
    <QuickNav {...args}>
      {systems.map(([id, label]) => (
        <QuickNavItem key={id} href={`#${id}`} current={id === 'operator'}>
          {label}
        </QuickNavItem>
      ))}
    </QuickNav>
  ),
}

/** 实机里没有英文；需要中英成对时给 `sub`。 */
export const WithSub: Story = {
  render: args => (
    <QuickNav {...args}>
      {systems.map(([id, label, sub, glyph]) => (
        <QuickNavItem
          key={id}
          href={`#${id}`}
          sub={sub}
          icon={glyphs[glyph]}
          current={id === 'operator'}
        >
          {label}
        </QuickNavItem>
      ))}
    </QuickNav>
  ),
}

/** 放不下时横向滚动，而不是把每一项缩小。轴线跟着一起滚，不会断。 */
export const Overflow: Story = {
  render: args => (
    <div className="w-80">
      <QuickNav {...args}>
        {systems.map(([id, label, , glyph]) => (
          <QuickNavItem key={id} href={`#${id}`} icon={glyphs[glyph]} current={id === 'terminal'}>
            {label}
          </QuickNavItem>
        ))}
      </QuickNav>
    </div>
  ),
}
