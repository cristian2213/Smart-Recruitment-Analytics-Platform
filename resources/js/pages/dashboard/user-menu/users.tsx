import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import {
  type BreadcrumbItem,
  type HeaderActions,
  type Link,
  type TableData,
  type User,
} from '@/types';
import { Head } from '@inertiajs/react';
import { columns, formInputs, formValidation } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/dashboard/users',
  },
];

interface UsersProps {
  users: {
    data: User[];
    links: Link[];
  };
}

const tableHeaderActions: HeaderActions<typeof formValidation> = {
  actions: {
    create: {
      formInputs,
      schema: formValidation,
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

export default function Users({ users }: UsersProps) {
  const tableData: TableData<User> = {
    columns,
    data: users.data,
    links: users.links,
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
