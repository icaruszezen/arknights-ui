import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { scenes } from '../../../.storybook/art'
import { Heading } from '../Heading'
import { Tag } from '../Tag'
import { Carousel, CarouselSlide } from './Carousel'

// 图是代码画的占位图，标题是演示用的占位文案
const events = [
  { id: 'a', tag: '活动', title: '限时活动即将开启', sub: 'SIDE STORY' },
  { id: 'b', tag: '寻访', title: '限定寻访开放', sub: 'HEADHUNTING' },
  { id: 'c', tag: '更新', title: '新增界面主题与首页场景', sub: 'UPDATE' },
  { id: 'd', tag: '复刻', title: '往期活动限时复刻', sub: 'RERUN' },
]

const meta = {
  title: '场景/官网/Carousel',
  component: Carousel,
  subcomponents: { CarouselSlide },
  args: { 'aria-label': '活动' },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

const slides = events.map((event, index) => (
  <CarouselSlide key={event.id} src={scenes[index] ?? ''} href={`#${event.id}`}>
    <Tag variant="solid" cut>
      {event.tag}
    </Tag>
    <Heading as="h3" size="sm" sub={event.sub}>
      {event.title}
    </Heading>
  </CarouselSlide>
))

/**
 * 官网“情报”屏的活动轮播：16:9 的大图，下面一条进度条——中灰轨道上一段同高的信号色，停在当前页。
 * 右边是计数和翻页按钮；触屏上可以横向滑动。标题压在图的左下角，只在底部加遮罩。
 */
export const Default: Story = {
  render: args => (
    <Carousel {...args} className="w-[44rem]">
      {slides}
    </Carousel>
  ),
}

/**
 * 自动轮播：每 4 秒换一张。多出一个暂停按钮；指针悬停、焦点在里面、页面不可见时不走，
 * 用户要求减少动效时完全不启动。
 */
export const Autoplay: Story = {
  args: { autoplay: 4000 },
  render: args => (
    <Carousel {...args} className="w-[44rem]">
      {slides}
    </Carousel>
  ),
}

/** `loop={false}`：到头的按钮禁用，自动轮播走到最后一张就停。 */
export const NoLoop: Story = {
  args: { loop: false },
  render: args => (
    <Carousel {...args} className="w-[44rem]">
      {slides.slice(0, 3)}
    </Carousel>
  ),
}

/** 比例由 `--ark-carousel-ratio` 决定。不要计数时进度条撑满到按钮。 */
export const Ratio: Story = {
  args: { counter: false },
  render: args => (
    <Carousel
      {...args}
      className="w-[44rem]"
      style={{ '--ark-carousel-ratio': '21 / 9' } as CSSProperties}
    >
      {events.map((event, index) => (
        <CarouselSlide key={event.id} src={scenes[index] ?? ''} alt={event.title} />
      ))}
    </Carousel>
  ),
}
