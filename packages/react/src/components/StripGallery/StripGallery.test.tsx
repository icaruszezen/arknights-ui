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

  it('等宽并排、没有间缝，竖屏改为纵向堆叠', () => {
    render(<StripGallery data-testid="gallery" />)
    const gallery = screen.getByTestId('gallery')
    expect(gallery).toHaveClass('grid-flow-col', 'auto-cols-fr', 'portrait:grid-flow-row')
    expect(gallery.className).not.toMatch(/(^|\s)gap-/)
  })
})

describe('Strip', () => {
  it('给了 href 是链接，名称来自标题、英文和 VIEW MORE', () => {
    render(
      <Strip src="/a.png" href="#is" icon={icon} sub="INTEGRATED STRATEGIES">
        集成战略
      </Strip>,
    )
    const strip = screen.getByRole('link', { name: '集成战略 INTEGRATED STRATEGIES VIEW MORE >' })
    expect(strip).toHaveAttribute('href', '#is')
    expect(strip).toHaveAttribute('data-ark', 'strip')
    expect(strip).toHaveAttribute('data-ark-tone', 'dark')
    expect(strip).toContainElement(screen.getByTestId('icon'))
  })

  it('没有 href 时只是一块内容，没有悬停反馈', () => {
    render(
      <Strip data-testid="strip" src="/a.png" tint="#4c2b2a">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    expect(strip.tagName).toBe('DIV')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(strip.innerHTML).not.toContain('group-hover:')
    expect(strip.querySelector('[data-ark="strip-wash"]')).toBeNull()
  })

  it('是链接时悬停把图片放大、退掉暗层；文字和横线不变', () => {
    render(
      <Strip data-testid="strip" src="/a.png" href="#is">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    const image = strip.querySelector('img')
    expect(image).toHaveClass('motion-safe:group-hover:scale-110')
    // 放大是位移类的动效，减少动效时不做
    expect(image?.className).not.toMatch(/(^|\s)group-hover:scale/)
    expect(image?.className).not.toContain('saturate')
    expect(strip.querySelector('[data-ark="strip-veil"]')).toHaveClass(
      'opacity-20',
      'group-hover:opacity-0',
    )

    const title = screen.getByText('集成战略').closest('[data-ark="icon-title"]')
    expect(title?.className).not.toContain('group-hover:')
    expect(strip.querySelector('[data-ark="strip-rule"]')?.className).not.toContain('group-hover:')
  })

  it('tint 是一道主题色带；悬停浮起的那层默认同色，hoverTint 另给', () => {
    const { rerender } = render(
      <Strip data-testid="strip" src="/a.png" href="#is">
        集成战略
      </Strip>,
    )
    const part = (name: string) =>
      screen.getByTestId('strip').querySelector<HTMLElement>(`[data-ark="strip-${name}"]`)
    expect(part('tint')).toBeNull()
    expect(part('wash')).toBeNull()

    rerender(
      <Strip data-testid="strip" src="/a.png" href="#is" tint="rgb(76, 43, 42)">
        集成战略
      </Strip>,
    )
    expect(part('tint')).toHaveAttribute('aria-hidden', 'true')
    expect(part('tint')?.style.color).toBe('rgb(76, 43, 42)')
    expect(part('tint')).toHaveClass('opacity-70')
    expect(part('wash')?.style.color).toBe('rgb(76, 43, 42)')
    expect(part('wash')).toHaveClass('opacity-0', 'group-hover:opacity-50')

    rerender(
      <Strip
        data-testid="strip"
        src="/a.png"
        href="#is"
        tint="rgb(76, 43, 42)"
        hoverTint="rgb(199, 21, 30)"
      >
        集成战略
      </Strip>,
    )
    expect(part('tint')?.style.color).toBe('rgb(76, 43, 42)')
    expect(part('wash')?.style.color).toBe('rgb(199, 21, 30)')
  })

  it('图片默认是陪衬，铺满并垫在最下面；上面压四道黑色渐变', () => {
    render(
      <Strip data-testid="strip" src="/a.png">
        集成战略
      </Strip>,
    )
    const strip = screen.getByTestId('strip')
    const image = strip.querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover')
    expect(strip.firstElementChild).toBe(image)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    const shade = strip.querySelector('[data-ark="strip-shade"]')
    expect(shade).toHaveAttribute('aria-hidden', 'true')
    expect(shade?.className.match(/linear-gradient/g)?.length).toBeGreaterThanOrEqual(4)
    // 不再套通用的遮罩组件
    expect(strip.querySelector('[data-ark="scrim"]')).toBeNull()
  })

  it('图标挂在文字列的左边外面，标题的字号跟着条带的宽度走', () => {
    render(
      <Strip data-testid="strip" src="/a.png" icon={icon} sub="INTEGRATED STRATEGIES">
        集成战略
      </Strip>,
    )
    expect(screen.getByTestId('strip')).toHaveClass('@container')
    const title = screen.getByText('集成战略').closest('[data-ark="icon-title"]')
    expect(title).toHaveClass('text-[length:clamp(1rem,11.25cqw,3.375rem)]')
    expect(screen.getByTestId('icon').parentElement).toHaveClass('absolute', 'right-full')
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
    expect(screen.queryByText('VIEW MORE >')).not.toBeInTheDocument()

    rerender(
      <Strip src="/a.png" more={null}>
        集成战略
      </Strip>,
    )
    expect(screen.queryByText('了解更多')).not.toBeInTheDocument()
    expect(screen.queryByText('VIEW MORE >')).not.toBeInTheDocument()
  })

  it('默认是 4:9 的竖条，竖屏变成横带', () => {
    render(
      <Strip data-testid="strip" src="/a.png">
        集成战略
      </Strip>,
    )
    expect(screen.getByTestId('strip')).toHaveClass('aspect-[4/9]', 'portrait:aspect-[5/2]')
  })
})
