import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('是一个导航地标，里面是有序的一列；最后一项是当前页', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbItem href="/docs">文档</BreadcrumbItem>
        <BreadcrumbItem current>按钮</BreadcrumbItem>
      </Breadcrumb>,
    )
    const nav = screen.getByRole('navigation', { name: '面包屑' })
    expect(nav).toHaveAttribute('data-ark', 'breadcrumb')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/')
    const current = screen.getByText('按钮')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName).toBe('SPAN')
  })

  it('第一级后面是双斜杠，往后是单斜杠；斜杠对读屏隐藏', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbItem href="/docs">文档</BreadcrumbItem>
        <BreadcrumbItem current>按钮</BreadcrumbItem>
      </Breadcrumb>,
    )
    const slashes = [...container.querySelectorAll('li > [aria-hidden="true"]')]
    expect(slashes.map(node => node.textContent)).toEqual(['//', '/'])
  })

  it('标了 current 的项即使带 href 也不是链接', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/docs" current>
          文档
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('文档')).not.toHaveAttribute('href')
  })

  it('as 换成路由库的链接组件；名称可以改', () => {
    const RouterLink = (props: ComponentProps<'a'>) => <a data-router="" {...props} />
    render(
      <Breadcrumb aria-label="位置">
        <BreadcrumbItem href="/" as={RouterLink}>
          首页
        </BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByRole('navigation', { name: '位置' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('data-router')
  })
})
