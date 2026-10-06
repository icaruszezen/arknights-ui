import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../../internal/testing'
import { Parallax, ParallaxLayer, type ParallaxProps } from './Parallax'

function Scene(props: ParallaxProps) {
  return (
    <Parallax data-testid="parallax" {...props}>
      <ParallaxLayer data-testid="far" depth={0.2} />
      <ParallaxLayer data-testid="near" depth={1} />
    </Parallax>
  )
}

const root = () => screen.getByTestId('parallax')
const viewpoint = () => [
  root().style.getPropertyValue('--ark-parallax-x'),
  root().style.getPropertyValue('--ark-parallax-y'),
]

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Parallax', () => {
  it('是一个会裁掉溢出部分的容器', () => {
    render(<Scene />)
    expect(root()).toHaveAttribute('data-ark', 'parallax')
    expect(root()).toHaveAttribute('data-source', 'pointer')
    expect(root()).toHaveClass('relative', 'isolate', 'overflow-hidden')
  })

  it('指针在容器里的位置写成视点，离开后回到正中', () => {
    mockMatchMedia(['pointer: fine'])
    render(<Scene />)
    vi.spyOn(root(), 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 200,
    } as DOMRect)

    root().dispatchEvent(new PointerEvent('pointermove', { clientX: 300, clientY: 50 }))
    vi.advanceTimersToNextFrame()
    expect(viewpoint()).toEqual(['0.500', '-0.500'])

    root().dispatchEvent(new PointerEvent('pointerleave'))
    vi.advanceTimersToNextFrame()
    expect(viewpoint()).toEqual(['0.000', '0.000'])
  })

  it('source="scroll" 跟着滚动进度走，只有纵向', () => {
    render(<Scene source="scroll" />)
    expect(root()).toHaveAttribute('data-source', 'scroll')
    const half = window.innerHeight / 2
    // 元素中心在视口中心下方半个“行程”处
    vi.spyOn(root(), 'getBoundingClientRect').mockReturnValue({
      top: half + half / 2 - 50,
      height: 100,
    } as DOMRect)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersToNextFrame()

    const [x, y] = viewpoint()
    expect(x).toBe('0.000')
    expect(Number(y)).toBeLessThan(0)
    expect(Number(y)).toBeGreaterThan(-1)
  })

  it('用户要求减少动效时各层不动', () => {
    mockMatchMedia(['pointer: fine', 'prefers-reduced-motion'])
    render(<Scene />)
    root().dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10 }))
    vi.advanceTimersToNextFrame()
    expect(viewpoint()).toEqual(['', ''])
  })

  it('触屏设备上不跟指针', () => {
    mockMatchMedia([])
    render(<Scene />)
    root().dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10 }))
    vi.advanceTimersToNextFrame()
    expect(viewpoint()).toEqual(['', ''])
  })
})

describe('ParallaxLayer', () => {
  it('把远近写成变量，位移交给主题层的工具类去算', () => {
    render(<Scene />)
    const far = screen.getByTestId('far')
    const near = screen.getByTestId('near')
    expect(far).toHaveAttribute('data-ark', 'parallax-layer')
    expect(far).toHaveClass('ark-parallax-layer')
    expect(far.style.getPropertyValue('--ark-parallax-depth')).toBe('0.2')
    expect(near.style.getPropertyValue('--ark-parallax-depth')).toBe('1')
  })

  it('跟指针时有过渡，跟滚动时没有', () => {
    render(<Scene />)
    expect(screen.getByTestId('near')).toHaveClass(
      'transition-[translate]',
      'in-data-[source=scroll]:transition-none',
    )
  })

  it('位置由 className 决定，保留使用方的 style', () => {
    render(
      <Parallax>
        <ParallaxLayer
          data-testid="layer"
          depth={-0.5}
          className="absolute inset-0"
          style={{ opacity: 0.5 }}
        />
      </Parallax>,
    )
    const layer = screen.getByTestId('layer')
    expect(layer).toHaveClass('absolute', 'inset-0')
    expect(layer.style.opacity).toBe('0.5')
    expect(layer.style.getPropertyValue('--ark-parallax-depth')).toBe('-0.5')
  })
})
