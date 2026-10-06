import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParallaxLayer } from '../Parallax'
import { Banner } from './Banner'

const banner = () => screen.getByTestId('banner')

describe('Banner', () => {
  it('是一张撑满的横幅：16:9，深色上下文，自己就是视差的容器', () => {
    render(<Banner data-testid="banner" title="限定寻访" />)
    expect(banner()).toHaveAttribute('data-ark', 'banner')
    expect(banner()).toHaveAttribute('data-ark-tone', 'dark')
    expect(banner()).toHaveAttribute('data-source', 'pointer')
    expect(banner()).toHaveClass('aspect-video', 'overflow-hidden', 'isolate')
  })

  it('标题是一个二级标题，英文在上', () => {
    render(<Banner title="限定寻访" sub="Limited Headhunting" />)
    const heading = screen.getByRole('heading', { level: 2, name: /限定寻访/ })
    expect(heading).toHaveAttribute('data-ark', 'heading')
    expect(heading).toHaveTextContent('Limited Headhunting')
    expect(screen.getByText('限定寻访')).toHaveClass('text-ark-display')
  })

  it('titleAs 改标题的级别', () => {
    render(<Banner title="限定寻访" titleAs="h1" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('给了 logo：标识放在固定大小的框里，标题只留给读屏', () => {
    render(
      <Banner
        title="限定寻访"
        sub="Limited Headhunting"
        logo={<svg data-testid="logo" viewBox="0 0 240 96" />}
      />,
    )
    const heading = screen.getByRole('heading', { name: '限定寻访' })
    expect(heading).toHaveClass('sr-only')
    const frame = screen.getByTestId('logo').parentElement
    expect(frame).toHaveClass('h-24')
    expect(frame).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText('Limited Headhunting')).not.toBeInTheDocument()
  })

  it('视差图层作为子元素放进来', () => {
    render(
      <Banner data-testid="banner" title="限定寻访">
        <ParallaxLayer depth={0.3} data-testid="far" />
        <ParallaxLayer depth={0.8} data-testid="near" />
      </Banner>,
    )
    expect(banner()).toContainElement(screen.getByTestId('far'))
    expect(screen.getByTestId('near').style.getPropertyValue('--ark-parallax-depth')).toBe('0.8')
  })

  it('source 传给视差', () => {
    render(<Banner data-testid="banner" title="限定寻访" source="scroll" />)
    expect(banner()).toHaveAttribute('data-source', 'scroll')
  })

  it('遮罩只压文字一侧，默认在左', () => {
    const { rerender } = render(<Banner data-testid="banner" title="限定寻访" />)
    const scrim = () => banner().querySelector('[data-ark="scrim"]')
    expect(scrim()).toHaveAttribute('aria-hidden', 'true')
    expect(scrim()).toHaveClass('bg-linear-to-r', '-z-1')
    expect(screen.getByRole('heading').parentElement).toHaveClass('justify-self-start')

    rerender(<Banner data-testid="banner" title="限定寻访" side="right" />)
    expect(scrim()).toHaveClass('bg-linear-to-l')
    expect(screen.getByRole('heading').parentElement).toHaveClass('justify-self-end')
  })

  it('小标签在标题上方，开放时间在标题下方', () => {
    render(
      <Banner
        title="限定寻访"
        tag={<span data-testid="tag">限定</span>}
        period={<span data-testid="period">10月03日 - 10月17日</span>}
      />,
    )
    const block = screen.getByRole('heading').parentElement as HTMLElement
    const order = Array.from(block.children)
    expect(order.indexOf(screen.getByTestId('tag'))).toBeLessThan(
      order.indexOf(screen.getByRole('heading')),
    )
    expect(block).toContainElement(screen.getByTestId('period'))
  })

  it('底部一行：规则链接在文字这一侧，行动按钮在对面', () => {
    const { rerender } = render(
      <Banner
        title="限定寻访"
        actions={<button type="button">寻访十次</button>}
        links={<a href="#rules">概率公示</a>}
      />,
    )
    const footer = () => screen.getByRole('button').parentElement?.parentElement as HTMLElement
    expect(footer()).toHaveClass('flex-row', 'justify-between', 'flex-wrap')
    // 链接在前、按钮在后：朗读顺序也是先规则后行动
    expect(footer().firstElementChild).toContainElement(screen.getByRole('link'))
    expect(screen.getByRole('link').parentElement).toHaveClass(
      'text-ark-caption',
      'text-ark-fg-muted',
    )

    rerender(
      <Banner
        title="限定寻访"
        side="right"
        actions={<button type="button">寻访十次</button>}
        links={<a href="#rules">概率公示</a>}
      />,
    )
    expect(footer()).toHaveClass('flex-row-reverse')
  })

  it('没有按钮和链接时不留空的底栏', () => {
    render(<Banner data-testid="banner" title="限定寻访" />)
    // 遮罩和标题区
    expect(banner().children).toHaveLength(2)
  })

  it('背景巨字垫在最底层，人物那一侧', () => {
    render(<Banner data-testid="banner" title="限定寻访" ghost="Headhunt" />)
    const ghost = banner().querySelector('[data-ark="ghost-title"]')
    expect(ghost).toHaveTextContent('Headhunt')
    expect(ghost).toHaveClass('-z-2', 'right-ark-6')
  })
})
