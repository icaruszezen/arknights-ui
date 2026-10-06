import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from './Loading'

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
    expect(bar).toHaveAttribute('data-ark', 'progress')
  })

  it('百分比取整并右对齐，对读屏隐藏', () => {
    const { rerender } = render(<Loading value={2} max={3} />)
    const percent = screen.getByText('67%')
    expect(percent).toHaveAttribute('aria-hidden', 'true')
    expect(percent).toHaveClass('ml-auto')

    rerender(<Loading value={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()

    rerender(<Loading value={5} max={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('默认的状态文字是 LOADING', () => {
    render(<Loading value={10} />)
    expect(screen.getByRole('progressbar', { name: 'LOADING' })).toBeInTheDocument()
  })

  it('没有 value 时进度未知：旋转指示，不输出 aria-valuenow', () => {
    render(<Loading>CONNECTING</Loading>)
    const spinner = screen.getByRole('progressbar', { name: 'CONNECTING' })
    expect(spinner).not.toHaveAttribute('aria-valuenow')
    expect(spinner).toHaveClass('motion-safe:animate-ark-spin')
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument()
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

  it('去掉状态文字时用 aria-label 命名', () => {
    render(<Loading aria-label="加载中">{null}</Loading>)
    expect(screen.getByRole('progressbar', { name: '加载中' })).toBeInTheDocument()
    expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
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
