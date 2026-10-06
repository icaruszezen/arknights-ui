import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon, Watermark } from './Icon'

const glyph = (
  <svg aria-hidden="true" data-testid="glyph" viewBox="0 0 24 24">
    <path d="M12 3 21 21H3z" fill="currentColor" />
  </svg>
)

describe('Icon', () => {
  it('默认是装饰：对读屏隐藏，1em 见方', () => {
    render(<Icon data-testid="icon">{glyph}</Icon>)
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('data-ark', 'icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).not.toHaveAttribute('role')
    expect(icon).toHaveClass('size-[1em]')
  })

  it('给了 label 就是一张有名称的图片', () => {
    render(<Icon label="近卫">{glyph}</Icon>)
    const icon = screen.getByRole('img', { name: '近卫' })
    expect(icon).not.toHaveAttribute('aria-hidden')
  })

  it('内联 SVG 铺满画板，端点和转角统一成平头、尖角', () => {
    render(<Icon>{glyph}</Icon>)
    const box = screen.getByTestId('glyph').parentElement
    expect(box).toHaveClass(
      'size-full',
      '[&>svg]:size-full',
      '[&_*]:[stroke-linecap:butt]',
      '[&_*]:[stroke-linejoin:miter]',
    )
  })

  it('方框画在根元素上，图形缩到 70%', () => {
    render(
      <Icon data-testid="icon" frame="square">
        {glyph}
      </Icon>,
    )
    expect(screen.getByTestId('icon')).toHaveClass('border-current')
    expect(screen.getByTestId('glyph').parentElement).toHaveClass('size-[70%]')
  })

  it('三角框是一张单独的 SVG，图形缩小并下移到重心附近', () => {
    render(
      <Icon data-testid="icon" frame="triangle">
        {glyph}
      </Icon>,
    )
    const icon = screen.getByTestId('icon')
    expect(icon).not.toHaveClass('border-current')
    const frame = icon.querySelector(':scope > svg')
    expect(frame).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('glyph').parentElement).toHaveClass('size-[40%]', 'translate-y-[30%]')
  })

  it('src 用遮罩取剪影，填成当前文字色，并忽略 children', () => {
    render(
      <Icon data-testid="icon" src="/emblem.png">
        {glyph}
      </Icon>,
    )
    expect(screen.queryByTestId('glyph')).not.toBeInTheDocument()
    const box = screen.getByTestId('icon').lastElementChild as HTMLElement
    expect(box).toHaveClass('bg-current', '[mask-size:contain]')
    expect(box.style.maskImage).toBe('url("/emblem.png")')
  })

  it('大小和颜色用 className 改', () => {
    render(
      <Icon data-testid="icon" className="size-6 text-ark-signal">
        {glyph}
      </Icon>,
    )
    const icon = screen.getByTestId('icon')
    expect(icon).toHaveClass('size-6', 'text-ark-signal')
    expect(icon).not.toHaveClass('size-[1em]')
  })
})

describe('Watermark', () => {
  it('是垫在内容下面的装饰：隐藏、不接收点击、压低不透明度', () => {
    render(<Watermark data-testid="mark">{glyph}</Watermark>)
    const mark = screen.getByTestId('mark')
    expect(mark).toHaveAttribute('data-ark', 'watermark')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveClass('pointer-events-none', 'absolute', '-z-1', 'opacity-10', 'h-[90%]')
  })

  it('颜色跟随明暗上下文', () => {
    render(<Watermark data-testid="mark">{glyph}</Watermark>)
    expect(screen.getByTestId('mark')).toHaveClass('text-ark-fg')
  })

  it('position 决定压在哪一边', () => {
    const { rerender } = render(<Watermark data-testid="mark">{glyph}</Watermark>)
    expect(screen.getByTestId('mark')).toHaveClass('right-ark-4')

    rerender(
      <Watermark data-testid="mark" position="left">
        {glyph}
      </Watermark>,
    )
    expect(screen.getByTestId('mark')).toHaveClass('left-ark-4')

    rerender(
      <Watermark data-testid="mark" position="center">
        {glyph}
      </Watermark>,
    )
    expect(screen.getByTestId('mark')).toHaveClass('left-1/2', '-translate-x-1/2')
  })

  it('高度和不透明度可以覆盖，也支持图片', () => {
    render(<Watermark data-testid="mark" src="/emblem.png" className="h-[120%] opacity-5" />)
    const mark = screen.getByTestId('mark')
    expect(mark).toHaveClass('h-[120%]', 'opacity-5')
    expect(mark).not.toHaveClass('h-[90%]', 'opacity-10')
    expect((mark.firstElementChild as HTMLElement).style.maskImage).toBe('url("/emblem.png")')
  })
})
