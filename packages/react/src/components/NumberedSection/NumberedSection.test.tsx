import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NumberedSection } from './NumberedSection'

describe('NumberedSection', () => {
  it('是一个以“编号 + 小节名”命名的区域', () => {
    render(
      <NumberedSection number={1} title="活动说明">
        <p>正文</p>
      </NumberedSection>,
    )
    const section = screen.getByRole('region', { name: '01 活动说明' })
    expect(section).toHaveAttribute('data-ark', 'numbered-section')
    expect(within(section).getByText('正文')).toBeInTheDocument()
  })

  it('小节名默认是三级标题，可以改级别', () => {
    const { rerender } = render(<NumberedSection number={1} title="活动说明" />)
    expect(screen.getByRole('heading', { level: 3, name: '活动说明' })).toBeInTheDocument()

    rerender(<NumberedSection number={1} title="活动说明" headingAs="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: '活动说明' })).toBeInTheDocument()
  })

  it('编号补前导零到两位，用数据体和信号色', () => {
    render(<NumberedSection number={3} title="新增时装" />)
    const number = screen.getByText('03')
    expect(number).toHaveClass('font-ark-data', 'font-ark-bold', 'text-ark-signal-fg')
    // 数字比小节名大一倍
    expect(number).toHaveClass('text-ark-h1')
    expect(screen.getByRole('heading')).toHaveClass('text-ark-body-lg')
  })

  it('pad 改位数，字符串编号原样输出', () => {
    const { rerender } = render(<NumberedSection number={7} pad={3} title="附录" />)
    expect(screen.getByText('007')).toBeInTheDocument()

    rerender(<NumberedSection number="A" title="附录" />)
    expect(screen.getByRole('region', { name: 'A 附录' })).toBeInTheDocument()
  })

  it('小节名下面是一条细线，对读屏隐藏', () => {
    render(<NumberedSection data-testid="section" number={1} title="活动说明" />)
    const rule = screen.getByTestId('section').querySelector('[aria-hidden="true"]')
    expect(rule).toHaveClass('h-px', 'bg-ark-rule', 'col-span-2')
  })

  it('英文小字在标题行右端', () => {
    render(<NumberedSection number={1} title="活动说明" sub="Event Info" />)
    expect(screen.getByText('Event Info')).toHaveClass('font-ark-latin-condensed', 'uppercase')
  })

  it('内容从小节名的左缘写起，竖屏回到最左', () => {
    render(
      <NumberedSection number={1} title="活动说明">
        <p data-testid="body">正文</p>
      </NumberedSection>,
    )
    expect(screen.getByTestId('body').parentElement).toHaveClass(
      'col-start-2',
      'portrait:col-start-1',
      'portrait:col-span-2',
    )
  })

  it('没有内容时不留空的内容区', () => {
    render(<NumberedSection data-testid="section" number={1} title="活动说明" />)
    expect(screen.getByTestId('section').children).toHaveLength(3)
  })
})
