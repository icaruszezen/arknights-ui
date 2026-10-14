import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UnitBar } from './UnitBar'

const fillOf = (bar: HTMLElement) => bar.firstElementChild as HTMLElement

describe('UnitBar', () => {
  it('默认只有一条生命条：4px、直角、黑色轨道', () => {
    render(<UnitBar data-testid="unit" value={76} />)
    const unit = screen.getByTestId('unit')
    expect(unit).toHaveAttribute('data-ark', 'unit-bar')
    expect(unit).toHaveAttribute('data-side', 'ally')

    const bars = screen.getAllByRole('progressbar')
    expect(bars).toHaveLength(1)
    const life = screen.getByRole('progressbar', { name: '生命' })
    expect(life).toHaveClass('h-1', 'bg-ark-neutral-black')
    expect(life).toHaveAttribute('aria-valuenow', '76')
    expect(life).toHaveAttribute('aria-valuemax', '100')
    expect(fillOf(life).style.width).toBe('76%')
    expect(unit.innerHTML).not.toContain('rounded')
  })

  it('我方蓝、敌方红', () => {
    const { rerender } = render(<UnitBar value={50} />)
    expect(fillOf(screen.getByRole('progressbar'))).toHaveClass('bg-ark-tier-3')

    rerender(<UnitBar data-testid="unit" value={50} side="enemy" />)
    expect(screen.getByTestId('unit')).toHaveAttribute('data-side', 'enemy')
    expect(fillOf(screen.getByRole('progressbar'))).toHaveClass('bg-ark-signal-danger')
  })

  it('给了 skill 才画技力条：3px，在生命条下面，颜色不同', () => {
    render(<UnitBar value={76} skill={18} skillMax={34} />)
    const [life, skill] = screen.getAllByRole('progressbar')
    expect(life).toHaveAccessibleName('生命')
    expect(skill).toHaveAccessibleName('技力')
    expect(skill).toHaveClass('h-[3px]', 'bg-ark-neutral-black')
    expect(skill).toHaveAttribute('aria-valuenow', '18')
    expect(skill).toHaveAttribute('aria-valuemax', '34')
    expect(fillOf(skill as HTMLElement)).toHaveClass('bg-ark-tier-2')
    expect(fillOf(skill as HTMLElement).style.width).toBe(`${(18 / 34) * 100}%`)
  })

  it('skill 为 0 时仍然画出空的技力条', () => {
    render(<UnitBar value={76} skill={0} />)
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })

  it('越界的值被限制在范围内', () => {
    render(<UnitBar value={180} max={120} skill={-5} />)
    const [life, skill] = screen.getAllByRole('progressbar')
    expect(life).toHaveAttribute('aria-valuenow', '120')
    expect(fillOf(life as HTMLElement).style.width).toBe('100%')
    expect(skill).toHaveAttribute('aria-valuenow', '0')
  })

  it('两条的名称都可以改', () => {
    render(<UnitBar value={50} skill={10} label="占位干员甲的生命" skillLabel="占位干员甲的技力" />)
    expect(screen.getByRole('progressbar', { name: '占位干员甲的生命' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '占位干员甲的技力' })).toBeInTheDocument()
  })

  it('宽度变化的过渡在减少动效时关闭', () => {
    render(<UnitBar value={50} />)
    expect(fillOf(screen.getByRole('progressbar'))).toHaveClass(
      'transition-[width]',
      'motion-reduce:transition-none',
    )
  })

  it('默认 2.5rem 宽，可以用类覆盖', () => {
    const { rerender } = render(<UnitBar data-testid="unit" value={50} />)
    expect(screen.getByTestId('unit')).toHaveClass('w-10')

    rerender(<UnitBar data-testid="unit" value={50} className="w-16" />)
    expect(screen.getByTestId('unit')).toHaveClass('w-16')
    expect(screen.getByTestId('unit')).not.toHaveClass('w-10')
  })
})
