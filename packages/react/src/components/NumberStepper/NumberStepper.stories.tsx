import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { NumberStepper } from './NumberStepper'

const meta = {
  title: '表单/NumberStepper',
  component: NumberStepper,
  args: { 'aria-label': '数量', min: 1, max: 99, defaultValue: 5 },
} satisfies Meta<typeof NumberStepper>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 五格连成一条：最少、减、数值、加、最多。数值在正中，用数据体，可以直接键入；
 * “最少”“最多”让人一步到头，不必连点。到了头，对应的两格变成禁用。
 */
export const Default: Story = {}

/** 没有同时给上下限时，两端的捷径不出现。 */
export const WithoutBounds: Story = {
  args: { min: 0, max: undefined, defaultValue: 0 },
}

export const Sizes: Story = {
  render: args => (
    <div className="grid justify-items-start gap-ark-4">
      <NumberStepper {...args} size="sm" />
      <NumberStepper {...args} size="md" />
      <NumberStepper {...args} size="lg" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

/**
 * 做决定要用的数摆在步进器旁边：单价、已有多少、还剩多少，以及按下去会花掉多少。
 * 不要让人退出去查库存再回来。
 */
export const WithContext: Story = {
  render: function Render() {
    const price = 180
    const [count, setCount] = useState(2)
    return (
      <Panel tone="raised" className="grid w-80 gap-ark-5">
        <div className="flex items-end justify-between">
          <Stat label="Price" value={price} size="sm" />
          <Stat label="Owned" value={5} size="sm" />
          <Stat label="Stock" value={4} size="sm" />
        </div>
        <NumberStepper
          aria-label="兑换数量"
          min={1}
          max={4}
          value={count}
          onValueChange={setCount}
          className="justify-self-center"
        />
        <Button variant="primary" size="lg" block sub={`-${price * count} CREDIT`}>
          兑换
        </Button>
      </Panel>
    )
  },
}
