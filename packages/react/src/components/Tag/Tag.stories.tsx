import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta = {
  title: '数据展示/Tag',
  component: Tag,
  args: { children: '生存' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/** 默认是中性标签：石墨底白字。 */
export const Neutral: Story = {}

/** 主标签：反白实心，可切右上角。用于最主要的属性，如职业。 */
export const Solid: Story = {
  args: { variant: 'solid', cut: true, children: '近卫' },
}

/** 次标签：信号色描边，文字同色。 */
export const Outline: Story = {
  args: { variant: 'outline', children: '输出' },
}

/** 三种形态并排：靠实心、描边、灰底区分主次，而不只是颜色。 */
export const Group: Story = {
  render: () => (
    <div className="flex items-center gap-ark-2">
      <Tag variant="solid" cut>
        近卫
      </Tag>
      <Tag variant="outline">输出</Tag>
      <Tag>生存</Tag>
    </div>
  ),
}
