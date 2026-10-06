import { Children, isValidElement, type ReactNode } from 'react'

export interface Item {
  key: string
  child: ReactNode
  /** 在列表里排第几个，从 0 起。逐项入场的延迟用它来算。 */
  index: number
}

/**
 * 把子元素摊平成一个个列表项，空节点（`null`、`false`）不算。
 * Nav、QuickNav 用它把每个导航项各包进一个 `<li>`。
 */
export function toItems(children: ReactNode): Item[] {
  return Children.toArray(children).map((child, index) => ({
    key: isValidElement(child) && child.key != null ? child.key : `item-${index}`,
    child,
    index,
  }))
}
