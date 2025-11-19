import { AvatarCell } from '@/components/avatar-cell'
import { Badge } from '@/components/ui/badge'
import { User, type Job } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

function RowActions() {
  return <div>Actions</div>
}

const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ row }) => {
      const salary = row.getValue('salary') as string
      return (
        <Badge variant="light_green" className="text-xs">
          $ {salary}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant =
        status === 'closed' ? 'pink' : status === 'draft' ? 'secondary' : 'highlight'
      return (
        <Badge variant={variant} className="text-xs">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'creator',
    header: 'Created By',
    cell: ({ row }) => {
      const creator = row.getValue('creator') as Pick<User, 'name' | 'avatar'>
      return <AvatarCell {...creator} />
    },
  },
  {
    accessorKey: 'recruiter',
    header: 'Assigned To',
    cell: ({ row }) => {
      const recruiter = row.getValue('recruiter') as Pick<User, 'name' | 'avatar'>
      return <AvatarCell {...recruiter} />
    },
  },
  {
    id: 'dates',
    header: 'Dates',
    cell: ({ row }) => {
      const { created_at, updated_at } = row.original
      let dates: string

      console.log('dates', created_at, updated_at)
      if (created_at && updated_at) {
        dates =
          format(new Date(created_at), 'yyyy-MM-dd') +
          ' - ' +
          format(new Date(updated_at), 'yyyy-MM-dd')
      } else {
        dates = 'N/A'
      }

      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs">{dates}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (data) => {
      return <RowActions />
    },
  },
]

export { columns }
