import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Barcode, code39Patterns, encodeCode39 } from './Barcode'

describe('Code 39 编码表', () => {
  it('43 个可编码字符加一个起止符', () => {
    expect(code39Patterns.size).toBe(44)
    for (const char of '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*') {
      expect(code39Patterns.has(char)).toBe(true)
    }
  })

  // 名字里的 “3 of 9”：这条不变量能查出绝大多数抄错的情况
  it('每个字符 9 个单元，恰好 3 个是宽的，且互不相同', () => {
    for (const pattern of code39Patterns.values()) {
      expect(pattern).toMatch(/^[01]{9}$/)
      expect(pattern.replaceAll('0', '')).toHaveLength(3)
    }
    expect(new Set(code39Patterns.values()).size).toBe(44)
  })

  // 取自维基百科 Code 39 条目的表格
  it('与公开的编码表一致', () => {
    expect(code39Patterns.get('*')).toBe('010010100')
    expect(code39Patterns.get('A')).toBe('100001001')
    expect(code39Patterns.get('0')).toBe('000110100')
    expect(code39Patterns.get('P')).toBe('001010010')
    expect(code39Patterns.get('$')).toBe('010101000')
    expect(code39Patterns.get('%')).toBe('000101010')
  })
})

describe('encodeCode39', () => {
  it('首尾加起止符，字符之间隔一个窄空', () => {
    const { text, bars, units } = encodeCode39('A')
    expect(text).toBe('A')
    // 每个字符 5 条；宽度 6 窄 + 3 宽（3:1）= 15，再加字符间的窄空
    expect(bars).toHaveLength(15)
    expect(units).toBe(15 * 3 + 2)
    // 起止符 *：窄条、宽空、窄条、窄空、宽条、窄空、宽条、窄空、窄条
    expect(bars.slice(0, 5)).toEqual([
      [0, 1],
      [4, 1],
      [6, 3],
      [10, 3],
      [14, 1],
    ])
    // 下一个字符从第 16 个单位开始；A 以一条宽条开头
    expect(bars[5]).toEqual([16, 3])
  })

  it('小写转大写，不支持的字符丢弃，起止符不能出现在内容里', () => {
    expect(encodeCode39('rhodes-island').text).toBe('RHODES-ISLAND')
    expect(encodeCode39('罗德岛 no.0147*').text).toBe(' NO.0147')
    expect(encodeCode39('@#!').text).toBe('')
  })

  it('条与条不重叠，全部落在总宽度之内', () => {
    const { bars, units } = encodeCode39('0011 7777')
    let end = 0
    for (const [x, width] of bars) {
      expect(x).toBeGreaterThan(end - 1)
      end = x + width
    }
    expect(end).toBe(units)
  })
})

describe('Barcode', () => {
  it('是装饰，默认对读屏隐藏', () => {
    render(<Barcode data-testid="barcode" value="NO.0147" />)
    const barcode = screen.getByTestId('barcode')
    expect(barcode).toHaveAttribute('data-ark', 'barcode')
    expect(barcode).toHaveAttribute('aria-hidden', 'true')
  })

  it('画出条，并在下方印出实际编码的内容', () => {
    render(<Barcode data-testid="barcode" value="no.0147" />)
    const barcode = screen.getByTestId('barcode')
    expect(barcode.querySelector('path')?.getAttribute('d')).toMatch(/^M0 0h1v1h-1z/)
    expect(screen.getByText('NO.0147')).toBeInTheDocument()
  })

  it('总宽度交给 CSS 变量，条宽和高度可以分别调', () => {
    render(<Barcode data-testid="barcode" value="A" style={{ color: 'red' }} />)
    const barcode = screen.getByTestId('barcode')
    expect(barcode.style.getPropertyValue('--ark-barcode-units')).toBe('47')
    expect(barcode.style.color).toBe('red')
    expect(barcode.querySelector('svg')).toHaveAttribute('viewBox', '0 0 47 1')
  })

  it('text 为 false 时只留条', () => {
    render(<Barcode data-testid="barcode" value="NO.0147" text={false} />)
    expect(screen.queryByText('NO.0147')).not.toBeInTheDocument()
    expect(screen.getByTestId('barcode').querySelector('path')).not.toBeNull()
  })

  it('没有可编码的字符时不渲染', () => {
    const { container } = render(<Barcode value="罗德岛" />)
    expect(container).toBeEmptyDOMElement()
  })
})
