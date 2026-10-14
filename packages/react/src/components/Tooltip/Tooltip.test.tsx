import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const advance = (ms: number) =>
    act(() => {
      vi.advanceTimersByTime(ms)
    })

  it('平时不在文档里；指针停够了时间才出现', () => {
    render(
      <Tooltip content="复制链接">
        <button type="button">复制</button>
      </Tooltip>,
    )
    const button = screen.getByRole('button', { name: '复制' })
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(button).not.toHaveAttribute('aria-describedby')

    fireEvent.pointerEnter(button)
    advance(299)
    expect(screen.queryByRole('tooltip')).toBeNull()
    advance(1)
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent('复制链接')
    expect(tooltip).toHaveAttribute('data-ark', 'tooltip')
    // 提示是元素的补充描述
    expect(button).toHaveAccessibleDescription('复制链接')
  })

  it('指针移开、按下都会消失；还没出现的也不再出现', () => {
    render(
      <Tooltip content="复制链接">
        <button type="button">复制</button>
      </Tooltip>,
    )
    const button = screen.getByRole('button')
    fireEvent.pointerEnter(button)
    advance(300)
    fireEvent.pointerLeave(button)
    expect(screen.queryByRole('tooltip')).toBeNull()

    fireEvent.pointerEnter(button)
    advance(100)
    fireEvent.pointerDown(button)
    advance(500)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('键盘聚焦时立刻出现，失焦消失', () => {
    render(
      <Tooltip content="复制链接">
        <button type="button">复制</button>
      </Tooltip>,
    )
    const button = screen.getByRole('button')
    // 真的把焦点移过去：组件要看它是不是 :focus-visible
    act(() => button.focus())
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    act(() => button.blur())
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('按 Esc 消失', () => {
    render(
      <Tooltip content="复制链接">
        <button type="button">复制</button>
      </Tooltip>,
    )
    act(() => screen.getByRole('button').focus())
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('保留被提示元素自己的事件和描述', () => {
    const onPointerEnter = vi.fn()
    const onFocus = vi.fn()
    render(
      <>
        <span id="own">已有的说明</span>
        <Tooltip content="复制链接" delay={0}>
          <button
            type="button"
            aria-describedby="own"
            onPointerEnter={onPointerEnter}
            onFocus={onFocus}
          >
            复制
          </button>
        </Tooltip>
      </>,
    )
    const button = screen.getByRole('button')
    fireEvent.pointerEnter(button)
    expect(onPointerEnter).toHaveBeenCalledTimes(1)
    expect(button).toHaveAccessibleDescription('已有的说明 复制链接')
    fireEvent.focus(button)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('disabled 或内容为空时不显示；触屏的“进入”不算悬停', () => {
    const { rerender } = render(
      <Tooltip content="复制链接" disabled delay={0}>
        <button type="button">复制</button>
      </Tooltip>,
    )
    fireEvent.pointerEnter(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).toBeNull()

    rerender(
      <Tooltip content="" delay={0}>
        <button type="button">复制</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).toBeNull()

    rerender(
      <Tooltip content="复制链接" delay={0}>
        <button type="button">复制</button>
      </Tooltip>,
    )
    fireEvent.pointerLeave(screen.getByRole('button'))
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'touch' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
