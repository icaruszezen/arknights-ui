import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuickNav, QuickNavItem } from '../QuickNav'
import { BackHome } from './BackHome'

const meta = {
  title: '导航/BackHome',
  component: BackHome,
  // 贴在场景的左上角
  globals: { backgrounds: { value: 'scene' } },
  decorators: [
    Story => (
      <div className="-m-ark-6 h-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackHome>

export default meta
type Story = StoryObj<typeof meta>

const quickNav = (
  <QuickNav aria-label="快捷导航">
    <QuickNavItem href="#home" sub="HOME">
      首页
    </QuickNavItem>
    <QuickNavItem href="#terminal" sub="TERMINAL">
      作战
    </QuickNavItem>
    <QuickNavItem href="#squads" sub="SQUADS">
      编队
    </QuickNavItem>
    <QuickNavItem href="#operator" sub="OPERATOR" current>
      干员
    </QuickNavItem>
    <QuickNavItem href="#base" sub="BASE">
      基建
    </QuickNavItem>
    <QuickNavItem href="#store" sub="STORE">
      采购
    </QuickNavItem>
  </QuickNav>
)

/**
 * 两个相邻的斜切色块：返回是深灰、右侧一条 45° 斜边，主页稍浅、是平行四边形，两块咬合。
 * 悬停整块反白。点击区和看到的形状一致。
 */
export const Default: Story = {}

/**
 * 隐藏式快捷导航：把 `QuickNav` 作为子元素传入，主页块就成了它的开关。
 * 平时不占空间，展开后可以直接跳到任何一个系统。按 Esc、点别处或选了一项之后收起。
 */
export const WithQuickNav: Story = {
  args: { children: quickNav, defaultExpanded: true },
}

/** 返回和主页都可以是链接。 */
export const AsLinks: Story = {
  args: { backHref: '#operators', homeHref: '#home', backLabel: '返回干员列表' },
}
