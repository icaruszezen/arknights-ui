import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Step, Steps } from './Steps'

const meta = {
  title: '导航/Steps',
  component: Steps,
  subcomponents: { Step },
  args: { current: 1, 'aria-label': '发布流程' },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

const steps = [
  <Step key="info" title="填写信息" sub="Info" />,
  <Step key="target" title="选择环境" sub="Target">
    生产环境需要审批
  </Step>,
  <Step key="review" title="检查变更" sub="Review" />,
  <Step key="confirm" title="确认发布" sub="Confirm" />,
]

/**
 * 一根轴线串着几个方形的节点，每个节点一个补零的编号。完成的反色并换成对勾，
 * 当前的是信号色，还没到的只有一圈细边。
 */
export const Default: Story = {
  render: args => (
    <div className="w-[44rem] max-w-full">
      <Steps {...args}>{steps}</Steps>
    </div>
  ),
}

/** 竖排：节点在左、内容在右，步骤带说明时更好读。 */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: args => <Steps {...args}>{steps}</Steps>,
}

/** 配合按钮一步步往前走。 */
export const Interactive: Story = {
  render: function Render(args) {
    const [current, setCurrent] = useState(0)
    return (
      <div className="grid w-[44rem] max-w-full gap-ark-5">
        <Steps {...args} current={current}>
          {steps}
        </Steps>
        <div className="flex gap-ark-3">
          <Button disabled={current === 0} onClick={() => setCurrent(current - 1)}>
            上一步
          </Button>
          <Button
            variant="primary"
            disabled={current >= steps.length}
            onClick={() => setCurrent(current + 1)}
          >
            {current >= steps.length - 1 ? '完成' : '下一步'}
          </Button>
        </div>
      </div>
    )
  },
}
