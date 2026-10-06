import type { Meta, StoryObj } from '@storybook/react-vite'
import { figure, item, scenes } from '../.storybook/art'
import { glyphs } from '../.storybook/glyphs'
import {
  Barcode,
  Codename,
  CornerMarks,
  Heading,
  KeyValue,
  KeyValueList,
  MicroText,
  NumberedSection,
  OperatorCard,
  Pattern,
  ProductCard,
  Rating,
  Scrim,
  Serial,
  Tag,
  TimeRange,
} from './index'

// 不是组件，只是把宣传物料相关的组件按活动公告长图的模板拼在一起：
// 页眉、编号小节、时间与条件的键值对、页脚的注意事项。每一期只换主题色、页眉和底纹，骨架不动——
// 用工具栏换一个信号色试试。图片全部是代码画的占位图，文案是演示用的占位内容。
const meta = {
  title: '示例/活动公告',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  globals: { backgrounds: { value: 'ink' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const operators = [
  {
    id: 'a',
    name: '占位干员甲',
    en: 'Operator A',
    role: '近卫',
    rarity: 6,
    body: '#9aa3a8',
    glyph: glyphs.slashes,
  },
  {
    id: 'b',
    name: '占位干员乙',
    en: 'Operator B',
    role: '术师',
    rarity: 5,
    body: '#a39a8f',
    glyph: glyphs.diamond,
  },
] as const

export const Announcement: Story = {
  name: '活动公告',
  render: () => (
    <article className="relative isolate mx-auto w-[44rem] max-w-full bg-ark-neutral-black">
      {/* 底纹：整面极淡的噪点，让大面积的留白不发飘 */}
      <Pattern variant="grain" className="absolute inset-0 -z-1" />
      {/* 贴边的微缩英文，写的是真实内容 */}
      <MicroText vertical className="absolute top-ark-8 right-ark-2">
        {'ARKNIGHTS-UI // UNOFFICIAL // EVENT NOTICE'}
      </MicroText>

      {/* 页眉：主视觉加标题。标题压在图的左下，遮罩只压文字一侧 */}
      <header className="relative isolate box-border grid aspect-[16/9] content-end p-ark-6">
        <img
          src={scenes[2]}
          alt=""
          className="absolute inset-0 -z-2 block size-full object-cover saturate-[0.7]"
        />
        <Scrim className="-z-1" />
        <div className="relative grid justify-items-start gap-ark-3">
          <Tag variant="solid" cut>
            限时活动
          </Tag>
          <Heading as="h1" size="lg" sub="SIDE STORY">
            占位活动
          </Heading>
        </div>
      </header>
      {/* 警戒条纹只做窄窄的一条边 */}
      <Pattern variant="hazard" mono className="text-ark-signal" />

      <CornerMarks className="m-ark-5 grid gap-ark-7 p-ark-6">
        <NumberedSection number={1} title="活动说明" sub="Event Info" headingAs="h2">
          <KeyValueList>
            <KeyValue label="活动时间" tone="signal">
              <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
            </KeyValue>
            <KeyValue label="解锁条件">通关主线 1-10</KeyValue>
            <KeyValue label="活动内容">
              活动期间开放限时关卡，通关后获得活动代币，可在活动商店兑换奖励。
            </KeyValue>
          </KeyValueList>
        </NumberedSection>

        <NumberedSection number={2} title="新增干员" sub="New Operators" headingAs="h2">
          {/* 干员介绍是一份“简历”：代号 Heavy 收字距，其余信息用普通字重 */}
          <ul className="m-0 grid list-none gap-ark-5 p-0">
            {operators.map(operator => (
              <li key={operator.id} className="flex items-end gap-ark-5">
                <OperatorCard
                  src={figure(operator.body)}
                  rarity={operator.rarity}
                  classIcon={operator.glyph}
                  className="aspect-[3/4] w-28"
                >
                  {operator.name}
                </OperatorCard>
                <div className="grid justify-items-start gap-ark-3 pb-ark-2">
                  <Rating value={operator.rarity} shape="diamond" />
                  <Codename as="h3" sub={operator.en}>
                    {operator.name}
                  </Codename>
                  <Tag variant="outline">{operator.role}</Tag>
                </div>
              </li>
            ))}
          </ul>
          <KeyValueList className="mt-ark-5">
            <KeyValue label="寻访时间">
              <TimeRange from="2026-10-03T16:00" to="2026-10-17T03:59" />
            </KeyValue>
          </KeyValueList>
        </NumberedSection>

        <NumberedSection number={3} title="活动商店" sub="Event Store" headingAs="h2">
          <ul className="m-0 flex list-none flex-wrap gap-ark-4 p-0">
            {(
              [
                ['寻访凭证', '×3', 150, '#a39a8f'],
                ['高级作战记录', '×30', 80, '#8f9aa3'],
                ['活动限定家具', '×1', 200, '#a09aa8'],
              ] as const
            ).map(([name, sub, price, body]) => (
              <li key={name} className="flex">
                <ProductCard
                  media={<img src={item(body)} alt="" className="size-16" />}
                  sub={sub}
                  price={price}
                  currency={glyphs.blocks}
                  currencyLabel="活动代币"
                  className="w-40"
                >
                  {name}
                </ProductCard>
              </li>
            ))}
          </ul>
        </NumberedSection>
      </CornerMarks>

      {/* 页脚：注意事项用小号、灰色，放在最底部 */}
      <footer className="box-border grid gap-ark-4 border-t border-ark-rule p-ark-6">
        <p className="m-0 text-ark-caption leading-ark-body text-ark-fg-muted">
          本页是演示用的占位内容，不对应任何真实活动，也不是官方发布的公告。
          活动时间、奖励内容请以官方渠道为准。
        </p>
        <div className="flex items-end justify-between">
          <Barcode value="ARK-UI 2026-10" />
          <Serial prefix="NO." value={147} pad={4} className="text-ark-fg-muted" />
        </div>
      </footer>
    </article>
  ),
}
