import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Attribute, AttributeList } from './AttributeList'

describe('AttributeList', () => {
  it('是一个描述列表：标签在 dt，数值在 dd', () => {
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
})

describe('Attribute', () => {
  it('标签在左、偏灰，数值右对齐、数据体粗体', () => {
    render(
      <AttributeList>
        <Attribute data-testid="row" label="防御" value={402} />
      </AttributeList>,
    )
    const row = screen.getByTestId('row')
    expect(row).toHaveAttribute('data-ark', 'attribute')
    expect(row).toHaveClass('grid-cols-[minmax(0,1fr)_auto]')
    expect(screen.getByRole('term')).toHaveClass('font-ark-regular', 'text-ark-fg-secondary')
    expect(screen.getByRole('definition')).toHaveClass('font-ark-data', 'font-ark-bold')
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

  it('给了 meter 才画相对值条，宽度写在变量里', () => {
    render(
      <AttributeList>
        <Attribute data-testid="with" label="生命上限" value={2480} meter={0.76} />
        <Attribute data-testid="without" label="法术抗性" value={0} />
      </AttributeList>,
    )
    const withMeter = screen.getByTestId('with')
    expect(withMeter.style.getPropertyValue('--ark-attribute-meter')).toBe('76%')
    expect(withMeter).toHaveClass(
      'before:h-0.5',
      'before:bg-ark-fg/25',
      'after:h-0.5',
      'after:w-(--ark-attribute-meter)',
    )

    const withoutMeter = screen.getByTestId('without')
    expect(withoutMeter.style.getPropertyValue('--ark-attribute-meter')).toBe('')
    expect(withoutMeter.className).not.toContain('after:')
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
        <Attribute data-testid="row" label="攻击" value={612} meter={0.5} />
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
        <Attribute data-testid="row" label="攻击" value={612} meter={0.5} />
      </AttributeList>,
    )
    expect(screen.getByTestId('row')).toHaveClass('motion-reduce:after:transition-none')
  })
})
