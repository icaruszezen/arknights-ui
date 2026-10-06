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

/**
 * 它不自己定位。这里贴在画面的右上角；作战界面的倍速、暂停、设置也是这种排法。
 * 图标是演示用的自绘几何图形。
 */
export const InCorner: Story = {
  render: function Battle(args) {
    const [speed, setSpeed] = useState(1)
    const [paused, setPaused] = useState(false)
    return (
      <div className="relative isolate aspect-video w-[44rem] max-w-full overflow-hidden">
        <img src={scene()} alt="" className="absolute inset-0 -z-1 block size-full object-cover" />
        <StoryControls {...args} aria-label="作战控制" className="absolute top-ark-3 right-ark-3">
          <StoryControl onClick={() => setSpeed(speed === 1 ? 2 : 1)} className="font-ark-data">
            {`${speed}X`}
          </StoryControl>
          <StoryControl icon={glyphs.bars} pressed={paused} onClick={() => setPaused(!paused)}>
            暂停
          </StoryControl>
          <StoryControl icon={glyphs.target}>设置</StoryControl>
        </StoryControls>
      </div>
    )
  },
}
