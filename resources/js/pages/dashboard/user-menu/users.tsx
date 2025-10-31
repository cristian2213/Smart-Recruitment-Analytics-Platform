import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import {
  type BreadcrumbItem,
  type DynamicFormInputProps,
  type HeaderActions,
  type Link,
  type TableData,
  type User,
} from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis, MoreHorizontal } from 'lucide-react';
import * as z from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/dashboard/users',
  },
];

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
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string;
      const formattedDate = date ? new Date(date).toLocaleString() : 'N/A';
      return <>{formattedDate}</>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.uuid)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              More <Ellipsis />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const formValidation = z.object({
  name: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(32, 'name must be at most 32 characters.'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(32, 'Last name must be at most 32 characters.'),
  email: z.email('Invalid email address.'),
  // 'nullable', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised(),
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

const formInputs: DynamicFormInputProps[] = [
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

interface UsersProps {
  users: {
    data: User[];
    links: Link[];
  };
}

export default function Users({ users }: UsersProps) {
  const tableData: TableData<User> = {
    columns,
    data: users.data,
    links: users.links,
  };

  const tableHeaderActions: HeaderActions<typeof formValidation> = {
    actions: {
      create: {
        formInputs,
        schema: formValidation,
        defaultValues: {
          name: '',
          last_name: '',
          email: '',
          password: '',
          role: 'hr_manager',
        },
      },
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 px-4 py-5 md:min-h-min dark:border-sidebar-border">
          <DataTable<User, typeof formValidation>
            tableData={tableData}
            headerActions={tableHeaderActions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
