import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver } from '../../internal/testing'
import { Stagger, type StaggerProps } from './Stagger'

function Sample(props: StaggerProps) {
  return (
    <Stagger data-testid="stagger" {...props}>
      <span>第一项</span>
      <span>第二项</span>
      {false}
      <span>第三项</span>
    </Stagger>
  )
}

const items = () => [...screen.getByTestId('stagger').children] as HTMLElement[]

afterEach(() => vi.unstubAllGlobals())

describe('Stagger', () => {
  it('每个子元素各包一层，空节点不算', () => {
    render(<Sample />)
    const stagger = screen.getByTestId('stagger')
    expect(stagger).toHaveAttribute('data-ark', 'stagger')
    expect(items()).toHaveLength(3)
    expect(items().map(item => item.textContent)).toEqual(['第一项', '第二项', '第三项'])
    for (const item of items()) expect(item.tagName).toBe('DIV')
  })

  it('每一项比前一项晚一个间隔', () => {
    render(<Sample />)
    expect(items().map(item => item.style.animationDelay)).toEqual([
      'calc(var(--ark-stagger-delay, 0ms) + var(--ark-motion-stagger) * 0)',
      'calc(var(--ark-stagger-delay, 0ms) + var(--ark-motion-stagger) * 1)',
      'calc(var(--ark-stagger-delay, 0ms) + var(--ark-motion-stagger) * 2)',
    ])
  })

  it('默认自左滑入；减少动效时只淡入', () => {
    render(<Sample />)
    for (const item of items()) {
      expect(item).toHaveClass(
        'motion-safe:animate-ark-enter-left',
        'motion-reduce:animate-ark-fade-in',
      )
    }
  })

  it('from 决定方向，none 是原地淡入', () => {
    const { rerender } = render(<Sample from="right" />)
    expect(items()[0]).toHaveClass('motion-safe:animate-ark-enter-right')

    rerender(<Sample from="bottom" />)
    expect(items()[0]).toHaveClass('motion-safe:animate-ark-enter-up')

    rerender(<Sample from="none" />)
    expect(items()[0]).toHaveClass('animate-ark-fade-in')
    expect(items()[0]?.className).not.toContain('animate-ark-enter')
  })

  it('delay 让第一项之前先等一段', () => {
    const { rerender } = render(<Sample />)
    const delay = () => screen.getByTestId('stagger').style.getPropertyValue('--ark-stagger-delay')
    expect(delay()).toBe('0ms')

    rerender(<Sample delay={300} />)
    expect(delay()).toBe('300ms')
  })

  it('as 为列表时每一项是 li', () => {
    render(<Sample as="ul" aria-label="情报" />)
    const list = screen.getByRole('list', { name: '情报' })
    expect(list.tagName).toBe('UL')
    expect(list).toHaveClass('list-none', 'p-0')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('trigger="visible" 时进入视口之前保持隐藏，进入后才入场', () => {
    const viewport = mockIntersectionObserver()
    render(<Sample trigger="visible" />)
    expect(viewport.observed).toBe(1)
    for (const item of items()) {
      expect(item).toHaveClass('opacity-0')
      expect(item.className).not.toContain('animate-ark-')
    }

    act(() => viewport.enter())
    for (const item of items()) {
      expect(item).not.toHaveClass('opacity-0')
      expect(item).toHaveClass('motion-safe:animate-ark-enter-left')
    }
  })

  it('默认挂载就入场，不观察视口', () => {
    const viewport = mockIntersectionObserver()
    render(<Sample />)
    expect(viewport.observed).toBe(0)
    expect(items()[0]).not.toHaveClass('opacity-0')
  })

  it('布局类写在自己身上，保留使用方的 style', () => {
    render(<Sample className="grid gap-ark-3" style={{ maxWidth: '20rem' }} />)
    const stagger = screen.getByTestId('stagger')
    expect(stagger).toHaveClass('grid', 'gap-ark-3')
    expect(stagger.style.maxWidth).toBe('20rem')
    expect(stagger.style.getPropertyValue('--ark-stagger-delay')).toBe('0ms')
  })
})
