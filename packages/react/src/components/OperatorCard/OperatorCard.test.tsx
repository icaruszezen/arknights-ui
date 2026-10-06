import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OperatorCard } from './OperatorCard'

const icon = <svg aria-hidden="true" data-testid="class-icon" viewBox="0 0 24 24" />

describe('OperatorCard', () => {
  it('默认是一张展示用的卡片：竖长，深色上下文', () => {
    render(<OperatorCard data-testid="card">干员代号</OperatorCard>)
    const card = screen.getByTestId('card')
    expect(card.tagName).toBe('DIV')
    expect(card).toHaveAttribute('data-ark', 'operator-card')
    expect(card).toHaveAttribute('data-ark-tone', 'dark')
    expect(card).toHaveClass('aspect-[1/2]', 'w-40', 'overflow-hidden')
    expect(card).toHaveTextContent('干员代号')
  })

  it('立绘是胸像：铺满，脸落在上三分之一，默认只是陪衬', () => {
    render(
      <OperatorCard data-testid="card" src="/a.png">
        干员代号
      </OperatorCard>,
    )
    const image = screen.getByTestId('card').querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover', 'object-[50%_15%]', '-z-2')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('不给 src 时没有图片，只剩石墨底', () => {
    render(<OperatorCard data-testid="card">干员代号</OperatorCard>)
    const card = screen.getByTestId('card')
    expect(card.querySelector('img')).toBeNull()
    expect(card).toHaveClass('bg-ark-neutral-graphite')
  })

  it('代号用 Codename 的排版：Heavy、收紧字距', () => {
    render(<OperatorCard sub="Codename">干员代号</OperatorCard>)
    const name = screen.getByText('干员代号').closest('[data-ark="codename"]')
    expect(name?.tagName).toBe('SPAN')
    expect(name).toHaveClass('font-ark-heavy', 'tracking-ark-cjk-tight')
    expect(name).toHaveTextContent('干员代号Codename')
  })

  it('稀有度双重编码：星数加底边色条', () => {
    render(
      <OperatorCard data-testid="card" rarity={6}>
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByRole('img', { name: '6 星' })).toBeInTheDocument()
    const bar = screen.getByTestId('card').querySelector('.bg-ark-tier-6')
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar).toHaveClass('bottom-0', 'h-(--ark-line-strong)')
  })

  it('卡片是一个容器：窄到放不下时星级下移一行，不压住职业图标', () => {
    render(
      <OperatorCard data-testid="card" rarity={6} classIcon={icon}>
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByTestId('card')).toHaveClass('@container')
    expect(screen.getByRole('img', { name: '6 星' })).toHaveClass(
      'top-ark-2',
      'right-ark-2',
      '@max-[8.5rem]:top-10',
    )
  })

  it('不给稀有度就没有星和色条', () => {
    render(<OperatorCard data-testid="card">干员代号</OperatorCard>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('card').innerHTML).not.toContain('bg-ark-tier-')
  })

  it('职业图标在左上角的黑底方块里', () => {
    render(<OperatorCard classIcon={icon}>干员代号</OperatorCard>)
    expect(screen.getByTestId('class-icon').parentElement).toHaveClass(
      'top-0',
      'left-0',
      'size-8',
      'bg-ark-neutral-black',
    )
  })

  it('等级用数据体，精英化阶段写成 E2 并给读屏完整的说法', () => {
    render(
      <OperatorCard level={90} elite={2}>
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByText('90')).toHaveClass('font-ark-data', 'font-ark-bold')
    expect(screen.getByText('E2')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('精英化阶段 2')).toHaveClass('sr-only')
  })

  it('精英化阶段为 0 时不显示', () => {
    render(
      <OperatorCard level={30} elite={0}>
        干员代号
      </OperatorCard>,
    )
    expect(screen.queryByText('E0')).not.toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('给了 href 是链接，悬停时立绘恢复饱和度、代号变成信号色', () => {
    render(
      <OperatorCard href="#operator" src="/a.png" rarity={5} level={80}>
        干员代号
      </OperatorCard>,
    )
    const link = screen.getByRole('link', { name: /干员代号/ })
    expect(link).toHaveAttribute('href', '#operator')
    expect(link.querySelector('img')).toHaveClass('saturate-[0.8]', 'group-hover:saturate-100')
    expect(link.querySelector('[data-ark="codename"]')).toHaveClass(
      'group-hover:text-ark-signal-fg',
    )
  })

  it('给了 onClick 是按钮，里面只有行内元素', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <OperatorCard onClick={onClick} src="/a.png" rarity={4} level={60} elite={1}>
        干员代号
      </OperatorCard>,
    )
    const button = screen.getByRole('button', { name: /干员代号/ })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button.querySelector('div, p, h1, h2, h3, ul, dl')).toBeNull()
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('展示用的卡片没有悬停反馈', () => {
    render(
      <OperatorCard data-testid="card" src="/a.png">
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByTestId('card').innerHTML).not.toContain('group-hover:')
  })

  it('选中：内侧一圈信号色描边，三种根元素各有自己的标记', () => {
    const { rerender } = render(
      <OperatorCard selected onClick={() => {}}>
        干员代号
      </OperatorCard>,
    )
    const button = screen.getByRole('button', { pressed: true })
    expect(button.querySelector('.border-ark-signal')).toHaveClass('border-2', 'inset-0')

    rerender(
      <OperatorCard selected href="#a">
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'true')

    rerender(
      <OperatorCard data-testid="card" selected>
        干员代号
      </OperatorCard>,
    )
    expect(screen.getByTestId('card')).toHaveAttribute('data-selected')
  })

  it('可点的卡片焦点轮廓画在内侧', () => {
    render(<OperatorCard href="#a">干员代号</OperatorCard>)
    expect(screen.getByRole('link')).toHaveClass('focus-visible:-outline-offset-2')
  })
})
