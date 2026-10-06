import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatStatValue, Stat } from './Stat'

describe('formatStatValue', () => {
  it('数字加千分位逗号', () => {
    expect(formatStatValue(131)).toBe('131')
    expect(formatStatValue(128400)).toBe('128,400')
    expect(formatStatValue(-6000)).toBe('-6,000')
  })

  it('指定 pad 时补前导零，不加千分位', () => {
    expect(formatStatValue(1, 2)).toBe('01')
    expect(formatStatValue(147, 4)).toBe('0147')
    expect(formatStatValue(12345, 2)).toBe('12345')
    expect(formatStatValue(-7, 2)).toBe('-07')
  })

  it('字符串原样返回', () => {
    expect(formatStatValue('02:14:36')).toBe('02:14:36')
    expect(formatStatValue('7', 3)).toBe('7')
  })
})

describe('Stat', () => {
  it('渲染为描述列表：标签在 dt，数值在 dd', () => {
    render(<Stat label="Sanity" value={131} max={135} />)
    expect(screen.getByRole('term')).toHaveTextContent('Sanity')
    expect(screen.getByRole('definition')).toHaveTextContent('131/135')
  })

  it('分母与当前值使用同样的补零规则', () => {
    render(<Stat label="Information" value={1} max={5} pad={2} />)
    expect(screen.getByRole('definition')).toHaveTextContent('01/05')
  })

  it('没有 max 时不渲染分母', () => {
    render(<Stat label="LMD" value={128400} />)
    expect(screen.getByRole('definition')).toHaveTextContent(/^128,400$/)
  })

  it('max 为 0 时仍渲染分母', () => {
    render(<Stat label="Orders" value={0} max={0} />)
    expect(screen.getByRole('definition')).toHaveTextContent('0/0')
  })

  it('渲染单位', () => {
    render(<Stat label="Cost" value={18} unit="理智" />)
    expect(screen.getByRole('definition')).toHaveTextContent('18理智')
  })

  it('value 是节点时原样放在主数值的位置，分母照常', () => {
    render(<Stat label="Sanity" value={<span data-testid="rolling">131</span>} max={135} />)
    const rolling = screen.getByTestId('rolling')
    expect(rolling.parentElement?.tagName).toBe('B')
    expect(screen.getByRole('definition')).toHaveTextContent('131/135')
  })
})
