import type { Meta, StoryObj } from '@storybook/react-vite'
import { Callout } from './Callout'

const meta = {
  title: '排版与装饰/Callout',
  component: Callout,
  args: { children: 'GALLERY', className: 'absolute top-2/3 left-1/4' },
  // 标注是压在图片或场景上的，这里用一块深色块代替
  decorators: [
    Story => (
      <div className="relative h-56 w-[30rem] bg-ark-neutral-ink-800">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

/** 空心方点标出位置，折线先水平后 45°，末端是黑底信号色字的标签。 */
export const Default: Story = {}

/** 四个方向。定位的坐标始终是方点的中心，换方向不用重新算位置。 */
export const Directions: Story = {
  render: () => (
    <>
      <Callout className="absolute top-1/2 left-1/2">UP-RIGHT</Callout>
      <Callout direction="down-right" className="absolute top-1/2 left-1/2">
        DOWN-RIGHT
      </Callout>
      <Callout direction="up-left" className="absolute top-1/2 left-1/2">
        UP-LEFT
      </Callout>
      <Callout direction="down-left" className="absolute top-1/2 left-1/2">
        DOWN-LEFT
      </Callout>
    </>
  ),
}

/**
 * 标签可以是链接：把导航做成一个“场所”，每个物件引出一个入口。
 * 悬停时标签整块换成信号色。
 */
export const AsLinks: Story = {
  render: () => (
    <>
      <Callout href="#gallery" className="absolute top-2/3 left-[18%]">
        GALLERY
      </Callout>
      <Callout href="#music" direction="down-right" className="absolute top-1/4 left-[42%]">
        MUSIC
      </Callout>
      <Callout href="#video" direction="up-left" className="absolute top-3/4 left-[82%]">
        VIDEO
      </Callout>
    </>
  ),
}
