import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export type RewardGlowTier = 1 | 2 | 3 | 4 | 5 | 6

export interface RewardGlowProps extends ComponentProps<'span'> {
  /** 用哪一档稀有度的颜色发光：光的颜色在看清物品之前就预告了稀有度。不给就是白光。 */
  tier?: RewardGlowTier
}

const tiers: Record<RewardGlowTier, string> = {
  1: '[--ark-glow:var(--ark-color-tier-1)]',
  2: '[--ark-glow:var(--ark-color-tier-2)]',
  3: '[--ark-glow:var(--ark-color-tier-3)]',
  4: '[--ark-glow:var(--ark-color-tier-4)]',
  5: '[--ark-glow:var(--ark-color-tier-5)]',
  6: '[--ark-glow:var(--ark-color-tier-6)]',
}

// 放射条：每 15° 一道 4° 宽的光，向外渐隐。直径是内容的三倍，四周各伸出一个内容的宽度
const rays = cn(
  'before:pointer-events-none before:absolute before:-inset-full before:-z-1 before:opacity-70',
  'before:[background:repeating-conic-gradient(var(--ark-glow)_0_4deg,transparent_4deg_15deg)]',
  'before:[mask-image:radial-gradient(closest-side,#000_30%,transparent)]',
)

// 中心一圈柔和的光晕，把放射条的根部连成一片。直径是内容的两倍
const halo = cn(
  'after:pointer-events-none after:absolute after:-inset-1/2 after:-z-1 after:opacity-60',
  'after:[background:radial-gradient(closest-side,var(--ark-glow),transparent)]',
)

/**
 * 奖励的光：获得物品时，图标背后一圈静态的放射光。
 *
 * 这是整套界面里少数允许“发光”的地方，因为它标记的是一次正向的结果。
 * 只用在这一个时刻，不要拿它装饰普通的图标。光是静态的，没有动画。
 */
export function RewardGlow({ tier, className, ...rest }: RewardGlowProps) {
  return (
    <span
      data-ark="reward-glow"
      {...rest}
      className={cn(
        'relative isolate box-border inline-grid place-items-center [--ark-glow:var(--ark-color-neutral-white)]',
        tier !== undefined && tiers[tier],
        rays,
        halo,
        className,
      )}
    />
  )
}
