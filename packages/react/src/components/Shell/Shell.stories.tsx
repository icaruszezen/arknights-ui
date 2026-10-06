import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Counter } from '../Counter'
import { Heading } from '../Heading'
import { ListRow } from '../ListRow'
import { MicroText } from '../MicroText'
import { Nav, NavItem } from '../Nav'
import { ScrollHint } from '../ScrollHint'
import { Shell } from './Shell'

const screens = [
  { id: 'index', en: 'INDEX', zh: '首页', ghost: 'ARKNIGHTS-UI' },
  { id: 'information', en: 'INFORMATION', zh: '情报', ghost: 'BREAKING NEWS' },
  { id: 'operator', en: 'OPERATOR', zh: '干员', ghost: 'RHODES' },
  { id: 'world', en: 'WORLD', zh: '设定', ghost: 'WORLD' },
  { id: 'more', en: 'MORE', zh: '更多内容', ghost: 'MORE CONTENT' },
]

// 标识是一行字，不是任何官方 Logo
const logo = (
  <span className="grid gap-ark-1">
    <span className="font-ark-latin-wide text-ark-body-lg leading-ark-solid font-ark-bold">
      ARKNIGHTS-UI
    </span>
    <MicroText>UNOFFICIAL</MicroText>
  </span>
)

const actions = (
  <>
    {['分享', '音频'].map(name => (
      <button
        key={name}
        type="button"
        aria-label={name}
        className="m-0 grid size-11 cursor-pointer appearance-none place-items-center border-0 bg-transparent p-0 text-ark-fg hover:bg-ark-invert hover:text-ark-on-invert focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ark-fg"
      >
        <span aria-hidden="true" className="size-3 border-2 border-current" />
      </button>
    ))}
  </>
)

const aside = (
  <ul className="m-0 grid list-none gap-ark-2 p-0 font-ark-data text-ark-caption">
    {['DOWNLOAD', 'COMMUNITY'].map(name => (
      <li key={name}>
        <a
          href={`#${name.toLowerCase()}`}
          className="text-ark-fg-muted no-underline hover:text-ark-signal"
        >
          {name}
        </a>
      </li>
    ))}
  </ul>
)

const news = (
  <div className="grid max-w-xl gap-ark-5">
    <Heading as="h1" size="lg" sub="BREAKING NEWS">
      情报
    </Heading>
    <ul className="m-0 list-none p-0">
      {[
        { category: '活动', date: '2026-10-03', title: 'SideStory 限时活动即将开启' },
        { category: '公告', date: '2026-09-29', title: '09月29日16:00闪断更新公告' },
      ].map(row => (
        <li key={row.title}>
          <ListRow category={row.category} date={row.date}>
            {row.title}
          </ListRow>
        </li>
      ))}
    </ul>
    <Button variant="primary" sub="READ MORE" arrow className="justify-self-start">
      更多情报
    </Button>
  </div>
)

const meta = {
  title: '布局与层级/Shell',
  component: Shell,
  parameters: { layout: 'fullscreen' },
  args: {
    // 骨架默认铺满视口；放在 Story 的留白里时给一个固定的高度
    className: 'h-[44rem]',
    logo,
    actions,
    aside,
    ghost: 'BREAKING NEWS',
    scrollHint: true,
    nav: (
      <Nav aria-label="主导航">
        {screens.map(screen => (
          <NavItem
            key={screen.id}
            href={`#${screen.id}`}
            sub={screen.zh}
            current={screen.id === 'information' && 'location'}
          >
            {screen.en}
          </NavItem>
        ))}
      </Nav>
    ),
    counter: <Counter value={1} total={4} label="INFORMATION" />,
    children: news,
  },
} satisfies Meta<typeof Shell>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 官网的固定骨架：顶栏的双语导航、右栏的计数、内容区左下的背景巨字、底部的滚动提示，
 * 背景是斜线网格加左下角一片半调。栏目名写了三遍：导航里、计数旁、巨字。
 */
export const Default: Story = {}

/**
 * 换屏只换内容：导航的当前项、计数、背景巨字跟着变，骨架不动。
 * 点滚动提示或导航项切换。
 */
export const Screens: Story = {
  render: function ScreenSwitcher(args) {
    const [index, setIndex] = useState(1)
    const screen = screens[index] ?? screens[0]
    if (!screen) return <Shell {...args} />
    return (
      <Shell
        {...args}
        ghost={screen.ghost}
        counter={<Counter value={index} total={screens.length - 1} label={screen.en} />}
        scrollHint={
          <ScrollHint label="下一屏" onClick={() => setIndex((index + 1) % screens.length)} />
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
      >
        <Heading as="h1" size="lg" sub={screen.en}>
          {screen.zh}
        </Heading>
      </Shell>
    )
  },
}

/** 右栏的三个槽位都不给时，骨架只有顶栏和内容。 */
export const WithoutRail: Story = {
  args: { actions: undefined, counter: undefined, aside: undefined },
}

/** 关掉背景底纹，只留骨架本身。内容超出时内容区自己滚动，顶栏和右栏不动。 */
export const Scrolling: Story = {
  args: {
    pattern: false,
    scrollHint: false,
    children: (
      <div className="grid max-w-xl gap-ark-7">
        {news}
        {news}
      </div>
    ),
  },
}
