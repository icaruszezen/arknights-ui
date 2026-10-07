import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scenes } from '../../../.storybook/art'
import { Codename } from '../Codename'
import { Thumbnail, ThumbnailStrip } from './ThumbnailStrip'

// 占位用的几何剪影，代码画的，不是官方立绘
const operators = [
  { id: 'a', name: '占位干员甲', art: figure('#9aa3a8') },
  { id: 'b', name: '占位干员乙', art: figure('#a39a8f', '#ffd802') },
  { id: 'c', name: '占位干员丙', art: figure('#8f9aa3', '#ff5e19') },
  { id: 'd', name: '占位干员丁', art: figure('#a09aa8') },
]

const meta = {
  title: '场景/官网/ThumbnailStrip',
  component: ThumbnailStrip,
  subcomponents: { Thumbnail },
  args: { defaultValue: 'a', 'aria-label': '干员' },
} satisfies Meta<typeof ThumbnailStrip>

export default meta
type Story = StoryObj<typeof meta>

const thumbnails = operators.map(operator => (
  <Thumbnail key={operator.id} value={operator.id} src={operator.art} label={operator.name} />
))

/**
 * 官网干员屏左下角的缩略图：每张一圈白框，名称写在左下角；当前项从右上角后面探出一块
 * 信号色的三角，其余的不压暗。尺寸是官网的实测值。Tab 进到当前项，方向键切换。
 */
export const Default: Story = {
  render: args => <ThumbnailStrip {...args}>{thumbnails}</ThumbnailStrip>,
}

/**
 * 竖排。寻访界面侧边的卡池缩略条是这种排法：图上已经有卡池的标题标识，
 * 用 `hideLabel` 把名称收起来，只读给读屏。
 */
export const Vertical: Story = {
  render: args => (
    <ThumbnailStrip {...args} orientation="vertical" defaultValue="0" aria-label="卡池">
      {scenes.map((scene, index) => (
        <Thumbnail
          // biome-ignore lint/suspicious/noArrayIndexKey: 占位图的顺序是固定的
          key={index}
          value={String(index)}
          src={scene}
          label={`卡池 ${index + 1}`}
          hideLabel
          className="h-20 w-36"
          position="50% 50%"
        />
      ))}
    </ThumbnailStrip>
  ),
}

/** 受控用法：缩略图切换旁边的主要内容。 */
export const Controlled: Story = {
  render: function Switcher() {
    const [current, setCurrent] = useState('b')
    const operator = operators.find(item => item.id === current) ?? operators[0]
    return (
      <div className="grid justify-items-start gap-ark-5">
        <Codename sub="Codename">{operator?.name}</Codename>
        <ThumbnailStrip aria-label="干员" value={current} onValueChange={setCurrent}>
          {thumbnails}
        </ThumbnailStrip>
      </div>
    )
  },
}
