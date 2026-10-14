import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Attribute, AttributeList } from './AttributeList'

const icon = <svg aria-hidden="true" data-testid="icon" viewBox="0 0 24 24" />

describe('AttributeList', () => {
  it('是一个描述列表：名称在 dt，数值在 dd', () => {
    render(
      <AttributeList data-testid="list">
        <Attribute label="生命上限" value={2480} />
        <Attribute label="攻击" value={612} />
      </AttributeList>,
    )
    const list = screen.getByTestId('list')
    expect(list.tagName).toBe('DL')
    expect(list).toHaveAttribute('data-ark', 'attribute-list')
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual(['生命上限', '攻击'])
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual([
      '2,480',
      '612',
    ])
  })

  it('默认一列：名称一列、数值一列，所有项共用', () => {
    render(
      <AttributeList data-testid="list">
        <Attribute data-testid="row" label="攻击" value={612} />
      </AttributeList>,
    )
    expect(screen.getByTestId('list')).toHaveClass('grid-cols-[auto_minmax(0,1fr)]')
    const row = screen.getByTestId('row')
    expect(row).toHaveClass('col-span-2', 'grid-cols-subgrid')
    expect(row.className).not.toContain('col-start-')
  })

  it('columns={2} 排成两列，中间夹一条空列', () => {
    render(
      <AttributeList data-testid="list" columns={2}>
        <Attribute data-testid="row" label="攻击" value={612} />
      </AttributeList>,
    )
    expect(screen.getByTestId('list')).toHaveClass(
      'grid-cols-[auto_minmax(0,1fr)_1rem_auto_minmax(0,1fr)]',
    )
    expect(screen.getByTestId('row')).toHaveClass('odd:col-start-1', 'even:col-start-4')
  })
})

describe('Attribute', () => {
  it('没有图标时名称显示在左边、偏灰，数值用数据体、左对齐', () => {
    render(
      <AttributeList>
        <Attribute data-testid="row" label="防御" value={402} />
      </AttributeList>,
    )
    expect(screen.getByTestId('row')).toHaveAttribute('data-ark', 'attribute')
    expect(screen.getByRole('term')).toHaveClass('font-ark-regular', 'text-ark-fg-secondary')
    expect(screen.getByText('防御')).not.toHaveClass('sr-only')
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('font-ark-data', 'font-ark-regular')
    expect(value.className).not.toContain('justify-end')
  })

  it('给了图标：黑底白色的小方块，名称只读给读屏', () => {
    render(
      <AttributeList>
        <Attribute label="生命上限" value={2480} icon={icon} />
      </AttributeList>,
    )
    const chip = screen.getByTestId('icon').parentElement
    expect(chip).toHaveAttribute('aria-hidden', 'true')
    expect(chip).toHaveClass('size-6', 'bg-ark-neutral-black', 'text-ark-neutral-white')
    expect(screen.getByText('生命上限')).toHaveClass('sr-only')
    // 名称仍然在 dt 里
    expect(screen.getByRole('term')).toHaveTextContent('生命上限')
  })

  it('showLabel 把名称和图标一起显示', () => {
    render(
      <AttributeList>
        <Attribute label="生命上限" value={2480} icon={icon} showLabel />
      </AttributeList>,
    )
    expect(screen.getByText('生命上限')).not.toHaveClass('sr-only')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('字符串和节点原样输出，单位跟在后面', () => {
    render(
      <AttributeList>
        <Attribute label="再部署时间" value="70" unit="s" />
        <Attribute label="信赖" value={<span data-testid="trust">200%</span>} />
      </AttributeList>,
    )
    const [redeploy, trust] = screen.getAllByRole('definition')
    expect(redeploy).toHaveTextContent('70s')
    expect(trust).toContainElement(screen.getByTestId('trust'))
  })

  it('给了 meter 才在数值背后垫相对值条，宽度写在变量里', () => {
    render(
      <AttributeList>
        <Attribute data-testid="with" label="生命上限" value={2480} meter={0.76} />
        <Attribute data-testid="without" label="法术抗性" value={0} />
      </AttributeList>,
    )
    const withMeter = screen.getByTestId('with')
    expect(withMeter.style.getPropertyValue('--ark-attribute-meter')).toBe('76%')
    const [bar, plain] = screen.getAllByRole('definition')
    // 轨道铺满数值那一格，填充从左边画起；都垫在数字后面
    expect(bar).toHaveClass(
      'isolate',
      'before:inset-0',
      'before:-z-1',
      'before:bg-ark-fg/10',
      'after:inset-y-0',
      'after:-z-1',
      'after:w-(--ark-attribute-meter)',
      'after:bg-ark-fg/30',
    )

    expect(screen.getByTestId('without').style.getPropertyValue('--ark-attribute-meter')).toBe('')
    expect(plain?.className).not.toContain('after:')
  })

  it('meter 被限制在 0 到 1 之间', () => {
    render(
      <AttributeList>
        <Attribute data-testid="over" label="攻击" value={999} meter={1.4} />
        <Attribute data-testid="under" label="防御" value={0} meter={-0.2} />
      </AttributeList>,
    )
    expect(screen.getByTestId('over').style.getPropertyValue('--ark-attribute-meter')).toBe('100%')
    expect(screen.getByTestId('under').style.getPropertyValue('--ark-attribute-meter')).toBe('0%')
  })

  it('相对值条不另加元素：一组里只有 dt 和 dd', () => {
    render(
      <AttributeList>
        <Attribute data-testid="row" label="攻击" value={612} meter={0.5} icon={icon} />
      </AttributeList>,
    )
    expect(Array.from(screen.getByTestId('row').children).map(child => child.tagName)).toEqual([
      'DT',
      'DD',
    ])
  })

  it('相对值条的过渡在减少动效时关闭', () => {
    render(
      <AttributeList>
        <Attribute label="攻击" value={612} meter={0.5} />
      </AttributeList>,
    )
    expect(screen.getByRole('definition')).toHaveClass('motion-reduce:after:transition-none')
  })
})
