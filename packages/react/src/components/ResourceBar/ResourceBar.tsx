import { type ComponentProps, createContext, type ReactNode, useContext, useId } from 'react'
import { PlusIcon } from '../../internal/icons'
import { brighterMuted, colorTransition, focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { formatStatValue } from '../Stat'

const PlainContext = createContext(false)

export interface ResourceBarProps extends ComponentProps<'dl'> {
  /**
   * 不画每一项的半透明底，数字直接压在场景上（主界面的写法）。
   * 二级页面用默认的深色块。
   */
  plain?: boolean
}

/**
 * 资源条：贴在右上角的一排资源数量，和左上角的“返回 + 主页”一样位置固定。
 * 定位交给使用方（通常是 `fixed top-0 right-0`）。
 *
 * 子元素是若干个 `Resource`。整体是一个描述列表：名称是 `<dt>`，数量是 `<dd>`。
 */
export function ResourceBar({ plain = false, className, ...rest }: ResourceBarProps) {
  return (
    <PlainContext value={plain}>
      <dl
        data-ark="resource-bar"
        data-ark-tone="dark"
        {...rest}
        className={cn(
          'm-0 box-border inline-flex flex-wrap justify-end font-ark-cjk-sans text-ark-fg',
          plain ? 'gap-ark-4' : 'gap-ark-1',
          brighterMuted,
          className,
        )}
      />
    </PlainContext>
  )
}

export interface ResourceProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 资源的名称，如“龙门币”。有图标时它只读给读屏。 */
  label: ReactNode
  /** 数量。数字自动加千分位，字符串原样输出。 */
  value: number | string
  /** 上限，写成小而灰的分母（理智 `131/135`）。 */
  max?: number | string
  /** 资源的图标。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
  /**
   * 把名称也显示出来。实机里只有图标和数字，所以默认是：有图标就只读给读屏，没有图标才显示。
   */
  showLabel?: boolean
  /** 给了就在数字后面画一个圆形的加号：补充这种资源的入口。 */
  onAdd?: () => void
  /**
   * 加号按钮的名称，读屏会连同资源的名称一起念出来（“补充 合成玉”）。
   * @default '补充'
   */
  addLabel?: string
}

/** 资源条里的一项：图标加数据体数字。只能放在 `ResourceBar` 里。 */
export function Resource({
  label,
  value,
  max,
  icon,
  showLabel = icon == null,
  onAdd,
  addLabel = '补充',
  className,
  ...rest
}: ResourceProps) {
  const plain = useContext(PlainContext)
  const nameId = useId()
  const addId = useId()
  return (
    <div
      data-ark="resource"
      {...rest}
      className={cn(
        'box-border flex h-8 items-center gap-ark-2 whitespace-nowrap',
        plain
          ? // 没有底的时候靠一圈很小的暗影把数字从场景里托出来
            '[text-shadow:0_0.0625rem_0.125rem_rgb(0_0_0/0.7)]'
          : // 黑 65%：压在场景上仍然够暗，白色数字读得清
            'bg-ark-neutral-black/65 px-ark-3',
        className,
      )}
    >
      <dt className="flex items-center gap-ark-1 text-ark-caption leading-ark-solid font-ark-regular text-ark-fg-muted">
        {icon != null && (
          <span
            aria-hidden="true"
            className="grid size-5 shrink-0 place-items-center text-ark-fg [&>svg]:block [&>svg]:size-full"
          >
            {icon}
          </span>
        )}
        <span id={nameId} className={cn(!showLabel && 'sr-only')}>
          {label}
        </span>
      </dt>
      <dd
        className={cn(
          'm-0 flex items-center gap-ark-2 font-ark-data leading-ark-solid',
          plain ? 'text-ark-body' : 'text-ark-label',
        )}
      >
        <span className="flex items-baseline">
          <b className="font-ark-bold">{formatStatValue(value)}</b>
          {max !== undefined && (
            <span className="text-ark-caption font-ark-regular text-ark-fg-muted">
              /{formatStatValue(max)}
            </span>
          )}
        </span>
        {onAdd !== undefined && (
          <button
            type="button"
            id={addId}
            aria-label={addLabel}
            // 名称由自己的 aria-label 和资源的名称拼成，几个加号才分得开
            aria-labelledby={`${addId} ${nameId}`}
            onClick={onAdd}
            className={cn(
              'relative m-0 box-border grid size-4 shrink-0 cursor-pointer appearance-none place-items-center rounded-full border-0 bg-ark-neutral-white p-0 text-ark-neutral-black [text-shadow:none]',
              'hover:bg-ark-signal hover:text-ark-on-signal',
              // 可见的圆只有 16px，点击区撑到 44px
              'after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2',
              colorTransition,
              focusRing,
            )}
          >
            <PlusIcon className="size-3 [&_path]:stroke-[3.5]" />
          </button>
        )}
      </dd>
    </div>
  )
}
