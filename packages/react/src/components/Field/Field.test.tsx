import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Radio, RadioGroup } from '../Radio'
import { Segment, SegmentedControl } from '../SegmentedControl'
import { Field, FormSection } from './Field'

describe('Field', () => {
  it('项名就是里面控件的名称', () => {
    render(
      <Field label="昵称">
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: '昵称' })).toBeInTheDocument()
  })

  it('注释接到控件的描述上，前面的 * 对读屏隐藏', () => {
    render(
      <Field label="昵称" hint="2–16 个字">
        <Input />
      </Field>,
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAccessibleDescription('2–16 个字')
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('有报错时控件标记为不合法，报错排在注释前面一起读', () => {
    render(
      <Field label="昵称" hint="2–16 个字" error="昵称已被占用">
        <Input />
      </Field>,
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('昵称已被占用 2–16 个字')
    expect(screen.getByText('昵称已被占用').closest('[data-ark="field"]')).toHaveAttribute(
      'data-invalid',
      'true',
    )
  })

  it('required 和 disabled 传给控件', () => {
    const { rerender } = render(
      <Field label="邮箱" required>
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toBeRequired()
    expect(screen.getByText('必填')).toBeInTheDocument()

    rerender(
      <Field label="邮箱" disabled>
        <Input />
      </Field>,
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('控件自己传的属性优先', () => {
    render(
      <Field label="邮箱" disabled>
        <Input id="own" disabled={false} aria-describedby="extra" />
      </Field>,
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'own')
    expect(input).toBeEnabled()
    expect(input).toHaveAttribute('aria-describedby', 'extra')
  })

  it('一组控件用项名做组的名称', () => {
    render(
      <>
        <Field label="帧率">
          <SegmentedControl defaultValue="60">
            <Segment value="30">30 FPS</Segment>
            <Segment value="60">60 FPS</Segment>
          </SegmentedControl>
        </Field>
        <Field label="通知方式" hint="可以随时修改">
          <RadioGroup defaultValue="mail">
            <Radio value="mail">邮件</Radio>
            <Radio value="none">不通知</Radio>
          </RadioGroup>
        </Field>
      </>,
    )
    expect(screen.getByRole('radiogroup', { name: '帧率' })).toBeInTheDocument()
    const group = screen.getByRole('radiogroup', { name: '通知方式' })
    expect(group).toHaveAccessibleDescription('可以随时修改')
  })

  it('勾选框放进来时，项名指向它', () => {
    render(
      <Field label="订阅周报">
        <Checkbox aria-label="订阅周报" />
      </Field>,
    )
    expect(screen.getByRole('checkbox', { name: '订阅周报' })).toBeInTheDocument()
  })

  it('layout="row" 时项名下面有一条定长的线，窄容器里退回上下排', () => {
    render(
      <Field label="帧率" layout="row">
        <Input />
      </Field>,
    )
    const field = screen.getByText('帧率').closest('[data-ark="field"]')
    expect(field).toHaveAttribute('data-layout', 'row')
    expect(field).toHaveClass('@container')
    expect(screen.getByText('帧率').parentElement).toHaveClass('@xl:border-b')
  })
})

describe('FormSection', () => {
  it('是一个以小节名命名的区域，标题层级可以换', () => {
    render(
      <FormSection title="显示" sub="Display" titleAs="h2">
        <Field label="帧率">
          <Input />
        </Field>
      </FormSection>,
    )
    const section = screen.getByRole('region', { name: '显示 Display' })
    expect(section).toHaveAttribute('data-ark', 'form-section')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('显示')
  })
})
