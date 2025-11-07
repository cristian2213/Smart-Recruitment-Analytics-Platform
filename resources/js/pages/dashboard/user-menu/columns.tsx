import { Badge } from '@/components/ui/badge'
import { type TRole, type User } from '@/types'
import { ColumnDef } from '@tanstack/react-table'

import { RowActions } from './row-actions'

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
    header: 'Last name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'roles',
    header: 'Role',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as { role: TRole }[]
      const role = roles.length > 0 ? roles[0].role : 'N/A'
      return (
        <Badge variant="highlight" className="text-xs">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'email_verified_at',
    header: 'Verified at',
    cell: ({ row }) => {
      const verifiedAt = row.getValue('email_verified_at') as string | null
      return (
        <Badge
          variant={verifiedAt == null ? 'destructive' : 'outline'}
          className="text-xs"
        >
          {verifiedAt == null ? 'unconfirmed' : verifiedAt}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated at',
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string
      const formattedDate = date ? new Date(date).toLocaleString() : 'N/A'
      return <span className="text-xs">{formattedDate}</span>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (data) => <RowActions {...data} />,
  },
]

export { columns }
