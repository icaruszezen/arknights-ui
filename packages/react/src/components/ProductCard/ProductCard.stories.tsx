import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { item } from '../../../.storybook/art'
import { glyphs } from '../../../.storybook/glyphs'
import { Countdown } from '../Countdown'
import { Dialog } from '../Dialog'
import { Tab, TabList, Tabs } from '../Tabs'
import { ProductCard } from './ProductCard'

// 占位用的几何图形，代码画的，不是官方的道具图标
const art = <img src={item()} alt="" className="size-20" />

const meta = {
  title: '场景/寻访与采购/ProductCard',
  component: ProductCard,
  args: {
    children: '应急理智合剂',
    sub: '×10',
    price: 200,
    currency: glyphs.diamond,
    currencyLabel: '合成玉',
    media: art,
  },
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

/** 带投影的卡片：顶部一条深色带写商品名，中间是商品图，底部一条居中的价格带。 */
export const Default: Story = {}

/**
 * 做决定所需的信息就地给全：还能买多少写在商品图右上角的小块里（“剩余”），
 * 自己已有多少写在图下面（“已有”）。不用为了查一个数来回跳转。
 */
export const WithStock: Story = {
  args: { stock: 12, limit: 15 },
}

/** 限时角标：商品图左上角橙色的小标签加剩余时间。橙色只在这种小面积、高浓度的地方出现。 */
export const Limited: Story = {
  args: {
    limited: (
      <>
        限时
        <Countdown seconds={2 * 86400 + 5 * 3600} format={({ days }) => `${days}天`} />
      </>
    ),
  },
}

/**
 * 售罄：整张卡片褪色，中间斜盖一条暗红的带，不再可点。名字仍然读得清。
 * 这条带是全套语言里少数不走 45° 的地方——它是一枚印章。
 */
export const SoldOut: Story = {
  args: { soldOut: true, limit: 0, onClick: () => {} },
}

/** 石墨与纸白两种表面。实机的商品卡片是白的；名称带和价格带是固定的深色。 */
export const Tones: Story = {
  render: args => (
    <div className="flex items-start gap-ark-4">
      <ProductCard {...args} />
      <ProductCard {...args} tone="paper" stock={12} />
    </div>
  ),
}

/**
 * 采购中心的一排货架：顶部是标签页，下面是卡片。给了 `onClick` 的卡片整张可点，
 * 悬停时价格带换成信号色；点了之后用通栏的确认弹窗，代价写在弹窗里。
 */
export const Shelf: Story = {
  render: function Store() {
    const [pending, setPending] = useState<string | null>(null)
    const products = [
      {
        id: 'a',
        name: '应急理智合剂',
        sub: '×10',
        price: 200,
        body: '#9aa3a8',
        stock: 12,
        limit: '2/5',
      },
      {
        id: 'b',
        name: '寻访凭证',
        sub: '×1',
        price: 450,
        body: '#a39a8f',
        stock: 3,
        limited: true,
      },
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
    ]
    return (
      <div className="grid gap-ark-5">
        <Tabs defaultValue="recommend" variant="underline">
          <TabList aria-label="采购中心">
            <Tab value="recommend">推荐</Tab>
            <Tab value="exchange">凭证交易所</Tab>
            <Tab value="furniture">家具商店</Tab>
          </TabList>
        </Tabs>
        <ul className="m-0 flex list-none flex-wrap gap-ark-4 p-0">
          {products.map(product => (
            <li key={product.id} className="flex">
              <ProductCard
                media={<img src={item(product.body)} alt="" className="size-20" />}
                sub={product.sub}
                price={product.price}
                currency={glyphs.diamond}
                currencyLabel="合成玉"
                stock={product.stock}
                limit={product.limit}
                limited={product.limited ? '限时 2天' : undefined}
                soldOut={product.soldOut}
                tone="paper"
                onClick={() => setPending(product.name)}
              >
                {product.name}
              </ProductCard>
            </li>
          ))}
        </ul>
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
