import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OperatorCard } from '../OperatorCard'
import { SquadSlot } from './SquadSlot'

describe('SquadSlot', () => {
  it('和干员卡片一样大：10rem 宽、1:2', () => {
    render(<SquadSlot data-testid="slot" />)
    const slot = screen.getByTestId('slot')
    expect(slot).toHaveAttribute('data-ark', 'squad-slot')
    expect(slot).toHaveClass('aspect-[1/2]', 'w-40')
  })

  it('没有干员时是一个带加号的虚线框', () => {
    render(<SquadSlot data-testid="slot" />)
    const slot = screen.getByTestId('slot')
    expect(slot).toHaveAttribute('data-empty')
    const placeholder = slot.firstElementChild
    expect(placeholder).toHaveClass('border', 'border-dashed')
    expect(placeholder?.querySelector('svg')).toBeInTheDocument()
  })

  it('不给 onAdd 时空位只是装饰，不可点', () => {
    render(<SquadSlot data-testid="slot" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByTestId('slot').firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('给了 onAdd 空位是一个按钮，默认名称是“添加干员”', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<SquadSlot onAdd={onAdd} />)
    const button = screen.getByRole('button', { name: '添加干员' })
    expect(button).toHaveAttribute('type', 'button')
    await user.click(button)
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('空位按钮悬停时虚线变实、换成信号色', () => {
    render(<SquadSlot onAdd={() => {}} />)
    expect(screen.getByRole('button')).toHaveClass(
      'hover:border-solid',
      'hover:border-ark-signal',
      'hover:text-ark-signal-fg',
    )
  })

  it('addLabel 改空位按钮的名称', () => {
    render(<SquadSlot onAdd={() => {}} addLabel="选择干员" />)
    expect(screen.getByRole('button', { name: '选择干员' })).toBeInTheDocument()
  })

  it('有干员时放卡片，不再是空位', () => {
    render(
      <SquadSlot data-testid="slot" onAdd={() => {}}>
        <OperatorCard>占位干员甲</OperatorCard>
      </SquadSlot>,
    )
    const slot = screen.getByTestId('slot')
    expect(slot).not.toHaveAttribute('data-empty')
    expect(slot.querySelector('[data-ark="operator-card"]')).toHaveTextContent('占位干员甲')
    expect(screen.queryByRole('button', { name: '添加干员' })).not.toBeInTheDocument()
  })

  it('里面的卡片撑满这个位置的大小', () => {
    render(<SquadSlot data-testid="slot" className="w-32" />)
    const slot = screen.getByTestId('slot')
    expect(slot).toHaveClass('w-32', '*:size-full', '*:aspect-auto')
    expect(slot).not.toHaveClass('w-40')
  })
})
