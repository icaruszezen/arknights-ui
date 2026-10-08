import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Counter, Serial } from './Counter'

describe('Counter', () => {
  it('写作 “01 // 01 / 05”：大数字之后跟当前 / 总数', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    const counter = screen.getByTestId('counter')
    expect(counter).toHaveAttribute('data-ark', 'counter')
    expect(counter.querySelector('b')).toHaveTextContent(/^01$/)
    expect(screen.getByText('// 01 / 05')).toBeInTheDocument()
  })

  it('当前值与总数用同样的补零规则', () => {
    render(<Counter data-testid="counter" value={7} total={120} pad={3} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveTextContent(/^007$/)
    expect(screen.getByText('// 007 / 120')).toBeInTheDocument()
  })

  it('读屏只读到“第几个 / 共几个”，视觉上的写法对它隐藏', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    const counter = screen.getByTestId('counter')
    expect(counter.querySelector('.sr-only')).toHaveTextContent('1 / 5')
    expect(counter.querySelector('b')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('// 01 / 05').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('标签是可读的文字，不隐藏', () => {
    render(<Counter value={1} total={5} label="INFORMATION" />)
    const label = screen.getByText('INFORMATION')
    expect(label).not.toHaveAttribute('aria-hidden')
    expect(label.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('大数字用信号色，并在纸白面上跟着压暗', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass('text-ark-signal-fg')
  })

  it('md 的大数字是宽体 5.4rem（官网实测），sm 缩到小节标签的字号并改用数据体', () => {
    const { rerender } = render(<Counter data-testid="counter" value={1} total={5} />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass(
      'font-ark-latin-wide',
      'text-[5.4rem]',
      'font-semibold',
    )

    rerender(<Counter data-testid="counter" value={1} total={5} size="sm" />)
    expect(screen.getByTestId('counter').querySelector('b')).toHaveClass(
      'font-ark-data',
      'text-ark-h2',
    )
  })

  it('md 的名称另起一行、靠右、1.125rem；“当前 / 总数”也是 1.125rem', () => {
    render(<Counter value={1} total={5} label="INFORMATION" />)
    expect(screen.getByText('INFORMATION')).toHaveClass(
      'col-span-2',
      'justify-self-end',
      'text-ark-body',
    )
    expect(screen.getByText('// 01 / 05')).toHaveClass('text-ark-body')
  })

  it('md 的大数字下缘被裁掉：容器裁切，数字下移，占位块定高', () => {
    render(<Counter data-testid="counter" value={1} total={5} />)
    const number = screen.getByTestId('counter').querySelector('b')
    // min-w-max：被挤窄时数字也不让出自己的宽度
    expect(number).toHaveClass('flex', 'items-baseline', 'overflow-hidden', 'min-w-max')
    const [digits, strut] = number?.children ?? []
    expect(digits).toHaveTextContent('01')
    expect(digits).toHaveClass('leading-[0]', 'supports-[height:1cap]:translate-y-[0.2cap]')
    expect(strut).toBeEmptyDOMElement()
    expect(strut).toHaveClass('w-0', 'supports-[height:1cap]:h-[0.8cap]')
  })

  it('sm 的数字不裁切', () => {
    render(<Counter data-testid="counter" value={3} total={12} size="sm" />)
    const number = screen.getByTestId('counter').querySelector('b')
    expect(number).not.toHaveClass('overflow-hidden')
    expect(number?.children).toHaveLength(0)
  })

  it('micro 在“当前 / 总数”下面加一行微缩字，对读屏隐藏；sm 不显示', () => {
    const { rerender } = render(<Counter value={1} total={5} micro="ARKNIGHTS" />)
    const micro = screen.getByText('ARKNIGHTS')
    expect(micro).toHaveClass('text-ark-micro', 'tracking-ark-micro', 'font-ark-latin-wide')
    expect(micro.closest('[aria-hidden="true"]')).not.toBeNull()
    // 两行同在右边那一列里，微缩字紧跟在“当前 / 总数”后面
    expect(micro.previousElementSibling).toHaveTextContent('// 01 / 05')

    rerender(<Counter value={1} total={5} micro="ARKNIGHTS" size="sm" />)
    expect(screen.queryByText('ARKNIGHTS')).not.toBeInTheDocument()
  })

  it('默认横排', () => {
    render(<Counter data-testid="counter" value={1} total={5} label="INFORMATION" />)
    const counter = screen.getByTestId('counter')
    expect(counter).not.toHaveAttribute('data-vertical')
    expect(counter).toHaveClass('inline-grid')
    expect(counter.className).not.toContain('writing-mode')
    expect(counter.innerHTML).not.toContain('writing-mode')
  })

  it('vertical="always" 是窄栏里的竖排：2rem 宽，数字缩到 1.8rem、居中，后两行竖着写在右下角', () => {
    render(
      <Counter
        data-testid="counter"
        value={1}
        total={5}
        label="INFORMATION"
        micro="ARKNIGHTS"
        vertical="always"
      />,
    )
    const counter = screen.getByTestId('counter')
    expect(counter).toHaveAttribute('data-vertical', 'always')
    expect(counter).toHaveClass('relative', 'block', 'w-8')
    expect(counter).not.toHaveClass('inline-grid')

    // 数字比这一块宽：居中，两边各裁掉一点
    const number = counter.querySelector('b')
    expect(number).toHaveClass('w-full', 'min-w-0', 'justify-center', 'overflow-hidden')
    expect(number).toHaveClass('text-[1.8rem]')
    expect(number).not.toHaveClass('text-[5.4rem]', 'min-w-max')

    const count = screen.getByText('// 01 / 05')
    expect(count).toHaveClass('text-[0.5rem]', '[writing-mode:vertical-rl]')
    expect(count.parentElement).toHaveClass('absolute', 'right-0', 'bottom-0', 'pb-0')

    const label = screen.getByText('INFORMATION')
    expect(label).toHaveClass(
      'absolute',
      'right-3',
      'bottom-0',
      'text-[0.3125rem]',
      '[writing-mode:vertical-rl]',
    )
    // 微缩字放不下，不显示
    expect(screen.getByText('ARKNIGHTS')).toHaveClass('hidden')
  })

  it('vertical="portrait" 只在竖屏竖排：同一组类，前面多一个 portrait:', () => {
    render(
      <Counter
        data-testid="counter"
        value={1}
        total={5}
        label="INFORMATION"
        micro="ARKNIGHTS"
        vertical="portrait"
      />,
    )
    const counter = screen.getByTestId('counter')
    expect(counter).toHaveAttribute('data-vertical', 'portrait')
    // 横屏的写法原样保留
    expect(counter).toHaveClass('inline-grid', 'portrait:block', 'portrait:w-8')
    const number = counter.querySelector('b')
    expect(number).toHaveClass('text-[5.4rem]', 'portrait:text-[1.8rem]', 'portrait:justify-center')
    expect(screen.getByText('// 01 / 05')).toHaveClass(
      'text-ark-body',
      'portrait:text-[0.5rem]',
      'portrait:[writing-mode:vertical-rl]',
    )
    expect(screen.getByText('INFORMATION')).toHaveClass(
      'portrait:absolute',
      'portrait:right-3',
      'portrait:text-[0.3125rem]',
    )
    expect(screen.getByText('ARKNIGHTS')).toHaveClass('portrait:hidden')
    expect(screen.getByText('ARKNIGHTS')).not.toHaveClass('hidden')
  })

  it('sm 没有竖排的写法', () => {
    render(<Counter data-testid="counter" value={3} total={12} size="sm" vertical="always" />)
    const counter = screen.getByTestId('counter')
    expect(counter).not.toHaveAttribute('data-vertical')
    expect(counter).toHaveClass('inline-flex')
    expect(counter).not.toHaveClass('w-8')
  })
})

describe('Serial', () => {
  it('前缀后面跟补零的序号', () => {
    render(<Serial prefix="NO." value={147} pad={4} />)
    const serial = screen.getByText('NO.0147')
    expect(serial).toHaveAttribute('data-ark', 'serial')
  })

  it('不设 pad 就不补零，也不加千分位', () => {
    const { rerender } = render(<Serial prefix="VOL." value={69} />)
    expect(screen.getByText('VOL.69')).toBeInTheDocument()

    rerender(<Serial prefix="NO." value={12345} />)
    expect(screen.getByText('NO.12345')).toBeInTheDocument()
  })

  it('字符串原样输出', () => {
    render(<Serial prefix="LOT " value="0011-7777" pad={12} />)
    expect(screen.getByText('LOT 0011-7777')).toBeInTheDocument()
  })
})
