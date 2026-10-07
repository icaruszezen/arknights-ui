import type { Meta, StoryObj } from '@storybook/react-vite'
import { scene } from '../../../.storybook/art'
import { HudCounter, HudCounterItem } from './HudCounter'

const meta = {
  title: '场景/作战/HudCounter',
  component: HudCounter,
  subcomponents: { HudCounterItem },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof HudCounter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 顶部正中的战况：橙色的准星配敌方的击杀数，蓝色的塔配我方的生命点数。
 * 底板是直角矩形，两端和两项之间各一条短竖线。数字用数据体，分子分母同大；
 * 生命点数的数字是浅红。名称只给读屏。
 */
export const Default: Story = {
  render: args => (
    <HudCounter {...args}>
      <HudCounterItem side="enemy" label="击杀" value={12} max={47} />
      <HudCounterItem side="ally" label="生命点数" value={3} />
    </HudCounter>
  ),
}

/**
 * 它不自己定位。这里用 `absolute` 贴在战场的顶边正中：信息贴四边，中间留给战场。
 * 场景是代码画的占位图。
 */
export const OnField: Story = {
  render: args => (
    <div className="relative isolate aspect-video w-[44rem] overflow-hidden">
      <img src={scene()} alt="" className="absolute inset-0 -z-1 block size-full object-cover" />
      <HudCounter {...args} className="absolute top-0 left-1/2 -translate-x-1/2">
        <HudCounterItem side="enemy" label="击杀" value={12} max={47} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>
    </div>
  ),
}

/** 只有一项也可以。 */
export const Single: Story = {
  render: args => (
    <HudCounter {...args}>
      <HudCounterItem side="ally" label="生命点数" value={10} />
    </HudCounter>
  ),
}
