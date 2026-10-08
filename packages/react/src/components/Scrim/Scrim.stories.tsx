import type { Meta, StoryObj } from '@storybook/react-vite'
import { scene } from '../../../.storybook/art'
import { Heading } from '../Heading'
import { MicroText } from '../MicroText'
import { Scrim } from './Scrim'

const image = scene()

const meta = {
  title: '图片/Scrim',
  component: Scrim,
  // 遮罩铺满父元素：这里给一张占位的场景图。图是代码画的，不是官方素材
  render: args => (
    <div className="relative isolate h-80 w-[36rem] overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 -z-2 block size-full object-cover" />
      <Scrim {...args} className="-z-1" />
      <div
        className={
          args.side === 'top'
            ? 'p-ark-5'
            : args.side === 'right'
              ? 'grid h-full content-end justify-items-end p-ark-5'
              : 'grid h-full content-end p-ark-5'
        }
      >
        <Heading as="h3" size="md" sub="INTEGRATED STRATEGIES">
          集成战略
        </Heading>
      </div>
    </div>
  ),
} satisfies Meta<typeof Scrim>

export default meta
type Story = StoryObj<typeof meta>

/** 底部压字：贴边 5rem 是实黑，到 20rem 处渐隐为透明。图片的上半部分保持原样。 */
export const Default: Story = {}

/** 侧边压字：从 70% 的黑渐隐到透明，更轻。 */
export const Side: Story = {
  args: { side: 'left' },
}

/** 四个方向。文字在哪一侧，就压哪一侧。 */
export const Sides: Story = {
  render: () => (
    <div className="grid w-[44rem] grid-cols-2 gap-ark-2">
      {(['bottom', 'top', 'left', 'right'] as const).map(side => (
        <div key={side} className="relative isolate h-48 overflow-hidden">
          <img src={image} alt="" className="absolute inset-0 -z-2 block size-full object-cover" />
          <Scrim side={side} className="-z-1" />
          <span className="absolute top-ark-2 left-ark-2 bg-ark-neutral-black px-ark-1 font-ark-data text-ark-caption text-ark-signal">
            {side}
          </span>
        </div>
      ))}
    </div>
  ),
}

/**
 * 把文字作为子元素放进来，遮罩就成了文字容器，里面是深色上下文。
 * 这样不用操心层叠顺序。
 */
export const WithContent: Story = {
  render: args => (
    <div className="relative h-80 w-[36rem] overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 block size-full object-cover" />
      <Scrim {...args} className="grid content-end gap-ark-3 p-ark-5">
        <Heading as="h3" size="md" sub="RECLAMATION ALGORITHM">
          生息演算
        </Heading>
        <MicroText>{'ARKNIGHTS-UI // UNOFFICIAL'}</MicroText>
      </Scrim>
    </div>
  ),
}

/**
 * 对照：左边只压文字一侧，右边给整张图蒙一层 50% 的黑。
 * 后者把图片也一起压没了，是文档里明确不要的做法。
 */
export const Comparison: Story = {
  render: () => (
    <div className="grid w-[44rem] grid-cols-2 gap-ark-2">
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt="" className="absolute inset-0 block size-full object-cover" />
        <Scrim className="grid content-end p-ark-4">
          <Heading as="h3" size="sm" sub="DO">
            只压文字一侧
          </Heading>
        </Scrim>
      </div>
      <div className="relative h-64 overflow-hidden" data-ark-tone="dark">
        <img src={image} alt="" className="absolute inset-0 block size-full object-cover" />
        <div className="absolute inset-0 grid content-end bg-ark-overlay-scrim p-ark-4">
          <Heading as="h3" size="sm" sub="DON'T">
            整张压暗
          </Heading>
        </div>
      </div>
    </div>
  ),
}
