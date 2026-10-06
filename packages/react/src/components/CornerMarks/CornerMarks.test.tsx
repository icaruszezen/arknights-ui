import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CornerMarks } from './CornerMarks'

const getMarks = () =>
  [...screen.getByTestId('frame').children].filter(child =>
    child.matches('span[aria-hidden="true"]'),
  )

describe('CornerMarks', () => {
  it('四个角各一个角标，都对读屏隐藏', () => {
    render(<CornerMarks data-testid="frame">罗德岛</CornerMarks>)
    expect(screen.getByTestId('frame')).toHaveAttribute('data-ark', 'corner-marks')
    expect(getMarks()).toHaveLength(4)
  })

  it('每个角标只画两条边，四个角标互不相同', () => {
    render(<CornerMarks data-testid="frame">罗德岛</CornerMarks>)
    const sides = getMarks().map(mark =>
      mark.className
        .split(' ')
        .filter(name => /^border-[tblr]$/.test(name))
        .sort()
        .join(' '),
    )
    for (const pair of sides) expect(pair.split(' ')).toHaveLength(2)
    expect(new Set(sides).size).toBe(4)
  })

  it('内容照常渲染，角标不拦截点击', () => {
    render(
      <CornerMarks data-testid="frame">
        <button type="button">查看档案</button>
      </CornerMarks>,
    )
    expect(screen.getByRole('button', { name: '查看档案' })).toBeInTheDocument()
    for (const mark of getMarks()) expect(mark).toHaveClass('pointer-events-none')
  })

  it('内边距可以用 className 覆盖', () => {
    render(
      <CornerMarks data-testid="frame" className="p-ark-6">
        罗德岛
      </CornerMarks>,
    )
    const frame = screen.getByTestId('frame')
    expect(frame).toHaveClass('p-ark-6')
    expect(frame).not.toHaveClass('p-ark-4')
  })
})
