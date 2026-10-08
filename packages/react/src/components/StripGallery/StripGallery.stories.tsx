import type { Meta, StoryObj } from '@storybook/react-vite'
import { scenes } from '../../../.storybook/art'
import { Icon } from '../Icon'
import { Strip, StripGallery } from './StripGallery'

// 演示用的自绘几何图形，不对应任何官方图标
const glyphs = [
  <svg key="diamond" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" stroke="currentColor" strokeWidth="2.5" />
  </svg>,
  <svg key="peak" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 3 21 21H3z" fill="currentColor" />
  </svg>,
  <svg key="blocks" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5v5h-5z" fill="currentColor" />
  </svg>,
  <svg key="bars" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M3 12h12M3 18h15" stroke="currentColor" strokeWidth="3" />
  </svg>,
]

// 每条一个主题色：tint 是暗一些的底色，hoverTint 是悬停时浮起来的鲜色
const entries = [
  {
    id: 'is',
    title: '集成战略',
    sub: 'INTEGRATED STRATEGIES',
    position: '30% 50%',
    tint: '#4c2b2a',
    hoverTint: '#c7151e',
  },
  {
    id: 'ra',
    title: '生息演算',
    sub: 'RECLAMATION ALGORITHM',
    position: '70% 50%',
    tint: '#898175',
    hoverTint: '#eeb763',
  },
  {
    id: 'anime',
    title: '衍生动画',
    sub: 'ANIMATION',
    position: '45% 50%',
    tint: '#293f45',
    hoverTint: '#2096e6',
  },
  {
    id: 'comic',
    title: '泰拉记事社',
    sub: 'TERRA HISTORICUS',
    position: '85% 50%',
    tint: '#576b0b',
    hoverTint: '#396308',
  },
]

const meta = {
  title: '图片/StripGallery',
  component: StripGallery,
  subcomponents: { Strip },
} satisfies Meta<typeof StripGallery>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 官网“更多内容”一屏的四条竖带。每条取一张图的局部，上下压黑，各带一个主题色；
 * 条带之间没有缝，靠每条右缘的一道暗边分开。
 * 图是代码画的占位图，不是官方素材。悬停任一条看反馈；竖屏时改为纵向堆叠的横带。
 */
export const Default: Story = {
  render: args => (
    <StripGallery {...args} aria-label="更多内容" className="w-[64rem]">
      {entries.map((entry, index) => (
        <Strip
          key={entry.id}
          href={`#${entry.id}`}
          src={scenes[index] ?? ''}
          position={entry.position}
          icon={<Icon>{glyphs[index]}</Icon>}
          sub={entry.sub}
          tint={entry.tint}
          hoverTint={entry.hoverTint}
        >
          {entry.title}
        </Strip>
      ))}
    </StripGallery>
  ),
}

/**
 * 文字的位置和字号按条带的宽度走：30rem 宽时是官网的值，窄下来等比缩小，标题最小 1rem。
 */
export const Narrow: Story = {
  render: args => (
    <StripGallery {...args} aria-label="更多内容" className="w-[36rem]">
      {entries.map((entry, index) => (
        <Strip
          key={entry.id}
          href={`#${entry.id}`}
          src={scenes[index] ?? ''}
          position={entry.position}
          icon={<Icon>{glyphs[index]}</Icon>}
          sub={entry.sub}
          tint={entry.tint}
        >
          {entry.title}
        </Strip>
      ))}
    </StripGallery>
  ),
}

/** 给列表一个高度，条带就撑满这个高度，不再按 4:9 的比例。 */
export const FixedHeight: Story = {
  render: args => (
    <StripGallery {...args} aria-label="更多内容" className="h-96 w-[54rem]">
      {entries.slice(0, 3).map((entry, index) => (
        <Strip
          key={entry.id}
          href={`#${entry.id}`}
          src={scenes[index] ?? ''}
          sub={entry.sub}
          className="aspect-auto"
        >
          {entry.title}
        </Strip>
      ))}
    </StripGallery>
  ),
}

/**
 * `position` 决定取原图的哪一条竖带：同一张图，三个不同的位置。
 * 不是链接时没有悬停反馈，也可以去掉 VIEW MORE。
 */
export const Position: Story = {
  render: args => (
    <StripGallery {...args} className="w-[42rem]">
      {(['10% 50%', '50% 50%', '90% 50%'] as const).map(position => (
        <Strip key={position} src={scenes[0] ?? ''} position={position} more={null}>
          {position}
        </Strip>
      ))}
    </StripGallery>
  ),
}
