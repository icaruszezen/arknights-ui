import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { Card } from '../Panel'
import { Tag } from '../Tag'
import { Rating } from './Rating'

const meta = {
  title: '数据展示/Rating',
  component: Rating,
  args: { value: 5 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 6, step: 1 } } },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

/** 金色五角星，间距是图形宽度的四分之一。只画点亮的那几颗。 */
export const Stars: Story = {}

/** 同一处星级在不同位置会写成菱形。 */
export const Diamonds: Story = {
  args: { shape: 'diamond', value: 6 },
}

/** 给了 `max` 之后，没点亮的位置画成暗的：写出分母，而不是一个孤立的数。 */
export const WithMax: Story = {
  args: { value: 4, max: 6 },
}

export const Sizes: Story = {
  render: args => (
    <div className="grid justify-items-start gap-ark-3">
      <Rating {...args} size="sm" />
      <Rating {...args} />
      <Rating {...args} size="lg" />
    </div>
  ),
}

/**
 * 稀有度双重编码：星星的数量，加上卡片底边的稀有度色条。
 * 纸白面上的金色自动压暗，保证看得清。
 */
export const OnCards: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: () => (
    <div className="flex gap-ark-2">
      <Card className="w-56 border-b-(length:--ark-line-strong) border-ark-tier-6">
        <Rating value={6} />
        <Heading as="h3" size="sm" sub="GUARD" className="mt-ark-3">
          近卫干员
        </Heading>
      </Card>
      <Card tone="paper" className="w-56 border-b-(length:--ark-line-strong) border-ark-tier-5">
        <div className="flex items-center justify-between">
          <Rating value={5} shape="diamond" />
          <Tag variant="solid" cut>
            狙击
          </Tag>
        </div>
        <Heading as="h3" size="sm" sub="SNIPER" className="mt-ark-3">
          狙击干员
        </Heading>
      </Card>
    </div>
  ),
}
