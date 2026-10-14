import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Spinner } from './Spinner'

const meta = {
  title: '反馈/Spinner',
  component: Spinner,
  args: { label: '正在加载' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

/** 进度未知时的短加载：一圈细线，信号色的一段 1s 转一圈。 */
export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-ark-4">
      <Spinner size="sm" label="正在加载" />
      <Spinner size="md" label="正在加载" />
      <Spinner size="lg" label="正在加载" />
    </div>
  ),
}

/** `inherit`：颜色跟随所在的文字。按钮的 `loading` 用的就是它。 */
export const InText: Story = {
  render: () => (
    <div className="grid justify-items-start gap-ark-4">
      <span className="inline-flex items-center gap-ark-2 text-ark-label text-ark-fg-muted">
        <Spinner inherit size="sm" />
        正在同步…
      </span>
      <Button variant="primary" loading>
        保存中
      </Button>
    </div>
  ),
}
