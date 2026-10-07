import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { Tag } from './Tag'

const meta = {
  title: '数据展示/Tag',
  component: Tag,
  args: { children: '近战位' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/** 默认是中性标签：深色块白字。实机里干员的定位（近战位、输出、支援）就是这种。 */
export const Neutral: Story = {}

/** 实心：白底黑字。实机里天赋的名称是这种。需要时可以切右上角，实机上没有见到。 */
export const Solid: Story = {
  args: { variant: 'solid', children: '领袖' },
}

/** 描边：信号色描边，文字同色。没有找到实机的出处，是本仓库保留的一种形态。 */
export const Outline: Story = {
  args: { variant: 'outline', children: '输出' },
}

/** 实机干员详情里的组合：天赋用实心，定位用深色块。靠实心与灰底区分主次，而不只是颜色。 */
export const Group: Story = {
  render: () => (
    <div className="flex items-center gap-ark-2">
      <Tag variant="solid">领袖</Tag>
      <Tag>近战位</Tag>
      <Tag>输出 支援</Tag>
    </div>
  ),
}

/** 纸白面上实心标签变成黑底白字：主界面的“当前”、弹层里的物品名就是这样。 */
export const OnPaper: Story = {
  render: () => (
    <Panel tone="paper" className="flex w-fit items-center gap-ark-2">
      <Tag variant="solid">当前</Tag>
      <span className="text-ark-label text-ark-fg-secondary">全部完成</span>
    </Panel>
  ),
}
