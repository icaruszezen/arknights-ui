import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { CornerMarks } from './CornerMarks'

const meta = {
  title: '排版与装饰/CornerMarks',
  component: CornerMarks,
} satisfies Meta<typeof CornerMarks>

export default meta
type Story = StoryObj<typeof meta>

/** 四个 L 形角标框住内容，不画完整的矩形。 */
export const Default: Story = {
  args: { className: 'w-64' },
  render: args => (
    <CornerMarks {...args}>
      <Heading as="h3" size="sm" sub="RHODES ISLAND" className="items-center py-ark-4">
        罗德岛
      </Heading>
    </CornerMarks>
  ),
}

/** 框住一张图或一块场景时，把内边距去掉，角标就压在图的四角上。 */
export const AroundImage: Story = {
  render: () => (
    <CornerMarks className="w-80 p-ark-2">
      <div className="h-44 bg-ark-neutral-ink-800" />
    </CornerMarks>
  ),
}

/** 角标用前景色，放进纸白面板时自动换成深色。 */
export const OnPaper: Story = {
  render: () => (
    <Panel tone="paper" className="w-72">
      <CornerMarks>
        <Heading as="h3" size="sm" sub="PURCHASE CERTIFICATE">
          采购凭证
        </Heading>
      </CornerMarks>
    </Panel>
  ),
}
