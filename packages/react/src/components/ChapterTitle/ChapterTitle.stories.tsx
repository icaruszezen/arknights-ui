import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { scenes } from '../../../.storybook/art'
import { Scrim } from '../Scrim'
import { ChapterTitle } from './ChapterTitle'

const meta = {
  title: '场景/剧情/ChapterTitle',
  component: ChapterTitle,
  // 标题是演示用的占位文案，不对应任何真实章节
  args: { children: 'The Long Night', sub: '长夜', number: 8 },
} satisfies Meta<typeof ChapterTitle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 巨大的英文标题用拉丁衬线大写、收紧字距；中文标题较小、字重更低；上面是章节编号。
 * 没有加载别的字体时，英文落在系统的 Times New Roman 或 Georgia 上。
 */
export const Default: Story = {}

/**
 * 多种文字并置：最下面一行是另一种文字的题记，暗示这一章的地域。
 * 它是对标题的再一次表述，对读屏隐藏。
 */
export const WithCaption: Story = {
  args: { caption: 'ДОЛГАЯ НОЧЬ' },
}

/** 居中的版式，小一档的字号。 */
export const Centered: Story = {
  args: { align: 'center', size: 'md', numberLabel: 'Chapter' },
}

/**
 * 同一套骨架，换一款标题字就换了一种气质。字体由 `--ark-chapter-font` 决定：
 * 这里三种都是系统自带的字体，实际使用时换成与题材相称的标题字。
 */
export const Typefaces: Story = {
  render: args => (
    <div className="grid gap-ark-7">
      {(
        [
          ['默认的衬线', undefined],
          ['更古典的衬线', 'Georgia, "Times New Roman", serif'],
          ['几何无衬线', 'var(--ark-font-family-latin-wide)'],
        ] as const
      ).map(([label, font]) => (
        <figure key={label} className="m-0 grid gap-ark-3">
          <ChapterTitle
            {...args}
            as="p"
            size="md"
            number={undefined}
            style={font ? ({ '--ark-chapter-font': font } as CSSProperties) : undefined}
          />
          <figcaption className="font-ark-data text-ark-caption text-ark-fg-muted">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
}

/**
 * 标题页：这组文字叠在一张气氛图上，只在文字一侧加遮罩。
 * 图是代码画的占位场景。
 */
export const OnCover: Story = {
  args: { caption: 'ДОЛГАЯ НОЧЬ' },
  render: args => (
    <div className="relative isolate box-border grid aspect-video w-[56rem] max-w-full content-end overflow-hidden p-ark-7">
      <img
        src={scenes[3]}
        alt=""
        className="absolute inset-0 -z-2 block size-full object-cover saturate-[0.6]"
      />
      <Scrim side="left" className="-z-1 from-ark-neutral-black/90" />
      <ChapterTitle {...args} className="relative" />
    </div>
  ),
}
