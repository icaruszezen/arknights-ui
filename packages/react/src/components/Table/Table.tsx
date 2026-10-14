import { type ComponentProps, createContext, useContext } from 'react'
import { focusRing, focusRingInset, thinScrollbar, triangleDown } from '../../utils/classes'
import { cn } from '../../utils/cn'

export type TableDensity = 'compact' | 'regular'
export type TableSort = 'asc' | 'desc' | 'none'

const DensityContext = createContext<TableDensity>('regular')

export interface TableProps extends ComponentProps<'table'> {
  /**
   * 行高：`compact` 2.25rem、`regular` 3rem。
   * @default 'regular'
   */
  density?: TableDensity
  /**
   * 表头固定在滚动容器的顶上。要给外层一个高度（用 `wrapperClassName`）。
   * 表头的底取默认面的颜色；表格放在别的面上时，用 `className` 换成那个面的颜色。
   */
  stickyHeader?: boolean
  /** 外面那层滚动容器的类名。表格比容器宽时在它里面横向滚动。 */
  wrapperClassName?: string
}

/**
 * 表格：行与行之间只有一条 1px 的细线，不给每行铺底色。表头是窄体的灰色小字；
 * 数字一列用数据体、靠右对齐，上下才比得了大小。
 *
 * 结构就是原生的 `<table>`：`TableHead`、`TableBody`、`TableRow`、`TableHeaderCell`、`TableCell`
 * 各对应一个原生元素。请放一个 `<caption>`，或用 `aria-label` 给表格命名。
 */
export function Table({
  density = 'regular',
  stickyHeader = false,
  wrapperClassName,
  className,
  ...rest
}: TableProps) {
  return (
    <DensityContext value={density}>
      <div
        data-ark="table"
        // 表头固定说明外层有固定的高度、会上下滚动：让键盘也能进去滚
        tabIndex={stickyHeader ? 0 : undefined}
        className={cn(
          // relative：里面绝对定位的东西（给读屏的隐藏文字）要以滚动容器为准，否则会把整页撑宽
          'relative box-border w-full overflow-x-auto',
          stickyHeader && ['overflow-y-auto', focusRingInset],
          thinScrollbar,
          wrapperClassName,
        )}
      >
        <table
          data-density={density}
          data-sticky={stickyHeader || undefined}
          {...rest}
          className={cn(
            'w-full border-collapse font-ark-cjk-sans text-ark-label leading-ark-snug text-ark-fg',
            '[&>caption]:pb-ark-3 [&>caption]:text-left [&>caption]:text-ark-caption [&>caption]:text-ark-fg-muted',
            // 固定的表头要有不透明的底，行才不会从它后面透出来
            stickyHeader &&
              '[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-1 [&_thead_th]:bg-ark-surface',
            className,
          )}
        />
      </div>
    </DensityContext>
  )
}

/** 表头，对应 `<thead>`。 */
export function TableHead(props: ComponentProps<'thead'>) {
  return <thead data-ark="table-head" {...props} />
}

/** 表体，对应 `<tbody>`。 */
export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody data-ark="table-body" {...props} />
}

export interface TableRowProps extends ComponentProps<'tr'> {
  /** 选中：左缘一条信号色的边，同时输出 `aria-selected`。 */
  selected?: boolean
}

/** 一行，对应 `<tr>`。表体里的行悬停时略微提亮。 */
export function TableRow({ selected, className, ...rest }: TableRowProps) {
  return (
    <tr
      data-ark="table-row"
      aria-selected={selected}
      {...rest}
      className={cn(
        'transition-colors duration-(--ark-motion-duration-fast) ease-ark-standard',
        '[tbody>&]:hover:bg-ark-fg/5',
        // 选中的行：左缘 4px 的色边画成内阴影，不占宽度，各列不会因此错位
        'aria-selected:bg-ark-fg/5 aria-selected:shadow-[inset_var(--ark-line-strong)_0_0_var(--ark-signal)]',
        className,
      )}
    />
  )
}

const paddings: Record<TableDensity, string> = {
  compact: 'h-9 px-ark-3 py-ark-1',
  regular: 'h-12 px-ark-4 py-ark-2',
}

export interface TableHeaderCellProps extends ComponentProps<'th'> {
  /** 数字列：靠右对齐。 */
  numeric?: boolean
  /**
   * 这一列当前的排序。给了它，表头就是一个可以点的按钮，并输出 `aria-sort`；
   * 没在排这一列时给 `'none'`。
   */
  sort?: TableSort
  /** 点表头时调用。接下来按什么排由使用方决定。 */
  onSort?: () => void
}

const ariaSort = { asc: 'ascending', desc: 'descending', none: 'none' } as const

/** 表头的一格，对应 `<th scope="col">`。窄体的灰色小字，下面一条比行线重的线。 */
export function TableHeaderCell({
  numeric = false,
  sort,
  onSort,
  className,
  children,
  ...rest
}: TableHeaderCellProps) {
  const density = useContext(DensityContext)
  return (
    <th
      data-ark="table-header-cell"
      scope="col"
      aria-sort={sort !== undefined ? ariaSort[sort] : undefined}
      {...rest}
      className={cn(
        'box-border border-0 border-b border-solid border-ark-rule-strong text-left align-middle font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide whitespace-nowrap text-ark-fg-muted uppercase',
        paddings[density],
        numeric && 'text-right',
        className,
      )}
    >
      {sort !== undefined ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'm-0 inline-flex cursor-pointer appearance-none items-center gap-ark-1 border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] tracking-[inherit] text-inherit uppercase hover:text-ark-fg',
            sort !== 'none' && 'text-ark-fg',
            focusRing,
          )}
        >
          {children}
          {/* 三角指向排序的方向；没在排这一列时淡成一个提示 */}
          <span
            aria-hidden="true"
            className={cn(
              triangleDown,
              'scale-75',
              sort === 'asc' && 'rotate-180',
              sort === 'none' && 'opacity-30',
            )}
          />
        </button>
      ) : (
        children
      )}
    </th>
  )
}

export interface TableCellProps extends ComponentProps<'td'> {
  /** 数字列：数据体、等宽数字、靠右对齐。 */
  numeric?: boolean
}

/** 表体的一格，对应 `<td>`。 */
export function TableCell({ numeric = false, className, ...rest }: TableCellProps) {
  const density = useContext(DensityContext)
  return (
    <td
      data-ark="table-cell"
      {...rest}
      className={cn(
        'box-border border-0 border-b border-solid border-ark-rule align-middle',
        paddings[density],
        numeric && 'text-right font-ark-data tabular-nums',
        className,
      )}
    />
  )
}
