import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OperatorAvatar } from './OperatorAvatar'

const glyph = <svg aria-hidden="true" data-testid="buff" viewBox="0 0 24 24" />
const ring = () =>
  screen.getByTestId('avatar').querySelector('circle.stroke-ark-signal') as SVGCircleElement

describe('OperatorAvatar', () => {
  it('是一个正方形的头像，脸落在上三分之一', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" alt="占位干员甲" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-ark', 'operator-avatar')
    expect(avatar).toHaveClass('size-14', 'bg-ark-neutral-graphite')
    const image = screen.getByRole('img', { name: '占位干员甲' })
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveClass('object-cover', 'object-[50%_15%]')
  })

  it('alt 默认是空的：头像只是陪衬', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" />)
    expect(screen.getByTestId('avatar').querySelector('img')).toHaveAttribute('alt', '')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('不给 src 是一个带加号的虚线空位', () => {
    render(<OperatorAvatar data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-empty')
    expect(avatar).toHaveClass('border-dashed')
    expect(avatar.querySelector('img')).toBeNull()
    expect(avatar.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('空位给了 alt 就以它为名称读出来', () => {
    render(<OperatorAvatar alt="空位" />)
    expect(screen.getByRole('img', { name: '空位' })).toHaveAttribute('data-empty')
  })

  it('加成图标叠在右下角，默认对读屏隐藏', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} />)
    const badge = screen.getByTestId('buff').parentElement?.parentElement
    expect(badge).toHaveClass('absolute', '-right-1', '-bottom-1', 'rounded-full')
    expect(badge).toHaveAttribute('aria-hidden', 'true')
  })

  it('给了 buffLabel 才会被读到', () => {
    render(<OperatorAvatar src="/a.png" buff={glyph} buffLabel="制造效率 +25%" />)
    expect(screen.getByRole('img', { name: '制造效率 +25%' })).toBeInTheDocument()
  })

  it('圆环表示加成有多强：走过的比例是 buffLevel / buffMax', () => {
    const { rerender } = render(
      <OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} buffLevel={2} />,
    )
    // 默认最强 3 级：2 级走了三分之二
    expect(Number(ring().getAttribute('stroke-dashoffset'))).toBeCloseTo(33.33, 1)

    rerender(<OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} buffLevel={3} />)
    expect(ring().getAttribute('stroke-dashoffset')).toBe('0')

    rerender(
      <OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} buffLevel={1} buffMax={2} />,
    )
    expect(ring().getAttribute('stroke-dashoffset')).toBe('50')
  })

  it('圆环用信号色，跟着所在位置的类型色走', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} buffLevel={2} />)
    expect(ring()).toHaveClass('stroke-ark-signal')
  })

  it('不给 buffLevel 就只有图标，没有圆环', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" buff={glyph} />)
    expect(screen.getByTestId('avatar').querySelector('circle')).toBeNull()
    expect(screen.getByTestId('buff')).toBeInTheDocument()
  })

  it('没有加成时不渲染角标', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" buffLevel={2} />)
    expect(screen.getByTestId('avatar').querySelector('.rounded-full')).toBeNull()
  })

  it('mood 在底边贴一条心情条', () => {
    render(<OperatorAvatar src="/a.png" mood={4} />)
    const bar = screen.getByRole('progressbar', { name: '心情' })
    expect(bar).toHaveClass('absolute', 'inset-x-0', 'bottom-0')
    expect(bar).toHaveAttribute('aria-valuenow', '4')
    expect(bar).toHaveAttribute('aria-valuemax', '24')
    expect(bar).toHaveAttribute('data-low')
  })

  it('moodMax 改心情的上限', () => {
    render(<OperatorAvatar src="/a.png" mood={50} moodMax={100} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
  })

  it('大小可以用类覆盖', () => {
    render(<OperatorAvatar data-testid="avatar" src="/a.png" className="size-20" />)
    expect(screen.getByTestId('avatar')).toHaveClass('size-20')
    expect(screen.getByTestId('avatar')).not.toHaveClass('size-14')
  })
})
