import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Prose } from './Prose'

describe('Prose', () => {
  it('把长文本的样式交给主题层的工具类，行长受控', () => {
    render(
      <Prose data-testid="prose">
        <h2>基础档案</h2>
        <p>正文</p>
      </Prose>,
    )
    const prose = screen.getByTestId('prose')
    expect(prose).toHaveAttribute('data-ark', 'prose')
    expect(prose.tagName).toBe('DIV')
    expect(prose).toHaveClass('ark-prose', 'max-w-[40em]', 'text-ark-fg')
    expect(prose).not.toHaveClass('ark-prose-numbered')
  })

  it('默认是黑体 1rem；serif 换成宋体的写法', () => {
    const { rerender } = render(<Prose data-testid="prose" />)
    expect(screen.getByTestId('prose')).toHaveClass('font-ark-cjk-sans', 'text-[1rem]')
    expect(screen.getByTestId('prose')).not.toHaveClass('ark-prose-serif')

    rerender(<Prose data-testid="prose" serif />)
    expect(screen.getByTestId('prose')).toHaveClass('ark-prose', 'ark-prose-serif', 'text-ark-body')
    expect(screen.getByTestId('prose')).not.toHaveClass('text-[1rem]', 'font-ark-cjk-sans')
  })

  it('里面是普通的标题和段落，不改动它们', () => {
    render(
      <Prose>
        <h2>基础档案</h2>
        <p>正文</p>
      </Prose>,
    )
    const heading = screen.getByRole('heading', { level: 2, name: '基础档案' })
    expect(heading).not.toHaveAttribute('class')
    expect(screen.getByText('正文').tagName).toBe('P')
  })

  it('numbered 打开二级标题的自动编号', () => {
    render(<Prose data-testid="prose" numbered />)
    expect(screen.getByTestId('prose')).toHaveClass('ark-prose', 'ark-prose-numbered')
  })

  it('as 指定渲染的元素', () => {
    render(<Prose as="article">正文</Prose>)
    expect(screen.getByRole('article')).toHaveAttribute('data-ark', 'prose')
  })

  it('行长和字号可以用 className 覆盖', () => {
    render(<Prose data-testid="prose" className="max-w-none text-ark-label" />)
    const prose = screen.getByTestId('prose')
    expect(prose).toHaveClass('max-w-none', 'text-ark-label', 'text-ark-fg')
    expect(prose).not.toHaveClass('max-w-[40em]', 'text-[1rem]')
  })
})
