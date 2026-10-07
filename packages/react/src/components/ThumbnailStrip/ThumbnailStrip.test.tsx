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

  it('当前项的标记是从右上角后面探出来的信号色三角，上、右两边给它留出位置', () => {
    render(<Strip defaultValue="a" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('flex-row', 'pt-ark-2', 'pr-[0.375rem]')
    expect(checked()).toHaveClass(
      'isolate',
      'before:-top-ark-2',
      'before:right-[-0.375rem]',
      'before:-z-1',
      'before:size-8',
      'before:bg-ark-signal',
      'before:[clip-path:polygon(0_0,100%_0,100%_100%)]',
      'before:opacity-0',
      'aria-checked:before:opacity-100',
    )
    // 不再是上方的一条短条
    expect(checked().className).not.toContain('before:h-(--ark-line-strong)')
  })

  it('竖排时标记不变，只是排成一列', () => {
    render(<Strip defaultValue="a" orientation="vertical" />)
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-orientation', 'vertical')
    expect(group).toHaveClass('flex-col', 'pt-ark-2')
    expect(checked()).toHaveClass('before:-top-ark-2', 'before:right-[-0.375rem]')
  })
})

describe('Thumbnail', () => {
  it('7.125rem × 11.25rem 的图片，铺满，本身对读屏隐藏', () => {
    render(<Strip defaultValue="a" />)
    const thumbnail = checked()
    expect(thumbnail).toHaveAttribute('data-ark', 'thumbnail')
    expect(thumbnail).toHaveClass('h-[11.25rem]', 'w-[7.125rem]')
    const image = thumbnail.querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover')
  })

  it('一圈 0.625rem 的白框压在图片上', () => {
    render(<Strip defaultValue="a" />)
    const frame = checked().querySelector('img')?.nextElementSibling
    expect(frame).toHaveAttribute('aria-hidden', 'true')
    expect(frame).toHaveClass('inset-0', 'border-[0.625rem]', 'border-ark-neutral-white')
  })

  it('非当前项不压暗', () => {
    render(<Strip defaultValue="a" />)
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.querySelector('img')?.className).not.toMatch(/opacity|saturate/)
    }
  })

  it('名称写在左下角，上面一个小方点；它就是可访问名称，不再另给 aria-label', () => {
    render(<Strip defaultValue="a" />)
    const label = screen.getByText('干员甲')
    expect(label).toHaveClass(
      'absolute',
      'bottom-ark-4',
      'left-ark-4',
      'font-ark-medium',
      'before:size-[0.375rem]',
      'before:bg-current',
    )
    expect(checked()).not.toHaveAttribute('aria-label')
    expect(checked()).toHaveAccessibleName('干员甲')
  })

  it('hideLabel 时名称只读给读屏', () => {
    render(
      <ThumbnailStrip aria-label="卡池" defaultValue="a">
        <Thumbnail value="a" src="/a.png" label="卡池一" hideLabel />
      </ThumbnailStrip>,
    )
    expect(screen.getByText('卡池一')).toHaveClass('sr-only')
    expect(screen.getByRole('radio', { name: '卡池一' })).toBeInTheDocument()
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
