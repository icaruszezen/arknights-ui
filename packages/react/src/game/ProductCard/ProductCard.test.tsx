import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductCard } from './ProductCard'

const icon = <svg aria-hidden="true" data-testid="currency" viewBox="0 0 24 24" />
const card = () => screen.getByTestId('card')
// 价格带是卡片里唯一带 mt-auto 的那一块
const band = () => card().querySelector('.mt-auto') as HTMLElement

describe('ProductCard', () => {
  it('是一张带投影的卡片：直角、石墨底', () => {
    render(
      <ProductCard data-testid="card" price={200}>
        应急理智合剂
      </ProductCard>,
    )
    expect(card()).toHaveAttribute('data-ark', 'product-card')
    expect(card()).toHaveAttribute('data-ark-tone', 'dark')
    expect(card()).toHaveClass('drop-shadow-ark-panel', 'bg-ark-overlay-panel-dark')
    expect(card().className).not.toContain('rounded')
  })

  it('商品名在顶部的深色带里，白字居中', () => {
    render(
      <ProductCard data-testid="card" price={200}>
        应急理智合剂
      </ProductCard>,
    )
    const name = screen.getByText('应急理智合剂')
    expect(name).toHaveClass('font-ark-bold', 'text-center')
    const bar = name.parentElement
    expect(bar).toBe(card().firstElementChild)
    expect(bar).toHaveClass('justify-center', 'bg-ark-neutral-ink-900', 'text-ark-neutral-white')
    expect(bar).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('纸白卡片切换到浅色上下文，名称带是石墨色，价格带仍然是深色', () => {
    render(
      <ProductCard data-testid="card" price={200} tone="paper">
        应急理智合剂
      </ProductCard>,
    )
    expect(card()).toHaveAttribute('data-ark-tone', 'light')
    expect(card()).toHaveClass('bg-ark-overlay-panel-light')
    expect(screen.getByText('应急理智合剂').parentElement).toHaveClass('bg-ark-neutral-graphite')
    expect(band()).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('价格带贴底、居中、四周留边：2rem 高的中灰，数据体，加千分位', () => {
    render(
      <ProductCard data-testid="card" price={18000}>
        寻访凭证
      </ProductCard>,
    )
    expect(band()).toHaveClass(
      'h-8',
      'justify-center',
      'mx-ark-2',
      'mb-ark-2',
      'bg-ark-neutral-gray-600',
      'font-ark-data',
      'font-ark-bold',
    )
    expect(band()).not.toHaveClass('justify-end')
    expect(band()).toHaveTextContent('18,000')
  })

  it('货币图标对读屏隐藏，名称由 currencyLabel 给出', () => {
    render(
      <ProductCard data-testid="card" price={200} currency={icon} currencyLabel="合成玉">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByTestId('currency').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(within(band()).getByText('合成玉')).toHaveClass('sr-only')
  })

  it('商品图在名称带下面，图下面可以带一行小字', () => {
    render(
      <ProductCard
        data-testid="card"
        price={200}
        sub="×10"
        media={<img src="/item.png" alt="" data-testid="media" />}
      >
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByTestId('media').parentElement).toHaveClass(
      'aspect-[4/3]',
      'place-items-center',
    )
    expect(screen.getByText('×10').parentElement).toHaveClass('text-center', 'text-ark-fg-muted')
  })

  it('还能买多少写在商品图右上角的浅灰小块里，默认叫“剩余”', () => {
    render(
      <ProductCard price={200} limit={15}>
        应急理智合剂
      </ProductCard>,
    )
    const term = screen.getByRole('term')
    expect(term).toHaveTextContent('剩余')
    expect(screen.getByRole('definition')).toHaveTextContent('15')
    expect(term.parentElement?.tagName).toBe('DL')
    expect(term.parentElement).toHaveClass(
      'absolute',
      'top-ark-1',
      'right-ark-1',
      'bg-ark-neutral-gray-300',
      'text-ark-neutral-black',
    )
  })

  it('自己已有多少写在商品图下面，默认叫“已有”；两样都就地给出', () => {
    render(
      <ProductCard price={200} stock={1200} limit="2/5">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual(['剩余', '已有'])
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual([
      '2/5',
      '1,200',
    ])
  })

  it('标签可以改；已有为 0 时照样显示，没有这些信息时不留空的列表', () => {
    const { rerender } = render(
      <ProductCard data-testid="card" price={200} stock={0} stockLabel="库存">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByRole('term')).toHaveTextContent('库存')
    expect(screen.getByRole('definition')).toHaveTextContent('0')

    rerender(
      <ProductCard data-testid="card" price={200}>
        应急理智合剂
      </ProductCard>,
    )
    expect(card().querySelector('dl')).toBeNull()
  })

  it('限时角标是商品图左上角的橙色小标签', () => {
    render(
      <ProductCard price={200} limited="剩余 2 天">
        应急理智合剂
      </ProductCard>,
    )
    const tag = screen.getByText('剩余 2 天')
    expect(tag).toHaveClass(
      'absolute',
      'top-0',
      'left-0',
      'bg-ark-signal-accent',
      'text-ark-neutral-black',
    )
    // 钉在商品图那一块上，不压住名称带
    expect(tag.parentElement).toHaveClass('relative')
    expect(tag.parentElement?.previousElementSibling).toContainElement(
      screen.getByText('应急理智合剂'),
    )
  })

  it('默认只是一张卡片，不可点', () => {
    render(
      <ProductCard data-testid="card" price={200}>
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(card().innerHTML).not.toContain('group-hover:')
  })

  it('给了 onClick 整张卡片是一个按钮，名称是商品名加价格', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ProductCard price={200} currencyLabel="合成玉" stock={12} onClick={onClick}>
        应急理智合剂
      </ProductCard>,
    )
    const button = screen.getByRole('button', { name: '应急理智合剂 合成玉 200' })
    expect(button).toBeEmptyDOMElement()
    expect(button).toHaveClass('absolute', 'inset-0', 'z-1')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('给了 href 整张卡片是链接', () => {
    render(
      <ProductCard price={200} href="#item">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByRole('link', { name: '应急理智合剂 200' })).toHaveAttribute('href', '#item')
  })

  it('可点时悬停价格带整块换成信号色', () => {
    render(
      <ProductCard data-testid="card" price={200} onClick={() => {}}>
        应急理智合剂
      </ProductCard>,
    )
    expect(band()).toHaveClass('group-hover:bg-ark-signal', 'group-hover:text-ark-on-signal')
  })

  it('售罄：整张卡片褪色，斜盖一条暗红的带，不再可点；名字仍然读得清', () => {
    render(
      <ProductCard
        data-testid="card"
        price={200}
        soldOut
        media={<img src="/item.png" alt="" data-testid="media" />}
        onClick={() => {}}
      >
        应急理智合剂
      </ProductCard>,
    )
    expect(card()).toHaveAttribute('data-sold-out')
    expect(screen.getByTestId('media').parentElement).toHaveClass('opacity-40', 'grayscale')

    const mark = card().querySelector('[data-ark="product-card-sold-out"]')
    expect(mark).toHaveClass('-rotate-12', 'bg-ark-signal-alert', 'text-ark-neutral-white')
    expect(screen.getByText('售罄')).toHaveClass('font-ark-cjk-serif', 'font-ark-heavy')
    // 两端被卡片裁掉
    expect(mark?.parentElement).toHaveClass('absolute', 'inset-0', 'overflow-hidden')

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(band()).not.toHaveClass('group-hover:bg-ark-signal')
    expect(band()).toHaveClass('bg-ark-neutral-ink-700', 'text-ark-neutral-gray-400')
    // 名称带褪成灰底深字，不降低不透明度
    const bar = screen.getByText('应急理智合剂').parentElement
    expect(bar).toHaveClass('bg-ark-neutral-gray-500', 'text-ark-neutral-black')
    expect(bar?.className).not.toContain('opacity')
  })

  it('售罄带上英文写在中文两侧，只读一遍', () => {
    render(
      <ProductCard data-testid="card" price={200} soldOut>
        应急理智合剂
      </ProductCard>,
    )
    const subs = screen.getAllByText('OUT OF STOCK')
    expect(subs).toHaveLength(2)
    expect(subs[0]).toHaveAttribute('aria-hidden', 'true')
    expect(subs[1]).not.toHaveAttribute('aria-hidden')
    expect(subs[0]?.nextElementSibling).toHaveTextContent('售罄')
  })

  it('售罄带上的文字可以改，英文可以去掉', () => {
    render(
      <ProductCard price={200} soldOut soldOutLabel="已兑完" soldOutSub={null}>
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByText('已兑完')).toBeInTheDocument()
    expect(screen.queryByText('OUT OF STOCK')).not.toBeInTheDocument()
  })
})
