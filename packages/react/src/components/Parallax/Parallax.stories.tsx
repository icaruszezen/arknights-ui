import type { Meta, StoryObj } from '@storybook/react-vite'
import { figure, scene } from '../../../.storybook/art'
import { GhostTitle } from '../GhostTitle'
import { Heading } from '../Heading'
import { Portrait } from '../Portrait'
import { Scrim } from '../Scrim'
import { Parallax, ParallaxLayer } from './Parallax'

// 占位图都是代码画的，不是官方素材
const backdrop = scene()
const far = figure('#6f7b82', '#6f7b82')
const near = figure()

const meta = {
  title: '布局与层级/Parallax',
  component: Parallax,
  subcomponents: { ParallaxLayer },
} satisfies Meta<typeof Parallax>

export default meta
type Story = StoryObj<typeof meta>

const layers = (
  <>
    {/* 最远：场景，几乎不动。比容器大一圈，移动时不露边 */}
    <ParallaxLayer depth={0.15} className="absolute -inset-ark-5 -z-3">
      <img src={backdrop} alt="" className="block size-full object-cover" />
    </ParallaxLayer>
    <ParallaxLayer depth={0.3} className="absolute bottom-0 left-ark-6 -z-2">
      <GhostTitle>Headhunt</GhostTitle>
    </ParallaxLayer>
    {/* 远处的人小、动得少；近处的人大、动得多 */}
    <ParallaxLayer depth={0.5} className="absolute right-[38%] bottom-0 -z-1 h-3/5 w-[18%]">
      <Portrait src={far} alt="" shadow={false} className="size-full opacity-60" />
    </ParallaxLayer>
    <ParallaxLayer depth={1} className="absolute right-[8%] bottom-0 -z-1 h-[92%] w-[30%]">
      <Portrait src={near} alt="" className="size-full" />
    </ParallaxLayer>
  </>
)

/**
 * 寻访界面的做法：几个人物大小不同、前后叠放，以不同的幅度位移。
 * 在画面里移动指针——指针往右，近处的人往左让得更多，背景几乎不动。
 * 文字不在任何一层里，保持不动。
 */
export const Default: Story = {
  render: args => (
    <Parallax {...args} className="h-[26rem] w-[48rem]">
      {layers}
      <Scrim side="left" className="-z-1" />
      <div className="grid h-full content-center pl-ark-7">
        <Heading as="h2" size="lg" sub="HEADHUNT">
          干员寻访
        </Heading>
      </div>
    </Parallax>
  ),
}

/**
 * `source="scroll"`：位移跟着这块内容滚过视口的进度走。上下滚动页面看各层错开。
 */
export const Scroll: Story = {
  args: { source: 'scroll' },
  render: args => (
    <div className="grid gap-ark-5">
      <p className="m-0 h-[70vh] text-ark-label text-ark-fg-muted">往下滚动 ↓</p>
      <Parallax {...args} className="h-[26rem] w-[48rem]">
        {layers}
      </Parallax>
      <div className="h-[90vh]" />
    </div>
  ),
}

/** 幅度由 `--ark-parallax-range` 决定：默认 2rem，这里放大到 5rem 看得更清楚。 */
export const Range: Story = {
  render: args => (
    <Parallax
      {...args}
      className="h-64 w-[36rem] bg-ark-neutral-ink-900 [--ark-parallax-range:5rem]"
    >
      {[0.2, 0.5, 1].map((depth, index) => (
        <ParallaxLayer
          key={depth}
          depth={depth}
          className="absolute top-1/2 left-1/2 grid place-items-center border border-ark-rule-strong font-ark-data text-ark-caption text-ark-fg-muted"
          style={{
            width: `${(index + 1) * 5}rem`,
            height: `${(index + 1) * 3}rem`,
            marginLeft: `${(index + 1) * -2.5}rem`,
            marginTop: `${(index + 1) * -1.5}rem`,
          }}
        >
          {`depth ${depth}`}
        </ParallaxLayer>
      ))}
    </Parallax>
  ),
}
