import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SkillSlot } from './SkillSlot'

const glyph = <svg aria-hidden="true" data-testid="glyph" viewBox="0 0 24 24" />

describe('SkillSlot', () => {
  it('默认只是展示用的方格：黑半透明底加细描边', () => {
    render(<SkillSlot data-testid="slot">{glyph}</SkillSlot>)
    const slot = screen.getByTestId('slot')
    expect(slot.tagName).toBe('DIV')
    expect(slot).toHaveAttribute('data-ark', 'skill-slot')
    expect(slot).toHaveAttribute('data-ark-tone', 'dark')
    expect(slot).toHaveClass('size-16', 'border', 'border-ark-rule', 'bg-ark-neutral-black/50')
    expect(slot).toContainElement(screen.getByTestId('glyph'))
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('给了 onClick 是按钮，名称是 label 加上看得见的 rank', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SkillSlot label="技能 2" rank="RANK 7" onClick={onClick}>
        {glyph}
      </SkillSlot>,
    )
    const button = screen.getByRole('button', { name: '技能 2 RANK 7' })
    expect(screen.getByText('技能 2')).toHaveClass('sr-only')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('图片的 alt 也可以当名称', () => {
    render(
      <SkillSlot onClick={() => {}}>
        <img src="/skill.png" alt="强力击" />
      </SkillSlot>,
    )
    expect(screen.getByRole('button', { name: '强力击' })).toBeInTheDocument()
  })

  it('选中：信号色描边，右上角一块信号色三角加对勾，按钮输出 aria-pressed', () => {
    render(
      <SkillSlot label="技能 3" selected onClick={() => {}}>
        {glyph}
      </SkillSlot>,
    )
    const button = screen.getByRole('button', { pressed: true })
    expect(button).toHaveClass('border-ark-signal')
    expect(button).not.toHaveClass('border-ark-rule')
    expect(button.className).not.toContain('shadow-[inset')

    const mark = button.querySelector('[data-ark="skill-slot-mark"]')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveClass(
      'top-0',
      'right-0',
      'size-6',
      'bg-ark-signal',
      'text-ark-on-signal',
      '[clip-path:polygon(0_0,100%_0,100%_100%)]',
    )
    expect(mark?.querySelector('svg')).toBeInTheDocument()
    // 标记是装饰，不进入名称
    expect(button).toHaveAccessibleName('技能 3')
  })

  it('没选中时没有角标', () => {
    render(<SkillSlot data-testid="slot">{glyph}</SkillSlot>)
    expect(screen.getByTestId('slot').querySelector('[data-ark="skill-slot-mark"]')).toBeNull()
  })

  it('展示用的方格选中时带 data-selected', () => {
    const { rerender } = render(<SkillSlot data-testid="slot" selected />)
    expect(screen.getByTestId('slot')).toHaveAttribute('data-selected')
    expect(screen.getByTestId('slot')).toHaveClass('border-ark-signal')

    rerender(<SkillSlot data-testid="slot" />)
    expect(screen.getByTestId('slot')).not.toHaveAttribute('data-selected')
  })

  it('rank 写在左下角，选中时跟着变成信号色', () => {
    const { rerender } = render(<SkillSlot rank="RANK 7">{glyph}</SkillSlot>)
    const rank = screen.getByText('RANK 7')
    expect(rank).toHaveClass('absolute', 'bottom-0', 'left-0', 'font-ark-data')
    expect(rank).not.toHaveClass('text-ark-signal-fg')

    rerender(
      <SkillSlot rank="M3" selected>
        {glyph}
      </SkillSlot>,
    )
    expect(screen.getByText('M3')).toHaveClass('text-ark-signal-fg')
  })

  it('按钮悬停时描边和底色一起变，禁用时不响应', () => {
    render(
      <SkillSlot label="技能 1" onClick={() => {}} disabled>
        {glyph}
      </SkillSlot>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'hover:border-ark-fg',
      'hover:bg-ark-neutral-black/80',
      'disabled:cursor-not-allowed',
    )
  })

  it('大小可以用类覆盖', () => {
    render(<SkillSlot data-testid="slot" className="size-12" />)
    const slot = screen.getByTestId('slot')
    expect(slot).toHaveClass('size-12')
    expect(slot).not.toHaveClass('size-16')
  })
})
