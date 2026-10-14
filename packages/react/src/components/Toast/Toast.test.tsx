import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type ToastOptions, ToastProvider, type ToastProviderProps, useToast } from './Toast'

function Trigger({ options }: { options: ToastOptions }) {
  const toast = useToast()
  return (
    <>
      <button type="button" onClick={() => toast(options)}>
        弹出
      </button>
      <button type="button" onClick={() => toast.dismiss()}>
        全部关掉
      </button>
    </>
  )
}

function App({ options, ...props }: { options: ToastOptions } & ToastProviderProps) {
  return (
    <ToastProvider {...props}>
      <Trigger options={options} />
    </ToastProvider>
  )
}

const pop = () => fireEvent.click(screen.getByRole('button', { name: '弹出' }))
const viewport = () => screen.getByRole('region', { name: '通知', hidden: true })

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const advance = (ms: number) =>
    act(() => {
      vi.advanceTimersByTime(ms)
    })

  it('这一栏一直在文档里，没有提示时不显示', () => {
    render(<App options={{ title: '已保存' }} />)
    expect(viewport()).toHaveAttribute('data-ark', 'toast-viewport')
    expect(viewport()).toHaveAttribute('popover', 'manual')
    expect(viewport()).toHaveClass('hidden')
    expect(viewport()).not.toHaveClass('flex')
  })

  it('弹出的提示就是一条 Notice，过了时间自己消失', () => {
    render(<App options={{ title: '已保存', description: '设置已同步', level: 'success' }} />)
    pop()
    expect(viewport()).toHaveClass('flex')
    const toast = within(viewport()).getByRole('status')
    expect(toast).toHaveTextContent('已保存')
    expect(toast).toHaveTextContent('设置已同步')
    expect(toast).toHaveAttribute('data-level', 'success')

    advance(4999)
    expect(within(viewport()).queryByRole('status')).not.toBeNull()
    advance(1)
    expect(within(viewport()).queryByRole('status')).toBeNull()
    expect(viewport()).toHaveClass('hidden')
  })

  it('警示和错误用 alert', () => {
    render(<App options={{ title: '连接中断', level: 'error' }} />)
    pop()
    expect(within(viewport()).getByRole('alert')).toHaveTextContent('连接中断')
  })

  it('指针停在上面时不走时，移开后从剩下的时间接着走', () => {
    render(<App options={{ title: '已保存', duration: 1000 }} />)
    pop()
    const item = viewport().querySelector('[data-ark="toast"]') as HTMLElement
    advance(600)
    fireEvent.pointerEnter(item)
    advance(5000)
    expect(within(viewport()).queryByRole('status')).not.toBeNull()
    fireEvent.pointerLeave(item)
    advance(399)
    expect(within(viewport()).queryByRole('status')).not.toBeNull()
    advance(1)
    expect(within(viewport()).queryByRole('status')).toBeNull()
  })

  it('duration 为 0 时一直留着，没有走时的细线，点关闭才消失', () => {
    render(<App options={{ title: '需要处理', duration: 0 }} />)
    pop()
    advance(60_000)
    expect(within(viewport()).getByRole('status')).toBeInTheDocument()
    expect(viewport().querySelector('[data-ark="toast-timer"]')).toBeNull()
    fireEvent.click(within(viewport()).getByRole('button', { name: '关闭' }))
    expect(within(viewport()).queryByRole('status')).toBeNull()
  })

  it('超过上限时最早的让位；dismiss() 不带编号全部关掉', () => {
    render(<App options={{ title: '已保存' }} max={2} />)
    pop()
    pop()
    pop()
    expect(within(viewport()).getAllByRole('status')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: '全部关掉' }))
    expect(within(viewport()).queryAllByRole('status')).toHaveLength(0)
  })

  it('位置和名称可以改', () => {
    render(<App options={{ title: '已保存' }} placement="top-center" label="消息" />)
    const region = screen.getByRole('region', { name: '消息', hidden: true })
    expect(region).toHaveAttribute('data-placement', 'top-center')
    expect(region).toHaveClass('top-0', 'left-1/2')
  })

  it('脱离 ToastProvider 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(
      'useToast() 必须在 <ToastProvider> 里使用',
    )
    error.mockRestore()
  })
})
