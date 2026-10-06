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

  it('底板是半透明黑的倒梯形，画在 ::before 上再裁，根元素不裁', () => {
    render(<HudCounter data-testid="hud" />)
    const hud = screen.getByTestId('hud')
    expect(hud).toHaveClass(
      'before:bg-ark-neutral-black/60',
      'before:ark-slant-in',
      '[--ark-slant:2.5rem]',
    )
    expect(hud.className).not.toMatch(/(^|\s)ark-slant-/)
  })

  it('左右各留出一条斜边的宽度', () => {
    render(<HudCounter data-testid="hud" />)
    expect(screen.getByTestId('hud')).toHaveClass('px-[calc(var(--ark-slant)+var(--ark-space-2))]')
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

  it('敌方配红色的菱形，我方配蓝色的方块', () => {
    render(
      <HudCounter>
        <HudCounterItem side="enemy" label="击杀" value={12} />
        <HudCounterItem side="ally" label="生命点数" value={3} />
      </HudCounter>,
    )
    const [enemy, ally] = screen
      .getAllByRole('term')
      .map(term => term.querySelector('[aria-hidden="true"]') as HTMLElement)
    expect(enemy).toHaveClass('text-ark-signal-danger')
    expect(ally).toHaveClass('text-ark-signal-info-deep')
    // 颜色之外，图形也不一样
    expect(enemy?.querySelector('path')?.getAttribute('d')).not.toBe(
      ally?.querySelector('path')?.getAttribute('d'),
    )
  })

  it('数字用数据体粗体，分母小而灰', () => {
    render(
      <HudCounter>
        <HudCounterItem side="enemy" label="击杀" value={1200} max={4700} />
      </HudCounter>,
    )
    const value = screen.getByRole('definition')
    expect(value).toHaveClass('font-ark-data', 'text-ark-h2')
    expect(value).toHaveTextContent('1,200/4,700')
    expect(screen.getByText('1,200')).toHaveClass('font-ark-bold')
    expect(screen.getByText('/4,700')).toHaveClass('text-ark-label', 'text-ark-fg-muted')
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
