import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Field } from '../Field'
import { Panel } from '../Panel'
import { Select, SelectOption } from './Select'

const meta = {
  title: '表单/Select',
  component: Select,
  subcomponents: { SelectOption },
  args: { 'aria-label': '语音语种', placeholder: '请选择', children: null },
  decorators: [
    Story => (
      <div className="min-h-72 w-64 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const voices = (
  <>
    <SelectOption value="jp">日语</SelectOption>
    <SelectOption value="cn">中文（普通话）</SelectOption>
    <SelectOption value="en">English</SelectOption>
    <SelectOption value="kr">한국어</SelectOption>
    <SelectOption value="dialect" disabled>
      方言（暂无）
    </SelectOption>
  </>
)

/**
 * 当前项是一块深色的底，左缘一条 4px 的信号色边；展开的选项用与主题相反的面——
 * “已选的”和“可选的”在明暗上是反的。指到的那一项文字变成信号色。
 */
export const Default: Story = {
  args: { defaultValue: 'jp', children: voices },
}

export const WithPlaceholder: Story = { args: { children: voices } }

export const Sizes: Story = {
  render: args => (
    <div className="grid gap-ark-3">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Select
          key={size}
          {...args}
          aria-label={`语音语种（${size}）`}
          size={size}
          defaultValue="cn"
        >
          {voices}
        </Select>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: args => (
    <div className="grid gap-ark-3">
      <Select {...args} aria-label="不合法" invalid>
        {voices}
      </Select>
      <Select {...args} aria-label="禁用" disabled defaultValue="jp">
        {voices}
      </Select>
    </div>
  ),
}

/** 放进 `Field`：项名是它的名称，报错和注释读给读屏；给了 `name` 就能随表单提交。 */
export const InField: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string>()
    return (
      <Field
        label="语音语种"
        sub="Voice"
        hint="切换后立即生效"
        error={value === undefined ? '请选择一个语种' : undefined}
      >
        <Select
          {...args}
          aria-label={undefined}
          name="voice"
          value={value}
          onValueChange={setValue}
        >
          {voices}
        </Select>
      </Field>
    )
  },
}

/** 放进反色面时，触发行和选项的明暗一起翻。 */
export const OnInverse: Story = {
  args: { defaultValue: 'jp', children: voices },
  render: args => (
    <Panel tone="inverse">
      <Select {...args} />
    </Panel>
  ),
}
