import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Counter, Serial } from './Counter'

describe('Counter', () => {
  it('写作 “01 // 01 / 05”：大数字之后跟当前 / 总数', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    const counter = screen.getByTestId('counter')
    expect(counter).toHaveAttribute('data-ark', 'counter')
    expect(counter.querySelector('b')).toHaveTextContent(/^01$/)
    expect(screen.getByText('// 01 / 05')).toBeInTheDocument()
  })

  it('当前值与总数用同样的补零规则', () => {
    render(<Counter data-testid="counter" value={7} total={120} pad={3} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveTextContent(/^007$/)
    expect(screen.getByText('// 007 / 120')).toBeInTheDocument()
  })

  it('读屏只读到“第几个 / 共几个”，视觉上的写法对它隐藏', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    const counter = screen.getByTestId('counter')
    expect(counter.querySelector('.sr-only')).toHaveTextContent('1 / 5')
    expect(counter.querySelector('b')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('// 01 / 05')).toHaveAttribute('aria-hidden', 'true')
  })

  it('标签是可读的文字，不隐藏', () => {
    render(<Counter value={1} total={5} label="INFORMATION" />)
    const label = screen.getByText('INFORMATION')
    expect(label).not.toHaveAttribute('aria-hidden')
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('大数字用信号色，并在纸白面上跟着压暗', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass('text-ark-signal-fg')
  })

  it('md 的大数字是宽体 5.4rem（官网实测），sm 缩到小节标签的字号并改用数据体', () => {
    const { rerender } = render(<Counter data-testid="counter" value={1} total={5} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass(
      'font-ark-latin-wide',
      'text-[5.4rem]',
      'font-semibold',
    )

    rerender(<Counter data-testid="counter" value={1} total={5} size="sm" />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass(
      'font-ark-data',
      'text-ark-h2',
    )
  })

  it('md 的名称另起一行、1.125rem；“当前 / 总数”也是 1.125rem', () => {
    render(<Counter value={1} total={5} label="INFORMATION" />)
    expect(screen.getByText('INFORMATION')).toHaveClass('col-span-2', 'text-ark-body')
    expect(screen.getByText('// 01 / 05')).toHaveClass('text-ark-body')
  })
})

describe('Serial', () => {
  it('前缀后面跟补零的序号', () => {
    render(<Serial prefix="NO." value={147} pad={4} />)
    const serial = screen.getByText('NO.0147')
    expect(serial).toHaveAttribute('data-ark', 'serial')
  })

  it('不设 pad 就不补零，也不加千分位', () => {
    const { rerender } = render(<Serial prefix="VOL." value={69} />)
    expect(screen.getByText('VOL.69')).toBeInTheDocument()

    rerender(<Serial prefix="NO." value={12345} />)
    expect(screen.getByText('NO.12345')).toBeInTheDocument()
  })

  it('字符串原样输出', () => {
    render(<Serial prefix="LOT " value="0011-7777" pad={12} />)
    expect(screen.getByText('LOT 0011-7777')).toBeInTheDocument()
  })
})
