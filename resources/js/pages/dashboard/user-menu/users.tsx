import { DataTable } from '@/components/data-table'
import { DataTableHeader } from '@/components/data-table-header'
import { DataTablePagination } from '@/components/data-table-pagination'
import AppLayout from '@/layouts/app-layout'
import {
  type BreadcrumbItem,
  type HeaderActions,
  type Link,
  type TableData,
  type User,
} from '@/types'
import { Head } from '@inertiajs/react'
import { VisibilityState, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { columns } from './columns'
import { createFormInputs, createUserValidation } from './forms'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/dashboard/users',
  },
]

const tableHeaderActions: HeaderActions<typeof createUserValidation> = {
  actions: {
    create: {
      userFormInputs: createFormInputs,
      schema: createUserValidation,
      defaultValues: {
        name: 'test',
        last_name: 'test 2',
        email: `test${Math.round(Math.random() * 1000)}@gmail.com`,
        password: 'admin123@A#',
        role: 'hr_manager',
      },
    },
  },
}

interface UsersProps {
  users: {
    data: User[]
    links: Link[]
  }
}

export default function Users({ users }: UsersProps) {
  // const [avatarFiles, setAvatarFiles] = useState<{ [key: string]: File }>({})

  // useEffect(() => {
  //   return
  //   const fetchAvatars = async () => {
  //     const newAvatarFiles: { [key: string]: File } = {}

  //     for (const user of users.data) {
  //       if (user.avatar) {
  //         try {
  //           const avatarUrl = `http://localhost:9000/dashboard/${user.avatar}`
  //           const response = await fetch(avatarUrl)
  //           const blob = await response.blob()

  //           // Extract file extension from the URL or use a default
  //           const extension = user.avatar.split('.').pop() || 'jpg'
  //           const contentType = `image/${extension}`

  //           const file = new File([blob], `avatar-${user.id}.${extension}`, {
  //             type: contentType,
  //           })

  //           newAvatarFiles[user.id] = file
  //         } catch (error) {
  //           console.error(`Failed to fetch avatar for user ${user.id}:`, error)
  //         }
  //       }
  //     }

  //     setAvatarFiles(newAvatarFiles)
  //   }

  //   fetchAvatars()
  // }, [users.data])

  const tableData: TableData<User> = useMemo(
    () => ({
      columns,
      data: users.data.map((user) => {
        const role = user.roles[0]?.role
        return {
          ...user,
          role,
          password: '',
        }
      }),
      links: users.links,
    }),
    [users.data, users.links],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: tableData.data,
    columns: tableData.columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

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
  )
}
