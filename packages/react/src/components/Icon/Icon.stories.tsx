import type { Meta, StoryObj } from '@storybook/react-vite'
import { figure } from '../../../.storybook/art'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Stat } from '../Stat'
import { Icon, Watermark } from './Icon'

// 演示用的自绘几何图形：只有直线和 45° 斜线，图形占画板的 75%。不对应任何官方图标
const Blocks = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h5v5h-5z" fill="currentColor" />
  </svg>
)
const Peak = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 3 21 21H3z" fill="currentColor" />
  </svg>
)
const Chevrons = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M4 4l8 8-8 8M12 4l8 8-8 8" stroke="currentColor" strokeWidth="3" />
  </svg>
)
const Bars = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M3 12h12M3 18h15" stroke="currentColor" strokeWidth="3" />
  </svg>
)
// 模仿开源图标库的默认画法：圆头、圆角的描边
const RoundStroke = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 18 10 7l4 7 6-10" />
  </svg>
)

const meta = {
  title: '图标与符号/Icon',
  component: Icon,
  subcomponents: { Watermark },
  args: { children: <Blocks />, className: 'text-ark-h1' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** 画板是正方形，默认 `1em` 见方，颜色跟随文字。图形由使用方传入。 */
export const Default: Story = {}

/** 同一组图标用同一种外框：都不带框、都是方框，或都是三角框。 */
export const Frames: Story = {
  render: () => (
    <div className="grid gap-ark-5 text-ark-h1">
      {(['none', 'square', 'triangle'] as const).map(frame => (
        <div key={frame} className="flex gap-ark-5">
          <Icon frame={frame}>
            <Blocks />
          </Icon>
          <Icon frame={frame}>
            <Peak />
          </Icon>
          <Icon frame={frame}>
            <Chevrons />
          </Icon>
          <Icon frame={frame}>
            <Bars />
          </Icon>
        </div>
      ))}
    </div>
  ),
}

/**
 * 开源图标库的图标默认多是圆头描边。放进 `Icon` 之后端点变成平头、转角变成尖角，
 * 和自己画的几何图形是同一种语言。左边是原样，右边是放进 `Icon` 之后。
 */
export const Normalized: Story = {
  render: () => (
    <div className="flex items-center gap-ark-6 text-ark-fg">
      <span className="inline-grid size-16">
        <RoundStroke />
      </span>
      <Icon className="size-16">
        <RoundStroke />
      </Icon>
    </div>
  ),
}

/**
 * 给 `src` 就取图片的透明通道当剪影：多色的图也会变成单色，颜色仍然跟随文字。
 * 用户自己的标识是一张带透明底的图片时用这种写法。
 */
export const FromImage: Story = {
  render: () => (
    <div className="flex items-end gap-ark-6">
      <img src={figure('#c9684f', '#ffd802')} alt="原图" className="h-24" />
      <Icon src={figure()} className="size-24" />
      <Icon src={figure()} className="size-24 text-ark-signal" />
      <Icon src={figure()} frame="square" className="size-24" />
    </div>
  ),
}

/**
 * 图标配文字：高度约等于中文的字高，间距 0.5–0.75rem。
 * 成组的写法见 `IconTitle`。
 */
export const WithText: Story = {
  render: () => (
    <div className="grid gap-ark-4 font-ark-bold">
      <span className="flex items-center gap-ark-2 text-ark-body-lg">
        <Icon>
          <Peak />
        </Icon>
        集成战略
      </span>
      <span className="flex items-center gap-ark-3 text-ark-h1">
        <Icon frame="square">
          <Chevrons />
        </Icon>
        生息演算
      </span>
    </div>
  ),
}

/** 单独出现、需要被读到时给一个 `label`，它会成为一张有名称的图片。 */
export const Labelled: Story = {
  args: { label: '近卫', frame: 'square', children: <Peak /> },
}

/**
 * 水印：同一个标识放大到面板高度的 90%、不透明度 10%，垫在留白的地方。
 * 颜色跟随明暗上下文，纸白面板上是深色的。一块面板只放一个。
 */
export const AsWatermark: Story = {
  globals: { backgrounds: { value: 'scene' } },
  render: () => (
    <div className="grid w-fit grid-cols-2 gap-ark-2">
      <Panel className="h-40 w-80">
        <Watermark>
          <Peak />
        </Watermark>
        <Heading as="h3" size="sm" sub="RHODES ISLAND">
          罗德岛
        </Heading>
        <Stat label="Operators" value={147} size="sm" className="mt-ark-5" />
      </Panel>
      <Panel tone="paper" className="h-40 w-80 overflow-hidden">
        <Watermark className="h-[120%]">
          <Blocks />
        </Watermark>
        <Heading as="h3" size="sm" sub="LOGISTICS">
          后勤
        </Heading>
        <Stat label="Orders" value={3} max={6} size="sm" className="mt-ark-5" />
      </Panel>
    </div>
  ),
}
