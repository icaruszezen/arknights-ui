import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Pattern } from './Pattern'

const meta = {
  title: '底纹/Pattern',
  component: Pattern,
  args: { variant: 'halftone' },
  // 底纹铺满父元素给的盒子，这里给一块近黑的面
  render: args => (
    <div className="relative isolate h-48 w-96 bg-ark-neutral-ink-900">
      <Pattern {...args} />
    </div>
  ),
} satisfies Meta<typeof Pattern>

export default meta
type Story = StoryObj<typeof meta>

/** 半调网点：最常用的一种。左下最密、点最大，朝右上越来越小直到消失。 */
export const Default: Story = {}

function Swatch({
  label,
  note,
  className,
  children,
}: {
  label: string
  note: string
  className: string
  children: ReactNode
}) {
  return (
    <figure className="m-0 grid gap-ark-2">
      <div className={`relative isolate h-32 overflow-hidden ${className}`}>{children}</div>
      <figcaption className="grid gap-ark-1">
        <span className="font-ark-data text-ark-caption text-ark-signal">{label}</span>
        <span className="text-ark-caption text-ark-fg-muted">{note}</span>
      </figcaption>
    </figure>
  )
}

/** 六种底纹各自的用法。对照 `docs/assets/patterns.svg`。 */
export const Gallery: Story = {
  render: () => (
    <div className="grid w-[56rem] grid-cols-3 gap-ark-5">
      <Swatch
        label="01 HALFTONE"
        note="半调网点：由密到疏是点变小，压在角落和面板底部"
        className="bg-ark-neutral-ink-900"
      >
        <Pattern variant="halftone" />
      </Swatch>
      <Swatch
        label="02 DOTS"
        note="点阵：等大的小方点，四排一组放在角落"
        className="bg-ark-neutral-ink-900"
      >
        <Pattern variant="dots" className="absolute bottom-ark-4 left-ark-4 h-[7.5rem] w-72" />
      </Swatch>
      <Swatch
        label="03 GRAIN"
        note="噪点：低密度、高颗粒，让留白不发飘"
        className="bg-ark-neutral-graphite"
      >
        <Pattern variant="grain" />
      </Swatch>
      <Swatch
        label="04 HAZARD"
        note="警戒条纹：45°，只做窄边，不铺满"
        className="bg-ark-neutral-ink-900"
      >
        <Pattern variant="hazard" className="absolute inset-x-0 top-0" />
        <Pattern variant="hazard" mono className="absolute inset-x-0 bottom-0 h-ark-5" />
      </Swatch>
      <Swatch
        label="05 DIAGONAL GRID"
        note="斜线网格：方格 + 对角线，铺在最底层"
        className="bg-ark-neutral-black"
      >
        <Pattern variant="grid" />
      </Swatch>
      <Swatch label="06 SCANLINE" note="扫描线：投影、全息看板的质感" className="bg-[#16323c]">
        <Pattern variant="scanline" />
      </Swatch>
    </div>
  ),
}

/**
 * `fade` 是朝哪个方向渐疏：网点只放一角，不要整面铺满均匀的点。
 * 半调的每个方向各是一张遮罩图；`none` 是一片等大的点。
 */
export const Fades: Story = {
  render: () => (
    <div className="grid w-[48rem] grid-cols-3 gap-ark-2">
      {(
        [
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
          'top',
          'right',
          'bottom',
          'left',
          'none',
        ] as const
      ).map(fade => (
        <div key={fade} className="relative isolate h-40 bg-ark-neutral-ink-900">
          <Pattern variant="halftone" fade={fade} />
          <span className="absolute top-ark-2 left-ark-2 font-ark-data text-ark-caption text-ark-fg-muted">
            {fade}
          </span>
        </div>
      ))}
    </div>
  ),
}

/**
 * 叠加顺序：底色 → 整面的斜线网格 → 角落的半调 → 内容 → 贴边的警戒条纹。
 * 底纹的对比度压到“细看才有”，不能比文字还抢眼。
 */
export const Stacking: Story = {
  render: () => (
    <div className="relative isolate h-64 w-[36rem] overflow-hidden bg-ark-neutral-black p-ark-6">
      <Pattern variant="grid" className="absolute inset-0 -z-2" />
      <Pattern variant="halftone" className="absolute bottom-0 left-0 -z-1 h-2/3 w-1/2" />
      <Heading as="h3" size="md" sub="CONTINGENCY CONTRACT">
        危机合约
      </Heading>
      <Pattern variant="hazard" className="absolute inset-x-0 bottom-0" />
    </div>
  ),
}

/**
 * 颜色取当前文字色：同一个底纹放进石墨和纸白面板，自动一浅一深；
 * 也可以用 `text-*` 换成信号色。
 */
export const FollowsContext: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-ark-2">
      <Panel className="h-40 w-64 overflow-hidden">
        <Pattern variant="halftone" className="absolute inset-0 -z-1" />
        <Heading as="h3" size="sm" sub="GRAPHITE">
          石墨
        </Heading>
      </Panel>
      <Panel tone="paper" className="h-40 w-64 overflow-hidden">
        <Pattern variant="halftone" className="absolute inset-0 -z-1" />
        <Heading as="h3" size="sm" sub="PAPER">
          纸白
        </Heading>
      </Panel>
      <Panel className="h-40 w-64 overflow-hidden">
        <Pattern variant="grid" className="absolute inset-0 -z-1 text-ark-signal" />
        <Heading as="h3" size="sm" sub="SIGNAL">
          信号色
        </Heading>
      </Panel>
    </div>
  ),
}
