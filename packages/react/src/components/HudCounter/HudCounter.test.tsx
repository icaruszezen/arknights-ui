import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HudCounter, HudCounterItem } from './HudCounter'

describe('HudCounter', () => {
  it('是一个描述列表：名称在 dt，数字在 dd', () => {
    render(
      <HudCounter data-testid="hud">
        <HudCounterItem side="enemy" label="击杀" value={12} max={47} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>,
    )
    const hud = screen.getByTestId('hud')
    expect(hud.tagName).toBe('DL')
    expect(hud).toHaveAttribute('data-ark', 'hud-counter')
    expect(hud).toHaveAttribute('data-ark-tone', 'dark')
    expect(screen.getAllByRole('term').map(term => term.textContent)).toEqual(['击杀', '生命点数'])
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual([
      '12/47',
      '3',
    ])
  })

  it('底板是半透明黑的直角矩形，不裁斜边', () => {
    render(<HudCounter data-testid="hud" />)
    const hud = screen.getByTestId('hud')
    expect(hud).toHaveClass('h-9', 'bg-ark-neutral-black/60')
    expect(hud.className).not.toMatch(/ark-slant-/)
  })

  it('两端各一条短竖线，画在伪元素上', () => {
    render(<HudCounter data-testid="hud" />)
    expect(screen.getByTestId('hud')).toHaveClass(
      'before:left-0',
      'before:h-1/2',
      'before:w-px',
      'after:right-0',
      'after:h-1/2',
      'after:w-px',
    )
  })

  it('描述列表里只直接放各项，不夹别的元素', () => {
    render(
      <HudCounter data-testid="hud">
        <HudCounterItem side="enemy" label="击杀" value={12} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>,
    )
    const children = [...screen.getByTestId('hud').children]
    expect(children).toHaveLength(2)
    expect(children.every(child => child.tagName === 'DIV')).toBe(true)
  })
})

describe('HudCounterItem', () => {
  it('名称只给读屏，画面上是图形加数字', () => {
    render(
      <HudCounter>
        <HudCounterItem data-testid="item" side="enemy" label="击杀" value={12} max={47} />
      </HudCounter>,
    )
    expect(screen.getByTestId('item')).toHaveAttribute('data-ark', 'hud-counter-item')
    expect(screen.getByText('击杀')).toHaveClass('sr-only')
    const glyph = screen.getByRole('term').querySelector('[aria-hidden="true"]')
    expect(glyph?.querySelector('svg')).toBeInTheDocument()
  })

  it('敌方配橙色的准星，我方配蓝色的塔', () => {
    render(
      <HudCounter>
        <HudCounterItem side="enemy" label="击杀" value={12} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>,
    )
    const [enemy, ally] = screen
      .getAllByRole('term')
      .map(term => term.querySelector('[aria-hidden="true"]') as HTMLElement)
    expect(enemy).toHaveClass('text-ark-side-enemy')
    expect(ally).toHaveClass('text-ark-signal-info-deep')
    // 颜色之外，图形也不一样：准星里有一个圆，塔没有
    expect(enemy?.querySelector('circle')).toBeInTheDocument()
    expect(ally?.querySelector('circle')).not.toBeInTheDocument()
  })

  it('数字用数据体常规字重，分母和当前值同大同色', () => {
    render(
      <HudCounter>
        <HudCounterItem side="enemy" label="击杀" value={1200} max={4700} />
      </HudCounter>,
    )
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('font-ark-data', 'text-ark-body-lg', 'font-ark-regular')
    expect(value).toHaveTextContent('1,200/4,700')
    // 分母没有单独的元素，也就没有单独的字号和颜色
    expect(value.children).toHaveLength(0)
  })

  it('生命点数的数字是浅红，击杀数保持前景色', () => {
    render(
      <HudCounter>
        <HudCounterItem side="enemy" label="击杀" value={12} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>,
    )
    const [kills, life] = screen.getAllByRole('definition')
    expect(kills).not.toHaveClass('text-ark-side-life')
    expect(life).toHaveClass('text-ark-side-life')
  })

  it('两项之间一条短竖线，第一项前面没有', () => {
    render(
      <HudCounter>
        <HudCounterItem data-testid="item" side="enemy" label="击杀" value={12} />
      </HudCounter>,
    )
    expect(screen.getByTestId('item')).toHaveClass(
      'not-first:before:left-0',
      'not-first:before:h-1/2',
      'not-first:before:w-px',
    )
  })

  it('icon 换掉默认的图形', () => {
    render(
      <HudCounter>
        <HudCounterItem
          side="ally"
          label="生命点数"
          value={3}
          icon={<svg aria-hidden="true" data-testid="custom" viewBox="0 0 12 12" />}
        />
      </HudCounter>,
    )
    const term = screen.getByRole('term')
    expect(term).toContainElement(screen.getByTestId('custom'))
    expect(term.querySelectorAll('svg')).toHaveLength(1)
  })
})
