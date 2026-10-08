import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { type GlyphName, glyphs } from '../.storybook/glyphs'
import { fitScreen } from '../.storybook/scale'
import {
  ActionButton,
  BackHome,
  Badge,
  Button,
  Callout,
  Divider,
  Drawer,
  GhostTitle,
  Heading,
  Loading,
  MicroText,
  Panel,
  Progress,
  QuickNav,
  QuickNavItem,
  Rating,
  Resource,
  ResourceBar,
  RewardGlow,
  RingProgress,
  Scrim,
  Sheet,
  Stat,
  Tag,
} from './index'

// 不是组件，只是把第二批组件按游戏二级页面的编排拼在一起：
// 左上角“返回 + 主页”，右上角资源条，信息贴四边，中间留给场景。
const meta = {
  title: '示例/游戏界面',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  globals: { backgrounds: { value: 'scene' } },
  // 游戏内的界面按 1280 × 720 排：根字号随画布等比缩放，画布多大都是完整的一屏
  decorators: [fitScreen('game')],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const systems: readonly (readonly [string, string, GlyphName])[] = [
  ['home', '首页', 'diamond'],
  ['squads', '编队', 'blocks'],
  ['operator', '干员', 'peak'],
  ['terminal', '作战', 'target'],
  ['base', '基建', 'frame'],
  ['store', '采购中心', 'shield'],
]

export const Game: Story = {
  name: '游戏界面',
  render: function GameScreen() {
    const [drawer, setDrawer] = useState(false)
    const [sheet, setSheet] = useState(false)
    return (
      <div className="relative isolate -m-ark-6 min-h-screen overflow-hidden">
        {/* 图上压字：只在文字所在的一侧加黑色到透明的渐变，场景其余部分保持原样 */}
        <Scrim side="left" className="right-auto -z-1 w-3/4 from-ark-neutral-black/85" />
        <GhostTitle className="absolute bottom-ark-4 left-ark-7 -z-1">Guard</GhostTitle>
        <MicroText vertical className="absolute right-ark-2 bottom-ark-7 text-ark-fg-muted">
          {'ARKNIGHTS-UI // UNOFFICIAL'}
        </MicroText>

        <BackHome className="absolute top-0 left-0">
          <QuickNav aria-label="快捷导航">
            {systems.map(([id, label, glyph]) => (
              <QuickNavItem
                key={id}
                href={`#${id}`}
                icon={glyphs[glyph]}
                current={id === 'operator'}
              >
                {label}
              </QuickNavItem>
            ))}
          </QuickNav>
        </BackHome>

        {/* 实机的资源条只有图标和数字，名称只读给读屏；可以购买的后面带一个加号 */}
        <ResourceBar className="absolute top-0 right-0">
          <Resource label="龙门币" icon={glyphs.frame} value={128400} />
          <Resource label="合成玉" icon={glyphs.shield} value={6000} onAdd={() => {}} />
          <Resource label="理智" icon={glyphs.chevrons} value={131} max={135} />
        </ResourceBar>

        <div className="grid grid-cols-[minmax(0,1fr)_22rem] items-end gap-ark-7 px-ark-7 pt-28 pb-ark-7">
          <section className="grid justify-items-start gap-ark-5">
            <Rating value={6} size="lg" />
            <Heading as="h1" size="lg" sub="GUARD OPERATOR">
              近卫干员
            </Heading>
            <div className="flex gap-ark-2">
              <Tag variant="solid" cut>
                近卫
              </Tag>
              {/* 实机里定位是深色块白字，不是描边 */}
              <Tag>输出</Tag>
              <Tag>生存</Tag>
            </div>
            <div className="flex items-center gap-ark-6">
              <RingProgress
                aria-label="等级经验"
                tone="action"
                size="lg"
                value={2480}
                max={3600}
                label="LV"
              >
                90
              </RingProgress>
              <div className="grid w-48 gap-ark-2">
                <Stat label="Trust" value={131} max={200} size="sm" orientation="horizontal" />
                <Progress aria-label="信赖" variant="meter" value={131} max={200} />
              </div>
            </div>
            <div className="flex gap-ark-4">
              <Button onClick={() => setSheet(true)}>职业详情</Button>
              <Badge dot label="制造站有可收取的产物">
                <Button onClick={() => setDrawer(true)}>查看制造站</Button>
              </Badge>
            </div>
          </section>

          <aside className="grid gap-ark-2">
            <Panel>
              <div className="flex items-start justify-between">
                <Heading as="h2" size="sm" sub="OPERATION">
                  1-7 行动
                </Heading>
                <Tag>推荐等级 精一 40</Tag>
              </div>
              <Divider variant="dash" className="my-ark-4" />
              <Loading value={65}>SYNCING SQUAD</Loading>
            </Panel>
            <ActionButton block cost={-18} costLabel="SANITY" sub="MISSION START">
              开始行动
            </ActionButton>
          </aside>
        </div>

        <Callout className="absolute top-40 left-[46%]">DEPLOY</Callout>

        <Drawer
          open={drawer}
          onOpenChange={setDrawer}
          title="制造站"
          sub="FACTORY"
          footer={<Button block>收取产物</Button>}
        >
          <div className="grid gap-ark-5">
            <Stat label="Output" value="赤金" size="sm" orientation="horizontal" />
            <Progress aria-label="制造进度" variant="thick" tone="action" value={62} segments={5} />
            <Stat label="Remaining" value="02:14:36" size="sm" orientation="horizontal" />
          </div>
        </Drawer>

        <Sheet open={sheet} onOpenChange={setSheet} title="获得物资" sub="REWARDS">
          <div className="flex justify-center gap-ark-8 py-ark-7">
            <RewardGlow tier={5}>
              <span className="grid size-14 place-items-center bg-ark-neutral-graphite font-ark-data text-ark-label font-ark-bold">
                ×2
              </span>
            </RewardGlow>
            <RewardGlow>
              <span className="grid size-14 place-items-center bg-ark-neutral-graphite font-ark-data text-ark-label font-ark-bold">
                ×200
              </span>
            </RewardGlow>
          </div>
        </Sheet>
      </div>
    )
  },
}
