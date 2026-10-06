import type { ReactNode } from 'react'
import { Heading } from '../components/Heading'
import { CloseButton } from './CloseButton'

export interface OverlayHeaderProps {
  /** 标题元素的 id，弹层用它做 `aria-labelledby`。 */
  titleId: string
  title?: ReactNode
  sub?: ReactNode
  closeLabel: string
  onClose: () => void
}

/** Drawer 与 Sheet 共用的标题栏：左边双语标题，右上角关闭按钮。 */
export function OverlayHeader({ titleId, title, sub, closeLabel, onClose }: OverlayHeaderProps) {
  return (
    <div className="box-border flex shrink-0 items-start gap-ark-4 py-ark-2 pr-ark-2 pl-ark-5">
      <div className="min-w-0 grow pt-ark-3">
        {title != null && (
          <Heading as="h2" size="sm" sub={sub} id={titleId}>
            {title}
          </Heading>
        )}
      </div>
      <CloseButton label={closeLabel} onClick={onClose} />
    </div>
  )
}
