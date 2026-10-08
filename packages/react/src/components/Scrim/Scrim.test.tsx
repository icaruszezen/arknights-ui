import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Scrim } from './Scrim'

describe('Scrim', () => {
  it('不放内容时是一层遮罩：隐藏、不接收点击、铺满父元素', () => {
    render(<Scrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')
    expect(scrim).toHaveAttribute('data-ark', 'scrim')
    expect(scrim).toHaveAttribute('aria-hidden', 'true')
    expect(scrim).toHaveClass('pointer-events-none', 'absolute', 'inset-0')
  })

  it('默认压底部，贴边一段实黑再渐隐', () => {
    render(<Scrim data-testid="scrim" />)
    const { className } = screen.getByTestId('scrim')
    expect(className).toContain('linear-gradient(to_top,')
    expect(className).toContain('var(--ark-scrim-solid,5rem)')
    expect(className).toContain('var(--ark-scrim-extent,20rem)')
  })

  it('左右两侧默认用更轻的一种：从 70% 的黑渐隐', () => {
    const { rerender } = render(<Scrim data-testid="scrim" side="left" />)
    expect(screen.getByTestId('scrim')).toHaveClass(
      'bg-linear-to-r',
      'from-ark-neutral-black/70',
      'to-transparent',
    )

    rerender(<Scrim data-testid="scrim" side="right" />)
    expect(screen.getByTestId('scrim')).toHaveClass('bg-linear-to-l')
  })

  it('variant 可以单独指定，不跟着方向走', () => {
    const { rerender } = render(<Scrim data-testid="scrim" side="left" variant="solid" />)
    expect(screen.getByTestId('scrim').className).toContain('linear-gradient(to_right,')

    rerender(<Scrim data-testid="scrim" side="top" variant="soft" />)
    const scrim = screen.getByTestId('scrim')
    expect(scrim).toHaveClass('bg-linear-to-b')
    expect(scrim.className).not.toContain('linear-gradient(')
  })

  it('放了内容就是文字容器：可见、可点，里面是深色上下文', () => {
    render(
      <Scrim data-testid="scrim">
        <a href="#more">查看更多</a>
      </Scrim>,
    )
    const scrim = screen.getByTestId('scrim')
    expect(scrim).not.toHaveAttribute('aria-hidden')
    expect(scrim).not.toHaveClass('pointer-events-none')
    expect(scrim).toHaveAttribute('data-ark-tone', 'dark')
    expect(screen.getByRole('link', { name: '查看更多' })).toBeInTheDocument()
  })

  it('可以用 className 只盖住一部分', () => {
    render(<Scrim data-testid="scrim" side="left" className="inset-y-0 right-auto w-3/4" />)
    const scrim = screen.getByTestId('scrim')
    expect(scrim).toHaveClass('w-3/4', 'right-auto')
  })
})
