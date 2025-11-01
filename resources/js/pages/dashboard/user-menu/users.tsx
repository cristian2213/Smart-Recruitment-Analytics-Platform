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
import { columns, createUserValidation, userFormInputs } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/dashboard/users',
  },
];

const tableHeaderActions: HeaderActions<typeof createUserValidation> = {
  actions: {
    create: {
      userFormInputs,
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
    data: users.data,
    links: users.links,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 px-4 py-5 md:min-h-min dark:border-sidebar-border">
          <DataTable<User, typeof createUserValidation>
            tableData={tableData}
            headerActions={tableHeaderActions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
