import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('默认是中性标签', () => {
    render(<Tag>生存</Tag>)
    const tag = screen.getByText('生存')
    expect(tag).toHaveAttribute('data-ark', 'tag')
    expect(tag).toHaveClass('bg-ark-neutral-graphite')
  })

  it('切角时背景画在 ::before 上，根元素不裁切', () => {
    render(
      <Tag variant="solid" cut>
        近卫
      </Tag>,
    )
    const tag = screen.getByText('近卫')
    expect(tag).toHaveClass('before:ark-cut-tr-sm', 'before:bg-ark-invert')
    expect(tag).not.toHaveClass('bg-ark-invert')
  })

  it('outline 不支持切角', () => {
    render(
      <Tag variant="outline" cut>
        输出
      </Tag>,
    )
    expect(screen.getByText('输出').className).not.toContain('ark-cut')
  })
})
