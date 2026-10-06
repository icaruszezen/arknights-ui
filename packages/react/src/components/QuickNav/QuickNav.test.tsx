import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QuickNav, QuickNavItem } from './QuickNav'

function Systems({ withStore = true }: { withStore?: boolean }) {
  return (
    <QuickNav aria-label="快捷导航">
      <QuickNavItem href="#home" sub="HOME">
        首页
      </QuickNavItem>
      <QuickNavItem href="#operator" sub="OPERATOR" current>
        干员
      </QuickNavItem>
      {withStore && (
        <QuickNavItem href="#store" sub="STORE">
          采购
        </QuickNavItem>
      )}
    </QuickNav>
  )
}

describe('QuickNav', () => {
  it('是一个带名称的导航地标，里面是一列链接', () => {
    render(<Systems />)
    const nav = screen.getByRole('navigation', { name: '快捷导航' })
    expect(nav).toHaveAttribute('data-ark', 'quick-nav')
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3)
    expect(within(nav).getAllByRole('link')).toHaveLength(3)
  })

  it('每一项的中文与英文小字都计入名称', () => {
    render(<Systems />)
    expect(screen.getByRole('link', { name: '首页 HOME' })).toHaveAttribute('href', '#home')
  })

  it('自带深色底，子元素按深色上下文取色', () => {
    render(<Systems />)
    expect(screen.getByRole('navigation')).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('条件渲染掉的项不留空的列表项', () => {
    render(<Systems withStore={false} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('当前项输出 aria-current，其余不输出', () => {
    render(<Systems />)
    expect(screen.getByRole('link', { name: '干员 OPERATOR' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: '首页 HOME' })).not.toHaveAttribute('aria-current')
  })

  it('current 可以指定取值', () => {
    render(
      <QuickNav aria-label="快捷导航">
        <QuickNavItem href="#base" current="location">
          基建
        </QuickNavItem>
      </QuickNav>,
    )
    expect(screen.getByRole('link', { name: '基建' })).toHaveAttribute('aria-current', 'location')
  })

  it('当前项是信号色加底条，不只靠颜色区分', () => {
    render(<Systems />)
    const current = screen.getByRole('link', { name: '干员 OPERATOR' })
    expect(current).toHaveClass('text-ark-signal-fg', 'after:bg-ark-signal')

    const other = screen.getByRole('link', { name: '首页 HOME' })
    expect(other).toHaveClass('text-ark-fg')
    expect(other.className).not.toContain('after:bg-ark-signal')
  })

  it('转发 ref 与其余属性到链接上', () => {
    let node: HTMLAnchorElement | null = null
    render(
      <QuickNav aria-label="快捷导航">
        <QuickNavItem
          href="#base"
          target="_blank"
          ref={element => {
            node = element
          }}
        >
          基建
        </QuickNavItem>
      </QuickNav>,
    )
    expect(node).toBeInstanceOf(HTMLAnchorElement)
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
  })
})
