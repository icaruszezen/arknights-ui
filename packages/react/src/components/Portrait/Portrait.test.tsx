import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portrait } from './Portrait'

describe('Portrait', () => {
  it('根元素是裁切框，里面是一张带替代文字的图', () => {
    render(<Portrait data-testid="portrait" src="/art.png" alt="近卫干员" />)
    const portrait = screen.getByTestId('portrait')
    expect(portrait).toHaveAttribute('data-ark', 'portrait')
    expect(portrait).toHaveClass('relative', 'overflow-hidden')

    const image = screen.getByRole('img', { name: '近卫干员' })
    expect(image).toHaveAttribute('src', '/art.png')
    expect(portrait.querySelectorAll('img')).toHaveLength(1)
  })

  it('全身：图比框高出一截并贴顶，腿部被框切掉', () => {
    render(<Portrait data-testid="portrait" src="/art.png" alt="立绘" />)
    expect(screen.getByTestId('portrait')).toHaveClass('aspect-[1/2]')
    expect(screen.getByRole('img')).toHaveClass(
      'top-0',
      'h-[calc(100%+var(--ark-portrait-bleed,15%))]',
      'object-contain',
      'object-top',
    )
  })

  it('胸像：铺满框，脸落在上三分之一', () => {
    render(<Portrait data-testid="portrait" src="/art.png" alt="立绘" crop="bust" />)
    expect(screen.getByTestId('portrait')).toHaveClass('aspect-[3/4]')
    const image = screen.getByRole('img')
    expect(image).toHaveClass('h-full', 'object-cover', 'object-[50%_15%]')
    expect(image).not.toHaveClass('object-contain')
  })

  it('默认带向左下的投影，可以关掉', () => {
    const { rerender } = render(<Portrait src="/art.png" alt="立绘" />)
    expect(screen.getByRole('img')).toHaveClass('drop-shadow-ark-drop')

    rerender(<Portrait src="/art.png" alt="立绘" shadow={false} />)
    expect(screen.getByRole('img')).not.toHaveClass('drop-shadow-ark-drop')
  })

  it('重影是同一张图的放大去色版，垫在后面，对读屏隐藏', () => {
    render(<Portrait data-testid="portrait" src="/art.png" alt="立绘" ghost />)
    const [ghost, main] = [...screen.getByTestId('portrait').querySelectorAll('img')]
    expect(main).toHaveAttribute('alt', '立绘')

    expect(ghost).toHaveAttribute('src', '/art.png')
    expect(ghost).toHaveAttribute('alt', '')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveClass('-z-1', 'scale-[2.4]', 'grayscale', 'opacity-[0.07]')
    expect(ghost).toHaveClass('pointer-events-none')
    // 投影只给主图
    expect(ghost).not.toHaveClass('drop-shadow-ark-drop')
    expect(screen.getAllByRole('img')).toHaveLength(1)
  })

  it('图片的加载属性传给图，其余属性留在根元素上', () => {
    render(
      <Portrait
        data-testid="portrait"
        src="/art.png"
        alt="立绘"
        srcSet="/art@2x.png 2x"
        sizes="50vw"
        loading="lazy"
        decoding="async"
        id="assistant"
      />,
    )
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('srcset', '/art@2x.png 2x')
    expect(image).toHaveAttribute('sizes', '50vw')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(screen.getByTestId('portrait')).toHaveAttribute('id', 'assistant')
  })

  it('框的大小和位置用 className 定', () => {
    render(
      <Portrait
        data-testid="portrait"
        src="/art.png"
        alt="立绘"
        className="absolute right-0 h-full w-1/2"
      />,
    )
    const portrait = screen.getByTestId('portrait')
    expect(portrait).toHaveClass('absolute', 'right-0', 'h-full', 'w-1/2')
    expect(portrait).not.toHaveClass('relative')
  })
})
