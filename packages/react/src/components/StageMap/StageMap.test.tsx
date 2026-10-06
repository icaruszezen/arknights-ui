import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { StageMap, type StageMapProps, StageNode } from './StageMap'

// 一条主线，在 1-2 之后向上分出一条支线；1-4 还没解锁
function Chapter(props: StageMapProps) {
  return (
    <StageMap aria-label="第一章" {...props}>
      <StageNode value="1-1" col={1} name="孤岛">
        1-1
      </StageNode>
      <StageNode value="1-2" col={2} from="1-1">
        1-2
      </StageNode>
      <StageNode value="TR-1" col={3} row={-1} from="1-2">
        TR-1
      </StageNode>
      <StageNode value="1-3" col={3} from="1-2" state="current">
        1-3
      </StageNode>
      <StageNode value="1-4" col={4} from={['1-3', 'TR-1']} state="locked">
        1-4
      </StageNode>
    </StageMap>
  )
}

const map = () => screen.getByRole('group')
const paths = () => Array.from(map().querySelectorAll('path'))
const node = (name: RegExp) => screen.getByRole('button', { name })
const cellStyle = (name: RegExp) => node(name).parentElement?.getAttribute('style') ?? ''

describe('StageMap', () => {
  it('是一组关卡按钮，排在一个列表里', () => {
    render(<Chapter />)
    expect(screen.getByRole('group', { name: '第一章' })).toBe(map())
    expect(map()).toHaveAttribute('data-ark', 'stage-map')
    expect(within(map()).getAllByRole('listitem')).toHaveLength(5)
    expect(within(map()).getAllByRole('button')).toHaveLength(5)
  })

  it('节点按 col、row 摆进网格：主线在中间，负的 row 在它上面', () => {
    render(<Chapter />)
    expect(cellStyle(/^1-1/)).toMatch(/grid-column:\s*1/)
    expect(cellStyle(/^1-1/)).toMatch(/grid-row:\s*2/)
    expect(cellStyle(/^TR-1/)).toMatch(/grid-column:\s*3/)
    expect(cellStyle(/^TR-1/)).toMatch(/grid-row:\s*1/)
    expect(cellStyle(/^1-4/)).toMatch(/grid-column:\s*4/)
  })

  it('列距是行距的两倍，行距由 --ark-stage-pitch 决定', () => {
    render(<Chapter />)
    const list = within(map()).getByRole('list')
    expect(list).toHaveClass('auto-rows-[var(--ark-stage-pitch,5rem)]')
    expect(list.getAttribute('style')).toContain(
      'repeat(4, calc(var(--ark-stage-pitch, 5rem) * 2))',
    )
  })

  it('不给 col 的节点排在上一个节点的下一列', () => {
    render(
      <StageMap aria-label="教学">
        <StageNode value="a">TR-1</StageNode>
        <StageNode value="b">TR-2</StageNode>
        <StageNode value="c" col={5}>
          TR-3
        </StageNode>
        <StageNode value="d">TR-4</StageNode>
      </StageMap>,
    )
    expect(cellStyle(/^TR-2/)).toMatch(/grid-column:\s*2/)
    expect(cellStyle(/^TR-4/)).toMatch(/grid-column:\s*6/)
  })

  it('每一条 from 关系画一条连线，画在一张以行距为单位的图上', () => {
    render(<Chapter />)
    const svg = map().querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    // 4 列 × 2，2 行
    expect(svg).toHaveAttribute('viewBox', '0 0 8 2')
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none')
    expect(paths()).toHaveLength(5)
    for (const path of paths()) {
      expect(path).toHaveAttribute('vector-effect', 'non-scaling-stroke')
    }
  })

  it('同一条线上是水平线；分叉是“水平 → 45° → 水平”的折线', () => {
    render(<Chapter />)
    const [main, branch] = paths()
    // 1-1 → 1-2：都在第二行的正中
    expect(main).toHaveAttribute('d', 'M1 1.5H3')
    // 1-2 → TR-1：斜的那一段横向走 1、纵向走 1，落在两列正中
    expect(branch).toHaveAttribute('d', 'M3 1.5H3.5L4.5 0.5V0.5H5')
  })

  it('通向未解锁关卡的连线是暗的虚线，其余是亮的实线', () => {
    render(<Chapter />)
    const [first, , , toLockedA, toLockedB] = paths()
    expect(first).toHaveClass('stroke-ark-fg/70')
    expect(first).not.toHaveAttribute('stroke-dasharray')
    for (const path of [toLockedA, toLockedB]) {
      expect(path).toHaveClass('stroke-ark-fg/30')
      expect(path).toHaveAttribute('stroke-dasharray', '4 4')
    }
  })

  it('from 指向不存在的关卡时不画线', () => {
    render(
      <StageMap aria-label="教学">
        <StageNode value="a" from="missing">
          TR-1
        </StageNode>
      </StageMap>,
    )
    expect(paths()).toHaveLength(0)
  })

  it('同一列上下相邻的两关用竖线相连', () => {
    render(
      <StageMap aria-label="教学">
        <StageNode value="a" col={1}>
          A
        </StageNode>
        <StageNode value="b" col={1} row={1} from="a">
          B
        </StageNode>
      </StageMap>,
    )
    expect(paths()[0]).toHaveAttribute('d', 'M1 0.5H1L1 0.5V1.5H1')
  })

  it('点击选中一关并回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Chapter defaultValue="1-3" onValueChange={onValueChange} />)
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent('1-3')

    await user.click(node(/^1-2/))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent('1-2')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('1-2')
  })

  it('未解锁的关卡不可选', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Chapter defaultValue="1-3" onValueChange={onValueChange} />)
    expect(node(/^1-4/)).toBeDisabled()
    await user.click(node(/^1-4/))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('受控时由外部状态决定选中项', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('1-1')
      return <Chapter value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    await user.click(node(/^TR-1/))
    expect(screen.getByRole('button', { pressed: true })).toHaveTextContent('TR-1')
  })

  it('放不下时横向滚动，四周留出焦点轮廓的位置', () => {
    render(<Chapter />)
    expect(map()).toHaveClass('overflow-x-auto', 'max-w-full', 'p-ark-2')
  })

  it('不是 StageNode 的子元素不参与摆位', () => {
    render(
      <StageMap aria-label="教学">
        <StageNode value="a">TR-1</StageNode>
        {null}
        <p>说明</p>
      </StageMap>,
    )
    expect(within(map()).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByText('说明')).not.toBeInTheDocument()
  })
})

describe('StageNode', () => {
  it('编号用数据体粗体，是主要文字；中文关卡名是下方的副题', () => {
    render(<Chapter />)
    const first = node(/^1-1/)
    expect(first).toHaveAttribute('data-ark', 'stage-node')
    expect(first).toHaveClass('font-ark-data', 'font-ark-bold')
    expect(screen.getByText('孤岛')).toHaveClass(
      'top-full',
      'font-ark-cjk-sans',
      'text-ark-caption',
    )
  })

  it('三种进度用明暗区分，并读给读屏', () => {
    render(<Chapter />)
    expect(node(/^1-2 已通关$/)).toHaveClass('bg-ark-neutral-graphite')
    expect(node(/^1-3 当前$/)).toHaveClass('bg-ark-neutral-white', 'text-ark-neutral-black')
    expect(node(/^1-4 未解锁$/)).toHaveClass('bg-ark-neutral-ink-900', 'border-dashed')
    expect(node(/^1-1 孤岛 已通关$/)).toHaveAttribute('data-state', 'cleared')
  })

  it('当前要打的那一关带一个方向三角', () => {
    render(<Chapter />)
    expect(node(/^1-3/).querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    expect(node(/^1-2/).querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('选中是信号色描边加底部 4px 条', () => {
    render(<Chapter defaultValue="1-2" />)
    expect(node(/^1-2/)).toHaveClass(
      'aria-pressed:border-ark-signal',
      'aria-pressed:shadow-[inset_0_-4px_0_var(--ark-signal)]',
    )
  })

  it('可以单独使用，选中由自己的属性决定', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <StageNode value="1-7" selected onClick={onClick}>
        1-7
      </StageNode>,
    )
    const button = screen.getByRole('button', { name: '1-7 已通关', pressed: true })
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disabled 可以显式覆盖：未解锁的关卡也能点开看条件', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <StageMap aria-label="教学" onValueChange={onValueChange}>
        <StageNode value="x" state="locked" disabled={false}>
          1-9
        </StageNode>
      </StageMap>,
    )
    await user.click(screen.getByRole('button'))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('x')
  })

  it('stateLabel 改读屏的说法', () => {
    render(
      <StageNode value="1-7" state="current" stateLabel="Next">
        1-7
      </StageNode>,
    )
    expect(screen.getByRole('button', { name: '1-7 Next' })).toBeInTheDocument()
  })

  it('摆位用的属性不会漏到 DOM 上', () => {
    render(<Chapter />)
    const branch = node(/^TR-1/)
    for (const attribute of ['col', 'row', 'from', 'value']) {
      expect(branch).not.toHaveAttribute(attribute)
    }
  })
})
