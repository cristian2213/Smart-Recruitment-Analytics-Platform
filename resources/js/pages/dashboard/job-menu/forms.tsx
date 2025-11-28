import { type DynamicFormInputProps } from '@/types'

import * as z from 'zod'

const createJobValidation = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters.'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters.')
    .regex(
      /^[A-Za-z0-9\sáéíóúÁÉÍÓÚñÑ-]+\/[A-Za-z0-9\sáéíóúÁÉÍÓÚñÑ-]+$/,
      'Location must be in the format: Department/City',
    ),
  // format: "skill1,skill2,skill3", don't allow , at the end
  skills: z
    .string()
    .min(1, 'Skills is required.')
    .regex(/^[^,]+(,[^,]+)*$/, 'Skills must be in the format: skill1,skill2,skill3'),
  salary: z
    .string()
    .min(1, 'Salary is required.')
    .regex(/^[0-9]+$/, 'Salary must be a number.'),
  status: z.enum(['draft', 'published', 'closed']),
  placement: z.enum(['remote', 'onsite', 'hybrid']),
  recruiter_id: z.string().min(1, 'Recruiter is required.'),
})

const updateJobValidation = createJobValidation.partial()

const createFormInputs: DynamicFormInputProps[] = [
  {
    name: 'title',
    label: 'Title',
    placeholder: 'Enter title',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'location',
    label: 'Location',
    placeholder: 'Enter location',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'skills',
    label: 'Skills',
    placeholder: 'Enter skills',
    htmlElement: 'multi-input',
  },
  {
    name: 'salary',
    label: 'Salary',
    placeholder: 'Enter salary',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'status',
    label: 'Status',
    placeholder: 'Select status',
    htmlElement: 'select',
    type: 'text',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    name: 'placement',
    label: 'Placement',
    placeholder: 'Enter placement',
    htmlElement: 'select',
    options: [
      { value: 'remote', label: 'Remote' },
      { value: 'onsite', label: 'Onsite' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
  },
  {
    name: 'recruiter_id',
    label: 'Recruiter',
    placeholder: 'Select recruiter',
    htmlElement: 'select',
    options: [],
  },
]

// For updates we can reuse the same inputs
const updateFormInputs = createFormInputs

export { createFormInputs, createJobValidation, updateFormInputs, updateJobValidation }
