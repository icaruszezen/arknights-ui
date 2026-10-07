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

/**
 * `variant="labeled"`：实机进驻信息里那种带字的粗条。左端白底写“心情”，和白色的填充连成一片；
 * 右端一格写当前值和上限。
 */
export const Labeled: Story = {
  args: { variant: 'labeled', value: 15, className: 'w-64' },
}

/** 进驻名单：每个人一条带字的心情条。心情低的那一条填充转红。 */
export const InList: Story = {
  render: () => (
    <Panel className="grid w-80 gap-ark-3">
      {(
        [
          ['占位干员甲', 24],
          ['占位干员乙', 13],
          ['占位干员丙', 3],
        ] as const
      ).map(([name, mood]) => (
        <div key={name} className="grid gap-ark-1">
          <span className="text-ark-label leading-ark-solid font-ark-bold">{name}</span>
          <MoodBar variant="labeled" value={mood} aria-label={`${name}的心情`} />
        </div>
      ))}
    </Panel>
  ),
}
