import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PanelGrid, PanelGridItem } from './PanelGrid'

describe('PanelGrid', () => {
  it('是一个 12 列的网格，默认的缝是 1rem（主界面入口面板之间的缝）', () => {
    render(<PanelGrid data-testid="grid" />)
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveAttribute('data-ark', 'panel-grid')
    expect(grid).toHaveClass('grid', 'grid-cols-12', 'gap-ark-4')
  })

  it('gap 可以收窄到 0.5rem 或 0.25rem（同组的子面板之间）', () => {
    const { rerender } = render(<PanelGrid data-testid="grid" gap="md" />)
    expect(screen.getByTestId('grid')).toHaveClass('gap-ark-2')
    expect(screen.getByTestId('grid')).not.toHaveClass('gap-ark-4')

    rerender(<PanelGrid data-testid="grid" gap="sm" />)
    expect(screen.getByTestId('grid')).toHaveClass('gap-ark-1')
    expect(screen.getByTestId('grid')).not.toHaveClass('gap-ark-4')
  })

  it('竖屏改成一列', () => {
    render(<PanelGrid data-testid="grid" />)
    expect(screen.getByTestId('grid')).toHaveClass('portrait:grid-cols-1')
  })

  it('行高由变量决定，可以覆盖', () => {
    render(<PanelGrid data-testid="grid" className="[--ark-panel-grid-row:7rem]" />)
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass(
      'auto-rows-[minmax(var(--ark-panel-grid-row,5rem),auto)]',
      '[--ark-panel-grid-row:7rem]',
    )
  })
})

describe('PanelGridItem', () => {
  it('默认占一整行、一行高', () => {
    render(<PanelGridItem data-testid="item" />)
    const item = screen.getByTestId('item')
    expect(item).toHaveAttribute('data-ark', 'panel-grid-item')
    expect(item).toHaveClass('col-span-12', 'row-span-1')
  })

  it('span 写成几分之几', () => {
    const cases = [
      ['1/2', 'col-span-6'],
      ['1/3', 'col-span-4'],
      ['2/3', 'col-span-8'],
      ['1/4', 'col-span-3'],
      ['3/4', 'col-span-9'],
    ] as const
    const { rerender } = render(<PanelGridItem data-testid="item" />)
    for (const [span, className] of cases) {
      rerender(<PanelGridItem data-testid="item" span={span} />)
      expect(screen.getByTestId('item')).toHaveClass(className)
      expect(screen.getByTestId('item')).not.toHaveClass('col-span-12')
    }
  })

  it('rows 决定占几行高', () => {
    render(<PanelGridItem data-testid="item" span="2/3" rows={3} />)
    expect(screen.getByTestId('item')).toHaveClass('col-span-8', 'row-span-3')
  })

  it('自己是网格容器，里面的面板自动撑满', () => {
    render(
      <PanelGridItem data-testid="item">
        <div>作战</div>
      </PanelGridItem>,
    )
    const item = screen.getByTestId('item')
    expect(item).toHaveClass('grid', 'min-w-0')
    expect(item).toHaveTextContent('作战')
  })

  it('竖屏时不再跨列跨行', () => {
    render(<PanelGridItem data-testid="item" span="1/3" rows={2} />)
    expect(screen.getByTestId('item')).toHaveClass('portrait:col-span-1', 'portrait:row-span-1')
  })
})
