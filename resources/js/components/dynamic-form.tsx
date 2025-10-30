import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// type InputType =
//   | 'text'
//   | 'email'
//   | 'password'
//   | 'number'
//   | 'select'
//   | 'checkbox'
//   | 'radio';
// type InputElement = 'input' | 'textarea' | 'select';

// interface InputProps {
//   // element: InputElement;
//   type: InputType;
//   label: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: { value: string; label: string }[];
// }

// interface FormDataProps<T extends z.ZodRawShape> {
//   inputs: InputProps[];
//   defaultValues: { [key: string]: string };
//   schema: z.ZodObject<T>;
// }

interface DynamicFormInputProps {
  name: string;
  htmlElement: 'input' | 'textarea' | 'select';
  type: 'text' | 'password' | 'email';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface FormDataProps {
  inputs: DynamicFormInputProps[];
  defaultValues?: { [key: string]: string | number };
  schema: any;
  onSubmit: (data: any, form?: any) => void;
}

function DynamicForm({ inputs, defaultValues, schema, onSubmit }: FormDataProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const createForm = () => {
    return inputs.map((input) => {
      const { name, htmlElement: element, type, label, placeholder, options } = input;

      if (element === 'input') {
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
                  placeholder={placeholder}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        );
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
        );
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
        );
      }
    });
  };

  const handleSubmit = (data: any) => onSubmit(data, form);

  return (
    <form id="dynamic-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup className="gap-4">{createForm()}</FieldGroup>
    </form>
  );
}

export { DynamicForm };

export type { DynamicFormInputProps };
