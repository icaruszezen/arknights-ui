import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DeployCard } from './DeployCard'

const icon = <svg aria-hidden="true" data-testid="class-icon" viewBox="0 0 24 24" />

describe('DeployCard', () => {
  it('是一个按钮，名称是干员名加费用', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<DeployCard label="占位干员甲" cost={12} onClick={onClick} />)
    const card = screen.getByRole('button', { name: '占位干员甲 费用 12' })
    expect(card).toHaveAttribute('type', 'button')
    expect(card).toHaveAttribute('data-ark', 'deploy-card')
    expect(card).toHaveAttribute('aria-pressed', 'false')
    await user.click(card)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('3:4 的小卡，点击区不小于 44px', () => {
    render(<DeployCard label="占位干员甲" cost={12} />)
    expect(screen.getByRole('button')).toHaveClass('aspect-[3/4]', 'w-14')
  })

  it('费用在左上角的黑底方块里，数据体粗体', () => {
    render(<DeployCard label="占位干员甲" cost={12} />)
    const cost = screen.getByText('12', { exact: false, selector: 'span.absolute' })
    expect(cost).toHaveClass('top-0', 'left-0', 'bg-ark-neutral-black', 'font-ark-data')
    expect(cost).not.toHaveClass('text-ark-signal-danger')
  })

  it('头像铺满，对读屏隐藏', () => {
    render(<DeployCard label="占位干员甲" cost={12} src="/a.png" />)
    const image = screen.getByRole('button').querySelector('img')
    expect(image).toHaveAttribute('src', '/a.png')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover', '-z-1')
    expect(image?.className).not.toContain('brightness')
  })

  it('选中：上浮并加描边；减少动效时不位移', () => {
    render(<DeployCard label="占位干员甲" cost={12} selected />)
    const card = screen.getByRole('button', { pressed: true })
    expect(card).toHaveClass('after:border-ark-neutral-white', 'motion-safe:-translate-y-2')
    expect(card.className).not.toMatch(/(^|\s)-translate-y-/)
  })

  it('未选中时描边是透明的，悬停才浮现', () => {
    render(<DeployCard label="占位干员甲" cost={12} />)
    expect(screen.getByRole('button')).toHaveClass(
      'after:border-transparent',
      'not-disabled:hover:after:border-ark-neutral-white/60',
      'motion-safe:not-disabled:hover:-translate-y-1',
    )
  })

  it('费用不足：卡面压暗，数字转红，并读给读屏', () => {
    render(<DeployCard label="占位干员甲" cost={32} src="/a.png" insufficient />)
    const card = screen.getByRole('button', { name: '占位干员甲 费用 32 费用不足' })
    expect(card.querySelector('img')).toHaveClass('brightness-[0.4]')
    expect(card.querySelector('.bg-ark-neutral-black')).toHaveClass('text-ark-signal-danger')
  })

  it('再部署冷却：卡面压暗，盖上倒计时', () => {
    render(<DeployCard label="占位干员甲" cost={12} src="/a.png" cooldown={17.2} />)
    const card = screen.getByRole('button', { name: '占位干员甲 费用 12 再部署冷却 18 秒' })
    expect(card.querySelector('img')).toHaveClass('brightness-[0.4]')
    const overlay = card.querySelector('.inset-0.grid')
    expect(overlay).toHaveTextContent('18')
    expect(overlay).toHaveClass('font-ark-data', 'text-ark-h2')
  })

  it('冷却为 0 时恢复正常', () => {
    render(<DeployCard label="占位干员甲" cost={12} src="/a.png" cooldown={0} />)
    const card = screen.getByRole('button', { name: '占位干员甲 费用 12' })
    expect(card.querySelector('img')?.className).not.toContain('brightness')
  })

  it('职业图标在右下角，对读屏隐藏', () => {
    render(<DeployCard label="占位干员甲" cost={12} classIcon={icon} />)
    const chip = screen.getByTestId('class-icon').parentElement
    expect(chip).toHaveClass('right-0', 'bottom-0')
    expect(chip).toHaveAttribute('aria-hidden', 'true')
  })

  it('aria-label 可以整个换掉读屏的说法', () => {
    render(<DeployCard label="占位干员甲" cost={12} aria-label="Operator A, cost 12" />)
    expect(screen.getByRole('button', { name: 'Operator A, cost 12' })).toBeInTheDocument()
  })

  it('按钮里只有行内元素', () => {
    render(<DeployCard label="占位干员甲" cost={12} src="/a.png" classIcon={icon} cooldown={5} />)
    expect(screen.getByRole('button').querySelector('div, p, h1, h2, h3, ul, dl')).toBeNull()
  })
})
