import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from './Loading'

const percent = () => document.querySelector('[data-ark="loading-percent"]')

describe('Loading', () => {
  it('有 value 时是进度条，状态文字就是它的名称', () => {
    render(
      <Loading data-testid="loading" value={65}>
        LOADING ASSETS
      </Loading>,
    )
    expect(screen.getByTestId('loading')).toHaveAttribute('data-ark', 'loading')
    const bar = screen.getByRole('progressbar', { name: 'LOADING ASSETS' })
    expect(bar).toHaveAttribute('aria-valuenow', '65')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('data-ark', 'loading-bar')
  })

  it('进度条是一条 2px 的线，两端各一个 6px 的方块，进度段 6px 高压在线上', () => {
    render(<Loading value={40} />)
    const bar = screen.getByRole('progressbar')
    // 左右两条边就是两端的方块
    expect(bar).toHaveClass('h-[0.375rem]', 'border-x-[0.375rem]', 'border-current')
    const [track, fill] = [...bar.children] as HTMLElement[]
    expect(track).toHaveClass('h-0.5', 'w-full', 'bg-current')
    expect(fill).toHaveClass('absolute', 'inset-y-0', 'left-0', 'bg-ark-signal')
    expect(fill?.style.width).toBe('40%')
    for (const part of [track, fill]) expect(part).toHaveAttribute('aria-hidden', 'true')
  })

  it('百分比取整，紧跟在状态文字后面，对读屏隐藏', () => {
    const { rerender } = render(<Loading value={2} max={3} />)
    expect(percent()).toHaveTextContent('- 67%')
    expect(percent()).toHaveAttribute('aria-hidden', 'true')
    expect(percent()?.previousElementSibling).toHaveTextContent('LOADING')
    expect(percent()?.parentElement).toHaveClass('font-ark-bold', 'uppercase')

    rerender(<Loading value={150} />)
    expect(percent()).toHaveTextContent('- 100%')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    rerender(<Loading value={5} max={0} />)
    expect(percent()).toHaveTextContent('- 0%')
  })

  it('默认的状态文字是 LOADING', () => {
    render(<Loading value={10} />)
    expect(screen.getByRole('progressbar', { name: 'LOADING' })).toBeInTheDocument()
  })

  it('aside 是右边的一行小字，只在有进度时显示，对读屏隐藏', () => {
    const { rerender } = render(<Loading value={10} aside="ARKNIGHTS-UI // UNOFFICIAL" />)
    const aside = screen.getByText('ARKNIGHTS-UI // UNOFFICIAL')
    expect(aside).toHaveAttribute('aria-hidden', 'true')
    expect(aside).toHaveClass('font-ark-regular')

    rerender(<Loading aside="ARKNIGHTS-UI // UNOFFICIAL" />)
    expect(screen.queryByText('ARKNIGHTS-UI // UNOFFICIAL')).not.toBeInTheDocument()
  })

  it('没有 value 时进度未知：旋转指示，不输出 aria-valuenow', () => {
    render(<Loading>CONNECTING</Loading>)
    const spinner = screen.getByRole('progressbar', { name: 'CONNECTING' })
    expect(spinner).not.toHaveAttribute('aria-valuenow')
    expect(spinner).toHaveClass('motion-safe:animate-ark-spin')
    expect(percent()).toBeNull()
  })

  it('光标默认只在进度未知时出现，可以单独开关', () => {
    const cursor = () => document.querySelector('[class*="animate-ark-blink"]')
    const { rerender } = render(<Loading />)
    expect(cursor()).toHaveAttribute('aria-hidden', 'true')

    rerender(<Loading value={10} />)
    expect(cursor()).toBeNull()

    rerender(<Loading value={10} cursor />)
    expect(cursor()).not.toBeNull()

    rerender(<Loading cursor={false} />)
    expect(cursor()).toBeNull()
  })

  it('旋转与闪烁只在允许动效时进行', () => {
    render(<Loading />)
    const animated = [...document.querySelectorAll('[class*="animate-ark-"]')]
    expect(animated).toHaveLength(2)
    for (const element of animated) expect(element.className).toMatch(/motion-safe:animate-ark-/)
  })

  it('去掉状态文字时用 aria-label 命名；有进度时只剩百分比', () => {
    const { rerender } = render(<Loading aria-label="加载中">{null}</Loading>)
    expect(screen.getByRole('progressbar', { name: '加载中' })).toBeInTheDocument()
    expect(screen.queryByText('LOADING')).not.toBeInTheDocument()

    rerender(
      <Loading aria-label="加载中" value={30}>
        {null}
      </Loading>,
    )
    expect(screen.getByRole('progressbar', { name: '加载中' })).toBeInTheDocument()
    expect(percent()?.textContent).toBe('30%')
  })

  it('aria-label 优先于状态文字', () => {
    render(
      <Loading value={30} aria-label="资源加载进度">
        LOADING ASSETS
      </Loading>,
    )
    const bar = screen.getByRole('progressbar', { name: '资源加载进度' })
    expect(bar).not.toHaveAttribute('aria-labelledby')
  })
})
