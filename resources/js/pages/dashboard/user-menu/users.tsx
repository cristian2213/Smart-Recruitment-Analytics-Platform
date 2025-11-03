import { DataTable } from '@/components/data-table';
import { DataTableHeader } from '@/components/data-table-header';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppLayout from '@/layouts/app-layout';
import {
  type BreadcrumbItem,
  type HeaderActions,
  type Link,
  type TableData,
  type User,
} from '@/types';
import { Head } from '@inertiajs/react';
import { VisibilityState, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { columns, createFormInputs, createUserValidation } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/dashboard/users',
  },
];

const tableHeaderActions: HeaderActions<typeof createUserValidation> = {
  actions: {
    create: {
      userFormInputs: createFormInputs,
      schema: createUserValidation,
      defaultValues: {
        name: '',
        last_name: '',
        email: '',
        password: 'admin123@A',
        role: 'hr_manager',
      },
    },
  },
};

interface UsersProps {
  users: {
    data: User[];
    links: Link[];
  };
}

export default function Users({ users }: UsersProps) {
  const tableData: TableData<User> = {
    columns,
    data: users.data.map((user) => {
      const role = user.roles[0]?.role;
      return {
        ...user,
        role,
        password: '',
      };
    }),
    links: users.links,
  };
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData.data,
    columns: tableData.columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 px-4 py-5 md:min-h-min dark:border-sidebar-border">
          <div className="flex flex-col overflow-hidden rounded-md">
            <DataTableHeader<User, typeof createUserValidation>
              table={table}
              headerActions={tableHeaderActions}
            />

            <DataTable<User> table={table} />

            <div className="mt-4">
              <DataTablePagination links={tableData.links} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
