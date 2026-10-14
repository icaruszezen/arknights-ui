import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('是装饰，对读屏隐藏；起伏只在允许动效时进行', () => {
    render(<Skeleton data-testid="skeleton" className="h-24" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveAttribute('data-ark', 'skeleton')
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveClass('h-24', 'bg-ark-fg/10', 'motion-safe:animate-ark-breathe')
  })

  it('text 画几行，最后一行短一截', () => {
    render(<Skeleton data-testid="skeleton" variant="text" lines={4} />)
    const lines = [...screen.getByTestId('skeleton').children]
    expect(lines).toHaveLength(4)
    expect(lines[0]).toHaveClass('w-full')
    expect(lines[3]).toHaveClass('w-3/5')
  })

  it('只有一行时不截短', () => {
    render(<Skeleton data-testid="skeleton" variant="text" lines={1} />)
    expect(screen.getByTestId('skeleton').firstElementChild).toHaveClass('w-full')
  })
})
