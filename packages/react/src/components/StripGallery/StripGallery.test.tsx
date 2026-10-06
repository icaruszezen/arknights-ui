import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Strip, StripGallery } from './StripGallery'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('StripGallery', () => {
  it('是一个列表，每条竖带各占一项', () => {
    render(
      <StripGallery aria-label="更多内容">
        <Strip src="/a.png" href="#a">
          集成战略
        </Strip>
        <Strip src="/b.png" href="#b">
          生息演算
        </Strip>
        {false}
      </StripGallery>,
    )
    const list = screen.getByRole('list', { name: '更多内容' })
    expect(list).toHaveAttribute('data-ark', 'strip-gallery')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('等宽并排，竖屏改为纵向堆叠', () => {
    render(<StripGallery data-testid="gallery" />)
    expect(screen.getByTestId('gallery')).toHaveClass(
      'grid-flow-col',
      'auto-cols-fr',
      'portrait:grid-flow-row',
    )
  })
})

describe('Strip', () => {
  it('给了 href 是链接，名称来自标题、英文和 VIEW MORE', () => {
    render(
      <Strip src="/a.png" href="#is" icon={icon} sub="INTEGRATED STRATEGIES">
        集成战略
      </Strip>,
    )
    const strip = screen.getByRole('link', { name: '集成战略 INTEGRATED STRATEGIES VIEW MORE' })
    expect(strip).toHaveAttribute('href', '#is')
    expect(strip).toHaveAttribute('data-ark', 'strip')
    expect(strip).toHaveAttribute('data-ark-tone', 'dark')
    expect(strip).toContainElement(screen.getByTestId('icon'))
  })

  it('没有 href 时只是一块内容，没有悬停反馈', () => {
    render(
      <Strip data-testid="strip" src="/a.png">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    expect(strip.tagName).toBe('DIV')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(strip.innerHTML).not.toContain('group-hover:')
  })

  it('是链接时悬停会恢复饱和度，文字和横线变成信号色', () => {
    render(
      <Strip data-testid="strip" src="/a.png" href="#is">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    const image = strip.querySelector('img')
    expect(image).toHaveClass('saturate-[0.7]', 'group-hover:saturate-100')
    expect(screen.getByText('集成战略').closest('[data-ark="icon-title"]')).toHaveClass(
      'group-hover:text-ark-signal-fg',
    )
    expect(strip.lastElementChild).toHaveClass('group-hover:w-full', 'group-hover:bg-ark-signal')
  })

  it('图片默认是陪衬，铺满并垫在遮罩下面', () => {
    render(
      <Strip data-testid="strip" src="/a.png">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    const image = strip.querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover', '-z-2')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    const scrim = strip.querySelector('[data-ark="scrim"]')
    expect(scrim).toHaveAttribute('aria-hidden', 'true')
    expect(scrim).toHaveClass('-z-1')
  })

  it('alt 和 position 传给图片', () => {
    render(
      <Strip src="/a.png" alt="集成战略的主视觉" position="30% 20%">
        集成战略
      </Strip>,
    )
    const image = screen.getByRole('img', { name: '集成战略的主视觉' })
    expect(image.style.objectPosition).toBe('30% 20%')
  })

  it('VIEW MORE 的文字可以改，也可以去掉', () => {
    const { rerender } = render(
      <Strip src="/a.png" more="了解更多">
        集成战略
      </Strip>,
    )
    expect(screen.getByText('了解更多')).toBeInTheDocument()
    expect(screen.queryByText('VIEW MORE')).not.toBeInTheDocument()

    rerender(
      <Strip src="/a.png" more={null}>
        集成战略
      </Strip>,
    )
    expect(screen.queryByText('了解更多')).not.toBeInTheDocument()
    expect(screen.queryByText('VIEW MORE')).not.toBeInTheDocument()
  })

  it('默认是 2:5 的竖条，竖屏变成横带', () => {
    render(
      <Strip data-testid="strip" src="/a.png">
        集成战略
      </Strip>,
    )
    expect(screen.getByTestId('strip')).toHaveClass('aspect-[2/5]', 'portrait:aspect-[5/2]')
  })
})
