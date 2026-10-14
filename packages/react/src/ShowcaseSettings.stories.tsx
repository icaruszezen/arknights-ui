import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { type GlyphName, glyphs } from '../.storybook/glyphs'
import {
  Button,
  Checkbox,
  Dialog,
  Field,
  FormSection,
  Heading,
  Input,
  NumberStepper,
  Radio,
  RadioGroup,
  Segment,
  SegmentedControl,
  Select,
  SelectOption,
  Slider,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  ToastProvider,
  useToast,
} from './index'

// 不是组件，只是把表单控件按设置页的编排拼在一起：分类竖排在左边，右边一项一行——
// 项名、控件、注释排成固定的三处；同一类设置归在一条深色的小节带下面。
// 两三个选项直接摆出来，不收进下拉框；选中整块换色。文案是演示用的占位内容。
const meta = {
  title: '示例/设置页',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const categories: readonly (readonly [string, string, GlyphName])[] = [
  ['display', '显示', 'frame'],
  ['notify', '通知', 'target'],
  ['account', '账号', 'shield'],
]

function SettingsPage() {
  const toast = useToast()
  const [resetting, setResetting] = useState(false)
  return (
    <div className="mx-auto grid max-w-5xl gap-ark-6">
      <header className="flex flex-wrap items-end justify-between gap-ark-4">
        <Heading as="h1" size="md" sub="SETTINGS">
          设置
        </Heading>
        <Button onClick={() => setResetting(true)}>恢复默认</Button>
      </header>

      <Tabs
        variant="segment"
        orientation="vertical"
        defaultValue="display"
        className="max-md:block"
      >
        <TabList aria-label="设置分类" className="w-44 max-md:mb-ark-5 max-md:w-full">
          {categories.map(([value, label, glyph]) => (
            <Tab key={value} value={value}>
              <span aria-hidden="true" className="grid size-5 [&>svg]:block [&>svg]:size-full">
                {glyphs[glyph]}
              </span>
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanel value="display" className="grid gap-ark-6">
          <FormSection title="画面" sub="Graphics" titleAs="h2">
            <Field label="主题" sub="Theme" layout="row" hint="跟随系统时，日落后自动切到暗色">
              <SegmentedControl defaultValue="dark">
                <Segment value="dark">暗色</Segment>
                <Segment value="light">亮色</Segment>
                <Segment value="auto">跟随系统</Segment>
              </SegmentedControl>
            </Field>
            <Field label="帧率" sub="Frame Rate" layout="row" hint="更高的帧率更耗电">
              <SegmentedControl defaultValue="60">
                <Segment value="30">30 FPS</Segment>
                <Segment value="60">60 FPS</Segment>
              </SegmentedControl>
            </Field>
            <Field label="界面缩放" sub="Scale" layout="row">
              <Slider defaultValue={100} min={80} max={140} step={10} formatValue={v => `${v}%`} />
            </Field>
            <Field label="减少动效" sub="Reduce Motion" layout="row">
              <Switch />
            </Field>
          </FormSection>
          <FormSection title="语言与地区" sub="Locale" titleAs="h2">
            <Field label="界面语言" sub="Language" layout="row">
              <Select defaultValue="zh" className="max-w-64">
                <SelectOption value="zh">简体中文</SelectOption>
                <SelectOption value="en">English</SelectOption>
                <SelectOption value="ja">日本語</SelectOption>
                <SelectOption value="ko">한국어</SelectOption>
              </Select>
            </Field>
            <Field label="每页条数" sub="Page Size" layout="row">
              <NumberStepper min={10} max={100} step={10} defaultValue={20} />
            </Field>
          </FormSection>
        </TabPanel>

        <TabPanel value="notify" className="grid gap-ark-6">
          <FormSection title="提醒" sub="Alerts" titleAs="h2">
            <Field label="每日摘要" sub="Digest" layout="row">
              <Switch defaultChecked />
            </Field>
            <Field label="发送方式" sub="Channel" layout="row">
              <RadioGroup defaultValue="mail">
                <Radio value="mail" description="工作日早上 9 点">
                  邮件
                </Radio>
                <Radio value="push">站内通知</Radio>
                <Radio value="none">不发送</Radio>
              </RadioGroup>
            </Field>
            <Field label="提醒音量" sub="Volume" layout="row">
              <Slider defaultValue={70} />
            </Field>
          </FormSection>
        </TabPanel>

        <TabPanel value="account" className="grid gap-ark-6">
          <FormSection title="资料" sub="Profile" titleAs="h2">
            <Field label="昵称" sub="Nickname" layout="row" required hint="修改后 30 天内不能再改">
              <Input defaultValue="Doctor" className="max-w-80" />
            </Field>
            <Field label="邮箱" sub="Email" layout="row" error="这个邮箱已经被别的账号使用">
              <Input type="email" defaultValue="doctor@example.com" className="max-w-80" />
            </Field>
            <Field label="简介" sub="Bio" layout="row">
              <Textarea maxLength={120} showCount defaultValue="罗德岛的一名普通职员。" />
            </Field>
            <Field label="隐私" sub="Privacy" layout="row">
              <Checkbox defaultChecked description="别人可以在成员列表里看到你">
                公开我的资料
              </Checkbox>
            </Field>
          </FormSection>
        </TabPanel>
      </Tabs>

      <footer className="flex justify-end gap-ark-3 border-t border-ark-rule pt-ark-5">
        <Button variant="ghost">放弃修改</Button>
        <Button variant="primary" onClick={() => toast({ title: '设置已保存', level: 'success' })}>
          保存
        </Button>
      </footer>

      <Dialog
        open={resetting}
        onOpenChange={setResetting}
        color="danger"
        title="恢复默认设置"
        confirmText="恢复"
        onConfirm={() => toast({ title: '已恢复默认设置' })}
      >
        三个分类下的全部设置都会回到初始值，<em>这一步不能撤回</em>。
      </Dialog>
    </div>
  )
}

export const Settings: Story = {
  name: '设置页',
  render: () => (
    <ToastProvider>
      <SettingsPage />
    </ToastProvider>
  ),
}

/** 窄屏：分类回到上面，每个设置项的项名和控件改成上下排。 */
export const SettingsNarrow: Story = {
  ...Settings,
  name: '设置页（窄屏）',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
