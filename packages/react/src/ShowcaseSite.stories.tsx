import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scenes } from '../.storybook/art'
import {
  Counter,
  Divider,
  Glitch,
  Heading,
  Icon,
  MicroText,
  Nav,
  NavItem,
  Portrait,
  Prose,
  Scrim,
  ScrollHint,
  Shell,
  Stagger,
  Strip,
  StripGallery,
  Tag,
} from './index'

// 不是组件，只是把第三批组件按官网的编排拼在一起：
// 一副固定骨架，换屏只换内容；每屏一个主角。图片全部是代码画的占位图。
const meta = {
  title: '示例/官网分屏',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const screens = [
  { id: 'operator', en: 'OPERATOR', zh: '干员', ghost: 'RHODES' },
  { id: 'more', en: 'MORE', zh: '更多内容', ghost: 'MORE CONTENT' },
] as const

// 演示用的自绘几何图形，不对应任何官方图标
const glyphs = [
  <svg key="diamond" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" stroke="currentColor" strokeWidth="2.5" />
  </svg>,
  <svg key="peak" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 3 21 21H3z" fill="currentColor" />
  </svg>,
  <svg key="blocks" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5v5h-5z" fill="currentColor" />
  </svg>,
  <svg key="bars" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M3 12h12M3 18h15" stroke="currentColor" strokeWidth="3" />
  </svg>,
]

const entries = [
  { id: 'is', title: '集成战略', sub: 'INTEGRATED STRATEGIES' },
  { id: 'ra', title: '生息演算', sub: 'RECLAMATION ALGORITHM' },
  { id: 'anime', title: '衍生动画', sub: 'ANIMATION' },
  { id: 'comic', title: '泰拉记事社', sub: 'TERRA HISTORICUS' },
]

// 干员屏：文字靠左逐项入场，立绘靠右出血，身后是重影。只在文字一侧加遮罩
function OperatorScreen() {
  return (
    <div className="relative isolate -mr-ark-6 -mb-ark-6 h-[calc(100%+var(--ark-space-6))]">
      <Portrait
        src={figure()}
        alt=""
        ghost
        className="absolute inset-y-0 right-0 -z-2 aspect-auto h-full w-3/5"
      />
      <Scrim side="left" className="-z-1" />
      <Stagger className="grid h-full max-w-md content-center gap-ark-4">
        <Divider label="PROFILE" variant="fade" />
        <Heading as="h1" size="lg" sub="CODENAME">
          干员代号
        </Heading>
        <div className="flex gap-ark-2">
          <Tag variant="solid" cut>
            近卫
          </Tag>
          <Tag variant="outline">输出</Tag>
        </div>
        <Prose className="bg-ark-neutral-black/50 p-ark-4 text-ark-label">
          <p>
            该名工程人员于两年前加入本舰后勤部门，负责外勤设备的检修与改装。她的工具箱里常年放着一卷黄黑相间的警示胶带。
          </p>
        </Prose>
      </Stagger>
    </div>
  )
}

// 更多内容屏：四条等宽竖带，各取一张图的局部，底部统一压黑
function MoreScreen() {
  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-ark-5">
      <Stagger>
        <Heading as="h1" size="md" sub="MORE CONTENT">
          更多内容
        </Heading>
      </Stagger>
      <StripGallery aria-label="更多内容">
        {entries.map((entry, index) => (
          <Strip
            key={entry.id}
            href={`#${entry.id}`}
            src={scenes[index] ?? ''}
            icon={<Icon>{glyphs[index]}</Icon>}
            sub={entry.sub}
            className="aspect-auto"
          >
            {entry.title}
          </Strip>
        ))}
      </StripGallery>
    </div>
  )
}

export const Site: Story = {
  name: '官网分屏',
  render: function SiteScreens() {
    const [index, setIndex] = useState(0)
    const screen = screens[index] ?? screens[0]
    return (
      <Shell
        // 抵消 Storybook 的留白，让骨架铺满视口
        className="-m-ark-6"
        logo={
          <span className="grid gap-ark-1">
            <span className="font-ark-latin-wide text-ark-body-lg leading-ark-solid font-ark-bold">
              ARKNIGHTS-UI
            </span>
            <MicroText>UNOFFICIAL</MicroText>
          </span>
        }
        nav={
          <Nav aria-label="主导航" collapse="never">
            {screens.map((item, i) => (
              <NavItem
                key={item.id}
                href={`#${item.id}`}
                sub={item.zh}
                current={i === index && 'location'}
                onClick={event => {
                  event.preventDefault()
                  setIndex(i)
                }}
              >
                {item.en}
              </NavItem>
            ))}
          </Nav>
        }
        counter={<Counter value={index + 1} total={screens.length} label={screen.en} />}
        aside={<MicroText>{'ARKNIGHTS-UI // UNOFFICIAL'}</MicroText>}
        ghost={screen.ghost}
        scrollHint={
          <ScrollHint label="下一屏" onClick={() => setIndex((index + 1) % screens.length)} />
        }
      >
        {/* 切屏时故障播一次，正好盖住内容的替换 */}
        <Glitch trigger={index} className="h-full">
          {screen.id === 'operator' ? <OperatorScreen /> : <MoreScreen />}
        </Glitch>
      </Shell>
    )
  },
}
