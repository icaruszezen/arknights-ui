import type { ComponentProps } from 'react'

// 自绘的几何小图标：只有直线和 45° 斜线，线宽统一、端点平头、转角不做圆角。
// 不描摹任何官方图标（见 docs/foundations/iconography.md）。
// 全部对读屏隐藏，含义由所在按钮的文字或 aria-label 给出；大小由 className 决定，颜色跟随文字。

type IconProps = ComponentProps<'svg'>

function Icon(props: IconProps) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props} />
}

/** 返回：向左的细折线，占满画板的高度（实机的返回箭头又高又细）。 */
export function BackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 2 6 12l10 10" stroke="currentColor" strokeWidth="1.5" />
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

/**
 * 向右的折线箭头，实心：两段 45° 的斜边，左端竖直切平。画板是 1:2 的竖长条，
 * 官网按钮和分类标签右端的箭头就是这个比例（0.5rem 宽）。
 */
export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 7 14" {...props}>
      <path d="M0 0 7 7 0 14v-4l3-3-3-3z" fill="currentColor" />
    </Icon>
  )
}

/** 圆圈里一个对勾：游戏内“确认”的固定图形。对勾是镂空的，露出按钮自己的底色。 */
export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM6.08 13.42l4.42 4.42 7.92-7.92-1.84-1.84-6.08 6.08-2.58-2.58z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Icon>
  )
}

/** 圆圈里一个 i：游戏内提示条前面的图形。线条，不填实。 */
export function InfoCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6.5v2.6M12 10.8v6.7" stroke="currentColor" strokeWidth="2.6" />
    </Icon>
  )
}

/** 圆圈里一个叉：游戏内“取消”的固定图形。同样是镂空的。 */
export function CloseCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM14.62 16.46 12 13.84l-2.62 2.62-1.84-1.84L10.16 12 7.54 9.38l1.84-1.84L12 10.16l2.62-2.62 1.84 1.84L13.84 12l2.62 2.62z"
        fill="currentColor"
        fillRule="evenodd"
      />
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

/** 对勾：一道折线，不带圆圈。压在技能格右上角的色块里。 */
export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12.5 10 18 19.5 7" stroke="currentColor" strokeWidth="3" />
    </Icon>
  )
}

/** 准星：一个圆加四道刻线，中间一个方点。作战顶部击杀计数的默认图形。 */
export function CrosshairIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 10.5h3v3h-3z" fill="currentColor" />
    </Icon>
  )
}

/** 塔：三个垛口、一段塔身、一层底座。作战顶部生命点数的默认图形。 */
export function TowerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 21h14v-2.5h-2V11h2V3h-3v2.5h-2.5V3h-3v2.5H8V3H5v8h2v7.5H5z" fill="currentColor" />
    </Icon>
  )
}

/** 菱形里镂空一个 C：费用的默认图形。C 由直线和 45° 斜线拼成。 */
export function CostIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 1.5 22.5 12 12 22.5 1.5 12zM15.25 7.5h-4L8.75 10v4l2.5 2.5h4v-2.2h-3l-1.2-1.2v-2.2l1.2-1.2h3z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Icon>
  )
}

/** 尖角朝上的正六边形：关卡节点左端的通关标记。`hollow` 只画描边。 */
export function HexagonIcon({ hollow = false, ...props }: IconProps & { hollow?: boolean }) {
  return (
    <Icon {...props}>
      {hollow ? (
        <path
          d="M12 3.2 19.6 7.6v8.8L12 20.8 4.4 16.4V7.6z"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      ) : (
        <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75z" fill="currentColor" />
      )}
    </Icon>
  )
}
