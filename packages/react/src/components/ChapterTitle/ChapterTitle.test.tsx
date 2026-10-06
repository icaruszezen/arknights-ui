import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChapterTitle } from './ChapterTitle'

describe('ChapterTitle', () => {
  it('默认是二级标题：英文用拉丁衬线大写，收紧字距', () => {
    render(<ChapterTitle>The Long Night</ChapterTitle>)
    const heading = screen.getByRole('heading', { level: 2, name: 'The Long Night' })
    expect(heading).toHaveAttribute('data-ark', 'chapter-title')
    const title = screen.getByText('The Long Night')
    expect(title).toHaveClass('uppercase', 'tracking-ark-tight', 'font-ark-bold', 'text-ark-hero')
    expect(title.className).toContain(
      'font-[family-name:var(--ark-chapter-font,var(--ark-font-family-latin-serif))]',
    )
  })

  it('as 改标题的级别', () => {
    render(<ChapterTitle as="h1">The Long Night</ChapterTitle>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('中文标题较小，字重低于英文，上面一条细线', () => {
    render(<ChapterTitle sub="长夜">The Long Night</ChapterTitle>)
    const sub = screen.getByText('长夜')
    expect(sub).toHaveClass('font-ark-cjk-serif', 'font-ark-medium', 'text-ark-h2')
    expect(sub.previousElementSibling).toHaveClass('h-px', 'bg-ark-rule-strong')
    expect(sub.previousElementSibling).toHaveAttribute('aria-hidden', 'true')
  })

  it('编号补前导零到两位，用数据体和信号色，前面带 EPISODE', () => {
    render(<ChapterTitle number={8}>The Long Night</ChapterTitle>)
    const number = screen.getByText('08')
    expect(number).toHaveClass('font-ark-data', 'font-ark-bold', 'text-ark-signal-fg')
    expect(screen.getByText('EPISODE')).toHaveClass('font-ark-latin-condensed', 'text-ark-fg-muted')
  })

  it('字符串编号原样输出，numberLabel 可以改也可以去掉', () => {
    const { rerender } = render(
      <ChapterTitle number="IV" numberLabel="Chapter">
        The Long Night
      </ChapterTitle>,
    )
    expect(screen.getByText('IV')).toBeInTheDocument()
    expect(screen.getByText('Chapter')).toBeInTheDocument()

    rerender(
      <ChapterTitle number={8} numberLabel={null}>
        The Long Night
      </ChapterTitle>,
    )
    expect(screen.queryByText('EPISODE')).not.toBeInTheDocument()
  })

  it('DOM 里英文标题在最前，编号在视觉上排到上面', () => {
    render(
      <ChapterTitle number={8} sub="长夜">
        The Long Night
      </ChapterTitle>,
    )
    const heading = screen.getByRole('heading')
    expect(heading.firstElementChild).toHaveTextContent('The Long Night')
    expect(heading.firstElementChild).toHaveClass('order-2')
    expect(screen.getByText('08').parentElement).toHaveClass('order-1')
    expect(heading).toHaveAccessibleName('The Long Night 长夜 EPISODE 08')
  })

  it('caption 是对标题的再一次表述，对读屏隐藏', () => {
    render(<ChapterTitle caption="ДОЛГАЯ НОЧЬ">The Long Night</ChapterTitle>)
    const caption = screen.getByText('ДОЛГАЯ НОЧЬ')
    expect(caption).toHaveAttribute('aria-hidden', 'true')
    expect(caption).toHaveClass('order-4', 'tracking-[0.3em]', 'text-ark-fg-muted')
    expect(screen.getByRole('heading')).toHaveAccessibleName('The Long Night')
  })

  it('两档字号', () => {
    render(
      <ChapterTitle size="md" sub="长夜">
        The Long Night
      </ChapterTitle>,
    )
    expect(screen.getByText('The Long Night')).toHaveClass('text-ark-display')
    expect(screen.getByText('长夜')).toHaveClass('text-ark-body-lg')
  })

  it('默认靠左，可以居中', () => {
    const { rerender } = render(<ChapterTitle>The Long Night</ChapterTitle>)
    expect(screen.getByRole('heading')).toHaveClass('items-start', 'text-left')

    rerender(<ChapterTitle align="center">The Long Night</ChapterTitle>)
    expect(screen.getByRole('heading')).toHaveClass('items-center', 'text-center')
  })

  it('入场以 1 秒淡入，只动透明度', () => {
    render(<ChapterTitle>The Long Night</ChapterTitle>)
    expect(screen.getByRole('heading')).toHaveClass(
      'animate-ark-fade-in',
      '[animation-duration:var(--ark-motion-duration-slower)]',
    )
  })

  it('竖屏时最大的一档收小', () => {
    render(<ChapterTitle>The Long Night</ChapterTitle>)
    expect(screen.getByText('The Long Night')).toHaveClass('portrait:text-ark-display')
  })
})
