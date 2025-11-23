import { type DynamicFormInputProps } from '@/types'

import * as z from 'zod'

const statusEnum = z.enum(['draft', 'published', 'closed'])

// Create Job Schema (full fields required for creation)
const createJobValidation = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  salary: z.string().min(1, 'Salary is required.'),
  status: statusEnum,
})

// Update Job Schema (partial; allow editing any subset)
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
    htmlElement: 'input',
    type: 'text',
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
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'recruiter',
    label: 'Recruiter',
    placeholder: 'Enter recruiter',
    htmlElement: 'input',
    type: 'text',
  },
]

// For updates we can reuse the same inputs
const updateFormInputs = createFormInputs

export { createFormInputs, createJobValidation, updateFormInputs, updateJobValidation }
