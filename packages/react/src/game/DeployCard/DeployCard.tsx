import type { ComponentProps, ReactNode } from 'react'
import { focusRing } from '../../utils/classes'
import { cn } from '../../utils/cn'

export interface DeployCardProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** 部署费用，写在顶部的黑底方块里。 */
  cost: number
  /** 这名干员的名字，读屏会念出来（卡面上没有文字）。 */
  label: string
  /** 头像的地址：胸像，脸落在上三分之一。 */
  src?: string
  /** 顶部、费用左边的职业图标，压在浅灰的方块上。组件库不带图标，请自备；它对读屏隐藏。 */
  classIcon?: ReactNode
  /** 选中：上浮并加一圈描边，同时输出 `aria-pressed`。 */
  selected?: boolean
  /** 费用不足：卡面压暗，费用数字变灰。 */
  insufficient?: boolean
  /** 再部署冷却还剩多少秒。大于 0 时卡面压暗，中间盖上倒计时数字。 */
  cooldown?: number
}

const base = cn(
  // 6.5rem 宽、5:6：实机的卡片折到 1280 宽约 105 × 126px
  'group relative isolate m-0 box-border block aspect-[5/6] w-[6.5rem] shrink-0 cursor-pointer appearance-none overflow-hidden border-0 bg-ark-neutral-graphite p-0 text-ark-neutral-white select-none',
  // 描边画在 ::after 上，盖在头像上面
  'after:pointer-events-none after:absolute after:inset-0 after:border after:border-transparent',
  'after:transition-colors after:duration-(--ark-motion-duration-base) after:ease-ark-standard',
  'transition-[translate] duration-(--ark-motion-duration-fast) ease-ark-standard',
  // 悬停：略微上浮，描边浮现
  'not-disabled:hover:after:border-ark-neutral-white/60 motion-safe:not-disabled:hover:-translate-y-1',
  'disabled:cursor-not-allowed',
  focusRing,
)

// 选中：上浮得更高，描边变实。减少动效时不位移，描边仍然在
const selectedClasses =
  'after:border-ark-neutral-white not-disabled:hover:after:border-ark-neutral-white motion-safe:-translate-y-2 motion-safe:not-disabled:hover:-translate-y-2'

/**
 * 作战界面底部卡带里的一张可部署干员卡：顶部并排两格——浅灰底的职业图标和黑底的费用，
 * 选中的那张上浮并加描边。
 *
 * 状态用明暗和数字表达，不需要额外的文字：费用不足时卡面变暗、数字变灰；
 * 再部署冷却时卡面变暗，盖上倒计时。这些状态同样会读给读屏；
 * 想换一种说法就直接给 `aria-label`，记得把卡面上看得见的费用也写进去。
 *
 * 默认 6.5rem 宽、5:6；多张并排时留 4px 的缝，底边对齐（选中的那张会比别人高出一截）。
 */
export function DeployCard({
  cost,
  label,
  src,
  classIcon,
  selected = false,
  insufficient = false,
  cooldown,
  className,
  ...rest
}: DeployCardProps) {
  const cooling = cooldown !== undefined && cooldown > 0
  const dimmed = insufficient || cooling
  return (
    <button
      data-ark="deploy-card"
      data-ark-tone="dark"
      type="button"
      aria-pressed={selected}
      {...rest}
      className={cn(base, selected && selectedClasses, className)}
    >
      {/* 名字在 DOM 最前：读屏先读到是谁，再读费用和状态 */}
      <span className="sr-only">{label}</span>
      {src !== undefined && (
        <img
          src={src}
          alt=""
          className={cn(
            'absolute inset-0 -z-1 m-0 block size-full max-w-none border-0 object-cover object-[50%_15%] select-none',
            'transition-[filter] duration-(--ark-motion-duration-base) ease-ark-standard',
            dimmed && 'brightness-[0.4] saturate-50',
          )}
        />
      )}
      {/* 顶部正中并排的两格，各 1.5rem 高：职业图标在左，费用在右 */}
      <span className="absolute top-0 left-1/2 flex -translate-x-1/2 leading-ark-solid">
        {classIcon != null && (
          <span
            aria-hidden="true"
            className={cn(
              'grid size-6 shrink-0 place-items-center text-ark-neutral-black [&>svg]:block [&>svg]:size-4',
              dimmed ? 'bg-ark-neutral-gray-500' : 'bg-ark-neutral-gray-300',
            )}
          >
            {classIcon}
          </span>
        )}
        <span
          className={cn(
            'box-border grid h-6 min-w-7 place-items-center bg-ark-neutral-black px-ark-1 font-ark-data text-ark-body font-ark-regular',
            // 实机上买不起的卡数字是灰的，不是红的。黑底上的 gray-500 是 6.4:1
            insufficient && 'text-ark-neutral-gray-500',
          )}
        >
          <span className="sr-only">费用</span>
          {cost}
        </span>
      </span>
      {insufficient && <span className="sr-only">费用不足</span>}
      {cooling && (
        <span className="absolute inset-0 grid place-items-center font-ark-data text-ark-h2 leading-ark-solid font-ark-bold">
          <span className="sr-only">再部署冷却</span>
          {Math.ceil(cooldown)}
          <span className="sr-only">秒</span>
        </span>
      )}
    </button>
  )
}
