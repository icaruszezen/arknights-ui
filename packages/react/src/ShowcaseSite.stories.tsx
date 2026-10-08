import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, scenes } from '../.storybook/art'
import {
  Button,
  Carousel,
  CarouselSlide,
  Counter,
  Glitch,
  Heading,
  Icon,
  ListRow,
  MicroText,
  Nav,
  NavItem,
  OperatorShowcase,
  ScrollHint,
  Shell,
  Stagger,
  Strip,
  StripGallery,
  Tab,
  TabList,
  Tabs,
  Tag,
  Thumbnail,
  ThumbnailStrip,
  WorldEntry,
  WorldEntryList,
} from './index'

// 不是组件，只是把组件按官网的编排拼在一起：
// 一副固定骨架，换屏只换内容；每屏一个主角。图片全部是代码画的占位图。
const meta = {
  title: '示例/官网分屏',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 骨架的横线随屏换位置：情报、干员两屏在内容区上缘，设定、更多内容在下缘（官网实测）
const screens = [
  { id: 'information', en: 'INFORMATION', zh: '情报', ghost: 'BREAKING NEWS', line: 'top' },
  { id: 'operator', en: 'OPERATOR', zh: '干员', ghost: 'RHODES', line: 'top' },
  { id: 'world', en: 'WORLD', zh: '设定', ghost: 'WORLD', line: 'bottom' },
  { id: 'more', en: 'MORE', zh: '更多内容', ghost: 'MORE CONTENT', line: 'bottom' },
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

const news = [
  { category: '活动', date: '2026-10-03', title: 'SideStory 限时活动即将开启' },
  { category: '公告', date: '2026-09-29', title: '09月29日16:00闪断更新公告' },
  { category: '新闻', date: '2026-09-21', title: '新增界面主题与首页场景' },
]

const events = [
  { id: 'event', tag: '活动', title: '限时活动即将开启', sub: 'SIDE STORY' },
  { id: 'headhunt', tag: '寻访', title: '限定寻访开放', sub: 'HEADHUNTING' },
  { id: 'update', tag: '更新', title: '新增界面主题与首页场景', sub: 'UPDATE' },
]

const firstOperator = {
  id: 'a',
  name: '占位干员甲',
  en: 'Operator A',
  art: figure('#9aa3a8'),
  intro:
    '该名工程人员于两年前加入本舰后勤部门，负责外勤设备的检修与改装。她的工具箱里常年放着一卷黄黑相间的警示胶带。',
}

const operators = [
  firstOperator,
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

const terms = [
  { id: 'originium', zh: '源石', en: 'ORIGINIUM' },
  { id: 'arts', zh: '源石技艺', en: 'ORIGINIUM ARTS' },
  { id: 'infected', zh: '感染者', en: 'INFECTED' },
  { id: 'nomadic', zh: '移动城市', en: 'NOMADIC CITY' },
]

// 每条一个主题色：tint 是压在图上的暗色带，hoverTint 是悬停时浮起来的鲜色
const entries = [
  {
    id: 'is',
    title: '集成战略',
    sub: 'INTEGRATED STRATEGIES',
    tint: '#4c2b2a',
    hoverTint: '#c7151e',
  },
  {
    id: 'ra',
    title: '生息演算',
    sub: 'RECLAMATION ALGORITHM',
    tint: '#898175',
    hoverTint: '#eeb763',
  },
  { id: 'anime', title: '衍生动画', sub: 'ANIMATION', tint: '#293f45', hoverTint: '#2096e6' },
  {
    id: 'comic',
    title: '泰拉记事社',
    sub: 'TERRA HISTORICUS',
    tint: '#576b0b',
    hoverTint: '#396308',
  },
]

// 情报屏：窄列表加宽图的不对称分栏。左边是分类标签和新闻行，右边是 16:9 的轮播，
// 右边出血到右栏的竖线。一屏只有一个主按钮
function InformationScreen() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,2fr)_minmax(0,5fr)] items-start gap-ark-7 portrait:grid-cols-1">
      <Stagger className="grid gap-ark-4">
        <Tabs defaultValue="latest">
          <TabList aria-label="情报分类">
            <Tab value="latest">最新</Tab>
            <Tab value="notice">公告</Tab>
            <Tab value="event">活动</Tab>
          </TabList>
        </Tabs>
        <ul className="m-0 list-none p-0">
          {news.map(row => (
            <li key={row.title}>
              <ListRow href="#news" category={row.category} date={row.date}>
                {row.title}
              </ListRow>
            </li>
          ))}
        </ul>
        <Button variant="primary" sub="READ MORE" arrow className="justify-self-start">
          更多情报
        </Button>
      </Stagger>
      <Carousel aria-label="活动" autoplay={5000} className="-mr-ark-6 portrait:order-first">
        {events.map((event, index) => (
          <CarouselSlide key={event.id} src={scenes[index] ?? ''} href={`#${event.id}`}>
            <Tag variant="solid" cut>
              {event.tag}
            </Tag>
            <Heading as="h2" size="sm" sub={event.sub}>
              {event.title}
            </Heading>
          </CarouselSlide>
        ))}
      </Carousel>
    </div>
  )
}

// 干员屏：文字靠左逐项入场，立绘靠右出血，身后是重影。左下角的缩略图切换干员
function OperatorScreen() {
  const [current, setCurrent] = useState('a')
  const operator = operators.find(item => item.id === current) ?? firstOperator
  return (
    <OperatorShowcase
      // 换人时重新挂载，文字和立绘的入场重播
      key={operator.id}
      nameAs="h1"
      name={operator.name}
      sub={operator.en}
      src={operator.art}
      emblem={<Icon frame="triangle">{glyphs[0]}</Icon>}
      meta="CV 占位声优"
      className="-mr-ark-6 -mb-ark-6 h-[calc(100%+var(--ark-space-6))]"
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
}

// 设定屏：内容最少的一屏。条目逐条自左入场，悬停时由灰变白，背后浮现巨型英文
function WorldScreen() {
  return (
    <div className="grid h-full content-center">
      <WorldEntryList aria-label="设定" className="max-w-3xl">
        {terms.map(term => (
          <WorldEntry key={term.id} href={`#${term.id}`} sub={term.en}>
            {term.zh}
          </WorldEntry>
        ))}
      </WorldEntryList>
    </div>
  )
}

// 更多内容屏：四条等宽竖带，各取一张图的局部，上下压黑，条带之间没有缝。
// 官网的条带铺满整屏；这里放在内容区里，向左、向右、向下出血到骨架的线上
function MoreScreen() {
  return (
    <div className="-my-ark-6 -mr-ark-6 -ml-ark-9 grid h-[calc(100%+var(--ark-space-6)*2)] portrait:-mx-ark-5">
      <h1 className="sr-only">更多内容</h1>
      <StripGallery aria-label="更多内容" className="h-full">
        {entries.map((entry, index) => (
          <Strip
            key={entry.id}
            href={`#${entry.id}`}
            src={scenes[index] ?? ''}
            icon={<Icon>{glyphs[index]}</Icon>}
            sub={entry.sub}
            tint={entry.tint}
            hoverTint={entry.hoverTint}
            className="aspect-auto"
          >
            {entry.title}
          </Strip>
        ))}
      </StripGallery>
    </div>
  )
}

const content = {
  information: <InformationScreen />,
  operator: <OperatorScreen />,
  world: <WorldScreen />,
  more: <MoreScreen />,
}

// 官网以 1920 × 1080 为基准，根字号随视口等比缩放（100vw / 120），尺寸全用 rem。
// 骨架自己不改根字号，要由页面来设，这里照做：整屏按比例缩进画布，多大的画布都是同一个版面。
// 另按高度收一道（官网没有）：Storybook 的画布常常又宽又矮，只按宽度算放不下一屏。
// 竖屏是另一套编排，不缩放
const rootScale =
  '@media (orientation: landscape) { :root { font-size: min(100vw / 120, 100dvh / 67.5); } }'

export const Site: Story = {
  name: '官网分屏',
  render: function SiteScreens() {
    const [index, setIndex] = useState(0)
    const screen = screens[index] ?? screens[0]
    return (
      // 抵消 Storybook 的留白，让骨架铺满视口；画布比 16:9 还宽时骨架居中，两侧留空
      <div className="-m-ark-6 flex justify-center">
        <style>{rootScale}</style>
        <Shell
          className="w-full max-w-[120rem]"
          logo={
            <span className="grid gap-ark-1">
              <span className="font-ark-latin-wide text-ark-body-lg leading-ark-solid font-ark-bold">
                ARKNIGHTS-UI
              </span>
              <MicroText className="text-ark-fg-muted">UNOFFICIAL</MicroText>
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
          counter={
            <Counter
              value={index + 1}
              total={screens.length}
              label={screen.en}
              micro="ARKNIGHTS-UI"
            />
          }
          aside={
            <MicroText className="text-ark-fg-muted">{'ARKNIGHTS-UI // UNOFFICIAL'}</MicroText>
          }
          ghost={screen.ghost}
          line={screen.line}
          scrollHint={
            // 最后一屏换成向上的箭头，回到第一屏
            index === screens.length - 1 ? (
              <ScrollHint direction="up" label="回到第一屏" onClick={() => setIndex(0)} />
            ) : (
              <ScrollHint label="下一屏" onClick={() => setIndex(index + 1)} />
            )
          }
        >
          {/* 切屏时故障播一次，正好盖住内容的替换 */}
          <Glitch trigger={index} className="h-full">
            {content[screen.id]}
          </Glitch>
        </Shell>
      </div>
    )
  },
}
