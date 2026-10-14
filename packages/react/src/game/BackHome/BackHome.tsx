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

// 实机里是两个并排的直角矩形，没有斜边。宽度按 1280×720 的实机裁图折算：
// 返回约 142 × 45px，主页约 208 × 45px。竖屏放不下这么宽，各收窄一档。
const block = cn(
  'relative m-0 box-border inline-flex h-11 shrink-0 cursor-pointer appearance-none items-center border-0 p-0 text-ark-neutral-white no-underline select-none',
  'hover:bg-ark-neutral-white hover:text-ark-neutral-black',
  colorTransition,
  focusRing,
)

// 返回：深灰（#313131，实机取色），细线箭头贴左
const backBlock = 'w-36 bg-ark-neutral-graphite-deep pl-ark-5 portrait:w-24'
// 主页：稍浅、更宽的一块，图标居中；与返回块之间留 2px 的缝
const homeBlock = cn(
  'ml-0.5 w-52 justify-center gap-ark-1 bg-ark-neutral-graphite portrait:w-32',
  // 展开时描一圈 2px 的白边，不换底色
  'aria-expanded:shadow-[inset_0_0_0_2px_var(--ark-color-neutral-white)]',
)

/**
 * 所有二级页面左上角的两个并排色块：返回箭头和主页图标。位置、大小从不改变，
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

  const backContent = <BackIcon className="size-8" />
  const homeContent = <HomeIcon className="size-6" />

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
          // 从两个色块的下面拉出来，左缘对齐；右边至少给视口留 1rem
          className="absolute top-full left-0 z-10 w-max max-w-[calc(100vw-1rem)] animate-ark-fade-in pt-ark-1"
        >
          {children}
        </div>
      )}
    </div>
  )
}
