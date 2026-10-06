import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Codename } from './Codename'

describe('Codename', () => {
  it('默认是二级标题：Heavy 字重，字距收紧到 -0.1em', () => {
    render(<Codename>干员代号</Codename>)
    const heading = screen.getByRole('heading', { level: 2, name: '干员代号' })
    expect(heading).toHaveAttribute('data-ark', 'codename')
    expect(heading).toHaveClass('font-ark-cjk-sans', 'font-ark-heavy', 'tracking-ark-cjk-tight')
  })

  it('英文名在视觉上排在代号上方，DOM 里代号在前', () => {
    render(<Codename sub="Codename">干员代号</Codename>)
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('flex-col-reverse')
    expect(heading.firstElementChild).toHaveTextContent('干员代号')
    expect(heading.lastElementChild).toHaveTextContent('Codename')
  })

  it('英文名是宽体大写，不跟着收字距', () => {
    render(<Codename sub="Codename">干员代号</Codename>)
    expect(screen.getByText('Codename')).toHaveClass(
      'font-ark-latin-wide',
      'font-ark-bold',
      'tracking-ark-normal',
      'uppercase',
    )
  })

  it('三档字号，英文约为代号的三分之一', () => {
    const { rerender } = render(
      <Codename size="sm" sub="Codename">
        干员代号
      </Codename>,
    )
    expect(screen.getByText('干员代号')).toHaveClass('text-ark-body-lg')
    expect(screen.getByText('Codename')).toHaveClass('text-ark-caption')

    rerender(<Codename sub="Codename">干员代号</Codename>)
    expect(screen.getByText('干员代号')).toHaveClass('text-ark-h1')
    expect(screen.getByText('Codename')).toHaveClass('text-ark-label')

    rerender(
      <Codename size="lg" sub="Codename">
        干员代号
      </Codename>,
    )
    expect(screen.getByText('干员代号')).toHaveClass('text-ark-display')
    expect(screen.getByText('Codename')).toHaveClass('text-ark-body-lg')
  })

  it('as 换元素，放进链接时用 span', () => {
    render(
      <Codename as="span" data-testid="name">
        干员代号
      </Codename>,
    )
    expect(screen.getByTestId('name').tagName).toBe('SPAN')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('使用方的类可以覆盖字重和字距（官网的写法）', () => {
    render(<Codename className="font-ark-bold tracking-ark-normal">干员代号</Codename>)
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('font-ark-bold', 'tracking-ark-normal')
    expect(heading).not.toHaveClass('font-ark-heavy', 'tracking-ark-cjk-tight')
  })
})
