import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from './Accordion'

const meta = {
  title: '数据展示/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  decorators: [
    Story => (
      <div className="w-[32rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  <AccordionItem key="setup" title="怎么接入" sub="Setup" defaultOpen>
    引入预编译的样式表，或者在 Tailwind 的入口里引入主题层。组件不设置页面级样式，底色和字体自己定。
  </AccordionItem>,
  <AccordionItem key="themes" title="支持哪些主题" sub="Themes">
    暗色与亮色两套，用 data-ark-theme 切换；auto 跟随系统。
  </AccordionItem>,
  <AccordionItem key="assets" title="带不带图标和字体" sub="Assets">
    都不带。图形全部是代码画的几何形状，字体栈里列了开源的替代品。
  </AccordionItem>,
]

/** 一列可以展开的条目，条目之间只有一条细线。每一项是原生的 `<details>`。 */
export const Default: Story = {
  render: args => <Accordion {...args}>{items}</Accordion>,
}

/** `exclusive`：同一时刻只展开一项。 */
export const Exclusive: Story = {
  args: { exclusive: true },
  render: args => <Accordion {...args}>{items}</Accordion>,
}

/** `numbered`：每一项前面一个补零的编号。 */
export const Numbered: Story = {
  args: { numbered: true },
  render: args => <Accordion {...args}>{items}</Accordion>,
}
