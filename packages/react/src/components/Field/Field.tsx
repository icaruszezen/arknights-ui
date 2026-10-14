import { type ComponentProps, type ReactNode, useContext, useId } from 'react'
import { FieldContext, type FieldContextValue } from '../../internal/field'
import { cn } from '../../utils/cn'

export type FieldLayout = 'stack' | 'row'

export interface FieldProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** 项名。 */
  label: ReactNode
  /** 项名后面的英文小字。 */
  sub?: ReactNode
  /** 注释：灰色小字，前面自动补一个 `*`。它会接到控件的 `aria-describedby` 上。 */
  hint?: ReactNode
  /** 报错。给了它，里面的控件就标记为不合法，并把这段文字读给读屏。 */
  error?: ReactNode
  /** 必填：项名后面出一个小标记，控件带上 `required`。 */
  required?: boolean
  /**
   * 必填标记的文字。
   * @default '必填'
   */
  requiredLabel?: ReactNode
  /** 整项禁用：里面的控件一起禁用。 */
  disabled?: boolean
  /**
   * - `stack`：项名在上、控件在下，普通表单的写法
   * - `row`：项名在左、控件在右，设置页的写法。项名下面一条定长的细线，一列项名的右端因此是齐的；
   *   容器窄于 36rem 时自动退回上下排
   * @default 'stack'
   */
  layout?: FieldLayout
}

/**
 * 表单项：项名、控件、注释排成固定的三处。`children` 是控件，放一个。
 *
 * 它把项名、注释、报错接到控件上（`id`、`aria-describedby`、`aria-invalid`），
 * 库里的表单控件放进来就自动连好；放别的元素时请自己接。
 */
export function Field({
  label,
  sub,
  hint,
  error,
  required = false,
  requiredLabel = '必填',
  disabled = false,
  layout = 'stack',
  className,
  children,
  ...rest
}: FieldProps) {
  const base = useId()
  const hintId = `${base}-hint`
  const errorId = `${base}-error`
  const hasError = error != null && error !== false
  const hasHint = hint != null && hint !== false
  const context: FieldContextValue = {
    controlId: `${base}-control`,
    labelId: `${base}-label`,
    describedBy: [hasError && errorId, hasHint && hintId].filter(Boolean).join(' ') || undefined,
    invalid: hasError,
    required,
    disabled,
  }
  const row = layout === 'row'

  return (
    <FieldContext value={context}>
      <div
        data-ark="field"
        data-layout={layout}
        data-invalid={hasError || undefined}
        {...rest}
        className={cn('@container box-border font-ark-cjk-sans text-ark-fg', className)}
      >
        <div
          className={cn(
            'grid gap-ark-2',
            // 设置页的写法：项名一列定宽（约 300px，实机截图），控件在右，各行的控件左缘对齐
            row &&
              '@xl:grid-cols-[minmax(0,var(--ark-field-label,18.75rem))_minmax(0,1fr)] @xl:items-center @xl:gap-x-ark-6',
          )}
        >
          <label
            id={context.labelId}
            htmlFor={context.controlId}
            className={cn(
              'flex min-w-0 items-baseline gap-ark-2 text-ark-label leading-ark-snug font-ark-bold',
              disabled && 'text-ark-on-disabled',
              // 项名下面那条线不随名字的长短变化
              row && '@xl:border-b @xl:border-ark-rule-strong @xl:pb-ark-2',
            )}
          >
            <span>{label}</span>
            {sub != null && (
              <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
                {sub}
              </span>
            )}
            {required && (
              <span className="ml-auto text-ark-caption font-ark-medium text-ark-signal-fg">
                {requiredLabel}
              </span>
            )}
          </label>
          <div className="min-w-0">{children}</div>
        </div>
        {hasError && (
          <p
            id={errorId}
            data-ark="field-error"
            className="m-0 mt-ark-2 text-ark-caption leading-ark-snug text-ark-danger-fg"
          >
            {error}
          </p>
        )}
        {hasHint && (
          <p
            id={hintId}
            data-ark="field-hint"
            className="m-0 mt-ark-2 text-ark-caption leading-ark-snug text-ark-fg-muted"
          >
            <span aria-hidden="true">* </span>
            {hint}
          </p>
        )}
      </div>
    </FieldContext>
  )
}

export interface FormSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** 小节名：深色带上的粗体字。 */
  title: ReactNode
  /** 小节名后面的英文小字。 */
  sub?: ReactNode
  /**
   * 标题渲染成哪个元素。
   * @default 'h3'
   */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * 表单的小节：一条通栏的深色带，带上是粗体的小节名，右端一段 45° 的斜纹。
 * 它是这一页里最重的横向元素，把长长的一列控件切成几段。下面放若干个 `Field`。
 */
export function FormSection({
  title,
  sub,
  titleAs: Title = 'h3',
  className,
  children,
  ...rest
}: FormSectionProps) {
  const titleId = useId()
  return (
    <section
      data-ark="form-section"
      aria-labelledby={titleId}
      {...rest}
      className={cn('box-border font-ark-cjk-sans text-ark-fg', className)}
    >
      <div className="box-border flex h-10 items-stretch justify-between gap-ark-4 bg-ark-control pl-ark-4">
        <Title
          id={titleId}
          className="m-0 flex items-center gap-ark-3 text-ark-base leading-ark-solid font-ark-bold"
        >
          {title}
          {sub != null && (
            <span className="font-ark-latin-condensed text-ark-caption font-ark-medium tracking-ark-wide text-ark-fg-muted uppercase">
              {sub}
            </span>
          )}
        </Title>
        <span aria-hidden="true" className="w-16 shrink-0 text-ark-fg ark-pattern-hazard-mono" />
      </div>
      <div className="grid gap-ark-5 pt-ark-5">{children}</div>
    </section>
  )
}

/** 当前所在 `Field` 的状态；不在 `Field` 里时是 `null`。自己写控件、想接到 `Field` 上时用。 */
export function useField() {
  return useContext(FieldContext)
}
