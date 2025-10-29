import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { toast } from 'sonner';
import * as z from 'zod';

type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio';
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
}

function DynamicForm({ inputs, defaultValues, schema }: FormDataProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof schema>) {
    // data is valid here

    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      // action: {
      //   label: 'Undo',
      //   onClick: () => console.log('Undo'),
      // },
      cancel: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }

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
                    <SelectValue placeholder="Select" />
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

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {createForm()}

            {/* <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length}/100 characters
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
            /> */}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export { DynamicForm };

export type { DynamicFormInputProps };
