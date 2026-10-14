import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../Input'
import { NumberStepper } from '../NumberStepper'
import { Segment, SegmentedControl } from '../SegmentedControl'
import { Slider } from '../Slider'
import { Switch } from '../Switch'
import { Field, FormSection } from './Field'

const meta = {
  title: '表单/Field',
  component: Field,
  subcomponents: { FormSection },
  args: { label: '昵称', children: <Input placeholder="2–16 个字" /> },
  decorators: [
    Story => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** 项名在上、控件在下：普通表单的写法。项名自动成为控件的名称。 */
export const Default: Story = {
  args: { sub: 'Nickname', className: 'w-80' },
}

/** 注释是灰色小字，前面自动补一个 `*`；它会读给读屏，作为控件的描述。 */
export const WithHint: Story = {
  args: { hint: '修改后 30 天内不能再改', className: 'w-80' },
}

/** 报错：文字换成红色，控件的底边跟着变红。 */
export const WithError: Story = {
  args: {
    required: true,
    error: '这个昵称已经被占用',
    hint: '修改后 30 天内不能再改',
    className: 'w-80',
    children: <Input defaultValue="Doctor" />,
  },
}

/**
 * `layout="row"`：项名在左、控件在右，设置页的写法。项名下面一条定长的细线，
 * 所以一列项名的右端是齐的，各行的控件左缘也是齐的。容器窄于 36rem 时自动退回上下排。
 */
export const Row: Story = {
  render: () => (
    <div className="grid gap-ark-5">
      <Field label="帧率" sub="Frame Rate" layout="row" hint="更高的帧率更耗电">
        <SegmentedControl defaultValue="60">
          <Segment value="30">30 FPS</Segment>
          <Segment value="60">60 FPS</Segment>
        </SegmentedControl>
      </Field>
      <Field label="省电模式" sub="Power Saving" layout="row">
        <Switch />
      </Field>
      <Field label="音量" sub="Volume" layout="row">
        <Slider defaultValue={70} />
      </Field>
    </div>
  ),
}

/**
 * 小节：一条通栏的深色带，带上是粗体的小节名，右端一段 45° 的斜纹。
 * 它是这一页里最重的横向元素，把长长的一列控件切成几段。
 */
export const Sections: Story = {
  render: () => (
    <div className="grid gap-ark-6">
      <FormSection title="显示" sub="Display">
        <Field label="画质" layout="row">
          <SegmentedControl defaultValue="high">
            <Segment value="low">低</Segment>
            <Segment value="mid">中</Segment>
            <Segment value="high">高</Segment>
          </SegmentedControl>
        </Field>
        <Field label="界面缩放" layout="row" hint="只影响文字和控件的大小">
          <Slider defaultValue={100} min={80} max={140} step={10} formatValue={v => `${v}%`} />
        </Field>
      </FormSection>
      <FormSection title="通知" sub="Notifications">
        <Field label="每日摘要" layout="row">
          <Switch defaultChecked />
        </Field>
        <Field label="保留天数" layout="row">
          <NumberStepper min={1} max={30} defaultValue={7} />
        </Field>
      </FormSection>
    </div>
  ),
}

/** 整项禁用：项名变灰，里面的控件一起禁用。 */
export const Disabled: Story = {
  args: { disabled: true, className: 'w-80', children: <Input defaultValue="Doctor" /> },
}
