import {
  Children,
  type ComponentProps,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from 'react'
import { HexagonIcon } from '../../internal/icons'
import { colorTransition, focusRing, thinScrollbar } from '../../utils/classes'
import { cn } from '../../utils/cn'
import { useControllableState } from '../../utils/useControllableState'

export type StageState = 'cleared' | 'current' | 'locked'

interface StageMapContextValue {
  value: string | undefined
  select: (value: string) => void
}

const StageMapContext = createContext<StageMapContextValue | null>(null)

// 列距固定是行距的 2 倍。连线画在一张以“行距”为单位的 SVG 上：一格横向是 2、纵向是 1，
// 和实际的像素比例一致，所以支线那段斜线是真正的 45°，不需要去量节点的位置
const COLUMN_RATIO = 2

interface Point {
  x: number
  y: number
}

interface PlacedNode {
  key: string
  child: ReactElement<StageNodeProps>
  value: string
  col: number
  row: number
  from: readonly string[]
  state: StageState
}

// 位置和连线都从节点的属性算出，不经过 effect：服务端渲染的结果里就有连线
function placeNodes(children: ReactNode): PlacedNode[] {
  const placed: PlacedNode[] = []
  let previous = 0
  for (const child of Children.toArray(children)) {
    if (!isValidElement<StageNodeProps>(child) || typeof child.props.value !== 'string') continue
    const { value, col = previous + 1, row = 0, from, state = 'cleared' } = child.props
    previous = col
    placed.push({
      key: child.key ?? value,
      child,
      value,
      col,
      row,
      from: from === undefined ? [] : typeof from === 'string' ? [from] : from,
      state,
    })
  }
  return placed
}

// 同一条线上是一段水平线；跨线时是“水平 → 45° → 水平”的折线，斜的那一段落在两列正中。
// 两列挨得太近、斜线走不完纵向的距离时，剩下的用一段竖线补上
function tracePath(from: Point, to: Point): string {
  if (from.y === to.y) return `M${from.x} ${from.y}H${to.x}`
  const dx = to.x - from.x
  const dy = to.y - from.y
  const run = Math.min(Math.abs(dx), Math.abs(dy))
  const middle = (from.x + to.x) / 2
  const x1 = middle - (Math.sign(dx) * run) / 2
  const x2 = middle + (Math.sign(dx) * run) / 2
  const y2 = from.y + Math.sign(dy) * run
  return `M${from.x} ${from.y}H${x1}L${x2} ${y2}V${to.y}H${to.x}`
}

export interface StageMapProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  /** 选中的关卡。受控：请在 `onValueChange` 里更新它。 */
  value?: string
  /** 一开始选中的关卡（非受控）。 */
  defaultValue?: string
  /** 选中的关卡变化时调用，通常用来更新旁边的关卡详情。 */
  onValueChange?: (value: string) => void
}

/**
 * 关卡地图：关卡不是一张列表，而是一条横向延伸的路线——每一关是一条带编号的白色横条，
 * 之间用 3px 的白线相连，支线向上下分叉。关卡之间的先后与分支用空间位置来表达。
 *
 * 子元素是若干个 `StageNode`，必须是直接子元素：各自用 `col`、`row` 说明自己在哪，
 * 用 `from` 说明从哪一关连过来。已通关的连线是实白线，通向未解锁关卡的是暗的虚线。
 * 行距由 `--ark-stage-pitch` 决定，默认 5rem，列距是它的两倍。放不下时横向滚动。
 *
 * 选中一关不会离开这一页：详情放在旁边的面板里，“开始行动”的代价直接写在按钮上。
 * 请用 `aria-label` 说明这是哪一章。
 */
export function StageMap({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...rest
}: StageMapProps) {
  const [current, select] = useControllableState<string | undefined>(value, defaultValue, next => {
    if (next !== undefined) onValueChange?.(next)
  })

  const nodes = placeNodes(children)
  const cols = Math.max(1, ...nodes.map(node => node.col))
  const top = Math.min(0, ...nodes.map(node => node.row))
  const rows = Math.max(0, ...nodes.map(node => node.row)) - top + 1
  const centers = new Map<string, Point>(
    nodes.map(node => [
      node.value,
      { x: (node.col - 0.5) * COLUMN_RATIO, y: node.row - top + 0.5 },
    ]),
  )
  const edges = nodes.flatMap(node =>
    node.from.flatMap(source => {
      const start = centers.get(source)
      const end = centers.get(node.value)
      if (!start || !end) return []
      return [
        {
          key: `${source}>${node.value}`,
          d: tracePath(start, end),
          locked: node.state === 'locked',
        },
      ]
    }),
  )

  return (
    <StageMapContext value={{ value: current, select }}>
      {/* biome-ignore lint/a11y/useSemanticElements: 这是一组关卡按钮，不是表单的 fieldset */}
      <div
        data-ark="stage-map"
        data-ark-tone="dark"
        role="group"
        {...rest}
        className={cn(
          // 四周留 0.5rem：横向滚动的容器会裁掉溢出的部分，焦点轮廓要落在这圈留白里
          'box-border max-w-full overflow-x-auto p-ark-2 font-ark-cjk-sans text-ark-fg',
          thinScrollbar,
          className,
        )}
      >
        <div className="relative isolate w-max">
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${cols * COLUMN_RATIO} ${rows}`}
            preserveAspectRatio="none"
            fill="none"
            className="pointer-events-none absolute inset-0 -z-1 block size-full"
          >
            {edges.map(edge => (
              <path
                key={edge.key}
                d={edge.d}
                // 线宽和虚线按屏幕像素算，不跟着这张图一起放大
                vectorEffect="non-scaling-stroke"
                // 实机的连线约 3px，实白
                strokeWidth={3}
                strokeDasharray={edge.locked ? '4 4' : undefined}
                className={edge.locked ? 'stroke-ark-fg/30' : 'stroke-ark-fg'}
              />
            ))}
          </svg>
          <ul
            className="m-0 grid list-none auto-rows-[var(--ark-stage-pitch,5rem)] p-0"
            style={{
              gridTemplateColumns: `repeat(${cols}, calc(var(--ark-stage-pitch, 5rem) * ${COLUMN_RATIO}))`,
            }}
          >
            {nodes.map(node => (
              <li
                key={node.key}
                className="grid place-items-center"
                style={{ gridColumn: node.col, gridRow: node.row - top + 1 }}
              >
                {node.child}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StageMapContext>
  )
}

export interface StageNodeProps extends Omit<ComponentProps<'button'>, 'value' | 'name'> {
  /** 关卡的标识。地图用它来认选中项，连线也用它来指认上一关。 */
  value: string
  /** 在地图的第几列，从 1 起，沿路线往右数。不给就排在上一个节点的下一列。 */
  col?: number
  /**
   * 在哪一条线上：`0` 是主线，负数往上、正数往下分叉。
   * @default 0
   */
  row?: number
  /** 从哪一关（或哪几关）连过来：填它们的 `value`。 */
  from?: string | readonly string[]
  /**
   * 进度，用左端的六边形和明暗区分。
   * - `cleared`：已通关，白底深字，六边形是实心的信号色
   * - `current`：当前要打的那一关，白底深字，六边形是空心的
   * - `locked`：未解锁，最暗、虚线描边，没有六边形，默认不可选
   * @default 'cleared'
   */
  state?: StageState
  /** 编号上方的一行极小的英文，如 `OPERATION`。纯装饰，对读屏隐藏。 */
  caption?: ReactNode
  /** 中文关卡名，写在编号下方。编号是主要文字，它是副题。 */
  name?: ReactNode
  /** 选中。放在 `StageMap` 里时由地图决定，不用给。 */
  selected?: boolean
  /** 给读屏的进度说明。默认是“已通关”“当前”“未解锁”。 */
  stateLabel?: string
}

const stateLabels: Record<StageState, string> = {
  cleared: '已通关',
  current: '当前',
  locked: '未解锁',
}

const base = cn(
  'relative m-0 box-border inline-flex h-9 min-w-24 cursor-pointer appearance-none items-stretch border border-transparent p-0 font-ark-data text-ark-body leading-ark-solid font-ark-bold whitespace-nowrap select-none',
  // 选中：整条明暗对调，变成黑底白字（实机的做法）。实机的地图是亮的，黑条自己就看得清；
  // 这里再描一圈白边，压在深色背景上时条的边界才不会消失
  'aria-pressed:border-ark-neutral-white aria-pressed:bg-ark-neutral-black aria-pressed:text-ark-neutral-white',
  colorTransition,
  focusRing,
)

// 已通关和当前都是白底深字，靠左端的六边形区分；悬停整块换成信号色
const open =
  'bg-ark-neutral-white text-ark-neutral-black not-disabled:hover:bg-ark-signal not-disabled:hover:text-ark-on-signal'

// 节点是压在地图上的实心横条，明暗是固定的，不跟随所在面板的明暗上下文。
// 实心的底同时把从节点中心出发的连线盖住
const states: Record<StageState, string> = {
  cleared: open,
  current: open,
  // 未解锁没有实机出处（估计）：最暗，虚线描边是明暗之外的第二种标记
  locked:
    'border-dashed border-ark-neutral-gray-600 bg-ark-neutral-ink-900 text-ark-neutral-gray-500',
}

/**
 * 一个关卡节点：一条白色的横条，左端一个六边形的通关标记，右边是数据体的编号
 * （`1-7`、`TR-1`）。`children` 是编号。选中时整条变成黑底白字。
 *
 * 通常放在 `StageMap` 里，由地图负责摆位、连线和选中；也可以单独当一个关卡标签用。
 */
export function StageNode({
  value,
  col: _col,
  row: _row,
  from: _from,
  state = 'cleared',
  caption,
  name,
  selected = false,
  stateLabel = stateLabels[state],
  disabled,
  className,
  onClick,
  children,
  ...rest
}: StageNodeProps) {
  const map = useContext(StageMapContext)
  return (
    <button
      data-ark="stage-node"
      data-ark-tone="dark"
      data-state={state}
      type="button"
      aria-pressed={map ? map.value === value : selected}
      disabled={disabled ?? state === 'locked'}
      {...rest}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) map?.select(value)
      }}
      className={cn(base, states[state], 'disabled:cursor-not-allowed', className)}
    >
      {state !== 'locked' && (
        // 六边形压在一格黑底上：信号色在白条上不够清楚，在黑底上才醒目
        <span
          data-ark="stage-node-mark"
          className={cn(
            'grid w-8 shrink-0 place-items-center bg-ark-neutral-black',
            state === 'cleared' ? 'text-ark-signal' : 'text-ark-neutral-white',
          )}
        >
          <HexagonIcon hollow={state === 'current'} className="block size-4" />
        </span>
      )}
      <span className="grid grow content-center justify-items-start gap-0.5 px-ark-3">
        {caption != null && (
          <span
            aria-hidden="true"
            className="font-ark-latin-condensed text-[0.5rem] leading-ark-solid font-ark-medium tracking-ark-wide uppercase opacity-70"
          >
            {caption}
          </span>
        )}
        <span>{children}</span>
      </span>
      {name != null && (
        <span
          className={cn(
            'absolute top-full left-1/2 mt-ark-1 -translate-x-1/2 font-ark-cjk-sans text-ark-caption leading-ark-solid font-ark-regular whitespace-nowrap',
            state === 'locked' ? 'text-ark-neutral-gray-500' : 'text-ark-neutral-gray-300',
          )}
        >
          {name}
        </span>
      )}
      <span className="sr-only">{stateLabel}</span>
    </button>
  )
}
