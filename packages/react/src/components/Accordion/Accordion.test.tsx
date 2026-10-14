import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, AccordionItem, type AccordionProps } from './Accordion'

function Faq(props: AccordionProps) {
  return (
    <Accordion {...props}>
      <AccordionItem title="怎么接入" sub="Setup" defaultOpen>
        引入样式表即可
      </AccordionItem>
      <AccordionItem title="支持哪些主题" sub="Themes">
        暗色与亮色
      </AccordionItem>
    </Accordion>
  )
}

const items = (container: HTMLElement) =>
  [...container.querySelectorAll('details')] as HTMLDetailsElement[]

describe('Accordion', () => {
  it('每一项是原生的 details，标题在 summary 里', () => {
    const { container } = render(<Faq />)
    expect(container.querySelector('[data-ark="accordion"]')).not.toBeNull()
    const [first, second] = items(container)
    expect(first).toHaveAttribute('data-ark', 'accordion-item')
    expect(first?.querySelector('summary')).toHaveTextContent('怎么接入')
    expect(first?.open).toBe(true)
    expect(second?.open).toBe(false)
    expect(screen.getByText('暗色与亮色')).toBeInTheDocument()
  })

  it('默认各项互不影响，不带 name；exclusive 时共用一个 name，由浏览器保证只开一项', () => {
    const { container, rerender } = render(<Faq />)
    for (const item of items(container)) expect(item).not.toHaveAttribute('name')

    rerender(<Faq exclusive />)
    const names = items(container).map(item => item.getAttribute('name'))
    expect(names[0]).toBeTruthy()
    expect(names[0]).toBe(names[1])
  })

  it('numbered 给每一项加补零的编号，对读屏隐藏', () => {
    const { container } = render(<Faq numbered />)
    const numbers = [...container.querySelectorAll('summary > span[aria-hidden="true"]')]
    expect(numbers.map(node => node.textContent)).toEqual(['01', '02'])
  })

  it('展开或收起时回调', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Accordion>
        <AccordionItem title="怎么接入" onOpenChange={onOpenChange}>
          引入样式表即可
        </AccordionItem>
      </Accordion>,
    )
    const [item] = items(container)
    if (!item) throw new Error('没有渲染出 details')
    item.open = true
    fireEvent(item, new Event('toggle'))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it('脱离 Accordion 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<AccordionItem title="孤立">内容</AccordionItem>)).toThrow(
      '<AccordionItem> 必须放在 <Accordion> 里',
    )
    error.mockRestore()
  })
})
