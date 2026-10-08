import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scene, scenes } from '../../../.storybook/art'
import { ActionButton } from '../ActionButton'
import { Carousel } from '../Carousel'
import { ParallaxLayer } from '../Parallax'
import { Portrait } from '../Portrait'
import { Tag } from '../Tag'
import { Thumbnail, ThumbnailStrip } from '../ThumbnailStrip'
import { TimeRange } from '../TimeRange'
import { Banner } from './Banner'

const meta = {
  title: '场景/寻访与采购/Banner',
  component: Banner,
  args: { title: '限定寻访', sub: 'Headhunting', className: 'w-[56rem] max-w-full' },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

// 占位用的场景和剪影，代码画的。三层：场景最远，后排的立绘次之，主角最近
const layers = (backdrop: string, accent = '#18d1ff') => [
  <ParallaxLayer key="scene" depth={0.15} className="absolute -inset-ark-5 -z-4">
    <img src={backdrop} alt="" className="block size-full object-cover opacity-60" />
  </ParallaxLayer>,
  <ParallaxLayer
    key="far"
    depth={0.4}
    className="absolute right-[34%] bottom-0 -z-3 h-[78%] w-[20%]"
  >
    <Portrait src={figure('#6f777c', accent)} alt="" className="size-full" />
  </ParallaxLayer>,
  <ParallaxLayer
    key="near"
    depth={0.9}
    className="absolute right-[8%] bottom-0 -z-2 h-[104%] w-[28%]"
  >
    <Portrait src={figure('#a9b1b6', accent)} alt="" className="size-full" />
  </ParallaxLayer>,
]

const actions = (
  <>
    <ActionButton variant="paper" cost={600} costLabel="合成玉" sub="HEADHUNT ×1">
      寻访一次
    </ActionButton>
    <ActionButton cost={6000} costLabel="合成玉" sub="HEADHUNT ×10">
      寻访十次
    </ActionButton>
  </>
)

const links = (
  <>
    <a href="#rates" className="text-ark-fg-muted underline-offset-4 hover:text-ark-signal-fg">
      概率公示
    </a>
    <a href="#rules" className="text-ark-fg-muted underline-offset-4 hover:text-ark-signal-fg">
      寻访规则
    </a>
  </>
)

/**
 * 人物偏右，左侧留给标题与规则，遮罩只压文字一侧。移动指针：三层以不同的幅度位移，
 * 近处的让得更多。两个行动按钮并排，代价直接印在按钮上，十连更醒目。
 * 立绘和场景都是代码画的占位图。
 */
export const Default: Story = {
  args: {
    tag: (
      <Tag variant="solid" cut>
        限定寻访
      </Tag>
    ),
    title: '占位卡池',
    sub: 'Placeholder Banner',
    period: <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />,
    ghost: 'Headhunt',
    actions,
    links,
  },
  render: args => <Banner {...args}>{layers(scene())}</Banner>,
}

/** `side="right"`：标题换到右边，人物和按钮跟着换边。 */
export const RightSide: Story = {
  args: { ...Default.args, side: 'right' },
  render: args => (
    <Banner {...args}>
      <ParallaxLayer depth={0.15} className="absolute -inset-ark-5 -z-4">
        <img src={scene()} alt="" className="block size-full object-cover opacity-60" />
      </ParallaxLayer>
      <ParallaxLayer depth={0.9} className="absolute bottom-0 left-[8%] -z-2 h-[104%] w-[28%]">
        <Portrait src={figure('#a9b1b6')} alt="" className="size-full" />
      </ParallaxLayer>
    </Banner>
  ),
}

/**
 * 标题标识是每个卡池专门设计的，风格可以各不相同，但放进来之后位置和尺寸是固定的。
 * 这里的标识是几条几何线拼的占位图；真正的标题只留给读屏。
 */
export const WithLogo: Story = {
  args: {
    ...Default.args,
    logo: (
      <svg viewBox="0 0 240 96" fill="none" role="presentation">
        <path d="M4 4h150l24 24v64H4z" stroke="currentColor" strokeWidth="3" />
        <path d="M20 30h110M20 48h72M20 66h132" stroke="currentColor" strokeWidth="8" />
        <path d="M190 4h46v88h-46z" fill="currentColor" />
      </svg>
    ),
  },
  render: args => <Banner {...args}>{layers(scene())}</Banner>,
}

/**
 * 卡池切换是横向的轮播：侧边一条竖排的缩略图，点一下换一个卡池。
 * 这里用受控的 `Carousel` 和 `ThumbnailStrip` 共用同一个序号。
 */
export const Pools: Story = {
  render: function Headhunt() {
    const [index, setIndex] = useState(0)
    const pools = [
      { name: '占位卡池甲', en: 'Banner A', accent: '#18d1ff' },
      { name: '占位卡池乙', en: 'Banner B', accent: '#ffd802' },
      { name: '占位卡池丙', en: 'Banner C', accent: '#ff5e19' },
    ]
    return (
      <div className="grid w-[64rem] max-w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-ark-4">
        <ThumbnailStrip
          aria-label="卡池"
          orientation="vertical"
          value={String(index)}
          onValueChange={next => setIndex(Number(next))}
        >
          {pools.map((pool, poolIndex) => (
            <Thumbnail
              key={pool.en}
              value={String(poolIndex)}
              src={scenes[poolIndex] ?? ''}
              label={pool.name}
              position="50% 50%"
              className="aspect-video w-28"
            />
          ))}
        </ThumbnailStrip>
        <Carousel aria-label="卡池" index={index} onIndexChange={setIndex}>
          {pools.map((pool, poolIndex) => (
            <Banner
              key={pool.en}
              title={pool.name}
              sub={pool.en}
              titleAs="h3"
              actions={actions}
              links={links}
              className="size-full"
            >
              {layers(scenes[poolIndex] ?? '', pool.accent)}
            </Banner>
          ))}
        </Carousel>
      </div>
    )
  },
}
