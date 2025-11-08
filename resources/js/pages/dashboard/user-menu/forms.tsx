import { type DynamicFormInputProps } from '@/types'

import * as z from 'zod'

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 1 * 1024 * 1024, {
    error: 'File size must be less than 1MB',
  })
  .refine(
    (file) => {
      const allowedTypes = ['image/jpeg', 'image/png']
      return allowedTypes.includes(file.type)
    },
    {
      error: 'File must be JPEG or PNG',
    },
  )
  .optional()

const createUserValidation = z.object({
  name: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(32, 'name must be at most 32 characters.'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(32, 'Last name must be at most 32 characters.'),
  email: z.email('Invalid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((password) => /[a-z]/.test(password), {
      error: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      error: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /[0-9]/.test(password), {
      error: 'Password must contain at least one number.',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      error: 'Password must contain at least one special character.',
    }),
  avatar: fileSchema,
  role: z.string().min(1, 'Role is required.'),
})

const updateUserValidation = createUserValidation.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((password) => /[a-z]/.test(password), {
      error: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      error: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /[0-9]/.test(password), {
      error: 'Password must contain at least one number.',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      error: 'Password must contain at least one special character.',
    })
    .or(z.literal('')),
})

const createFormInputs: DynamicFormInputProps[] = [
  {
    name: 'name',
    label: 'First name',
    placeholder: 'Enter first name',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'last_name',
    label: 'Last name',
    placeholder: 'Enter last name',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    htmlElement: 'input',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    htmlElement: 'input',
    type: 'password',
  },
  {
    name: 'avatar',
    label: 'Upload avatar',
    htmlElement: 'input',
    type: 'file',
    fileOpts: {
      name: 'avatar',
      accept: 'jpg,.jpeg,.png',
      multiple: false,
    },
  },
  {
    name: 'role',
    label: 'Role',
    placeholder: 'Select role',
    htmlElement: 'select',
    type: 'email',
    options: [
      {
        value: 'admin',
        label: 'Admin',
      },
      {
        value: 'hr_manager',
        label: 'HR Manager',
      },
      {
        value: 'recruiter',
        label: 'Recruiter',
      },
      {
        value: 'applicant',
        label: 'Applicant',
      },
    ],
  },
]

const updateFormInputs = createFormInputs.filter((input) => input.name !== 'role')

export { createFormInputs, createUserValidation, updateFormInputs, updateUserValidation }
