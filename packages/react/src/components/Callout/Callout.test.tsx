import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from './Callout'

describe('Callout', () => {
  it('待机是一个小方框加一行字，小方框对读屏隐藏，没有引线', () => {
    render(<Callout data-testid="callout">GALLERY</Callout>)
    const callout = screen.getByTestId('callout')
    expect(callout).toHaveAttribute('data-ark', 'callout')
    expect(callout).not.toHaveAttribute('data-active')
    expect(callout.querySelector('svg')).toBeNull()

    const marker = callout.querySelector('span[aria-hidden="true"]')
    expect(marker).toBeEmptyDOMElement()
    // 1rem 见方、2px 描边画在外面、2px 圆角，里面一道斜切 45° 的竖条
    expect(marker).toHaveClass(
      'box-content',
      'size-4',
      'border-2',
      'border-current',
      'rounded-ark-subtle',
      'before:skew-x-[45deg]',
    )

    const label = screen.getByText('GALLERY')
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
    expect(label).toHaveClass('font-ark-latin-condensed', 'text-ark-label', 'text-ark-fg-muted')
  })

  it('默认只是文字', () => {
    render(<Callout>GALLERY</Callout>)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('GALLERY').tagName).toBe('SPAN')
  })

  it('有 href 时整条是链接：悬停变前景色，点击区撑到 44px', () => {
    render(
      <Callout href="#gallery" target="_blank" rel="noreferrer">
        GALLERY
      </Callout>,
    )
    const link = screen.getByRole('link', { name: 'GALLERY' })
    expect(link).toHaveAttribute('href', '#gallery')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link).toHaveClass('hover:text-ark-fg', 'after:h-11')
    // 小方框也在链接里面，跟着一起变色
    expect(link.querySelector('span[aria-hidden="true"]')).not.toBeNull()
  })

  it('active 换成黑底信号色字的标签，小方框消失', () => {
    render(
      <Callout data-testid="callout" active>
        GALLERY
      </Callout>,
    )
    const callout = screen.getByTestId('callout')
    expect(callout).toHaveAttribute('data-active', '')
    expect(callout.querySelector('.border-2')).toBeNull()

    const label = screen.getByText('GALLERY')
    expect(label).toHaveClass(
      'bg-ark-neutral-black',
      'text-ark-signal',
      'text-ark-body-lg',
      'pr-ark-2',
      'pl-ark-1',
    )
    expect(label).not.toHaveClass('text-ark-fg-muted')
  })

  it('icon 只在 active 时显示，放在标签上面，对读屏隐藏', () => {
    const icon = <svg data-testid="icon" viewBox="0 0 24 24" />
    const { rerender } = render(<Callout icon={icon}>GALLERY</Callout>)
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()

    rerender(
      <Callout icon={icon} active>
        GALLERY
      </Callout>,
    )
    const tile = screen.getByTestId('icon').parentElement
    expect(tile).toHaveAttribute('aria-hidden', 'true')
    expect(tile).toHaveClass('w-[4.875rem]')
    expect(tile?.nextElementSibling).toBe(screen.getByText('GALLERY'))
  })

  it('active 的链接不再有悬停变色和撑开的点击区', () => {
    render(
      <Callout href="#gallery" active>
        GALLERY
      </Callout>,
    )
    const link = screen.getByRole('link', { name: 'GALLERY' })
    expect(link).not.toHaveClass('hover:text-ark-fg')
    expect(link).not.toHaveClass('after:h-11')
  })

  it('使用方的 className 用来定位', () => {
    render(
      <Callout data-testid="callout" className="absolute top-1/2 left-1/3">
        GALLERY
      </Callout>,
    )
    const callout = screen.getByTestId('callout')
    expect(callout).toHaveClass('absolute', 'top-1/2', 'left-1/3')
    expect(callout).not.toHaveClass('relative')
  })
})
