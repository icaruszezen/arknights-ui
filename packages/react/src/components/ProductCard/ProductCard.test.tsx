import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductCard } from './ProductCard'

const icon = <svg aria-hidden="true" data-testid="currency" viewBox="0 0 24 24" />
const card = () => screen.getByTestId('card')
const band = () => card().querySelector('.bg-ark-neutral-ink-950') as HTMLElement

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
    expect(screen.getByText('应急理智合剂')).toHaveClass('font-ark-bold')
  })

  it('纸白卡片切换到浅色上下文，价格带仍然是深色', () => {
    render(
      <ProductCard data-testid="card" price={200} tone="paper">
        应急理智合剂
      </ProductCard>,
    )
    expect(card()).toHaveAttribute('data-ark-tone', 'light')
    expect(card()).toHaveClass('bg-ark-overlay-panel-light')
    expect(band()).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('价格贴在底部的深色带里：2rem 高，右对齐，数据体，加千分位', () => {
    render(
      <ProductCard data-testid="card" price={18000}>
        寻访凭证
      </ProductCard>,
    )
    expect(band()).toHaveClass('h-8', 'justify-end', 'font-ark-data', 'font-ark-bold', 'mt-auto')
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

  it('商品图放在上半部，商品名下面可以带一行小字', () => {
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
    expect(screen.getByText('×10')).toHaveClass('text-ark-fg-muted')
  })

  it('库存和限购就地给出：一个描述列表', () => {
    render(
      <ProductCard price={200} stock={1200} limit="2/5">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual(['库存', '限购'])
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual([
      '1,200',
      '2/5',
    ])
  })

  it('库存为 0 时照样显示，没有这些信息时不留空的列表', () => {
    const { rerender } = render(
      <ProductCard data-testid="card" price={200} stock={0}>
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByRole('definition')).toHaveTextContent('0')

    rerender(
      <ProductCard data-testid="card" price={200}>
        应急理智合剂
      </ProductCard>,
    )
    expect(card().querySelector('dl')).toBeNull()
  })

  it('限时角标是左上角的橙色小标签', () => {
    render(
      <ProductCard price={200} limited="剩余 2 天">
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByText('剩余 2 天')).toHaveClass(
      'absolute',
      'top-0',
      'left-0',
      'bg-ark-signal-accent',
      'text-ark-neutral-black',
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

  it('售罄：商品图和价格压暗，盖上一条横带，不再可点；文字仍然读得清', () => {
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
    const mark = screen.getByText('售罄').parentElement
    expect(mark).toHaveClass('inset-x-0', 'border-y', 'bg-ark-neutral-black/85')
    expect(mark).toHaveTextContent('售罄SOLD OUT')
    // 横带不旋转
    expect(mark?.className).not.toMatch(/rotate|skew/)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(band()).not.toHaveClass('group-hover:bg-ark-signal')
    expect(band()).toHaveClass('text-ark-neutral-gray-500')
    // 名字所在的那一块不降低不透明度
    expect(screen.getByText('应急理智合剂').parentElement?.className).not.toContain('opacity')
  })

  it('售罄横带上的文字可以改，英文可以去掉', () => {
    render(
      <ProductCard price={200} soldOut soldOutLabel="已兑完" soldOutSub={null}>
        应急理智合剂
      </ProductCard>,
    )
    expect(screen.getByText('已兑完')).toBeInTheDocument()
    expect(screen.queryByText('SOLD OUT')).not.toBeInTheDocument()
  })
})
