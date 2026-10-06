import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OperatorShowcase } from './OperatorShowcase'

const emblem = <svg aria-hidden="true" data-testid="emblem" viewBox="0 0 24 24" />

describe('OperatorShowcase', () => {
  it('名字是标题：英文名在上，中文名 3.75rem、Bold、不收字距', () => {
    render(<OperatorShowcase data-testid="showcase" name="干员代号" sub="Codename" src="/a.png" />)
    expect(screen.getByTestId('showcase')).toHaveAttribute('data-ark', 'operator-showcase')
    const heading = screen.getByRole('heading', { level: 2, name: /干员代号/ })
    expect(heading).toHaveAttribute('data-ark', 'codename')
    expect(heading).toHaveClass('font-ark-bold', 'tracking-ark-normal')
    expect(screen.getByText('干员代号')).toHaveClass('text-ark-display')
    expect(screen.getByText('Codename')).toHaveClass('text-ark-body-lg')
  })

  it('nameAs 改标题的级别', () => {
    render(<OperatorShowcase name="干员代号" nameAs="h1" src="/a.png" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('文字区以 PROFILE 小标签开头，可以改也可以去掉', () => {
    const { rerender } = render(<OperatorShowcase name="干员代号" src="/a.png" />)
    expect(screen.getByText('PROFILE').closest('[data-ark="divider"]')).toBeInTheDocument()

    rerender(<OperatorShowcase name="干员代号" src="/a.png" label="ARCHIVE" />)
    expect(screen.getByText('ARCHIVE')).toBeInTheDocument()

    rerender(<OperatorShowcase data-testid="showcase" name="干员代号" src="/a.png" label={null} />)
    expect(screen.getByTestId('showcase').querySelector('[data-ark="divider"]')).toBeNull()
  })

  it('立绘靠右出血，带重影，默认只是陪衬', () => {
    render(<OperatorShowcase data-testid="showcase" name="干员代号" src="/a.png" />)
    const portrait = screen.getByTestId('showcase').querySelector('[data-ark="portrait"]')
    expect(portrait).toHaveClass('absolute', 'right-0', 'w-3/5', '-z-2')
    const images = portrait?.querySelectorAll('img')
    // 主图加一张重影
    expect(images).toHaveLength(2)
    expect(images?.[1]).toHaveAttribute('alt', '')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('alt 传给主图', () => {
    render(<OperatorShowcase name="干员代号" src="/a.png" alt="干员代号的立绘" />)
    expect(screen.getByRole('img', { name: '干员代号的立绘' })).toHaveAttribute('src', '/a.png')
  })

  it('只在文字一侧加遮罩', () => {
    render(<OperatorShowcase data-testid="showcase" name="干员代号" src="/a.png" />)
    const scrim = screen.getByTestId('showcase').querySelector('[data-ark="scrim"]')
    expect(scrim).toHaveAttribute('aria-hidden', 'true')
    expect(scrim).toHaveClass('bg-linear-to-r', '-z-1')
  })

  it('简介压在半透明的黑底上', () => {
    render(
      <OperatorShowcase name="干员代号" src="/a.png">
        <p>简介文字</p>
      </OperatorShowcase>,
    )
    const box = screen.getByText('简介文字').parentElement
    expect(box).toHaveClass('bg-ark-neutral-black/50')
    expect(box).toHaveAttribute('data-ark-tone', 'dark')
  })

  it('徽记、小字信息、背景巨字和底栏各有自己的位置', () => {
    render(
      <OperatorShowcase
        data-testid="showcase"
        name="干员代号"
        src="/a.png"
        emblem={emblem}
        meta="CV 占位声优"
        ghost="Rhodes"
        footer={<div data-testid="footer">缩略图</div>}
      />,
    )
    const showcase = screen.getByTestId('showcase')
    // 徽记和名字在同一行
    expect(screen.getByTestId('emblem').parentElement?.parentElement).toContainElement(
      screen.getByRole('heading'),
    )
    expect(screen.getByText('CV 占位声优')).toHaveClass('text-ark-fg-secondary')
    const ghost = showcase.querySelector('[data-ark="ghost-title"]')
    expect(ghost).toHaveTextContent('Rhodes')
    expect(ghost).toHaveClass('-z-3')
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('文字逐项自左入场，立绘自右入场；减少动效时只淡入', () => {
    render(
      <OperatorShowcase data-testid="showcase" name="干员代号" src="/a.png" meta="CV 占位声优">
        简介
      </OperatorShowcase>,
    )
    const showcase = screen.getByTestId('showcase')
    const stagger = showcase.querySelector('[data-ark="stagger"]') as HTMLElement
    // 小标签、名字、小字信息、简介
    expect(stagger.children).toHaveLength(4)
    expect(stagger.firstElementChild).toHaveClass('motion-safe:animate-ark-enter-left')
    expect(showcase.querySelector('[data-ark="portrait"]')).toHaveClass(
      'motion-safe:animate-ark-enter-right',
      'motion-reduce:animate-ark-fade-in',
    )
  })

  it('竖屏时立绘堆到文字上方，不再并排', () => {
    render(<OperatorShowcase data-testid="showcase" name="干员代号" src="/a.png" ghost="Rhodes" />)
    const showcase = screen.getByTestId('showcase')
    expect(showcase.querySelector('[data-ark="portrait"]')).toHaveClass(
      'portrait:relative',
      'portrait:w-full',
    )
    expect(showcase.querySelector('[data-ark="scrim"]')).toHaveClass('portrait:hidden')
    expect(showcase.querySelector('[data-ark="ghost-title"]')).toHaveClass('portrait:hidden')
  })
})
