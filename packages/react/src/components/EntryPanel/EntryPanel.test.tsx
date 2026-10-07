import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EntryPanel } from './EntryPanel'

const emblem = <svg aria-hidden="true" data-testid="emblem" viewBox="0 0 24 24" />

describe('EntryPanel', () => {
  it('默认是按钮：石墨底，深色上下文', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <EntryPanel sub="Squads" onClick={onClick}>
        编队
      </EntryPanel>,
    )
    const panel = screen.getByRole('button', { name: '编队 Squads' })
    expect(panel).toHaveAttribute('type', 'button')
    expect(panel).toHaveAttribute('data-ark', 'entry-panel')
    expect(panel).toHaveAttribute('data-ark-tone', 'dark')
    expect(panel).toHaveClass('bg-ark-overlay-panel-dark')
    await user.click(panel)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('给了 href 是链接', () => {
    render(
      <EntryPanel href="#terminal" sub="Terminal">
        作战
      </EntryPanel>,
    )
    expect(screen.getByRole('link', { name: '作战 Terminal' })).toHaveAttribute('href', '#terminal')
  })

  it('入口名是重磅衬线，下面是一行灰色的小字，不强制大写', () => {
    render(<EntryPanel sub="角色管理">干员</EntryPanel>)
    expect(screen.getByText('干员')).toHaveClass('font-ark-cjk-serif', 'font-ark-heavy')
    const sub = screen.getByText('角色管理')
    expect(sub).toHaveClass('font-ark-regular', 'text-ark-fg-muted')
    expect(sub).not.toHaveClass('uppercase', 'font-ark-latin-condensed', 'tracking-ark-wide')
  })

  it('内容默认贴左上，其余留白', () => {
    render(<EntryPanel>编队</EntryPanel>)
    const panel = screen.getByRole('button')
    expect(panel).toHaveClass('flex-col', 'justify-start', 'text-left')
    expect(panel).not.toHaveClass('justify-end')
  })

  it('align 换位置：居中，或者贴左下', () => {
    const { rerender } = render(<EntryPanel align="center">采购中心</EntryPanel>)
    expect(screen.getByRole('button')).toHaveClass('items-center', 'justify-center', 'text-center')
    expect(screen.getByText('采购中心').parentElement).toHaveClass('justify-items-center')

    rerender(<EntryPanel align="bottom">编队</EntryPanel>)
    expect(screen.getByRole('button')).toHaveClass('justify-end')
    expect(screen.getByRole('button')).not.toHaveClass('justify-start')
  })

  it('三档字号，英文约为中文的三分之一', () => {
    const { rerender } = render(<EntryPanel sub="Depot">仓库</EntryPanel>)
    expect(screen.getByText('仓库')).toHaveClass('text-ark-nav')
    expect(screen.getByText('Depot')).toHaveClass('text-ark-caption')

    rerender(
      <EntryPanel size="md" sub="Squads">
        编队
      </EntryPanel>,
    )
    expect(screen.getByText('编队')).toHaveClass('text-ark-h1')
    expect(screen.getByText('Squads')).toHaveClass('text-ark-label')

    rerender(
      <EntryPanel size="lg" sub="Terminal">
        作战
      </EntryPanel>,
    )
    expect(screen.getByText('作战')).toHaveClass('text-ark-display')
    expect(screen.getByText('Terminal')).toHaveClass('text-ark-body-lg')
  })

  it('纸白面板切换到浅色上下文', () => {
    render(<EntryPanel tone="paper">作战</EntryPanel>)
    const panel = screen.getByRole('button')
    expect(panel).toHaveAttribute('data-ark-tone', 'light')
    expect(panel).toHaveClass('bg-ark-overlay-panel-light')
    expect(panel).not.toHaveClass('bg-ark-overlay-panel-dark')
  })

  it('信号色面板：实底，字跟着信号色自己的前景色走，按浅色上下文算', () => {
    render(
      <EntryPanel tone="signal" sub="限时">
        采购中心
      </EntryPanel>,
    )
    const panel = screen.getByRole('button')
    expect(panel).toHaveAttribute('data-ark-tone', 'light')
    expect(panel).toHaveClass(
      'bg-ark-signal',
      '[--ark-fg:var(--ark-on-signal)]',
      '[--ark-fg-muted:var(--ark-on-signal)]',
      'not-disabled:hover:bg-ark-neutral-white',
    )
    expect(screen.getByText('采购中心').className).not.toContain('text-shadow')
  })

  it('悬停整块换色，改的是语义变量；禁用时不响应', () => {
    const { rerender } = render(<EntryPanel>编队</EntryPanel>)
    expect(screen.getByRole('button')).toHaveClass(
      'not-disabled:hover:bg-ark-neutral-gray-400',
      'not-disabled:hover:[--ark-fg:var(--ark-color-neutral-black)]',
    )

    rerender(<EntryPanel tone="paper">作战</EntryPanel>)
    expect(screen.getByRole('button')).toHaveClass(
      'not-disabled:hover:bg-ark-signal',
      'not-disabled:hover:[--ark-fg:var(--ark-on-signal)]',
    )

    rerender(<EntryPanel disabled>编队</EntryPanel>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed')
  })

  it('只有石墨面板上的入口名带硬投影，纸白面板上没有', () => {
    const { rerender } = render(<EntryPanel>编队</EntryPanel>)
    expect(screen.getByText('编队')).toHaveClass('text-shadow-ark-hard')

    rerender(<EntryPanel tone="paper">采购中心</EntryPanel>)
    expect(screen.getByText('采购中心').className).not.toContain('text-shadow')

    rerender(
      <EntryPanel tone="paper" size="lg">
        终端
      </EntryPanel>,
    )
    expect(screen.getByText('终端').className).not.toContain('text-shadow')
  })

  it('badge 是橙色的提醒标记，中心压在右上角；给了 badgeLabel 才会被读到', () => {
    const { rerender } = render(<EntryPanel badge>任务</EntryPanel>)
    const panel = screen.getByRole('button', { name: '任务' })
    const dot = panel.querySelector('[data-ark="badge"]')
    expect(dot).toHaveClass('absolute', 'top-0', 'right-0', 'translate-x-1/2', '-translate-y-1/2')
    expect(dot).toHaveClass('rotate-45', 'bg-ark-signal-accent')
    expect(dot).toHaveAttribute('aria-hidden', 'true')

    rerender(
      <EntryPanel badge badgeLabel="有可领取的奖励">
        任务
      </EntryPanel>,
    )
    expect(screen.getByRole('button', { name: '任务 有可领取的奖励' })).toBeInTheDocument()
  })

  it('badge 是数字时显示数量，为 0 时不显示', () => {
    const { rerender } = render(<EntryPanel badge={3}>邮件</EntryPanel>)
    expect(screen.getByRole('button').querySelector('[data-ark="badge"]')).toHaveTextContent('3')

    rerender(<EntryPanel badge={0}>邮件</EntryPanel>)
    expect(screen.getByRole('button').querySelector('[data-ark="badge"]')).toBeNull()
  })

  it('aside 在右上角，有角标时给它让出位置', () => {
    const { rerender } = render(
      <EntryPanel aside={<b data-testid="sanity">131/135</b>}>作战</EntryPanel>,
    )
    expect(screen.getByTestId('sanity').parentElement).toHaveClass(
      'absolute',
      'top-ark-4',
      'right-ark-4',
    )

    rerender(
      <EntryPanel badge aside={<b data-testid="sanity">131/135</b>}>
        作战
      </EntryPanel>,
    )
    expect(screen.getByTestId('sanity').parentElement).toHaveClass('right-ark-5')
  })

  it('水印垫在内容下面，对读屏隐藏', () => {
    render(<EntryPanel watermark={emblem}>作战</EntryPanel>)
    const watermark = screen.getByTestId('emblem').closest('[data-ark="watermark"]')
    expect(watermark).toHaveAttribute('aria-hidden', 'true')
    expect(watermark).toHaveClass('-z-1')
    // 水印可以超出面板的高度，由面板裁掉
    expect(screen.getByRole('button')).toHaveClass('overflow-hidden', 'isolate')
  })

  it('按钮里只有行内元素', () => {
    render(
      <EntryPanel badge={2} watermark={emblem} sub="Terminal" aside={<b>131</b>}>
        作战
      </EntryPanel>,
    )
    expect(screen.getByRole('button').querySelector('div, p, h1, h2, h3, ul, dl')).toBeNull()
  })

  it('聚焦时提到相邻面板的上面，轮廓不会被盖住', () => {
    render(<EntryPanel>编队</EntryPanel>)
    expect(screen.getByRole('button')).toHaveClass('focus-visible:z-1', 'focus-visible:outline-2')
  })
})
