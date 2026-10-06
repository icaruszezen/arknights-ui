import type { Meta, StoryObj } from '@storybook/react-vite'
import { Serial } from '../Counter'
import { Panel } from '../Panel'
import { Barcode } from './Barcode'

const meta = {
  title: '排版与装饰/Barcode',
  component: Barcode,
  args: { value: 'ARKNIGHTS-UI' },
} satisfies Meta<typeof Barcode>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 一条真实的 Code 39 条码：编的就是传入的内容，下方印出原文。
 * 装饰写真实内容，不放一排随手画的竖线。
 */
export const Default: Story = {}

export const WithoutText: Story = {
  args: { text: false },
}

/**
 * 窄条的宽度和条码的高度各由一个 CSS 变量决定。
 * 要拿去扫的话把窄条放大到 2px 以上，并在两侧各留 10 个窄条宽的空白。
 */
export const Sizes: Story = {
  render: args => (
    <div className="grid justify-items-start gap-ark-5">
      <Barcode {...args} className="[--ark-barcode-height:1rem]" />
      <Barcode {...args} />
      <Barcode
        {...args}
        value="NO.0147"
        className="[--ark-barcode-height:4rem] [--ark-barcode-unit:0.125rem]"
      />
    </div>
  ),
}

/** 和序号放在一起，像贴在货箱上的标签。条码用前景色，放进纸白面板时换成深色。 */
export const OnLabel: Story = {
  render: () => (
    <Panel tone="paper" className="grid w-fit gap-ark-3">
      <Serial prefix="NO." value={147} pad={4} className="text-ark-body font-ark-bold" />
      <Barcode value="NO.0147" />
    </Panel>
  ),
}
