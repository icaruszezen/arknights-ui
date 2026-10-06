import type { Meta, StoryObj } from '@storybook/react-vite'
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

const systems = [
  ['home', '首页', 'HOME'],
  ['terminal', '作战', 'TERMINAL'],
  ['squads', '编队', 'SQUADS'],
  ['operator', '干员', 'OPERATOR'],
  ['base', '基建', 'BASE'],
  ['store', '采购', 'STORE'],
  ['mission', '任务', 'MISSION'],
] as const

/**
 * 黑色半透明横条，每一项是中文加英文小字。当前项是信号色加一条 4px 底条。
 * 它提供从任意页面直达任意系统的捷径。
 */
export const Default: Story = {
  render: args => (
    <QuickNav {...args}>
      {systems.map(([id, label, sub]) => (
        <QuickNavItem key={id} href={`#${id}`} sub={sub} current={id === 'operator'}>
          {label}
        </QuickNavItem>
      ))}
    </QuickNav>
  ),
}

/** 放不下时横向滚动，而不是把每一项缩小。 */
export const Overflow: Story = {
  render: args => (
    <div className="w-80">
      <QuickNav {...args}>
        {systems.map(([id, label, sub]) => (
          <QuickNavItem key={id} href={`#${id}`} sub={sub} current={id === 'terminal'}>
            {label}
          </QuickNavItem>
        ))}
      </QuickNav>
    </div>
  ),
}
