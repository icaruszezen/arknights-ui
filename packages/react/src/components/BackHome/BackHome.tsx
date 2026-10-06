import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BackIcon, HomeIcon } from '../../internal/icons'
import { colorTransition, focusRing, triangleDown } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { mergeRefs } from '../../utils/mergeRefs'

export interface BackHomeProps extends ComponentProps<'div'> {
  /** 点返回时调用。 */
  onBack?: () => void
  /** 给了就把返回渲染成链接。 */
  backHref?: string
  /**
   * 返回块的名称，读屏会念出来。
   * @default '返回'
   */
  backLabel?: string
  /** 点主页时调用。有 `children` 时主页块是展开开关，不会调用它。 */
  onHome?: () => void
  /** 给了就把主页渲染成链接。有 `children` 时无效。 */
  homeHref?: string
  /**
   * 主页块的名称，读屏会念出来。
   * @default '主页'
   */
  homeLabel?: string
  /** 一开始就展开。仅在有 `children` 时有意义。 */
  defaultExpanded?: boolean
  /** 展开或收起时调用。 */
  onExpandedChange?: (expanded: boolean) => void
  /**
   * 主页块展开的内容，通常是一条 `QuickNav`。
   * 传了之后主页块变成展开开关，回主页的入口放在展开的内容里。
   */
  children?: ReactNode
}

// 可见的形状画在 ::before 上再裁出斜边；根元素不裁，焦点轮廓才是完整的。
// 两块咬合处的包围盒是重叠的，所以根元素不接收指针事件，只让裁切后的 ::before 接收：
// 点击区和看到的形状一致，点在返回块的斜角上不会误触主页。
const block = cn(
  'pointer-events-none relative isolate m-0 box-border inline-flex h-11 shrink-0 cursor-pointer appearance-none items-center border-0 bg-transparent p-0 text-ark-neutral-white no-underline select-none',
  'before:pointer-events-auto before:absolute before:inset-0 before:-z-1',
  'before:transition-colors before:duration-(--ark-motion-duration-base) before:ease-ark-standard',
  'hover:text-ark-neutral-black hover:before:bg-ark-neutral-white',
  colorTransition,
  focusRing,
)

// 返回：左边贴着屏幕边缘是直的，右边整条斜边
const backBlock = 'w-26 pl-ark-4 before:bg-ark-neutral-graphite-deep before:ark-slant-r'
// 主页：平行四边形，往左缩进 2.5rem 与返回块咬合，中间留 4px 的缝
const homeBlock = cn(
  '-ml-10 w-28 justify-center gap-ark-1 before:bg-ark-neutral-graphite before:ark-slant-x',
  'aria-expanded:text-ark-neutral-black aria-expanded:before:bg-ark-neutral-white',
)

/**
 * 所有二级页面左上角的两个斜切色块：返回箭头和主页图标。位置、大小从不改变，
 * 用户不需要重新找路。定位交给使用方（通常是 `fixed top-0 left-0`）。
 *
 * 把一条 `QuickNav` 作为子元素传入，主页块就成了它的开关：点一下展开，
 * 按 Esc、点别处或者选了其中一项之后收起。
 */
export function BackHome({
  onBack,
  backHref,
  backLabel = '返回',
  onHome,
  homeHref,
  homeLabel = '主页',
  defaultExpanded = false,
  onExpandedChange,
  ref,
  className,
  onKeyDown,
  children,
  ...rest
}: BackHomeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const rootRef = useRef<HTMLDivElement>(null)
  const setRef = useMemo(() => mergeRefs(rootRef, ref), [ref])
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const expandable = children != null && children !== false

  const change = (next: boolean) => {
    setExpanded(next)
    onExpandedChange?.(next)
  }

  // 点别处收起
  useEffect(() => {
    if (!expanded) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setExpanded(false)
      onExpandedChange?.(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expanded, onExpandedChange])

  const backContent = <BackIcon className="size-6" />
  const homeContent = <HomeIcon className="size-5" />

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 只是接住里面的按钮、链接冒泡上来的 Esc，用来收起展开的内容；它自己不可聚焦
    <div
      data-ark="back-home"
      {...rest}
      ref={setRef}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (event.defaultPrevented || event.key !== 'Escape' || !expanded) return
        change(false)
        toggleRef.current?.focus()
      }}
      className={cn('relative box-border inline-flex', className)}
    >
      {backHref !== undefined ? (
        <a href={backHref} aria-label={backLabel} className={cn(block, backBlock)}>
          {backContent}
        </a>
      ) : (
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className={cn(block, backBlock)}
        >
          {backContent}
        </button>
      )}

      {expandable ? (
        <button
          ref={toggleRef}
          type="button"
          aria-label={homeLabel}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => change(!expanded)}
          className={cn(block, homeBlock)}
        >
          {homeContent}
          <span aria-hidden="true" className={triangleDown} />
        </button>
      ) : homeHref !== undefined ? (
        <a href={homeHref} aria-label={homeLabel} className={cn(block, homeBlock)}>
          {homeContent}
        </a>
      ) : (
        <button
          type="button"
          aria-label={homeLabel}
          onClick={onHome}
          className={cn(block, homeBlock)}
        >
          {homeContent}
        </button>
      )}

      {expandable && (
        // biome-ignore lint/a11y/noStaticElementInteractions: 只是监听里面链接冒泡上来的点击，用来在跳转后收起；它自己不是可交互的元素
        // biome-ignore lint/a11y/useKeyWithClickEvents: 用键盘激活链接同样会触发 click，不需要另外的键盘处理
        <div
          id={panelId}
          hidden={!expanded}
          onClick={event => {
            if ((event.target as Element).closest('a')) change(false)
          }}
          // 左缘对齐主页块的左下角（4rem），像是从它下面拉出来的；右边至少给视口留 1rem
          className="absolute top-full left-16 z-10 w-max max-w-[calc(100vw-5rem)] animate-ark-fade-in pt-ark-1"
        >
          {children}
        </div>
      )}
    </div>
  )
}
