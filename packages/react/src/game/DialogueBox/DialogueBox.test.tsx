import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DialogueBox } from './DialogueBox'

const box = () => screen.getByTestId('box')

describe('DialogueBox', () => {
  it('没有框：一片自下而上的黑色渐变，贴在父元素底部', () => {
    render(
      <DialogueBox data-testid="box" speaker="占位干员甲">
        我们到了。
      </DialogueBox>,
    )
    expect(box()).toHaveAttribute('data-ark', 'dialogue-box')
    expect(box()).toHaveAttribute('data-ark-tone', 'dark')
    expect(box()).toHaveClass(
      'absolute',
      'inset-x-0',
      'bottom-0',
      'min-h-[35%]',
      'bg-linear-to-t',
      'from-ark-neutral-black',
      'to-transparent',
    )
    expect(box().className).not.toMatch(/(^|\s)(border|rounded)/)
  })

  it('说话人在左、较小、偏灰；正文在右、白色、行高 1.6', () => {
    render(
      <DialogueBox data-testid="box" speaker="占位干员甲">
        我们到了。
      </DialogueBox>,
    )
    const speaker = screen.getByText('占位干员甲')
    const line = screen.getByText('我们到了。')
    expect(speaker).toHaveClass('text-right', 'text-[1rem]', 'text-ark-fg-muted')
    expect(line).toHaveClass('text-ark-body-lg', 'leading-ark-body')
    expect(speaker.compareDocumentPosition(line) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('旁白没有说话人，那一格仍然留着', () => {
    render(<DialogueBox data-testid="box">风停了。</DialogueBox>)
    const line = screen.getByText('风停了。')
    expect(line.previousElementSibling?.tagName).toBe('P')
    expect(line.previousElementSibling).toBeEmptyDOMElement()
  })

  it('换下一句时新的内容会读给读屏', () => {
    render(<DialogueBox data-testid="box">风停了。</DialogueBox>)
    const region = screen.getByText('风停了。').parentElement
    expect(region).toHaveAttribute('aria-live', 'polite')
    expect(region).toHaveAttribute('aria-atomic', 'true')
  })

  it('竖屏时说话人挪到正文上方', () => {
    render(
      <DialogueBox data-testid="box" speaker="占位干员甲">
        我们到了。
      </DialogueBox>,
    )
    expect(screen.getByText('我们到了。').parentElement).toHaveClass('portrait:grid-cols-1')
    expect(screen.getByText('占位干员甲')).toHaveClass('portrait:text-left')
  })

  it('默认只是一段文字，不可点，也没有闪烁的三角', () => {
    render(<DialogueBox data-testid="box">风停了。</DialogueBox>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(box().querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('给了 onAdvance：整片文字区是一个按钮，点击和回车都能继续', async () => {
    const user = userEvent.setup()
    const onAdvance = vi.fn()
    render(
      <DialogueBox data-testid="box" onAdvance={onAdvance}>
        风停了。
      </DialogueBox>,
    )
    const button = screen.getByRole('button', { name: '继续' })
    expect(button).toHaveClass('absolute', 'inset-0')
    await user.click(button)
    expect(onAdvance).toHaveBeenCalledTimes(1)

    button.focus()
    await user.keyboard('{Enter}')
    expect(onAdvance).toHaveBeenCalledTimes(2)
  })

  it('可以继续时正文末尾有一个闪烁的三角，只在允许动效时闪', () => {
    render(
      <DialogueBox data-testid="box" onAdvance={() => {}}>
        风停了。
      </DialogueBox>,
    )
    const mark = screen.getByText('风停了。').querySelector('[aria-hidden="true"]')
    expect(mark).toHaveClass('text-ark-signal', 'motion-safe:animate-ark-blink')
    expect(mark?.className).not.toMatch(/(^|\s)animate-ark-blink/)
  })

  it('indicator 可以单独开关', () => {
    const { rerender } = render(
      <DialogueBox data-testid="box" onAdvance={() => {}} indicator={false}>
        风停了。
      </DialogueBox>,
    )
    expect(box().querySelector('[aria-hidden="true"]')).toBeNull()

    rerender(
      <DialogueBox data-testid="box" indicator>
        风停了。
      </DialogueBox>,
    )
    expect(box().querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('advanceLabel 改推进按钮的名称', () => {
    render(
      <DialogueBox onAdvance={() => {}} advanceLabel="下一句">
        风停了。
      </DialogueBox>,
    )
    expect(screen.getByRole('button', { name: '下一句' })).toBeInTheDocument()
  })
})
