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

/** 全身立绘：头顶贴着框的上缘，腿部被下缘切掉。投影向左下。 */
export const Default: Story = {}

/**
 * 幽灵重影：身后是同一张图的放大版，去色、极低的不透明度。
 * 主图清晰、重影模糊，前后拉开了距离。
 */
export const WithGhost: Story = {
  args: { ghost: true, className: 'h-96 w-[28rem]' },
}

/** 胸像：铺满框，脸落在上三分之一。干员卡片用这种裁切。 */
export const Bust: Story = {
  render: args => (
    <ul className="m-0 flex list-none gap-ark-2 p-0">
      {[5, 6, 4].map(tier => (
        <li key={tier} className="relative w-36" data-ark-tone="dark">
          <Portrait
            {...args}
            alt=""
            crop="bust"
            shadow={false}
            className="w-full bg-ark-neutral-ink-900"
          />
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
      <Portrait {...args} ghost className="absolute inset-y-0 right-0 -z-2 h-full w-3/5" />
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
