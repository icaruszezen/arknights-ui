import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Resource, ResourceBar } from './ResourceBar'

const meta = {
  title: '导航/ResourceBar',
  component: ResourceBar,
  subcomponents: { Resource },
  // 每一项的底是半透明的，放在场景上才看得出来
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof ResourceBar>

export default meta
type Story = StoryObj<typeof meta>

// 占位的图标：几何图形加一个颜色，不对应任何官方的资源图标。
// 外面多包了一层用来上色，所以要自己把图形撑满图标的那一格
const tinted = 'grid size-full place-items-center [&>svg]:block [&>svg]:size-full'
const lmd = <span className={`${tinted} text-ark-signal`}>{glyphs.frame}</span>
const originite = <span className={`${tinted} text-ark-signal-danger`}>{glyphs.diamond}</span>
const orundum = <span className={`${tinted} text-ark-tier-5`}>{glyphs.shield}</span>

/**
 * 实机的写法：每一项只有图标和数字，名称只读给读屏；可以购买的资源后面带一个圆形的加号。
 * 有上限的写成小而灰的分母。
 */
export const Default: Story = {
  render: args => (
    <ResourceBar {...args}>
      <Resource label="龙门币" icon={lmd} value={128400} />
      <Resource label="至纯源石" icon={originite} value={82} onAdd={() => {}} />
      <Resource label="合成玉" icon={orundum} value={6000} onAdd={() => {}} />
      <Resource label="无人机" icon={glyphs.slashes} value={0} max={200} onAdd={() => {}} />
    </ResourceBar>
  ),
}

/** 主界面的写法：不画底，数字直接压在场景上。 */
export const Plain: Story = {
  args: { plain: true },
  render: args => (
    <ResourceBar {...args}>
      <Resource label="龙门币" icon={lmd} value={2538950} />
      <Resource label="至纯源石" icon={originite} value={82335} onAdd={() => {}} />
      <Resource label="合成玉" icon={orundum} value={416} onAdd={() => {}} />
    </ResourceBar>
  ),
}

/** 没有图标时名称照常显示：组件库不带图标，这是最省事的用法。 */
export const TextOnly: Story = {
  render: args => (
    <ResourceBar {...args}>
      <Resource label="龙门币" value={128400} />
      <Resource label="合成玉" value={6000} />
      <Resource label="理智" value={131} max={135} />
    </ResourceBar>
  ),
}

/** 贴在右上角。和左上角的返回、主页一样，位置从不改变。 */
export const TopRight: Story = {
  render: args => (
    <div className="relative -m-ark-6 h-40">
      <ResourceBar {...args} className="absolute top-0 right-0">
        <Resource label="龙门币" icon={lmd} value={128400} />
        <Resource label="合成玉" icon={orundum} value={6000} onAdd={() => {}} />
        <Resource label="理智" value={131} max={135} />
      </ResourceBar>
    </div>
  ),
}

/** 需要时把名称和图标一起显示。 */
export const WithLabel: Story = {
  render: args => (
    <ResourceBar {...args}>
      <Resource label="理智" icon={glyphs.chevrons} value={131} max={135} showLabel />
      <Resource label="合成玉" icon={orundum} value={6000} showLabel />
    </ResourceBar>
  ),
}
