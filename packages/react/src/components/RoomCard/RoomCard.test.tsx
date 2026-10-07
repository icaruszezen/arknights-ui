import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RoomCard, roomSignal } from './RoomCard'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('RoomCard', () => {
  it('是一个直角矩形的房间：深色实底，左侧一条类型色的粗边，深色上下文', () => {
    render(<RoomCard data-testid="room" title="制造站" sub="Factory" />)
    const room = screen.getByTestId('room')
    expect(room).toHaveAttribute('data-ark', 'room-card')
    expect(room).toHaveAttribute('data-ark-tone', 'dark')
    expect(room).toHaveClass(
      'border-0',
      'border-l-[0.75rem]',
      'border-ark-signal',
      'bg-ark-neutral-ink-800',
    )
    // 不再是四边一圈的描边
    expect(room).not.toHaveClass('border-2')
    expect(room.className).not.toContain('rounded')
    expect(room).toHaveTextContent('制造站')
    expect(screen.getByText('Factory')).toHaveClass('font-ark-latin-condensed', 'uppercase')
  })

  it('kind 决定类型色：覆盖 --ark-signal，取实机的三种设施色', () => {
    const { rerender } = render(<RoomCard data-testid="room" title="制造站" kind="factory" />)
    const room = screen.getByTestId('room')
    expect(room).toHaveAttribute('data-kind', 'factory')
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-facility-factory)]')

    rerender(<RoomCard data-testid="room" title="贸易站" kind="trading" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-facility-trading)]')

    rerender(<RoomCard data-testid="room" title="发电站" kind="power" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-facility-power)]')

    rerender(<RoomCard data-testid="room" title="宿舍" kind="neutral" />)
    expect(room).toHaveClass('[--ark-signal:var(--ark-color-neutral-gray-400)]')
  })

  it('不给 kind 就沿用所在位置的信号色', () => {
    render(<RoomCard data-testid="room" title="会客室" />)
    expect(screen.getByTestId('room').className).not.toContain('[--ark-signal:')
  })

  it('roomSignal 导出同一套类名，给抽屉用', () => {
    expect(roomSignal.factory).toBe('[--ark-signal:var(--ark-color-facility-factory)]')
    expect(Object.keys(roomSignal)).toEqual(['factory', 'trading', 'power', 'neutral'])
  })

  it('图标压在一块类型色的底上，对读屏隐藏', () => {
    render(<RoomCard title="制造站" icon={icon} />)
    const chip = screen.getByTestId('icon').parentElement
    expect(chip).toHaveClass('bg-ark-signal', 'text-ark-on-signal')
    expect(chip).toHaveAttribute('aria-hidden', 'true')
  })

  it('等级是标题后面几颗类型色的小竖条，数字只读给读屏', () => {
    render(<RoomCard title="制造站" level={3} />)
    const spoken = screen.getByText('等级 3')
    expect(spoken).toHaveClass('sr-only')
    const pips = Array.from(spoken.parentElement?.querySelectorAll('[aria-hidden="true"]') ?? [])
    expect(pips).toHaveLength(3)
    for (const pip of pips) {
      expect(pip).toHaveClass('h-[0.5625rem]', 'w-[0.1875rem]', 'bg-ark-signal')
    }
    // 紧跟在标题后面
    expect(spoken.parentElement?.previousElementSibling).toHaveTextContent('制造站')
  })

  it('小竖条最多五颗，更高的等级仍然如实读出', () => {
    render(<RoomCard title="控制中枢" level={8} />)
    const spoken = screen.getByText('等级 8')
    expect(spoken.parentElement?.querySelectorAll('[aria-hidden="true"]')).toHaveLength(5)
  })

  it('status 是标题下面一行类型色的小字', () => {
    render(<RoomCard title="制造站" status="生产中" />)
    const status = screen.getByText('生产中')
    expect(status).toHaveClass('text-ark-caption', 'font-ark-bold', 'text-ark-signal-fg')
    expect(status.previousElementSibling).toHaveTextContent('制造站')
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
    const button = screen.getByRole('button', { name: '制造站 等级 3 Factory' })
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

  it('可点时悬停底色染上类型色（仍然不透明）、标题变色', () => {
    render(<RoomCard data-testid="room" title="制造站" onClick={() => {}} />)
    expect(screen.getByTestId('room')).toHaveClass(
      'hover:bg-[color-mix(in_srgb,var(--ark-signal)_25%,var(--ark-color-neutral-ink-800))]',
    )
    expect(screen.getByText('制造站')).toHaveClass('group-hover:text-ark-signal-fg')
  })

  it('有待处理的事时整张卡片被类型色圈起来，平时没有这一圈', () => {
    const { rerender } = render(<RoomCard data-testid="room" title="贸易站" badge />)
    expect(screen.getByTestId('room')).toHaveClass('shadow-[inset_0_0_0_2px_var(--ark-signal)]')

    rerender(<RoomCard data-testid="room" title="贸易站" badge={2} />)
    expect(screen.getByTestId('room')).toHaveClass('shadow-[inset_0_0_0_2px_var(--ark-signal)]')

    rerender(<RoomCard data-testid="room" title="贸易站" badge={0} />)
    expect(screen.getByTestId('room').className).not.toContain('shadow-[inset')
  })

  it('badge 是右上角的提醒标记或数量', () => {
    const { rerender } = render(
      <RoomCard data-testid="room" title="制造站" badge badgeLabel="有可收取的产出" />,
    )
    expect(screen.getByRole('img', { name: '有可收取的产出' })).toHaveClass(
      'absolute',
      'top-0',
      'right-0',
      'rotate-45',
    )

    rerender(<RoomCard data-testid="room" title="贸易站" badge={2} />)
    expect(screen.getByTestId('room').querySelector('[data-ark="badge"]')).toHaveTextContent('2')

    rerender(<RoomCard data-testid="room" title="贸易站" badge={0} />)
    expect(screen.getByTestId('room').querySelector('[data-ark="badge"]')).toBeNull()
  })
})
