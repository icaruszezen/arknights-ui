import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scene } from '../../../.storybook/art'
import { Portrait } from '../Portrait'
import { StoryControl, StoryControls } from '../StoryControls'
import { DialogueBox } from './DialogueBox'

const meta = {
  title: '场景/剧情/DialogueBox',
  component: DialogueBox,
  args: { speaker: '占位干员甲', children: '我们到了。这里就是地图上标的那座旧仓库。' },
} satisfies Meta<typeof DialogueBox>

export default meta
type Story = StoryObj<typeof meta>

// 场景和立绘都是代码画的占位图；台词是演示用的占位文案
const stage = 'relative isolate aspect-video w-[56rem] max-w-full overflow-hidden'
const backdrop = (
  <img src={scene()} alt="" className="absolute inset-0 -z-2 block size-full object-cover" />
)

/**
 * 没有“框”：文字区是底部一片自下而上的黑色渐变。说话人在左，较小、偏灰；正文在右，白色。
 * 它默认贴在父元素的底边。
 */
export const Default: Story = {
  render: args => (
    <div className={stage}>
      {backdrop}
      <DialogueBox {...args} />
    </div>
  ),
}

/** 旁白没有说话人。正文的左边线不跟着跳。 */
export const Narration: Story = {
  args: { speaker: undefined, children: '风停了。远处传来金属门被拉开的声音。' },
  render: args => (
    <div className={stage}>
      {backdrop}
      <DialogueBox {...args} />
    </div>
  ),
}

/**
 * 一段对话：点文字区（或聚焦后按回车）到下一句，正文末尾闪烁的三角表示“后面还有”。
 * 说话的一方立绘是亮的，未说话的一方压暗。控件贴在右上角，不抢画面。
 */
export const Conversation: Story = {
  render: function Scene() {
    const lines = [
      { who: 'a', name: '占位干员甲', text: '我们到了。这里就是地图上标的那座旧仓库。' },
      { who: 'b', name: '占位干员乙', text: '门是从里面锁上的。有人比我们先到。' },
      { who: null, name: undefined, text: '风停了。远处传来金属门被拉开的声音。' },
      { who: 'a', name: '占位干员甲', text: '……先别出声。' },
    ] as const
    const [index, setIndex] = useState(0)
    const [auto, setAuto] = useState(false)
    const line = lines[index % lines.length] ?? lines[0]
    const dim = 'transition-[filter] duration-(--ark-motion-duration-base) brightness-50'
    return (
      <div className={stage}>
        {backdrop}
        <Portrait
          src={figure('#9aa3a8')}
          alt=""
          shadow={false}
          className={`absolute bottom-0 left-[18%] -z-1 h-[92%] w-[22%] ${line.who === 'a' ? '' : dim}`}
        />
        <Portrait
          src={figure('#a39a8f', '#ffd802')}
          alt=""
          shadow={false}
          className={`absolute right-[18%] bottom-0 -z-1 h-[92%] w-[22%] ${line.who === 'b' ? '' : dim}`}
        />
        <DialogueBox speaker={line.name} onAdvance={() => setIndex(index + 1)}>
          {line.text}
        </DialogueBox>
        <StoryControls aria-label="剧情控制" className="absolute top-ark-4 right-ark-4">
          <StoryControl pressed={auto} onClick={() => setAuto(!auto)}>
            自动
          </StoryControl>
          <StoryControl onClick={() => setIndex(lines.length - 1)}>跳过</StoryControl>
          <StoryControl onClick={() => setIndex(0)}>回顾</StoryControl>
        </StoryControls>
      </div>
    )
  },
}
