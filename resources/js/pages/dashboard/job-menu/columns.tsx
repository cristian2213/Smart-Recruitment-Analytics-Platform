import { AvatarCell } from '@/components/avatar-cell'
import { RowActions } from '@/components/datatable/row-actions'
import { Badge } from '@/components/ui/badge'
import { titleShortener } from '@/lib/str'
import { updateFormInputs, updateJobValidation } from '@/pages/dashboard/job-menu/forms'
import { User, type Job } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      return <span className="text-xs">{titleShortener(title, 20)}</span>
    },
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
      let dates = 'N/A'

      if (created_at && updated_at) {
        dates =
          format(new Date(created_at), 'yyyy-MM-dd') +
          ' - ' +
          format(new Date(updated_at), 'yyyy-MM-dd')
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
      return (
        <RowActions<Job>
          cell={data}
          updateFormInputs={updateFormInputs}
          rowUpdateValidation={updateJobValidation}
        />
      )
    },
  },
]

export { columns }
