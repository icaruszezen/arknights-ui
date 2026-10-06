import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Thumbnail, ThumbnailStrip, type ThumbnailStripProps } from './ThumbnailStrip'

function Strip(props: ThumbnailStripProps) {
  return (
    <ThumbnailStrip aria-label="干员" {...props}>
      <Thumbnail value="a" src="/a.png" label="干员甲" />
      <Thumbnail value="b" src="/b.png" label="干员乙" />
      <Thumbnail value="c" src="/c.png" label="干员丙" position="30% 20%" />
    </ThumbnailStrip>
  )
}

const checked = () => screen.getByRole('radio', { checked: true })

describe('ThumbnailStrip', () => {
  it('是一个单选组，每张缩略图是一个单选按钮，名称来自 label', () => {
    render(<Strip defaultValue="a" />)
    const group = screen.getByRole('radiogroup', { name: '干员' })
    expect(group).toHaveAttribute('data-ark', 'thumbnail-strip')
    expect(group).toHaveAttribute('aria-orientation', 'horizontal')
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(checked()).toHaveAccessibleName('干员甲')
  })

  it('点击切换并回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Strip defaultValue="a" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '干员丙' }))
    expect(checked()).toHaveAccessibleName('干员丙')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('c')
  })

  it('方向键移动并立即切换，只有当前项在 Tab 键序列里', async () => {
    const user = userEvent.setup()
    render(<Strip defaultValue="b" />)
    expect(screen.getAllByRole('radio').map(radio => radio.tabIndex)).toEqual([-1, 0, -1])

    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(checked()).toHaveAccessibleName('干员丙')
    await user.keyboard('{ArrowRight}')
    expect(checked()).toHaveAccessibleName('干员甲')
  })

  it('受控时由外部状态决定当前项', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(<Strip value="a" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '干员乙' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b')
    expect(checked()).toHaveAccessibleName('干员甲')

    rerender(<Strip value="b" onValueChange={onValueChange} />)
    expect(checked()).toHaveAccessibleName('干员乙')
  })

  it('横排时短条在当前项上方，并留出它的位置', () => {
    render(<Strip defaultValue="a" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('flex-row', 'pt-ark-2')
    expect(checked()).toHaveClass(
      'before:inset-x-0',
      'before:-top-ark-2',
      'before:h-(--ark-line-strong)',
      'before:bg-ark-signal',
      'aria-checked:before:opacity-100',
    )
  })

  it('竖排时短条在左侧', () => {
    render(<Strip defaultValue="a" orientation="vertical" />)
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-orientation', 'vertical')
    expect(group).toHaveClass('flex-col', 'pl-ark-2')
    expect(checked()).toHaveClass(
      'before:inset-y-0',
      'before:-left-ark-2',
      'before:w-(--ark-line-strong)',
    )
    expect(checked()).not.toHaveClass('before:-top-ark-2')
  })
})

describe('Thumbnail', () => {
  it('3:4 的图片，铺满，本身对读屏隐藏', () => {
    render(<Strip defaultValue="a" />)
    const thumbnail = checked()
    expect(thumbnail).toHaveAttribute('data-ark', 'thumbnail')
    expect(thumbnail).toHaveClass('aspect-[3/4]', 'w-16')
    const image = thumbnail.querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover')
  })

  it('非当前项压暗，悬停和选中时恢复', () => {
    render(<Strip defaultValue="a" />)
    expect(checked().querySelector('img')).toHaveClass(
      'opacity-50',
      'group-hover:opacity-100',
      'group-aria-checked:opacity-100',
      'group-aria-checked:saturate-100',
    )
  })

  it('position 传给图片', () => {
    render(<Strip defaultValue="a" />)
    const image = screen.getByRole('radio', { name: '干员丙' }).querySelector('img')
    expect(image?.style.objectPosition).toBe('30% 20%')
  })

  it('脱离 ThumbnailStrip 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Thumbnail value="x" src="/x.png" label="孤立" />)).toThrow(
      '<Thumbnail> 必须放在 <ThumbnailStrip> 里',
    )
    error.mockRestore()
  })
})
