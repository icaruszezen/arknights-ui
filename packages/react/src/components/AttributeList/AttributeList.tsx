import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
} from 'react'
import { cn } from '../../utils/cn'
import { clampProgress } from '../../utils/progress'
import { formatStatValue } from '../Stat'

export type AttributeListColumns = 1 | 2

const ColumnsContext = createContext<AttributeListColumns>(1)

export interface AttributeListProps extends ComponentProps<'dl'> {
  /**
   * 排成几列。干员详情页是两列：左边生命、攻击、防御、法抗，右边再部署、费用、阻挡、攻速。
   * @default 1
   */
  columns?: AttributeListColumns
}

// 所有项共用同一组列：名称一列、数值一列，数值条的左缘才对得齐。两列时中间夹一条 1rem 的空列
const templates: Record<AttributeListColumns, string> = {
  1: 'grid-cols-[auto_minmax(0,1fr)]',
  2: 'grid-cols-[auto_minmax(0,1fr)_1rem_auto_minmax(0,1fr)]',
}

/**
 * 属性表：干员详情页左侧的生命上限、攻击、防御那几项。每项是一个小图标加数值，
 * 数值背后一条半透明的条表示它的相对高低。
 *
 * 子元素是若干个 `Attribute`。整体是一个描述列表：名称是 `<dt>`，数值是 `<dd>`。
 * 宽度由使用方决定（如 `w-48`）。
 */
export function AttributeList({ columns = 1, className, ...rest }: AttributeListProps) {
  return (
    <ColumnsContext value={columns}>
      <dl
        data-ark="attribute-list"
        {...rest}
        className={cn(
          'm-0 box-border grid gap-y-ark-1 font-ark-cjk-sans text-ark-fg',
          templates[columns],
          className,
        )}
      />
    </ColumnsContext>
  )
}

export interface AttributeProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** 属性名，如“生命上限”。给了 `icon` 时默认只读给读屏。 */
  label: ReactNode
  /** 数值。数字自动加千分位，字符串和节点原样输出。 */
  value: ReactNode
  /** 单位，跟在数值后面。 */
  unit?: ReactNode
  /** 名称前的小图标，压在一块黑底方块上。组件库不带图标，请自备；它对读屏隐藏。 */
  icon?: ReactNode
  /**
   * 把名称也显示出来。实机上只有图标没有文字，所以给了 `icon` 时默认不显示；
   * 没有图标时名称总是显示的。
   * @default 没有图标时为 true
   */
  showLabel?: boolean
  /**
   * 相对值：这个数值在同类里的相对高低，0 到 1。给了就在数值背后垫一条半透明的条，
   * 不用读数字就能比较。它只是数值的第二种表达，对读屏隐藏。
   */
  meter?: number
}

// 条画在 <dd> 的两个伪元素上：::before 是轨道，::after 是相对值，都垫在数字后面。
// 不另加元素——描述列表里的一组只能有 <dt> 和 <dd>
const meterLayer = cn(
  'before:absolute before:inset-0 before:-z-1 before:bg-ark-fg/10',
  'after:absolute after:inset-y-0 after:left-0 after:-z-1 after:w-(--ark-attribute-meter) after:bg-ark-fg/30',
  'after:transition-[width] after:duration-(--ark-motion-duration-base) after:ease-ark-standard motion-reduce:after:transition-none',
)

/** 属性表里的一项。只能放在 `AttributeList` 里。 */
export function Attribute({
  label,
  value,
  unit,
  icon,
  showLabel = icon == null,
  meter,
  className,
  style,
  ...rest
}: AttributeProps) {
  const columns = useContext(ColumnsContext)
  const hasMeter = meter !== undefined
  return (
    <div
      data-ark="attribute"
      {...rest}
      className={cn(
        // 子网格：这一项自己有盒子，两格仍然对齐到列表的列
        'col-span-2 box-border grid h-6 grid-cols-subgrid items-stretch',
        columns === 2 && 'odd:col-start-1 even:col-start-4',
        className,
      )}
      style={
        hasMeter
          ? ({
              '--ark-attribute-meter': `${clampProgress(meter, 1).percent}%`,
              ...style,
            } as CSSProperties)
          : style
      }
    >
      <dt className="m-0 flex items-center gap-ark-2 text-ark-label leading-ark-solid font-ark-regular text-ark-fg-secondary">
        {icon != null && (
          // 黑底白色的小方块是固定的，不跟随明暗上下文
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center bg-ark-neutral-black text-ark-neutral-white [&>svg]:block [&>svg]:size-3.5"
          >
            {icon}
          </span>
        )}
        <span className={cn(showLabel ? 'pr-ark-3' : 'sr-only')}>{label}</span>
      </dt>
      <dd
        className={cn(
          'relative isolate m-0 flex min-w-0 items-center px-ark-2 font-ark-data text-[1rem] leading-ark-solid font-ark-regular',
          hasMeter && meterLayer,
        )}
      >
        {typeof value === 'number' ? formatStatValue(value) : value}
        {unit != null && (
          <span className="ml-ark-1 text-ark-caption font-ark-regular text-ark-fg-muted">
            {unit}
          </span>
        )}
      </dd>
    </div>
  )
}
