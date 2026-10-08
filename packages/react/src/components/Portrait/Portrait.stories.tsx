import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { figure } from '../../../.storybook/art'
import { GhostTitle } from '../GhostTitle'
import { Heading } from '../Heading'
import { Rating } from '../Rating'
import { Scrim } from '../Scrim'
import { Portrait } from './Portrait'

// 占位用的几何剪影，代码画的，不是官方立绘
const art = figure()

const meta = {
  title: '图片/Portrait',
  component: Portrait,
  args: { src: art, alt: '占位立绘', className: 'w-56' },
} satisfies Meta<typeof Portrait>

export default meta
type Story = StoryObj<typeof meta>

/** 全身立绘：头顶贴着框的上缘，腿部被下缘切掉。大立绘没有投影。 */
export const Default: Story = {}

/**
 * 幽灵重影：身后是一张放大、去色的图，不透明度 25%，只比背景亮一两档。
 * 主图是彩色的，重影是灰的，前后拉开了距离。官网用的是另一张预先处理好的图，可以用 `ghostSrc` 指定。
 */
export const WithGhost: Story = {
  args: { ghost: true, className: 'h-96 w-[28rem]' },
}

/**
 * 向左下的投影（`-0.5rem 0.5rem 1rem` 的实黑）。它是官网缩略图上的取值，用在小尺寸的头像、缩略图上；
 * 大立绘不带。
 */
export const WithShadow: Story = {
  render: args => (
    <div className="flex gap-ark-5 bg-ark-neutral-ink-800 p-ark-5">
      <Portrait {...args} crop="bust" className="w-28" />
      <Portrait {...args} crop="bust" shadow className="w-28" />
    </div>
  ),
}

/** 入场后的缓移：10 秒里自左移回原位，只走一次。减少动效时不动。 */
export const Drift: Story = {
  args: { drift: true },
}

/** 胸像：铺满框，脸落在上三分之一。干员卡片用这种裁切。 */
export const Bust: Story = {
  render: args => (
    <ul className="m-0 flex list-none gap-ark-2 p-0">
      {[5, 6, 4].map(tier => (
        <li key={tier} className="relative w-36" data-ark-tone="dark">
          <Portrait {...args} alt="" crop="bust" className="w-full bg-ark-neutral-ink-900" />
          <Scrim className="grid content-end gap-ark-1 p-ark-2 [--ark-scrim-extent:8rem] [--ark-scrim-solid:1rem]">
            <Rating value={tier} size="sm" />
            <span className="text-ark-label leading-ark-solid font-ark-bold">干员代号</span>
          </Scrim>
        </li>
      ))}
    </ul>
  ),
}

/** 出血的多少由 `--ark-portrait-bleed` 决定：默认 15%，调大就切得更高。 */
export const Bleed: Story = {
  render: args => (
    <div className="flex gap-ark-5">
      {(['0%', '15%', '40%'] as const).map(bleed => (
        <figure key={bleed} className="m-0 grid gap-ark-2">
          <Portrait
            {...args}
            className="w-40 border-b border-ark-rule"
            style={{ '--ark-portrait-bleed': bleed } as CSSProperties}
          />
          <figcaption className="font-ark-data text-ark-caption text-ark-fg-muted">
            {`--ark-portrait-bleed: ${bleed}`}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
}

/**
 * 官网干员屏的编排：文字靠左，立绘靠右并出血，身后是重影和背景巨字。
 * 只在文字一侧加遮罩。
 */
export const InHero: Story = {
  render: args => (
    <div className="relative isolate h-[26rem] w-[48rem] overflow-hidden bg-ark-neutral-black">
      <GhostTitle className="absolute bottom-0 left-ark-5 -z-3">Rhodes</GhostTitle>
      <Portrait {...args} ghost drift className="absolute inset-y-0 right-0 -z-2 h-full w-3/5" />
      <Scrim side="left" className="-z-1" />
      <div className="grid h-full content-center gap-ark-3 pl-ark-7">
        <Heading as="h2" size="lg" sub="CODENAME" subPosition="above">
          干员代号
        </Heading>
        <p className="m-0 max-w-64 text-ark-label leading-ark-body text-ark-fg-secondary">
          立绘越过容器的边界，被屏幕或面板的边缘切掉一部分。
        </p>
      </div>
    </div>
  ),
}
