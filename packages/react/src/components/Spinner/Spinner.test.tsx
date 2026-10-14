import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('给了 label 是一个进度未知的进度指示', () => {
    render(<Spinner label="正在保存" />)
    const spinner = screen.getByRole('progressbar', { name: '正在保存' })
    expect(spinner).toHaveAttribute('data-ark', 'spinner')
    expect(spinner).not.toHaveAttribute('aria-valuenow')
  })

  it('没有 label 时只是装饰', () => {
    render(<Spinner data-testid="spinner" />)
    expect(screen.getByTestId('spinner')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('使用方自己给了 role 和名称时不标成装饰', () => {
    render(
      <>
        <span id="status">LOADING</span>
        <Spinner role="progressbar" aria-labelledby="status" />
      </>,
    )
    const spinner = screen.getByRole('progressbar', { name: 'LOADING' })
    expect(spinner).not.toHaveAttribute('aria-hidden')
  })

  it('旋转只在允许动效时进行；inherit 时颜色跟随文字', () => {
    const { rerender } = render(<Spinner data-testid="spinner" />)
    expect(screen.getByTestId('spinner')).toHaveClass(
      'motion-safe:animate-ark-spin',
      'border-t-ark-signal',
    )
    rerender(<Spinner data-testid="spinner" inherit size="lg" />)
    expect(screen.getByTestId('spinner')).toHaveClass('border-t-current', 'size-6')
    expect(screen.getByTestId('spinner')).not.toHaveClass('border-t-ark-signal')
  })
})
