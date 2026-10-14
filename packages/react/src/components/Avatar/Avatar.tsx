import { type ComponentProps, type ReactNode, useState } from 'react'
import { cn } from '../../utils/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'busy' | 'offline'

export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** 头像图片。加载不出来时退回到名字的缩写。 */
  src?: string
  /**
   * 这是谁。它是头像的名称，没有图片时取它的头两个字符做缩写。
   * 旁边已经写了名字、头像只是装饰时可以不给。
   */
  name?: string
  /** 没有图片时显示的内容，代替名字的缩写（比如一个图标）。 */
  fallback?: ReactNode
  /**
   * 边长：2rem / 2.5rem / 3.5rem / 5rem。
   * @default 'md'
   */
  size?: AvatarSize
  /**
   * 形状。默认是直角的方块；圆形只在需要和周围的方块区分开时用。
   * @default 'square'
   */
  shape?: 'square' | 'circle'
  /** 右下角的状态角标：在线是绿色的实块，忙碌是黄色，离线是空心的灰框。 */
  status?: AvatarStatus
  /** 状态读给读屏的说法，如“在线”。不给时角标只是装饰。 */
  statusLabel?: string
  /** 外面套一圈信号色的框：当前选中的人、正在说话的人。 */
  ring?: boolean
}

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-ark-caption',
  md: 'size-10 text-ark-label',
  lg: 'size-14 text-ark-body',
  xl: 'size-20 text-ark-h2',
}

// 形状之外再靠明暗区分：在线和忙碌是实块，离线是空心的框
const statuses: Record<AvatarStatus, string> = {
  online: 'bg-ark-signal-success',
  busy: 'bg-ark-signal-action',
  offline: 'border border-ark-fg-muted bg-ark-surface',
}

const initials = (name: string) => Array.from(name.trim()).slice(0, 2).join('').toUpperCase()

/**
 * 头像：一个直角的方块。没有图片时显示名字的头两个字符，窄体。
 *
 * 状态角标贴在右下角，外面一圈和底同色的缝把它和头像分开。
 * 组件库不带任何头像图片，请使用原创或已获授权的素材。
 */
export function Avatar({
  src,
  name,
  fallback,
  size = 'md',
  shape = 'square',
  status,
  statusLabel,
  ring = false,
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState<string>()
  const showImage = src !== undefined && failed !== src
  // 有图片时名称由 <img alt> 给；没有图片时这一块自己当一张图。role 和 aria-label 必须一起出现
  const label = name ?? rest['aria-label']
  const named =
    !showImage && label !== undefined ? ({ role: 'img', 'aria-label': label } as const) : undefined
  const statusNamed =
    statusLabel !== undefined
      ? ({ role: 'img', 'aria-label': statusLabel } as const)
      : ({ 'aria-hidden': true } as const)
  return (
    <span
      data-ark="avatar"
      {...named}
      {...rest}
      className={cn(
        'relative box-border inline-grid shrink-0 place-items-center bg-ark-control align-middle font-ark-latin-condensed leading-ark-solid font-ark-medium text-ark-fg select-none',
        sizes[size],
        shape === 'circle' && 'rounded-full',
        ring && 'outline-2 outline-offset-2 outline-ark-signal',
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ?? ''}
          onError={() => setFailed(src)}
          className={cn('block size-full object-cover', shape === 'circle' && 'rounded-full')}
        />
      ) : (
        <span aria-hidden="true">{fallback ?? (name !== undefined ? initials(name) : null)}</span>
      )}
      {status !== undefined && (
        <span
          data-ark="avatar-status"
          data-status={status}
          {...statusNamed}
          className={cn(
            'absolute -right-0.5 -bottom-0.5 box-content size-[28%] max-h-3 max-w-3 outline-2 outline-ark-canvas',
            statuses[status],
          )}
        />
      )}
    </span>
  )
}
