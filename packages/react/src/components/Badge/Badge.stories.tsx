import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Badge } from './Badge'

const meta = {
  title: '数据展示/Badge',
  component: Badge,
  args: { count: 3 },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** 数字角标：直角小块，数据体黑字压在红底上。 */
export const Count: Story = {}

/** 红点：未读、可领取。只说“有”，不说“有多少”。 */
export const Dot: Story = {
  args: { dot: true, count: undefined },
}

/** 超过上限时写成 `99+`。 */
export const Overflow: Story = {
  args: { count: 128 },
}

/**
 * 包住一个元素，角标贴在它的右上角。
 * `label` 给读屏一句完整的说明；没有 `label` 的红点对读屏是隐藏的。
 */
export const OnElements: Story = {
  render: () => (
    <div className="flex items-start gap-ark-6">
      <Badge count={3} label="3 封未读邮件">
        <Button>邮件</Button>
      </Badge>
      <Badge dot label="有可领取的奖励">
        <Button>任务</Button>
      </Badge>
      <Badge count={0}>
        <Button>好友</Button>
      </Badge>
    </div>
  ),
}

/** 主界面的入口面板：红点贴在面板的右上角。 */
export const OnPanel: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: () => (
    <Badge dot label="有新的公开招募结果">
      <Panel className="w-56">
        <Heading as="h3" size="sm" sub="RECRUIT" serif>
          公开招募
        </Heading>
      </Panel>
    </Badge>
  ),
}
