import type { Meta, StoryObj } from '@storybook/react-vite'
import { figure, scene } from '../.storybook/art'
import {
  CountUp,
  EntryGrid,
  EntryPanel,
  Heading,
  Panel,
  PanelGrid,
  PanelGridItem,
  Parallax,
  ParallaxLayer,
  Pattern,
  Portrait,
  Resource,
  ResourceBar,
  Serial,
  Stat,
  TiltGroup,
} from './index'

// 不是组件，只是把组件按游戏主界面的编排拼在一起：
// 场景和助理做成视差，左右两组面板向内倾斜、随指针轻微摆动；右组用 EntryGrid 排成一、二、三、三。
// 图片全部是代码画的占位图。
const meta = {
  title: '示例/主界面',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  globals: { backgrounds: { value: 'scene' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 自绘的三角标识，当水印用。不对应任何官方标识
const emblem = (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 2 23 21H1zM12 9l-5 9h10z" fill="currentColor" fillRule="evenodd" />
  </svg>
)

export const Home: Story = {
  name: '主界面',
  render: () => (
    <Parallax className="-m-ark-6 min-h-screen">
      {/* 最远：场景，几乎不动，四周压暗把视线收到中间 */}
      <ParallaxLayer depth={0.15} className="absolute -inset-ark-5 -z-3">
        <img src={scene()} alt="" className="block size-full object-cover" />
      </ParallaxLayer>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-2 bg-[radial-gradient(ellipse_at_42%_50%,transparent_30%,var(--ark-color-overlay-scrim-strong))]"
      />
      {/* 助理：比面板近一些，位移更大 */}
      <ParallaxLayer depth={0.6} className="absolute bottom-0 left-[34%] -z-1 h-[86%] w-[22%]">
        <Portrait src={figure()} alt="助理" className="size-full" />
      </ParallaxLayer>

      <ResourceBar className="absolute top-0 right-0">
        <Resource label="龙门币" value={128400} />
        <Resource label="合成玉" value={6000} />
        <Resource label="理智" value={131} max={135} />
      </ResourceBar>

      <div className="flex min-h-screen items-center justify-between gap-ark-7 px-ark-7 pt-20 pb-ark-7 portrait:flex-col portrait:items-stretch">
        {/* 左组：博士信息和次要入口，向右后方倾 */}
        <TiltGroup side="left" sway className="relative w-80 portrait:w-auto">
          <PanelGrid>
            <PanelGridItem>
              <Panel className="grid gap-ark-3">
                <div className="flex items-baseline justify-between">
                  <Heading as="h2" size="sm" sub="DOCTOR">
                    博士
                  </Heading>
                  <Serial prefix="ID " value="00000000" className="text-ark-fg-muted" />
                </div>
                <Stat label="Level" value={120} size="sm" orientation="horizontal" />
              </Panel>
            </PanelGridItem>
            <PanelGridItem span="1/2">
              <EntryPanel href="#friends" sub="Friends">
                好友
              </EntryPanel>
            </PanelGridItem>
            <PanelGridItem span="1/2">
              <EntryPanel href="#archives" sub="Archives">
                档案
              </EntryPanel>
            </PanelGridItem>
          </PanelGrid>
          {/* 投影性质的面板上叠一层扫描线 */}
          <Pattern variant="scanline" className="absolute inset-0" />
        </TiltGroup>

        {/* 右组：主要入口，一、二、三、三；作战最大最亮。入口的字号跟着所在的行走 */}
        <TiltGroup side="right" sway className="relative w-[32rem] portrait:w-auto">
          <EntryGrid>
            <EntryPanel
              href="#terminal"
              tone="paper"
              sub="Terminal"
              watermark={emblem}
              aside={<Stat label="Sanity" value={<CountUp value={131} />} max={135} size="sm" />}
            >
              作战
            </EntryPanel>
            <EntryPanel href="#squads" sub="Squads">
              编队
            </EntryPanel>
            <EntryPanel href="#operator" sub="Operator">
              干员
            </EntryPanel>
            <EntryPanel href="#store" tone="paper" sub="Store">
              采购中心
            </EntryPanel>
            <EntryPanel href="#recruit" sub="Recruit">
              公开招募
            </EntryPanel>
            <EntryPanel href="#headhunt" sub="Headhunt">
              干员寻访
            </EntryPanel>
            <EntryPanel href="#mission" sub="Mission" badge badgeLabel="有可领取的奖励">
              任务
            </EntryPanel>
            <EntryPanel href="#base" sub="Base">
              基建
            </EntryPanel>
            <EntryPanel href="#depot" sub="Depot">
              仓库
            </EntryPanel>
          </EntryGrid>
          <Pattern variant="scanline" className="absolute inset-0" />
        </TiltGroup>
      </div>
    </Parallax>
  ),
}
