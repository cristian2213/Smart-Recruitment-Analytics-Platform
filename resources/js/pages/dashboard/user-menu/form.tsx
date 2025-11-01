import { Badge } from '@/components/ui/badge';
import { type DynamicFormInputProps, type TRole, type User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import * as z from 'zod';
import { RowActions } from './row-actions';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'roles',
    header: 'Role',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as { role: TRole }[];
      const role = roles[0].role;
      return (
        <Badge variant="highlight" className="text-xs">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string;
      const formattedDate = date ? new Date(date).toLocaleString() : 'N/A';
      return <span className="text-xs">{formattedDate}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (data) => <RowActions {...data} />,
  },
];

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
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must contain at least one number.',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'Password must contain at least one special character.',
    }),
  role: z.string().min(1, 'Role is required.'),
});

const updateUserValidation = createUserValidation.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must contain at least one number.',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'Password must contain at least one special character.',
    })
    .or(z.literal('')),
});

const userFormInputs: DynamicFormInputProps[] = [
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
];

export { columns, createUserValidation, updateUserValidation, userFormInputs };
