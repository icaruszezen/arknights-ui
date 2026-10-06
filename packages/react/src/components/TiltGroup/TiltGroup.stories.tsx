import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { PanelGrid, PanelGridItem } from '../PanelGrid'
import { Pattern } from '../Pattern'
import { Stat } from '../Stat'
import { TiltGroup } from './TiltGroup'

const meta = {
  title: '布局与层级/TiltGroup',
  component: TiltGroup,
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta<typeof TiltGroup>

export default meta
type Story = StoryObj<typeof meta>

// 主界面右面板组的拼法，见 PanelGrid
const entries = (
  <PanelGrid>
    <PanelGridItem rows={2}>
      <Panel tone="paper" className="flex flex-col justify-end p-ark-4">
        <Stat
          label="Sanity"
          value={131}
          max={135}
          size="sm"
          className="absolute top-ark-4 right-ark-4 justify-items-end"
        />
        <Heading as="h3" size="md" sub="TERMINAL" serif>
          作战
        </Heading>
      </Panel>
    </PanelGridItem>
    {[
      ['编队', 'SQUADS'],
      ['干员', 'OPERATOR'],
    ].map(([title, sub]) => (
      <PanelGridItem key={sub} span="1/2">
        <Panel className="flex flex-col justify-end p-ark-4">
          <Heading as="h3" size="sm" sub={sub} serif>
            {title}
          </Heading>
        </Panel>
      </PanelGridItem>
    ))}
    {[
      ['任务', 'MISSION'],
      ['基建', 'BASE'],
      ['仓库', 'DEPOT'],
    ].map(([title, sub]) => (
      <PanelGridItem key={sub} span="1/3">
        <Panel className="flex flex-col justify-end p-ark-4">
          <Heading as="h3" size="sm" sub={sub} serif>
            {title}
          </Heading>
        </Panel>
      </PanelGridItem>
    ))}
  </PanelGrid>
)

/**
 * 右侧面板组：绕 Y 轴 -10°、缩到 0.9，以右缘为轴，像一块悬浮在场景里的全息看板。
 * 只有整组倾斜，里面的面板和文字保持正交。
 */
export const Default: Story = {
  args: { className: 'ml-auto w-[30rem]', children: entries },
}

/** 左侧面板组：方向相反，以左缘为轴。 */
export const Left: Story = {
  args: { side: 'left', className: 'w-[30rem]', children: entries },
}

/**
 * 左右各一组，形成“环抱”的视角，中间留给场景和助理。
 * 投影性质的面板上可以叠一层扫描线。
 */
export const Embrace: Story = {
  render: () => (
    <div className="flex items-center justify-between gap-ark-7">
      <TiltGroup side="left" className="relative w-72">
        <Panel className="grid gap-ark-3">
          <Heading as="h3" size="sm" sub="DOCTOR">
            博士
          </Heading>
          <Stat label="Level" value={120} size="sm" orientation="horizontal" />
        </Panel>
        <Pattern variant="scanline" className="absolute inset-0" />
      </TiltGroup>
      <TiltGroup side="right" className="relative w-[26rem]">
        {entries}
        <Pattern variant="scanline" className="absolute inset-0" />
      </TiltGroup>
    </div>
  ),
}

/**
 * 随指针摆动：幅度只有 ±2°，制造“面板真的悬在空间里”的感觉而不干扰阅读。
 * 触屏设备上和用户要求减少动效时不启用。在画面上移动指针试试。
 */
export const Sway: Story = {
  args: { sway: true, className: 'ml-auto w-[30rem]', children: entries },
}
