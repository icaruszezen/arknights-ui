import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { figure, item, scenes } from '../.storybook/art'
import { glyphs } from '../.storybook/glyphs'
import {
  ActionButton,
  BackHome,
  Banner,
  Carousel,
  Countdown,
  Dialog,
  Heading,
  ParallaxLayer,
  Portrait,
  ProductCard,
  Resource,
  ResourceBar,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Thumbnail,
  ThumbnailStrip,
  TimeRange,
} from './index'

// 不是组件，只是把寻访与采购相关的组件按游戏里的编排拼在一起。
// 寻访是最“有戏”的界面：大图、视差；采购中心是最“像应用”的界面：卡片、标签页、库存。
// 图片全部是代码画的占位图。
const meta = {
  title: '示例/寻访与采购',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const pools = [
  { id: 'a', name: '占位卡池甲', en: 'Banner A', accent: '#18d1ff', tag: '限定寻访' },
  { id: 'b', name: '占位卡池乙', en: 'Banner B', accent: '#ffd802', tag: '标准寻访' },
  { id: 'c', name: '占位卡池丙', en: 'Banner C', accent: '#ff5e19', tag: '中坚寻访' },
]

const ruleLink = 'text-ark-fg-muted underline-offset-4 hover:text-ark-signal-fg'

export const Headhunt: Story = {
  name: '干员寻访',
  render: function Gacha() {
    const [index, setIndex] = useState(0)
    return (
      <div className="relative -m-ark-6 grid min-h-screen grid-rows-[auto_minmax(0,1fr)] bg-ark-neutral-black">
        <div className="flex items-start justify-between">
          <BackHome />
          <ResourceBar>
            <Resource label="合成玉" value={18600} />
            <Resource label="寻访凭证" value={7} />
          </ResourceBar>
        </div>

        {/* 卡池切换是横向的轮播：侧边一条竖排的缩略图，点一下换一个卡池 */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-ark-4 px-ark-6 pt-ark-4 pb-ark-6">
          <ThumbnailStrip
            aria-label="卡池"
            orientation="vertical"
            value={String(index)}
            onValueChange={next => setIndex(Number(next))}
          >
            {pools.map((pool, poolIndex) => (
              <Thumbnail
                key={pool.id}
                value={String(poolIndex)}
                src={scenes[poolIndex] ?? ''}
                label={pool.name}
                position="50% 50%"
                className="aspect-video w-28"
              />
            ))}
          </ThumbnailStrip>

          <Carousel aria-label="卡池" index={index} onIndexChange={setIndex}>
            {pools.map((pool, poolIndex) => (
              <Banner
                key={pool.id}
                title={pool.name}
                sub={pool.en}
                titleAs="h1"
                ghost="Headhunt"
                tag={
                  <Tag variant="solid" cut>
                    {pool.tag}
                  </Tag>
                }
                period={<TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />}
                // 两个行动按钮并排，代价直接印在按钮上，十连更醒目
                actions={
                  <>
                    <ActionButton variant="paper" cost={600} costLabel="合成玉" sub="HEADHUNT ×1">
                      寻访一次
                    </ActionButton>
                    <ActionButton cost={6000} costLabel="合成玉" sub="HEADHUNT ×10">
                      寻访十次
                    </ActionButton>
                  </>
                }
                // 概率与规则是次级入口：角落里的小字链接
                links={
                  <>
                    <a href="#rates" className={ruleLink}>
                      概率公示
                    </a>
                    <a href="#rules" className={ruleLink}>
                      寻访规则
                    </a>
                  </>
                }
                className="size-full"
              >
                {/* 三层视差：场景最远，后排的立绘次之，主角最近、位移最大 */}
                <ParallaxLayer depth={0.15} className="absolute -inset-ark-5 -z-4">
                  <img
                    src={scenes[poolIndex] ?? ''}
                    alt=""
                    className="block size-full object-cover opacity-60"
                  />
                </ParallaxLayer>
                <ParallaxLayer
                  depth={0.4}
                  className="absolute right-[34%] bottom-0 -z-3 h-[78%] w-[20%]"
                >
                  <Portrait
                    src={figure('#6f777c', pool.accent)}
                    alt=""
                    shadow={false}
                    className="size-full"
                  />
                </ParallaxLayer>
                <ParallaxLayer
                  depth={0.9}
                  className="absolute right-[8%] bottom-0 -z-2 h-[104%] w-[28%]"
                >
                  <Portrait src={figure('#a9b1b6', pool.accent)} alt="" className="size-full" />
                </ParallaxLayer>
              </Banner>
            ))}
          </Carousel>
        </div>
      </div>
    )
  },
}

const shelves = {
  recommend: [
    {
      id: 'a',
      name: '应急理智合剂',
      sub: '×10',
      price: 200,
      body: '#9aa3a8',
      stock: 12,
      limit: '2/5',
    },
    { id: 'b', name: '寻访凭证', sub: '×1', price: 450, body: '#a39a8f', stock: 3, limited: true },
    { id: 'c', name: '高级作战记录', sub: '×20', price: 180, body: '#8f9aa3', stock: 96 },
    {
      id: 'd',
      name: '家具零件',
      sub: '×200',
      price: 120,
      body: '#a09aa8',
      stock: 0,
      soldOut: true,
    },
  ],
  exchange: [
    { id: 'e', name: '芯片助剂', sub: '×1', price: 90, body: '#9aa39a', stock: 2, limit: '4/4' },
    { id: 'f', name: '技巧概要', sub: '×5', price: 60, body: '#a3a09a', stock: 31 },
  ],
}

interface Product {
  id: string
  name: string
  sub: string
  price: number
  body: string
  stock: number
  limit?: string
  limited?: boolean
  soldOut?: boolean
}

function Shelf({ products, onBuy }: { products: Product[]; onBuy: (name: string) => void }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-ark-4 p-0 pt-ark-5">
      {products.map(product => (
        <li key={product.id} className="flex">
          <ProductCard
            media={<img src={item(product.body)} alt="" className="size-20" />}
            sub={product.sub}
            price={product.price}
            currency={glyphs.diamond}
            currencyLabel="合成玉"
            // 实机的商品卡片是白的。决策信息就地给全：已有多少、还能买多少、限时还剩多久
            tone="paper"
            stock={product.stock}
            limit={product.limit}
            limited={
              product.limited ? (
                <>
                  限时
                  <Countdown seconds={2 * 86400 + 5 * 3600} format={({ days }) => `${days}天`} />
                </>
              ) : undefined
            }
            soldOut={product.soldOut}
            onClick={() => onBuy(product.name)}
          >
            {product.name}
          </ProductCard>
        </li>
      ))}
    </ul>
  )
}

export const Store: Story = {
  name: '采购中心',
  globals: { backgrounds: { value: 'ink' } },
  render: function Shop() {
    const [pending, setPending] = useState<string | null>(null)
    return (
      <div className="relative -m-ark-6 min-h-screen">
        <div className="flex items-start justify-between">
          <BackHome />
          <ResourceBar>
            <Resource label="龙门币" value={128400} />
            <Resource label="合成玉" value={18600} />
          </ResourceBar>
        </div>
        <div className="grid gap-ark-5 px-ark-7 pt-ark-5 pb-ark-7">
          <Heading as="h1" size="md" sub="STORE">
            采购中心
          </Heading>
          {/* 列表页老老实实用卡片：可读、可比、可扫视比风格更重要 */}
          <Tabs defaultValue="recommend" variant="underline">
            <TabList aria-label="采购中心">
              <Tab value="recommend">推荐</Tab>
              <Tab value="exchange">凭证交易所</Tab>
            </TabList>
            <TabPanel value="recommend">
              <Shelf products={shelves.recommend} onBuy={setPending} />
            </TabPanel>
            <TabPanel value="exchange">
              <Shelf products={shelves.exchange} onBuy={setPending} />
            </TabPanel>
          </Tabs>
        </div>
        <Dialog
          open={pending !== null}
          onOpenChange={() => setPending(null)}
          detail="演示用的弹窗，不会真的购买"
        >
          {`是否购买“${pending ?? ''}”？`}
        </Dialog>
      </div>
    )
  },
}
