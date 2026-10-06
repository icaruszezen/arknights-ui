import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RoomCard, roomSignal } from './RoomCard'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('RoomCard', () => {
  it('是一个直角矩形的房间：2px 信号色描边，深色上下文', () => {
    render(<RoomCard data-testid="room" title="制造站" sub="Factory" />)
    const room = screen.getByTestId('room')
    expect(room).toHaveAttribute('data-ark', 'room-card')
    expect(room).toHaveAttribute('data-ark-tone', 'dark')
    expect(room).toHaveClass('border-2', 'border-ark-signal')
    expect(room.className).not.toContain('rounded')
    expect(room).toHaveTextContent('制造站')
    expect(screen.getByText('Factory')).toHaveClass('font-ark-latin-condensed', 'uppercase')
  })

  it('kind 决定类型色：覆盖 --ark-signal', () => {
    const { rerender } = render(<RoomCard data-testid="room" title="制造站" kind="factory" />)
    const room = screen.getByTestId('room')
    expect(room).toHaveAttribute('data-kind', 'factory')
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-signal-action)]')

    rerender(<RoomCard data-testid="room" title="贸易站" kind="trading" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-signal-info-game)]')

    rerender(<RoomCard data-testid="room" title="发电站" kind="power" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-signal-success)]')

    rerender(<RoomCard data-testid="room" title="宿舍" kind="neutral" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-neutral-gray-400)]')
  })

  it('不给 kind 就沿用所在位置的信号色', () => {
    render(<RoomCard data-testid="room" title="会客室" />)
    expect(screen.getByTestId('room').className).not.toContain('[--ark-signal:')
  })

  it('roomSignal 导出同一套类名，给抽屉用', () => {
    expect(roomSignal.factory).toBe('[--ark-signal:var(--ark-color-signal-action)]')
    expect(Object.keys(roomSignal)).toEqual(['factory', 'trading', 'power', 'neutral'])
  })

  it('图标压在一块类型色的底上，对读屏隐藏', () => {
    render(<RoomCard title="制造站" icon={icon} />)
    const chip = screen.getByTestId('icon').parentElement
    expect(chip).toHaveClass('bg-ark-signal', 'text-ark-on-signal')
    expect(chip).toHaveAttribute('aria-hidden', 'true')
  })

  it('等级用数据体，写在标题行右端', () => {
    render(<RoomCard title="制造站" level={3} />)
    const level = screen.getByText('3')
    expect(level).toHaveClass('font-ark-data', 'font-ark-bold', 'text-ark-signal-fg')
    expect(level.parentElement).toHaveClass('ml-auto')
  })

  it('内景图垫在最底层并压暗', () => {
    render(<RoomCard data-testid="room" title="制造站" src="/room.png" />)
    const image = screen.getByTestId('room').querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('-z-1', 'opacity-35', 'object-cover')
  })

  it('默认只是一块内容，不可点', () => {
    render(
      <RoomCard data-testid="room" title="制造站">
        <span>进驻 2/3</span>
      </RoomCard>,
    )
    const room = screen.getByTestId('room')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(room).toHaveTextContent('进驻 2/3')
    expect(room.innerHTML).not.toContain('hover:')
  })

  it('给了 onClick 整张卡片是一个按钮，名称来自标题行', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <RoomCard title="制造站" sub="Factory" level={3} onClick={onClick}>
        <span>进驻 2/3</span>
      </RoomCard>,
    )
    const button = screen.getByRole('button', { name: '制造站 Factory LV 3' })
    expect(button).toHaveAttribute('type', 'button')
    // 点击区是盖在上面的一层，里面的内容不在按钮里，读屏仍然能逐项读到
    expect(button).toBeEmptyDOMElement()
    expect(button).toHaveClass('absolute', 'inset-0', 'z-1')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('给了 href 整张卡片是链接', () => {
    render(<RoomCard title="贸易站" sub="Trading Post" href="#trading" />)
    const link = screen.getByRole('link', { name: '贸易站 Trading Post' })
    expect(link).toHaveAttribute('href', '#trading')
    expect(link).toHaveClass('focus-visible:-outline-offset-2')
  })

  it('可点时悬停底色染上类型色、标题变色', () => {
    render(<RoomCard data-testid="room" title="制造站" onClick={() => {}} />)
    expect(screen.getByTestId('room')).toHaveClass('hover:bg-ark-signal/25')
    expect(screen.getByText('制造站')).toHaveClass('group-hover:text-ark-signal-fg')
  })

  it('badge 是右上角的红点或数量', () => {
    const { rerender } = render(
      <RoomCard data-testid="room" title="制造站" badge badgeLabel="有可收取的产出" />,
    )
    expect(screen.getByRole('img', { name: '有可收取的产出' })).toHaveClass(
      'absolute',
      'top-ark-1',
      'right-ark-1',
    )

    rerender(<RoomCard data-testid="room" title="贸易站" badge={2} />)
    expect(screen.getByTestId('room').querySelector('[data-ark="badge"]')).toHaveTextContent('2')

    rerender(<RoomCard data-testid="room" title="贸易站" badge={0} />)
    expect(screen.getByTestId('room').querySelector('[data-ark="badge"]')).toBeNull()
  })
})
