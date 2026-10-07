import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '../../internal/testing'
import { Carousel, type CarouselProps, CarouselSlide } from './Carousel'

function Gallery(props: CarouselProps) {
  return (
    <Carousel aria-label="活动" {...props}>
      <CarouselSlide src="/a.png" href="#a">
        第一张
      </CarouselSlide>
      <CarouselSlide src="/b.png">第二张</CarouselSlide>
      <CarouselSlide src="/c.png">第三张</CarouselSlide>
    </Carousel>
  )
}

const slides = () => screen.getAllByRole('group', { hidden: true })
// 当前这一张是唯一没有 inert 的
const currentSlide = () => slides().find(slide => !slide.hasAttribute('inert')) as HTMLElement
const track = () => slides()[0]?.parentElement as HTMLElement
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Carousel', () => {
  it('是一个带名称的轮播区域，每张幻灯片是一个编了号的分组', () => {
    render(<Gallery />)
    const carousel = screen.getByRole('region', { name: '活动' })
    expect(carousel).toHaveAttribute('data-ark', 'carousel')
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')

    expect(slides()).toHaveLength(3)
    expect(slides().map(slide => slide.getAttribute('aria-label'))).toEqual([
      '1 / 3',
      '2 / 3',
      '3 / 3',
    ])
    for (const slide of slides()) expect(slide).toHaveAttribute('aria-roledescription', 'slide')
  })

  it('默认 16:9，比例可以用变量改', () => {
    render(<Gallery />)
    expect(track().parentElement).toHaveClass(
      'aspect-[var(--ark-carousel-ratio,16/9)]',
      'overflow-hidden',
    )
  })

  it('从第一张开始，其余的幻灯片是 inert', () => {
    render(<Gallery />)
    expect(currentSlide()).toHaveTextContent('第一张')
    expect(slides().map(slide => slide.hasAttribute('inert'))).toEqual([false, true, true])
    expect(track().style.getPropertyValue('--ark-carousel-index')).toBe('0')
  })

  it('下一张 / 上一张切换，同级之间用水平位移', () => {
    render(<Gallery />)
    click('下一张')
    expect(currentSlide()).toHaveTextContent('第二张')
    expect(track().style.getPropertyValue('--ark-carousel-index')).toBe('1')
    expect(track()).toHaveClass(
      'translate-x-[calc(var(--ark-carousel-index)*-100%)]',
      'transition-[translate]',
      'motion-reduce:transition-none',
    )

    click('上一张')
    expect(currentSlide()).toHaveTextContent('第一张')
  })

  it('默认首尾相接', () => {
    render(<Gallery />)
    click('上一张')
    expect(currentSlide()).toHaveTextContent('第三张')
    click('下一张')
    expect(currentSlide()).toHaveTextContent('第一张')
  })

  it('loop={false} 时到头的按钮禁用', () => {
    render(<Gallery loop={false} />)
    expect(screen.getByRole('button', { name: '上一张' })).toBeDisabled()
    click('下一张')
    click('下一张')
    expect(currentSlide()).toHaveTextContent('第三张')
    expect(screen.getByRole('button', { name: '下一张' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '上一张' })).toBeEnabled()
  })

  it('进度条上一段信号色停在当前页的位置，对读屏隐藏；位置由计数读出', () => {
    render(<Gallery defaultIndex={1} />)
    const carousel = screen.getByRole('region')
    const progress = carousel.querySelector('[data-ark="progress"]')
    expect(progress).toHaveAttribute('aria-hidden', 'true')
    expect(progress).toHaveAttribute('aria-valuenow', '2')
    expect(progress).toHaveAttribute('aria-valuemax', '3')
    // 官网实测：轨道与进度同高，进度段只占当前这一页（三页里的第二页）
    expect(progress).toHaveClass('h-2', 'bg-ark-neutral-gray-400')
    const segment = progress?.lastElementChild as HTMLElement
    expect(segment.style.left).toMatch(/^33\.3/)
    expect(segment.style.width).toMatch(/^33\.3/)

    const counter = carousel.querySelector('[data-ark="counter"]') as HTMLElement
    expect(within(counter).getByText('2 / 3')).toHaveClass('sr-only')
    expect(counter.parentElement).toHaveAttribute('aria-live', 'polite')
  })

  it('counter={false} 时不显示计数，但位置仍然读得到', () => {
    render(<Gallery counter={false} />)
    const carousel = screen.getByRole('region')
    expect(carousel.querySelector('[data-ark="counter"]')).toBeNull()
    expect(within(carousel).getByText('1 / 3')).toHaveClass('sr-only')
  })

  it('非受控时从 defaultIndex 开始并回调', () => {
    const onIndexChange = vi.fn()
    render(<Gallery defaultIndex={2} onIndexChange={onIndexChange} />)
    expect(currentSlide()).toHaveTextContent('第三张')
    click('下一张')
    expect(onIndexChange).toHaveBeenCalledExactlyOnceWith(0)
  })

  it('受控时由外部状态决定是第几张', () => {
    const onIndexChange = vi.fn()
    const { rerender } = render(<Gallery index={1} onIndexChange={onIndexChange} />)
    click('下一张')
    expect(onIndexChange).toHaveBeenCalledExactlyOnceWith(2)
    // 外部不更新 index，就还是原来那张
    expect(currentSlide()).toHaveTextContent('第二张')

    rerender(<Gallery index={2} onIndexChange={onIndexChange} />)
    expect(currentSlide()).toHaveTextContent('第三张')
  })

  it('受控配合 useState', () => {
    function Controlled() {
      const [index, setIndex] = useState(0)
      return <Gallery index={index} onIndexChange={setIndex} />
    }
    render(<Controlled />)
    click('下一张')
    expect(currentSlide()).toHaveTextContent('第二张')
  })

  it('越界的序号收回到范围内', () => {
    render(<Gallery index={9} />)
    expect(currentSlide()).toHaveTextContent('第三张')
  })

  it('只有一张时不显示翻页按钮', () => {
    render(
      <Carousel aria-label="活动">
        <CarouselSlide src="/a.png" />
      </Carousel>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('空节点不算幻灯片', () => {
    render(
      <Carousel aria-label="活动">
        <CarouselSlide src="/a.png" />
        {false}
        <CarouselSlide src="/b.png" />
      </Carousel>,
    )
    expect(slides()).toHaveLength(2)
  })

  describe('触屏滑动', () => {
    const swipe = (from: number, to: number, pointerType = 'touch', dy = 0) => {
      const viewport = track().parentElement as HTMLElement
      fireEvent.pointerDown(viewport, { pointerType, clientX: from, clientY: 100 })
      fireEvent.pointerUp(viewport, { pointerType, clientX: to, clientY: 100 + dy })
    }

    it('向左滑到下一张，向右滑回上一张', () => {
      render(<Gallery />)
      swipe(300, 100)
      expect(currentSlide()).toHaveTextContent('第二张')
      swipe(100, 300)
      expect(currentSlide()).toHaveTextContent('第一张')
    })

    it('滑得太短、方向偏纵向、或者用的是鼠标，都不翻页', () => {
      render(<Gallery />)
      swipe(300, 280)
      swipe(300, 200, 'touch', 200)
      swipe(300, 100, 'mouse')
      expect(currentSlide()).toHaveTextContent('第一张')
    })

    it('滑动之后补上来的那一次点击被拦下，链接不会跟着跳转', () => {
      render(<Gallery defaultIndex={1} />)
      swipe(100, 300)
      const link = screen.getByRole('link')
      const clicked = fireEvent.click(link)
      // preventDefault 之后 fireEvent 返回 false
      expect(clicked).toBe(false)
      // 只拦这一次
      expect(fireEvent.click(link)).toBe(true)
    })

    it('纵向滑动仍然交给页面滚动', () => {
      render(<Gallery />)
      expect(track().parentElement).toHaveClass('touch-pan-y')
    })
  })

  describe('自动轮播', () => {
    it('不给 autoplay 就不自动换，也没有暂停按钮', () => {
      vi.useFakeTimers()
      render(<Gallery />)
      advance(20000)
      expect(currentSlide()).toHaveTextContent('第一张')
      expect(screen.queryByRole('button', { name: '暂停轮播' })).not.toBeInTheDocument()
    })

    it('每隔一段时间换下一张，并首尾相接', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} />)
      advance(2900)
      expect(currentSlide()).toHaveTextContent('第一张')
      advance(200)
      expect(currentSlide()).toHaveTextContent('第二张')
      // 一次只推进一个间隔：React 在两次计时之间重新渲染，和浏览器里一样
      advance(3000)
      expect(currentSlide()).toHaveTextContent('第三张')
      advance(3000)
      expect(currentSlide()).toHaveTextContent('第一张')
    })

    it('进行中不播报位置', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} />)
      const carousel = screen.getByRole('region')
      expect(carousel.querySelector('[aria-live]')).toHaveAttribute('aria-live', 'off')

      click('暂停轮播')
      expect(carousel.querySelector('[aria-live]')).toHaveAttribute('aria-live', 'polite')
    })

    it('暂停按钮停住轮播，再按一次继续', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} />)
      click('暂停轮播')
      advance(10000)
      expect(currentSlide()).toHaveTextContent('第一张')

      click('继续轮播')
      advance(3100)
      expect(currentSlide()).toHaveTextContent('第二张')
    })

    it('手动翻页之后重新计时', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} />)
      advance(2000)
      click('下一张')
      // 焦点没有进到轮播里（fireEvent 不移动焦点），计时从这一刻重新开始
      advance(2000)
      expect(currentSlide()).toHaveTextContent('第二张')
      advance(1100)
      expect(currentSlide()).toHaveTextContent('第三张')
    })

    it('鼠标悬停时不走，移开后继续', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} />)
      const carousel = screen.getByRole('region')
      fireEvent.pointerEnter(carousel, { pointerType: 'mouse' })
      advance(10000)
      expect(currentSlide()).toHaveTextContent('第一张')

      fireEvent.pointerLeave(carousel, { pointerType: 'mouse' })
      advance(3100)
      expect(currentSlide()).toHaveTextContent('第二张')
    })

    it('焦点在里面时不走，离开后继续', () => {
      vi.useFakeTimers()
      render(
        <>
          <Gallery autoplay={3000} />
          <button type="button">外面</button>
        </>,
      )
      const next = screen.getByRole('button', { name: '下一张' })
      act(() => next.focus())
      advance(10000)
      expect(currentSlide()).toHaveTextContent('第一张')

      act(() => screen.getByRole('button', { name: '外面' }).focus())
      advance(3100)
      expect(currentSlide()).toHaveTextContent('第二张')
    })

    it('页面不可见时不走', () => {
      vi.useFakeTimers()
      const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
      render(<Gallery autoplay={3000} />)
      advance(10000)
      expect(currentSlide()).toHaveTextContent('第一张')

      hidden.mockReturnValue(false)
      advance(3100)
      expect(currentSlide()).toHaveTextContent('第二张')
    })

    it('用户要求减少动效时完全不启动', () => {
      vi.useFakeTimers()
      mockMatchMedia(['prefers-reduced-motion'])
      render(<Gallery autoplay={3000} />)
      advance(10000)
      expect(currentSlide()).toHaveTextContent('第一张')
    })

    it('loop={false} 时走到最后一张就停', () => {
      vi.useFakeTimers()
      render(<Gallery autoplay={3000} loop={false} />)
      for (let tick = 0; tick < 6; tick++) advance(3000)
      expect(currentSlide()).toHaveTextContent('第三张')
    })

    it('卸载后不再计时', () => {
      vi.useFakeTimers()
      const onIndexChange = vi.fn()
      const { unmount } = render(<Gallery autoplay={3000} onIndexChange={onIndexChange} />)
      unmount()
      advance(10000)
      expect(onIndexChange).not.toHaveBeenCalled()
    })
  })
})

describe('CarouselSlide', () => {
  it('图片铺满，默认只是陪衬', () => {
    render(
      <Carousel aria-label="活动">
        <CarouselSlide data-testid="slide" src="/a.png" position="70% 30%" />
      </Carousel>,
    )
    const slide = screen.getByTestId('slide')
    expect(slide.tagName).toBe('DIV')
    expect(slide).toHaveAttribute('data-ark', 'carousel-slide')
    const image = slide.querySelector('img') as HTMLImageElement
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveClass('object-cover', '-z-2')
    expect(image.style.objectPosition).toBe('70% 30%')
  })

  it('没有文字时不加遮罩，有文字时只压底部一侧', () => {
    const { rerender } = render(
      <Carousel aria-label="活动">
        <CarouselSlide data-testid="slide" src="/a.png" />
      </Carousel>,
    )
    expect(screen.getByTestId('slide').querySelector('[data-ark="scrim"]')).toBeNull()

    rerender(
      <Carousel aria-label="活动">
        <CarouselSlide data-testid="slide" src="/a.png">
          限时活动
        </CarouselSlide>
      </Carousel>,
    )
    const scrim = screen.getByTestId('slide').querySelector('[data-ark="scrim"]')
    expect(scrim).toHaveTextContent('限时活动')
    expect(scrim).not.toHaveAttribute('aria-hidden')
  })

  it('给了 href 整张是链接，焦点轮廓画在内侧', () => {
    render(
      <Carousel aria-label="活动">
        <CarouselSlide src="/a.png" alt="活动主视觉" href="#event">
          限时活动
        </CarouselSlide>
      </Carousel>,
    )
    const link = screen.getByRole('link', { name: '活动主视觉 限时活动' })
    expect(link).toHaveAttribute('href', '#event')
    expect(link).toHaveClass('focus-visible:-outline-offset-2')
  })
})
