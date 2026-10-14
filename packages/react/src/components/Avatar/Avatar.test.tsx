import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('有图片时名称来自图片的 alt', () => {
    render(<Avatar src="/amiya.png" name="Amiya" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toHaveAttribute('data-ark', 'avatar')
    expect(avatar).not.toHaveAttribute('role')
    expect(screen.getByRole('img', { name: 'Amiya' })).toHaveAttribute('src', '/amiya.png')
  })

  it('没有图片时显示名字的头两个字符，整块当一张图', () => {
    render(<Avatar name="closure" />)
    const avatar = screen.getByRole('img', { name: 'closure' })
    expect(avatar).toHaveTextContent('CL')
    expect(avatar.querySelector('img')).toBeNull()
  })

  it('图片加载失败时退回到缩写', () => {
    render(<Avatar src="/missing.png" name="博士" />)
    fireEvent.error(screen.getByRole('img', { name: '博士' }))
    expect(screen.getByRole('img', { name: '博士' })).toHaveTextContent('博士')
    expect(screen.getByRole('img', { name: '博士' }).querySelector('img')).toBeNull()
  })

  it('没有名字时只是装饰；fallback 代替缩写', () => {
    render(<Avatar data-testid="avatar" fallback={<svg data-testid="glyph" />} />)
    expect(screen.getByTestId('avatar')).not.toHaveAttribute('role')
    expect(screen.getByTestId('glyph').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('状态角标默认是装饰，给了 statusLabel 才读出来', () => {
    const { container, rerender } = render(<Avatar name="Amiya" status="online" />)
    const mark = () => container.querySelector('[data-ark="avatar-status"]')
    expect(mark()).toHaveAttribute('aria-hidden', 'true')
    expect(mark()).toHaveAttribute('data-status', 'online')

    rerender(<Avatar name="Amiya" status="offline" statusLabel="离线" />)
    expect(screen.getByRole('img', { name: '离线' })).toBe(mark())
    // 离线是空心的框，不只靠颜色
    expect(mark()).toHaveClass('border')
  })

  it('默认是直角的方块；ring 套一圈信号色的框', () => {
    const { rerender } = render(<Avatar name="Amiya" />)
    expect(screen.getByRole('img')).not.toHaveClass('rounded-full')
    rerender(<Avatar name="Amiya" shape="circle" ring size="lg" />)
    expect(screen.getByRole('img')).toHaveClass('rounded-full', 'outline-ark-signal', 'size-14')
  })
})
