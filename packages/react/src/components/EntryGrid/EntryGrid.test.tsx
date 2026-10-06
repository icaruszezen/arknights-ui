import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EntryPanel } from '../EntryPanel'
import { EntryGrid } from './EntryGrid'

const names = ['作战', '编队', '干员', '采购中心', '公开招募', '干员寻访', '任务', '基建', '仓库']

// 直接返回数组：入口必须是 EntryGrid 的直接子元素，包一层组件或 Fragment 就只算一个
const entries = (count = names.length) =>
  names.slice(0, count).map(name => <EntryPanel key={name}>{name}</EntryPanel>)

// 每个入口所在的那一格
const cell = (name: string) =>
  screen.getByRole('button', { name }).closest('[data-ark="panel-grid-item"]') as HTMLElement
const title = (name: string) => screen.getByText(name)

describe('EntryGrid', () => {
  it('是一组错位拼合的面板，竖屏纵向堆叠', () => {
    render(<EntryGrid data-testid="grid">{entries()}</EntryGrid>)
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveAttribute('data-ark', 'entry-grid')
    expect(grid).toHaveClass('grid-cols-12', 'gap-ark-1', 'portrait:grid-cols-1')
    expect(screen.getAllByRole('button')).toHaveLength(9)
  })

  it('默认按一、二、三、三排成四行', () => {
    render(<EntryGrid>{entries()}</EntryGrid>)
    expect(cell('作战')).toHaveClass('col-span-12')
    for (const name of ['编队', '干员']) expect(cell(name)).toHaveClass('col-span-6')
    for (const name of ['采购中心', '公开招募', '干员寻访', '任务', '基建', '仓库']) {
      expect(cell(name)).toHaveClass('col-span-4')
    }
  })

  it('第一行最高，第二行次之，其余一样', () => {
    render(<EntryGrid>{entries()}</EntryGrid>)
    expect(cell('作战')).toHaveClass('row-span-2')
    expect(cell('编队')).toHaveClass(
      'row-span-1',
      'min-h-[calc(var(--ark-panel-grid-row,5rem)*1.5)]',
    )
    expect(cell('任务')).toHaveClass('row-span-1')
    expect(cell('任务').className).not.toContain('min-h-')
  })

  it('入口的默认字号跟着所在的行走：越靠上越大', () => {
    render(<EntryGrid>{entries()}</EntryGrid>)
    expect(title('作战')).toHaveClass('text-ark-display')
    expect(title('编队')).toHaveClass('text-ark-h1')
    expect(title('采购中心')).toHaveClass('text-ark-nav')
    expect(title('仓库')).toHaveClass('text-ark-nav')
  })

  it('入口自己指定的字号优先', () => {
    render(
      <EntryGrid>
        <EntryPanel size="sm">作战</EntryPanel>
      </EntryGrid>,
    )
    expect(title('作战')).toHaveClass('text-ark-nav')
  })

  it('rows 改每一行的个数，超出的部分沿用最后一行', () => {
    render(<EntryGrid rows={[2, 4]}>{entries()}</EntryGrid>)
    for (const name of ['作战', '编队']) expect(cell(name)).toHaveClass('col-span-6', 'row-span-2')
    // 第二行 4 个，第三行沿用 4 个
    for (const name of ['干员', '采购中心', '公开招募', '干员寻访', '任务']) {
      expect(cell(name)).toHaveClass('col-span-3')
    }
    expect(title('干员')).toHaveClass('text-ark-h1')
    expect(title('任务')).toHaveClass('text-ark-nav')
  })

  it('rows 为空时用默认的排法', () => {
    render(<EntryGrid rows={[]}>{entries(3)}</EntryGrid>)
    expect(cell('作战')).toHaveClass('col-span-12')
    expect(cell('编队')).toHaveClass('col-span-6')
  })

  it('空节点不占格子', () => {
    render(
      <EntryGrid data-testid="grid">
        <EntryPanel>作战</EntryPanel>
        {null}
        <EntryPanel>编队</EntryPanel>
        {false}
        <EntryPanel>干员</EntryPanel>
      </EntryGrid>,
    )
    expect(screen.getByTestId('grid').children).toHaveLength(3)
    expect(cell('编队')).toHaveClass('col-span-6')
    expect(cell('干员')).toHaveClass('col-span-6')
  })

  it('gap 改缝的宽度', () => {
    render(
      <EntryGrid data-testid="grid" gap="md">
        {entries(1)}
      </EntryGrid>,
    )
    expect(screen.getByTestId('grid')).toHaveClass('gap-ark-2')
  })

  it('不放在 EntryGrid 里的入口默认是最小一档', () => {
    render(<EntryPanel>仓库</EntryPanel>)
    expect(title('仓库')).toHaveClass('text-ark-nav')
  })
})
