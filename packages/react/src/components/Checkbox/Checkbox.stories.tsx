import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta = {
  title: '表单/Checkbox',
  component: Checkbox,
  args: { children: '记住这台设备' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** 一个直角的小方块；选中时整块换成信号色，里面一道对勾。 */
export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

/** 文字下面可以带一行灰色的说明。 */
export const WithDescription: Story = {
  args: { children: '每周摘要', description: '周一早上发到你的邮箱', defaultChecked: true },
}

export const States: Story = {
  render: () => (
    <div className="grid gap-ark-3">
      <Checkbox>未选</Checkbox>
      <Checkbox defaultChecked>已选</Checkbox>
      <Checkbox indeterminate>半选</Checkbox>
      <Checkbox disabled>禁用</Checkbox>
      <Checkbox disabled defaultChecked>
        禁用且已选
      </Checkbox>
      <Checkbox aria-invalid="true">不合法</Checkbox>
    </div>
  ),
}

const members = ['Amiya', 'Kal’tsit', 'Closure']

/** 半选：一组里只选了一部分。点“全选”把整组一起选上或清掉。 */
export const SelectAll: Story = {
  render: function Render() {
    const [picked, setPicked] = useState<string[]>(['Amiya'])
    const all = picked.length === members.length
    return (
      <div className="grid gap-ark-3">
        <Checkbox
          checked={all}
          indeterminate={picked.length > 0 && !all}
          onCheckedChange={checked => setPicked(checked ? members : [])}
          description={`已选 ${picked.length} / ${members.length}`}
        >
          全选
        </Checkbox>
        <div className="grid gap-ark-2 border-l border-ark-rule pl-ark-4">
          {members.map(name => (
            <Checkbox
              key={name}
              checked={picked.includes(name)}
              onCheckedChange={checked =>
                setPicked(list => (checked ? [...list, name] : list.filter(item => item !== name)))
              }
            >
              {name}
            </Checkbox>
          ))}
        </div>
      </div>
    )
  },
}
