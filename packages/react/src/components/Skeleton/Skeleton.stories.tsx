import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Panel'
import { Skeleton } from './Skeleton'

const meta = {
  title: '反馈/Skeleton',
  component: Skeleton,
  decorators: [
    Story => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** 一整块：大小用 `className` 给。 */
export const Block: Story = { args: { className: 'h-24' } }

/** 几行文字的位置，最后一行短一截。 */
export const Text: Story = { args: { variant: 'text', lines: 4 } }

/** 把内容的位置和大小先占出来，内容来了之后版面不跳。容器上标 `aria-busy`。 */
export const CardPlaceholder: Story = {
  render: () => (
    <Card role="status" aria-busy="true" aria-label="正在加载">
      <div className="flex items-center gap-ark-3">
        <Skeleton className="size-10 shrink-0" />
        <Skeleton variant="text" lines={2} />
      </div>
      <Skeleton className="mt-ark-4 h-32" />
      <Skeleton variant="text" lines={3} className="mt-ark-4" />
    </Card>
  ),
}
