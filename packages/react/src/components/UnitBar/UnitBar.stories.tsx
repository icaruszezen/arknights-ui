import type { Meta, StoryObj } from '@storybook/react-vite'
import { UnitBar } from './UnitBar'

const meta = {
  title: '场景/作战/UnitBar',
  component: UnitBar,
  args: { value: 76, skill: 18, skillMax: 34 },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof UnitBar>

export default meta
type Story = StoryObj<typeof meta>

/** 上面 4px 是生命，下面 3px 是技力。条很细、直角，黑色轨道。 */
export const Default: Story = {}

/** 敌方的生命条是红色，通常没有技力条。 */
export const Enemy: Story = {
  args: { side: 'enemy', value: 41, skill: undefined },
}

/**
 * 贴在单位的上方，不遮挡战场。它不自己定位：这里用 `absolute` 放在每个单位的容器上。
 * 方块是代码画的占位单位。
 */
export const OnField: Story = {
  render: () => (
    <div className="flex gap-ark-7 pt-ark-5">
      {(
        [
          { id: 'a', side: 'ally', value: 100, skill: 34, name: '我方单位甲' },
          { id: 'b', side: 'ally', value: 58, skill: 9, name: '我方单位乙' },
          { id: 'c', side: 'enemy', value: 72, skill: undefined, name: '敌方单位' },
          { id: 'd', side: 'enemy', value: 12, skill: undefined, name: '敌方单位' },
        ] as const
      ).map(unit => (
        <div key={unit.id} className="relative">
          <UnitBar
            side={unit.side}
            value={unit.value}
            skill={unit.skill}
            skillMax={34}
            label={`${unit.name}的生命`}
            skillLabel={`${unit.name}的技力`}
            className="absolute -top-ark-3 left-1/2 -translate-x-1/2"
          />
          <div
            aria-hidden="true"
            className={
              unit.side === 'ally'
                ? 'size-10 bg-ark-signal-info-deep/90'
                : 'size-10 bg-ark-signal-danger/80'
            }
          />
        </div>
      ))}
    </div>
  ),
}
