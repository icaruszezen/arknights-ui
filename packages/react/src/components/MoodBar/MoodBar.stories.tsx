import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from '../Panel'
import { MoodBar } from './MoodBar'

const meta = {
  title: '场景/基建/MoodBar',
  component: MoodBar,
  args: { value: 18, className: 'w-40' },
} satisfies Meta<typeof MoodBar>

export default meta
type Story = StoryObj<typeof meta>

/** 4px 的直角细条：没有圆头，没有渐变。默认上限 24。 */
export const Default: Story = {}

/**
 * 低于阈值（默认是上限的四分之一）时转红，同时把填充换成 45° 斜纹——
 * 状态不只靠颜色区分。
 */
export const Low: Story = {
  args: { value: 4 },
}

/** 进驻名单里的一列：名字、心情条、数值。数字用数据体，分母小而灰。 */
export const InList: Story = {
  render: () => (
    <Panel className="grid w-72 gap-ark-3">
      {(
        [
          ['占位干员甲', 24],
          ['占位干员乙', 13],
          ['占位干员丙', 3],
        ] as const
      ).map(([name, mood]) => (
        <div key={name} className="grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-ark-3">
          <span className="text-ark-label leading-ark-solid">{name}</span>
          <MoodBar value={mood} aria-label={`${name}的心情`} />
          <span className="font-ark-data text-ark-label leading-ark-solid">
            <b className="font-ark-bold">{mood}</b>
            <span className="text-ark-caption text-ark-fg-muted">/24</span>
          </span>
        </div>
      ))}
    </Panel>
  ),
}
