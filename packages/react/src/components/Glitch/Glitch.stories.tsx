import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Counter } from '../Counter'
import { Heading } from '../Heading'
import { Loading } from '../Loading'
import { Panel } from '../Panel'
import { Glitch } from './Glitch'

const meta = {
  title: '底纹/Glitch',
  component: Glitch,
  argTypes: { duration: { control: { type: 'range', min: 200, max: 1000, step: 100 } } },
} satisfies Meta<typeof Glitch>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 点“重播”看一次：内容横向错位、被裁成几条横带，上面叠着横条和信号色的色块，
 * 0.6 秒后恢复原样。它只在有理由的时刻出现，不常驻。
 */
export const Default: Story = {
  render: function Replay(args) {
    const [count, setCount] = useState(0)
    return (
      <div className="grid w-96 justify-items-start gap-ark-5">
        <Glitch {...args} trigger={count} className="w-full">
          <Panel>
            <Heading as="h3" size="md" sub="SIGNAL UNSTABLE">
              信号不稳定
            </Heading>
            <Loading value={72} className="mt-ark-5">
              RECONNECTING
            </Loading>
          </Panel>
        </Glitch>
        <Button onClick={() => setCount(count + 1)}>重播</Button>
      </div>
    )
  },
}

const screens = [
  { en: 'INFORMATION', zh: '情报' },
  { en: 'OPERATOR', zh: '干员' },
  { en: 'WORLD', zh: '设定' },
]

/**
 * 用在转场上：把会换掉的内容包进来，`trigger` 传屏的序号。
 * 内容换掉的那一刻，故障正好盖住这次切换。
 */
export const SceneSwitch: Story = {
  render: function Switcher(args) {
    const [index, setIndex] = useState(0)
    const screen = screens[index % screens.length]
    return (
      <div className="grid w-[32rem] gap-ark-5">
        <Glitch
          {...args}
          trigger={index}
          className="grid h-48 content-center border border-ark-rule px-ark-6"
        >
          <Heading as="h2" size="lg" sub={screen?.en}>
            {screen?.zh}
          </Heading>
        </Glitch>
        <div className="flex items-center justify-between">
          <Counter
            size="sm"
            value={(index % screens.length) + 1}
            total={screens.length}
            label={screen?.en}
          />
          <Button onClick={() => setIndex(index + 1)} arrow>
            下一屏
          </Button>
        </div>
      </div>
    )
  },
}

/** `appear`：挂载时播一次，用在加载结束、内容第一次出现的时候。 */
export const OnAppear: Story = {
  args: { appear: true },
  render: args => (
    <Glitch {...args} className="w-fit">
      <Heading as="h2" size="lg" sub="CONNECTED">
        接入完成
      </Heading>
    </Glitch>
  ),
}
