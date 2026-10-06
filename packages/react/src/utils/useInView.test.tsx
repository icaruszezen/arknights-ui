import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver } from '../internal/testing'
import { useInView } from './useInView'

function Probe({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, enabled)
  return (
    <div ref={ref} data-testid="probe">
      {seen ? 'seen' : 'waiting'}
    </div>
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('useInView', () => {
  it('进入视口之前为 false，进入之后为 true 并停止观察', () => {
    const viewport = mockIntersectionObserver()
    render(<Probe enabled />)
    expect(screen.getByTestId('probe')).toHaveTextContent('waiting')
    expect(viewport.observed).toBe(1)

    act(() => viewport.enter())
    expect(screen.getByTestId('probe')).toHaveTextContent('seen')
    expect(viewport.observed).toBe(0)
  })

  it('不启用时不观察，直接视为已进入', () => {
    const viewport = mockIntersectionObserver()
    render(<Probe enabled={false} />)
    expect(screen.getByTestId('probe')).toHaveTextContent('seen')
    expect(viewport.observed).toBe(0)
  })

  it('浏览器不支持 IntersectionObserver 时视为已进入', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Probe enabled />)
    expect(screen.getByTestId('probe')).toHaveTextContent('seen')
  })
})
