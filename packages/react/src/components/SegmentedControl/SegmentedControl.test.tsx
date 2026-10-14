import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Segment, SegmentedControl } from './SegmentedControl'

describe('SegmentedControl', () => {
  function Fps(props: { onValueChange?: (value: string) => void; disabled?: boolean }) {
    return (
      <SegmentedControl aria-label="帧率" name="fps" defaultValue="60" {...props}>
        <Segment value="30">30 FPS</Segment>
        <Segment value="60">60 FPS</Segment>
        <Segment value="120">120 FPS</Segment>
      </SegmentedControl>
    )
  }

  it('语义是单选组，每块是一个原生的单选框', () => {
    render(<Fps />)
    const group = screen.getByRole('radiogroup', { name: '帧率' })
    expect(group).toHaveAttribute('data-ark', 'segmented-control')
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: '60 FPS' })).toBeChecked()
  })

  it('点一块就选中它，并回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Fps onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '30 FPS' }))
    expect(screen.getByRole('radio', { name: '30 FPS' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '60 FPS' })).not.toBeChecked()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('30')
  })

  it('选中是整块换成信号色；默认的写法在块与块之间有一条线', () => {
    render(<Fps />)
    const block = screen.getByRole('radio', { name: '60 FPS' }).nextElementSibling
    expect(block).toHaveClass('peer-checked:bg-ark-signal', 'bg-ark-control')
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-variant', 'linked')
    expect(screen.getByRole('radio', { name: '60 FPS' }).parentElement?.className).toContain(
      'not-first:before:h-px',
    )
  })

  it('variant="joined" 连成一条，没有那条线', () => {
    render(
      <SegmentedControl aria-label="视图" variant="joined" defaultValue="list">
        <Segment value="list">列表</Segment>
        <Segment value="grid">网格</Segment>
      </SegmentedControl>,
    )
    expect(screen.getByRole('radiogroup')).toHaveClass('gap-0.5')
    expect(screen.getByRole('radio', { name: '网格' }).parentElement?.className).not.toContain(
      'before:',
    )
  })

  it('表单提交的是选中的值；整组禁用时每块都禁用', () => {
    const { rerender } = render(
      <form data-testid="form">
        <Fps />
      </form>,
    )
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('fps')).toBe('60')
    rerender(
      <form data-testid="form">
        <Fps disabled />
      </form>,
    )
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
  })

  it('脱离 SegmentedControl 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Segment value="x">孤立</Segment>)).toThrow(
      '<Segment> 必须放在 <SegmentedControl> 里',
    )
    error.mockRestore()
  })
})
