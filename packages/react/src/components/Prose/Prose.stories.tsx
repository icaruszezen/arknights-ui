import type { Meta, StoryObj } from '@storybook/react-vite'
import { Serial } from '../Counter'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Prose } from './Prose'

// 示例文字是为这个 Story 写的，不是任何官方档案的原文
const archive = (
  <>
    <h2>基础档案</h2>
    <p>
      该名工程人员于两年前加入本舰后勤部门，负责外勤设备的检修与改装。入职评估显示，其在结构力学与野外应急维修方面的经验远超岗位要求。
    </p>
    <p>
      出身地的记录并不完整。本人只提到自己“在一座总是在修路的城市长大”，并表示这解释了她对 Field
      Repair Manual, 3rd Edition 的偏爱。
    </p>
    <h2>综合评定</h2>
    <ul>
      <li>物理强度：标准</li>
      <li>战场机动：普通</li>
      <li>战术规划：优良</li>
    </ul>
    <blockquote>“图纸上的每一条线都要有人负责。画的人负责一半，照着做的人负责另一半。”</blockquote>
    <h2>档案资料</h2>
    <p>
      她的工具箱里常年放着一卷黄黑相间的警示胶带。同事问起时，她的回答是：
      <strong>标清楚边界，比事后解释省事</strong>
      。相关的操作规范见 <a href="#manual">后勤手册第四章</a>。
    </p>
    <hr />
    <p>以上内容经本人确认。</p>
  </>
)

const meta = {
  title: '排版与装饰/Prose',
  component: Prose,
  args: { children: archive },
} satisfies Meta<typeof Prose>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 黑体 1rem、行高 1.4、段距 1em，行长约 40 个字——官网公告正文的排法。
 * 二级标题上方一条细线，把正文分成一节一节。里面写的就是普通的 `h2`、`p`、`ul`、`blockquote`。
 */
export const Default: Story = {}

/** 自动编号：档案条目用编号和细线分节。编号是数据体、信号色。这个写法没有实机出处。 */
export const Numbered: Story = {
  args: { numbered: true, as: 'article' },
}

/**
 * `serif` 是文书的写法：中文宋体配英文衬线，1.125rem、行高 1.9。没有实机出处，是估计——
 * 官网所有成段的文字都是黑体。左边是默认，右边是 `serif`。
 */
export const Serif: Story = {
  render: () => {
    const text =
      '该名工程人员于两年前加入本舰后勤部门，负责外勤设备的检修与改装。入职评估显示，其在结构力学与野外应急维修方面的经验远超岗位要求。'
    return (
      <div className="grid w-[52rem] grid-cols-2 gap-ark-7">
        <Prose>
          <p>{text}</p>
        </Prose>
        <Prose serif>
          <p>{text}</p>
        </Prose>
      </div>
    )
  },
}

/** 放进纸白面板：文字、细线、引文的色边和链接的信号色都跟着明暗上下文走。 */
export const OnPaper: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: args => (
    <Panel as="article" tone="paper" className="w-[36rem] p-ark-6">
      <div className="mb-ark-5 flex items-end justify-between">
        <Heading as="h1" size="sm" sub="PERSONNEL FILE">
          人事档案
        </Heading>
        <Serial prefix="NO." value={147} pad={4} className="text-ark-fg-muted" />
      </div>
      <Prose {...args} numbered />
    </Panel>
  ),
}
