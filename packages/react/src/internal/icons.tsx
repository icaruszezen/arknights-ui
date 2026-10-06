import type { ComponentProps } from 'react'

// 自绘的几何小图标：只有直线和 45° 斜线，线宽统一、端点平头、转角不做圆角。
// 不描摹任何官方图标（见 docs/foundations/iconography.md）。
// 全部对读屏隐藏，含义由所在按钮的文字或 aria-label 给出；大小由 className 决定，颜色跟随文字。

type IconProps = ComponentProps<'svg'>

function Icon(props: IconProps) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props} />
}

/** 返回：向左的粗折线。 */
export function BackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 4 7 12l8 8" stroke="currentColor" strokeWidth="3" />
    </Icon>
  )
}

/** 主页：屋顶 45° 的房屋轮廓。 */
export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12 12 3.5l8.5 8.5M6 10.5V20h12v-9.5" stroke="currentColor" strokeWidth="2" />
    </Icon>
  )
}

/** 关闭：两条 45° 的线。 */
export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" />
    </Icon>
  )
}

/** 菜单：三条横线。 */
export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
    </Icon>
  )
}

/** 加号：空位，表示“这里可以放一个”。 */
export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" />
    </Icon>
  )
}

/** 暂停：两条竖条。 */
export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.5 5v14M15.5 5v14" stroke="currentColor" strokeWidth="3" />
    </Icon>
  )
}

/** 向下：一道 16 × 6 的粗折线，滚动提示用。 */
export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9l8 6 8-6" stroke="currentColor" strokeWidth="2.5" />
    </Icon>
  )
}

/** 五角星，实心。 */
export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 1.6 14.58 9.55h8.36l-6.76 4.91 2.58 7.94L12 17.49 5.24 22.4l2.58-7.94-6.76-4.91h8.36z"
        fill="currentColor"
      />
    </Icon>
  )
}

/** 菱形，实心：转了 45° 的正方形。 */
export function DiamondIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor" />
    </Icon>
  )
}
