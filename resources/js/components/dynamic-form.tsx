import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type DynamicFormInputProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { Badge } from './ui/badge'

interface FormDataProps<TFormSchema> {
  inputs: DynamicFormInputProps[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
  defaultValues: z.infer<TFormSchema>
  htmlProps?: React.HTMLAttributes<HTMLDivElement>
  onSubmit: (data: z.infer<TFormSchema>, form: UseFormReturn) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DynamicForm<TFormSchema extends z.ZodType<any>>({
  inputs,
  defaultValues,
  schema,
  onSubmit,
  htmlProps = {},
}: FormDataProps<TFormSchema>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const [badges, setBadges] = useState<string[]>([])

  const createForm = () => {
    return inputs.map((input) => {
      const {
        name,
        htmlElement: element,
        type,
        label,
        placeholder,
        options,
        fileOpts,
      } = input

      if (element === 'multi-input') {
        return (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
              // console.log('field', field)
              // console.log(form)
              // setBadges(field.value.split(','))
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>{label}</FieldLabel>
                  <Input
                    {...field}
                    id={name}
                    type={type}
                    aria-invalid={fieldState.invalid}
                    {...(placeholder ? { placeholder } : {})}
                    onChange={(e) => {
                      const val = e.target.value

                      const badge = val.split(',').map((item) => item.trim())
                      setBadges(badge)
                      field.onChange(val)
                    }}
                  />
                  {/* Badge */}
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <Badge key={badge}>{badge}</Badge>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />
        )
      }

      if (element === 'input') {
        if (type === 'file') {
          return (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>{label}</FieldLabel>
                  <Input
                    id={name}
                    type="file"
                    aria-invalid={fieldState.invalid}
                    {...fileOpts}
                    name={field.name}
                    onChange={(event) => {
                      const files = event.target.files
                      if (!files) return

                      const values = fileOpts?.multiple ? files : files[0]
                      field.onChange(values)
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )
        }

        return (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={name}
                  type={type}
                  aria-invalid={fieldState.invalid}
                  {...(placeholder ? { placeholder } : {})}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )
      }

      if (element === 'textarea') {
        return (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={name}
                    placeholder={placeholder}
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field?.value?.length}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what actually
                  happened.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )
      }

      if (element === 'select') {
        return (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-select-language"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )
      }
    })
  }

  const handleSubmit = (data: z.infer<TFormSchema>) => onSubmit(data, form)

  return (
    <form id="dynamic-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup {...htmlProps}>{createForm()}</FieldGroup>
    </form>
  )
}

export { DynamicForm }
