import type { Meta, StoryObj } from '@storybook/react-vite'
import { glyphs } from '../../../.storybook/glyphs'
import { Panel } from '../Panel'
import { Input } from './Input'

const meta = {
  title: '表单/Input',
  component: Input,
  args: { 'aria-label': '搜索', placeholder: '输入关键词' },
  decorators: [
    Story => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** 一块直角的色块，底边一条线；聚焦时这条线换成信号色。 */
export const Default: Story = {}

/** 三档高度：2rem / 2.5rem / 3rem。 */
export const Sizes: Story = {
  render: args => (
    <div className="grid gap-ark-3">
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </div>
  ),
}

/** 前后可以放图标、单位，它们不是输入的一部分。 */
export const WithAffix: Story = {
  render: () => (
    <div className="grid gap-ark-3">
      <Input
        aria-label="搜索"
        placeholder="搜索成员"
        prefix={<span className="grid size-4 [&>svg]:size-full">{glyphs.target}</span>}
      />
      <Input aria-label="金额" defaultValue="1280" prefix="¥" suffix="CNY" inputMode="decimal" />
      <Input aria-label="域名" defaultValue="arknights-ui" suffix=".example.com" />
    </div>
  ),
}

/** 不合法时底边变红；禁用时整块变灰。 */
export const States: Story = {
  render: () => (
    <div className="grid gap-ark-3">
      <Input aria-label="邮箱" defaultValue="doctor@" invalid />
      <Input aria-label="邮箱" defaultValue="doctor@example.com" disabled />
      <Input aria-label="邮箱" defaultValue="doctor@example.com" readOnly />
    </div>
  ),
}

/** 放进反色面时，底色和文字跟着换。 */
export const OnInverse: Story = {
  render: args => (
    <Panel tone="inverse">
      <Input {...args} />
    </Panel>
  ),
}
