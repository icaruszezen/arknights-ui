import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './Tabs'

interface NewsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabledEvent?: boolean
}

function News({ value, defaultValue = 'latest', onValueChange, disabledEvent }: NewsProps) {
  const state: TabsProps =
    value !== undefined ? { value, onValueChange } : { defaultValue, onValueChange }
  return (
    <Tabs {...state}>
      <TabList aria-label="新闻分类">
        <Tab value="latest">最新</Tab>
        <Tab value="notice">公告</Tab>
        <Tab value="event" disabled={disabledEvent}>
          活动
        </Tab>
        <Tab value="news">新闻</Tab>
      </TabList>
      <TabPanel value="latest">最新内容</TabPanel>
      <TabPanel value="notice">公告内容</TabPanel>
      <TabPanel value="event">活动内容</TabPanel>
      <TabPanel value="news">新闻内容</TabPanel>
    </Tabs>
  )
}

const selectedTab = () => screen.getByRole('tab', { selected: true })

describe('Tabs', () => {
  it('按 WAI-ARIA 标签页模式连接各角色', () => {
    render(<News />)
    expect(screen.getByRole('tablist', { name: '新闻分类' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(4)

    const tab = selectedTab()
    const panel = screen.getByRole('tabpanel')
    expect(tab).toHaveTextContent('最新')
    expect(panel).toHaveTextContent('最新内容')
    expect(tab).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('aria-labelledby', tab.id)
  })

  it('aria-controls 只指向真实存在的面板', () => {
    render(<News />)
    // 未选中项的面板没有渲染，不留悬空引用
    for (const tab of screen.getAllByRole('tab', { selected: false })) {
      expect(tab).not.toHaveAttribute('aria-controls')
    }
  })

  it('不配 TabPanel 时（纯筛选）不输出 aria-controls', () => {
    render(
      <Tabs defaultValue="all">
        <TabList aria-label="职业">
          <Tab value="all">全部</Tab>
          <Tab value="guard">近卫</Tab>
        </TabList>
      </Tabs>,
    )
    expect(selectedTab()).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
  })

  it('只有选中项在 Tab 键序列里', () => {
    render(<News />)
    expect(screen.getAllByRole('tab').map(tab => tab.tabIndex)).toEqual([0, -1, -1, -1])
  })

  it('点击切换，并只渲染选中项的面板', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<News onValueChange={onValueChange} />)

    await user.click(screen.getByRole('tab', { name: '公告' }))
    expect(selectedTab()).toHaveTextContent('公告')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('公告内容')
    expect(screen.queryByText('最新内容')).not.toBeInTheDocument()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('notice')
  })

  it('重复点击已选中项不触发 onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<News onValueChange={onValueChange} />)
    await user.click(screen.getByRole('tab', { name: '最新' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('方向键移动焦点并立即切换，首尾循环', async () => {
    const user = userEvent.setup()
    render(<News />)
    await user.tab()
    expect(screen.getByRole('tab', { name: '最新' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: '公告' })).toHaveFocus()
    expect(selectedTab()).toHaveTextContent('公告')

    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('tab', { name: '新闻' })).toHaveFocus()
    expect(selectedTab()).toHaveTextContent('新闻')

    await user.keyboard('{ArrowRight}')
    expect(selectedTab()).toHaveTextContent('最新')
  })

  it('Home / End 跳到首尾', async () => {
    const user = userEvent.setup()
    render(<News />)
    await user.tab()
    await user.keyboard('{End}')
    expect(selectedTab()).toHaveTextContent('新闻')
    await user.keyboard('{Home}')
    expect(selectedTab()).toHaveTextContent('最新')
  })

  it('方向键跳过禁用项', async () => {
    const user = userEvent.setup()
    render(<News defaultValue="notice" disabledEvent />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(selectedTab()).toHaveTextContent('新闻')
  })

  it('受控时由外部状态决定选中项', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { rerender } = render(<News value="notice" onValueChange={onValueChange} />)
    expect(selectedTab()).toHaveTextContent('公告')

    // 外部不更新 value，选中项就不变
    await user.click(screen.getByRole('tab', { name: '新闻' }))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('news')
    expect(selectedTab()).toHaveTextContent('公告')

    rerender(<News value="news" onValueChange={onValueChange} />)
    expect(selectedTab()).toHaveTextContent('新闻')
  })

  it('受控配合 useState', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('latest')
      return <News value={value} onValueChange={setValue} />
    }
    render(<Controlled />)
    await user.click(screen.getByRole('tab', { name: '活动' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('活动内容')
  })

  it('含空白的 value 不会把 aria-controls 拆成多个引用', () => {
    render(
      <Tabs defaultValue="all operators">
        <TabList aria-label="筛选">
          <Tab value="all operators">全部</Tab>
        </TabList>
        <TabPanel value="all operators">全部干员</TabPanel>
      </Tabs>,
    )
    const controls = screen.getByRole('tab').getAttribute('aria-controls')
    expect(controls).not.toMatch(/\s/)
    expect(screen.getByRole('tabpanel').id).toBe(controls)
  })

  it('block 变体只在选中项上显示折线箭头，箭头贴右', () => {
    render(<News />)
    const marked = screen.getAllByRole('tab').filter(tab => tab.querySelector('[aria-hidden]'))
    expect(marked).toHaveLength(1)
    expect(marked[0]).toHaveTextContent('最新')
    expect(marked[0]?.querySelector('svg')).toHaveClass('ml-auto')
  })

  it('block 变体的选中项是信号色底（官网实测），不是反白', () => {
    render(<News />)
    const tab = selectedTab()
    expect(tab).toHaveClass('aria-selected:bg-ark-signal', 'aria-selected:text-ark-on-signal')
    expect(tab.className).not.toContain('aria-selected:bg-ark-invert')
  })

  it('segment 变体每一项都有底块，选中项明暗对调', () => {
    render(
      <Tabs variant="segment" defaultValue="all">
        <TabList aria-label="仓库分类">
          <Tab value="all">全部</Tab>
          <Tab value="material">养成材料</Tab>
        </TabList>
      </Tabs>,
    )
    // 连成一条，没有缝；项与项之间是画在 Tab 上的短竖线，选中项两侧不画
    expect(screen.getByRole('tablist')).toHaveClass('gap-0')
    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toHaveClass('bg-ark-fg/10', 'aria-selected:bg-ark-invert')
      expect(tab).toHaveClass('not-first:before:w-px', 'aria-selected:before:hidden')
      expect(tab.className).toContain('[[aria-selected=true]+&]:before:hidden')
      expect(tab.querySelector('svg')).toBeNull()
    }
  })

  it('脱离 Tabs 使用时报错', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Tab value="x">孤立</Tab>)).toThrow('<Tab> 必须放在 <Tabs> 里')
    error.mockRestore()
  })
})
