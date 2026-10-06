import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scene, scenes } from '../.storybook/art'
import {
  Button,
  ChapterTitle,
  DialogueBox,
  Glitch,
  Portrait,
  Scrim,
  StoryControl,
  StoryControls,
} from './index'

// 不是组件，只是把剧情相关的组件按游戏里的编排拼在一起：
// 章节标题是每一章的“电影片头”；对话时界面退到最少，只留底部的文字和角落的几个小按钮。
// 图片全部是代码画的占位图，标题和台词是演示用的占位文案。
const meta = {
  title: '示例/剧情',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const lines = [
  { who: 'a', name: '占位干员甲', text: '我们到了。这里就是地图上标的那座旧仓库。' },
  { who: 'b', name: '占位干员乙', text: '门是从里面锁上的。有人比我们先到。' },
  { who: null, name: undefined, text: '风停了。远处传来金属门被拉开的声音。' },
  // 这一句之前信号不稳：故障在这里不是装饰，而是叙事
  { who: 'a', name: '占位干员甲', text: '……博士，你那边还听得到吗？', glitch: true },
  { who: 'b', name: '占位干员乙', text: '信号恢复了。继续前进。' },
] as const

const dim = 'brightness-50'
const fade = 'transition-[filter] duration-(--ark-motion-duration-base) ease-ark-standard'

export const Episode: Story = {
  name: '剧情',
  render: function Reader() {
    // -1 是标题页，之后是第几句
    const [index, setIndex] = useState(-1)
    const [auto, setAuto] = useState(false)
    const [hidden, setHidden] = useState(false)
    const line = index >= 0 ? lines[index] : undefined
    const glitches = lines.filter((entry, i) => i <= index && 'glitch' in entry).length

    if (line === undefined) {
      return (
        <div className="relative isolate -m-ark-6 box-border grid h-screen min-h-[30rem] content-end overflow-hidden p-ark-8">
          <img
            src={scenes[3]}
            alt=""
            className="absolute inset-0 -z-2 block size-full object-cover saturate-[0.6]"
          />
          <Scrim side="left" className="-z-1 from-ark-neutral-black/90" />
          <div className="relative grid justify-items-start gap-ark-6">
            {/* 用字体讲题材：同一套骨架，换一款标题字就换了一种气质 */}
            <ChapterTitle as="h1" number={8} sub="长夜" caption="ДОЛГАЯ НОЧЬ">
              The Long Night
            </ChapterTitle>
            <Button variant="primary" sub="START" arrow onClick={() => setIndex(0)}>
              开始阅读
            </Button>
          </div>
        </div>
      )
    }

    return (
      <Glitch trigger={glitches} className="-m-ark-6 h-screen min-h-[30rem] overflow-hidden">
        <img src={scene()} alt="" className="absolute inset-0 -z-2 block size-full object-cover" />
        {/* 说话的一方是亮的，未说话的一方压暗 */}
        <Portrait
          src={figure('#9aa3a8')}
          alt=""
          shadow={false}
          className={`absolute bottom-0 left-[20%] -z-1 h-[90%] w-[20%] ${fade} ${line.who === 'a' ? '' : dim}`}
        />
        <Portrait
          src={figure('#a39a8f', '#ffd802')}
          alt=""
          shadow={false}
          className={`absolute right-[20%] bottom-0 -z-1 h-[90%] w-[20%] ${fade} ${line.who === 'b' ? '' : dim}`}
        />

        {/* 阅读时让界面消失：没有边框的文字区，比一个精致的对话框更不打扰 */}
        {!hidden && (
          <DialogueBox
            speaker={line.name}
            onAdvance={() => setIndex(index + 1 < lines.length ? index + 1 : -1)}
          >
            {line.text}
          </DialogueBox>
        )}

        {/* 控件贴右上角，半透明，不抢画面 */}
        <StoryControls aria-label="剧情控制" className="absolute top-ark-4 right-ark-4">
          <StoryControl pressed={auto} onClick={() => setAuto(!auto)}>
            自动
          </StoryControl>
          <StoryControl onClick={() => setIndex(-1)}>跳过</StoryControl>
          <StoryControl pressed={hidden} onClick={() => setHidden(!hidden)}>
            隐藏界面
          </StoryControl>
        </StoryControls>
      </Glitch>
    )
  },
}
