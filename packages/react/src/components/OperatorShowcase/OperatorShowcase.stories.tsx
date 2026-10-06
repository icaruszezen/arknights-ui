import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { Icon } from '../Icon'
import { Thumbnail, ThumbnailStrip } from '../ThumbnailStrip'
import { OperatorShowcase } from './OperatorShowcase'

// 占位用的几何剪影和文案，不是官方立绘与档案
const first = {
  id: 'a',
  name: '占位干员甲',
  en: 'Operator A',
  art: figure('#9aa3a8'),
  intro:
    '该名工程人员于两年前加入本舰后勤部门，负责外勤设备的检修与改装。她的工具箱里常年放着一卷黄黑相间的警示胶带。',
}

const operators = [
  first,
  {
    id: 'b',
    name: '占位干员乙',
    en: 'Operator B',
    art: figure('#a39a8f', '#ffd802'),
    intro: '档案室的夜班管理员。经手的每一份文件都会在右下角盖上日期，从不遗漏。',
  },
  {
    id: 'c',
    name: '占位干员丙',
    en: 'Operator C',
    art: figure('#8f9aa3', '#ff5e19'),
    intro: '负责测绘的外勤人员，随身带着一把折叠标尺。她画的等高线图被贴在作战室的墙上。',
  },
]

const emblem = <Icon frame="triangle">{glyphs.diamond}</Icon>

const meta = {
  title: '场景/官网/OperatorShowcase',
  component: OperatorShowcase,
  args: {
    name: first.name,
    sub: first.en,
    src: first.art,
    emblem,
    meta: 'CV 占位声优',
    ghost: 'Rhodes',
    children: first.intro,
    className: 'h-[30rem] max-w-5xl',
  },
} satisfies Meta<typeof OperatorShowcase>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 文字靠左、立绘靠右并出血，身后是同一张图放大去色的重影，最底下垫一行背景巨字。
 * 遮罩只压文字一侧。立绘和徽记都是代码画的占位图。
 */
export const Default: Story = {}

/**
 * 左下角放一条 `ThumbnailStrip` 切换干员。换人时给 `OperatorShowcase` 换一个 `key`，
 * 文字和立绘的入场就会重播。
 */
export const WithThumbnails: Story = {
  render: function Switcher(args) {
    const [current, setCurrent] = useState('a')
    const operator = operators.find(item => item.id === current) ?? first
    return (
      <OperatorShowcase
        {...args}
        key={operator.id}
        name={operator.name}
        sub={operator.en}
        src={operator.art}
        footer={
          <ThumbnailStrip aria-label="干员" value={current} onValueChange={setCurrent}>
            {operators.map(item => (
              <Thumbnail key={item.id} value={item.id} src={item.art} label={item.name} />
            ))}
          </ThumbnailStrip>
        }
      >
        {operator.intro}
      </OperatorShowcase>
    )
  },
}

/** 只有名字和立绘的最简写法。 */
export const Minimal: Story = {
  args: { emblem: undefined, meta: undefined, ghost: undefined, children: undefined, label: null },
}
