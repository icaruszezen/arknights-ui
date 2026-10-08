import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Callout } from './Callout'

const meta = {
  title: '排版与装饰/Callout',
  component: Callout,
  args: { children: 'GALLERY', className: 'absolute top-1/2 left-1/4' },
  // 标注是压在图片或场景上的，这里用一块深色块代替
  decorators: [
    Story => (
      <div className="relative h-56 w-[30rem] bg-ark-neutral-ink-800">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

// 演示用的自绘图形，不对应任何官方图标：一块信号色的底上两座山
const tile = (
  <svg aria-hidden="true" viewBox="0 0 78 50">
    <path d="M0 0h78v50H0z" fill="var(--ark-signal)" />
    <path d="M8 44 30 16l12 15 8-9 20 22z" fill="none" stroke="#000" strokeWidth="3" />
    <path d="M14 8h8v8h-8z" fill="#000" />
  </svg>
)

/** 待机：一个带斜杠的小方框加一行窄体灰字。没有引线，直接摆在物件旁边。 */
export const Default: Story = {}

/** 选中：小方框和灰字换成黑底信号色字的标签。 */
export const Active: Story = {
  args: { active: true },
}

/** 选中时标签上面可以放一块图标，标签至少和图标一样宽。 */
export const ActiveWithIcon: Story = {
  args: { active: true, icon: tile },
}

/**
 * 标注可以是链接：把导航做成一个“场所”，每个物件引出一个入口。
 * 悬停时由灰变成前景色；点开的那一个换成标签。
 */
export const AsLinks: Story = {
  render: function Links() {
    const [current, setCurrent] = useState('gallery')
    const items = [
      { id: 'gallery', label: 'GALLERY', place: 'top-[22%] left-[18%]' },
      { id: 'music', label: 'MONSTER SIREN', place: 'top-[62%] left-[30%]' },
      { id: 'video', label: 'VIDEO', place: 'top-[40%] left-[70%]' },
    ]
    return (
      <>
        {items.map(item => (
          <Callout
            key={item.id}
            href={`#${item.id}`}
            active={item.id === current}
            icon={tile}
            className={`absolute ${item.place}`}
            onClick={event => {
              event.preventDefault()
              setCurrent(item.id)
            }}
          >
            {item.label}
          </Callout>
        ))}
      </>
    )
  },
}
