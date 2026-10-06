import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ClassFilter, ClassFilterItem, type ClassFilterProps } from './ClassFilter'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

function Filter({ disabledSniper, ...props }: ClassFilterProps & { disabledSniper?: boolean }) {
  return (
    <ClassFilter aria-label="职业" {...props}>
      <ClassFilterItem value="all">全部</ClassFilterItem>
      <ClassFilterItem value="guard" icon={icon}>
        近卫
      </ClassFilterItem>
      <ClassFilterItem value="sniper" disabled={disabledSniper}>
        狙击
      </ClassFilterItem>
      <ClassFilterItem value="caster">术师</ClassFilterItem>
    </ClassFilter>
  )
}

const checked = () => screen.getByRole('radio', { checked: true })

describe('ClassFilter', () => {
  it('是一个单选组，每一项是一个单选按钮', () => {
    render(<Filter defaultValue="all" />)
    const group = screen.getByRole('radiogroup', { name: '职业' })
    expect(group).toHaveAttribute('data-ark', 'class-filter')
    expect(group).toHaveAttribute('data-ark-tone', 'dark')
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(checked()).toHaveTextContent('全部')
  })

  it('只有选中项在 Tab 键序列里', () => {
    render(<Filter defaultValue="guard" />)
    expect(screen.getAllByRole('radio').map(radio => radio.tabIndex)).toEqual([-1, 0, -1, -1])
  })

  it('还没有选中项时每一项都能用 Tab 到达', () => {
    render(<Filter />)
    expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument()
    expect(screen.getAllByRole('radio').map(radio => radio.tabIndex)).toEqual([0, 0, 0, 0])
  })

  it('点击切换并回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Filter defaultValue="all" onValueChange={onValueChange} />)

    await user.click(screen.getByRole('radio', { name: '近卫' }))
    expect(checked()).toHaveTextContent('近卫')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('guard')
  })

  it('重复点击已选中项不回调', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Filter defaultValue="all" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '全部' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('方向键移动焦点并立即切换，首尾循环', async () => {
    const user = userEvent.setup()
    render(<Filter defaultValue="all" />)
    await user.tab()
    expect(screen.getByRole('radio', { name: '全部' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '近卫' })).toHaveFocus()
    expect(checked()).toHaveTextContent('近卫')

    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(checked()).toHaveTextContent('术师')

    await user.keyboard('{ArrowDown}')
    expect(checked()).toHaveTextContent('全部')
  })

  it('Home / End 跳到首尾，方向键跳过禁用项', async () => {
    const user = userEvent.setup()
    render(<Filter defaultValue="guard" disabledSniper />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(checked()).toHaveTextContent('术师')
    await user.keyboard('{Home}')
    expect(checked()).toHaveTextContent('全部')
    await user.keyboard('{End}')
    expect(checked()).toHaveTextContent('术师')
  })

  it('受控时由外部状态决定选中项', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(<Filter value="guard" onValueChange={onValueChange} />)
    expect(checked()).toHaveTextContent('近卫')

    // 外部不更新 value，选中项就不变
    await user.click(screen.getByRole('radio', { name: '术师' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('caster')
    expect(checked()).toHaveTextContent('近卫')

    rerender(<Filter value="caster" onValueChange={onValueChange} />)
    expect(checked()).toHaveTextContent('术师')
  })

  it('受控配合 useState', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('all')
      return <Filter value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    await user.click(screen.getByRole('radio', { name: '狙击' }))
    expect(checked()).toHaveTextContent('狙击')
  })

  it('使用方的 onKeyDown 调用 preventDefault 可以拦下方向键', async () => {
    const user = userEvent.setup()
    render(<Filter defaultValue="all" onKeyDown={event => event.preventDefault()} />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(checked()).toHaveTextContent('全部')
  })

  it('放不下时横向滚动，四周留出焦点轮廓的位置', () => {
    render(<Filter defaultValue="all" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('overflow-x-auto', 'max-w-full', 'p-ark-1')
  })
})

describe('ClassFilterItem', () => {
  it('当前项整块反白', () => {
    render(<Filter defaultValue="all" />)
    expect(checked()).toHaveClass('aria-checked:bg-ark-invert', 'aria-checked:text-ark-on-invert')
  })

  it('图标对读屏隐藏，名称来自文字', () => {
    render(<Filter defaultValue="all" />)
    const guard = screen.getByRole('radio', { name: '近卫' })
    expect(guard).toHaveAttribute('data-ark', 'class-filter-item')
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(guard).toContainElement(screen.getByTestId('icon'))
  })

  it('点击区不小于 44px', () => {
    render(<Filter defaultValue="all" />)
    expect(checked()).toHaveClass('h-12', 'min-w-12')
  })

  it('禁用项不能选中', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Filter defaultValue="all" disabledSniper onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: '狙击' }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(checked()).toHaveTextContent('全部')
  })

  it('使用方的 onClick 调用 preventDefault 可以阻止选中', async () => {
    const user = userEvent.setup()
    render(
      <ClassFilter aria-label="职业" defaultValue="all">
        <ClassFilterItem value="all">全部</ClassFilterItem>
        <ClassFilterItem value="guard" onClick={event => event.preventDefault()}>
          近卫
        </ClassFilterItem>
      </ClassFilter>,
    )
    await user.click(screen.getByRole('radio', { name: '近卫' }))
    expect(checked()).toHaveTextContent('全部')
  })

  it('脱离 ClassFilter 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ClassFilterItem value="x">孤立</ClassFilterItem>)).toThrow(
      '<ClassFilterItem> 必须放在 <ClassFilter> 里',
    )
    error.mockRestore()
  })
})
