import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { scene } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { StoryControl, StoryControls } from './StoryControls'

const meta = {
  title: '场景/剧情/StoryControls',
  component: StoryControls,
  subcomponents: { StoryControl },
  args: { 'aria-label': '剧情控制' },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof StoryControls>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 角落里的一组小按钮：半透明黑底、小号文字，悬停整块反白。
 * 可见的形状只有 28px 高，点击区撑到 44px。
 */
export const Default: Story = {
  render: args => (
    <StoryControls {...args}>
      <StoryControl>自动</StoryControl>
      <StoryControl>跳过</StoryControl>
      <StoryControl>回顾</StoryControl>
      <StoryControl>隐藏界面</StoryControl>
    </StoryControls>
  ),
}

/** “自动”是一个开关：打开时保持反白，并告诉读屏它处于按下的状态。 */
export const Toggle: Story = {
  render: function Controls(args) {
    const [auto, setAuto] = useState(true)
    return (
      <StoryControls {...args}>
        <StoryControl pressed={auto} onClick={() => setAuto(!auto)}>
          自动
        </StoryControl>
        <StoryControl>跳过</StoryControl>
        <StoryControl disabled>回顾</StoryControl>
      </StoryControls>
    )
  },
}

/** 它不自己定位。这里贴在剧情画面的右上角。图标是演示用的自绘几何图形。 */
export const InCorner: Story = {
  render: args => (
    <div className="relative isolate aspect-video w-[44rem] max-w-full overflow-hidden">
      <img src={scene()} alt="" className="absolute inset-0 -z-1 block size-full object-cover" />
      <StoryControls {...args} className="absolute top-ark-3 right-ark-3">
        <StoryControl icon={glyphs.bars}>回顾</StoryControl>
        <StoryControl icon={glyphs.forward}>跳过</StoryControl>
      </StoryControls>
    </div>
  ),
}

/**
 * 作战界面右上角的倍速、暂停是另一种形状：`shape="square"`，5rem 见方的深色方块，
 * 文字在上、图标在下。只放图标的键用 `aria-label` 取名。
 */
export const Square: Story = {
  render: function Battle(args) {
    const [speed, setSpeed] = useState(1)
    const [paused, setPaused] = useState(false)
    return (
      <div className="relative isolate aspect-video w-[44rem] max-w-full overflow-hidden">
        <img src={scene()} alt="" className="absolute inset-0 -z-1 block size-full object-cover" />
        <StoryControls {...args} aria-label="作战控制" className="absolute top-ark-3 right-ark-3">
          <StoryControl
            shape="square"
            icon={speed === 1 ? glyphs.play : glyphs.forward}
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          >
            {`${speed}X`}
          </StoryControl>
          <StoryControl
            shape="square"
            icon={glyphs.pause}
            aria-label="暂停"
            pressed={paused}
            onClick={() => setPaused(!paused)}
          />
        </StoryControls>
      </div>
    )
  },
}
