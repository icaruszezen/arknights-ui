import { vi } from 'vitest'

// 测试用的浏览器 API 替身。happy-dom 自带 matchMedia 和 IntersectionObserver，
// 但前者对这些查询一律返回 false，后者从不回调——测试需要自己说了算。
// 用完在 afterEach 里 vi.restoreAllMocks() 和 vi.unstubAllGlobals()。

/**
 * 替换 `window.matchMedia`：查询里含有 `matching` 中任意一个片段就算匹配。
 *
 * @example
 * mockMatchMedia(['prefers-reduced-motion']) // 用户要求减少动效
 * mockMatchMedia(['pointer: fine'])          // 有鼠标的设备
 */
export function mockMatchMedia(matching: string[] = []) {
  return vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: matching.some(fragment => query.includes(fragment)),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

/**
 * 替换全局的 `IntersectionObserver`。返回的 `enter()` 让所有正在被观察的元素进入视口；
 * 它会引起状态更新，调用时请包在 `act()` 里。
 */
export function mockIntersectionObserver() {
  const observers = new Set<MockObserver>()

  class MockObserver {
    readonly elements = new Set<Element>()
    constructor(readonly callback: IntersectionObserverCallback) {
      observers.add(this)
    }
    observe(element: Element) {
      this.elements.add(element)
    }
    unobserve(element: Element) {
      this.elements.delete(element)
    }
    disconnect() {
      this.elements.clear()
      observers.delete(this)
    }
    takeRecords() {
      return []
    }
  }

  vi.stubGlobal('IntersectionObserver', MockObserver)

  return {
    /** 当前被观察的元素个数。 */
    get observed() {
      return [...observers].reduce((count, observer) => count + observer.elements.size, 0)
    },
    enter() {
      for (const observer of [...observers]) {
        const entries = [...observer.elements].map(
          target => ({ target, isIntersecting: true }) as IntersectionObserverEntry,
        )
        if (entries.length > 0) {
          observer.callback(entries, observer as unknown as IntersectionObserver)
        }
      }
    },
  }
}
