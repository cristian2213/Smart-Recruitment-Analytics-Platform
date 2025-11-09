import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { type TRole, type User } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { RowActions } from './row-actions'

function AvatarCell({ avatarUrl }: { avatarUrl?: string }) {
  const [showImageDialog, setShowImageDialog] = useState(false)

  const handleModal = () => {
    if (avatarUrl) setShowImageDialog(true)
  }

  return (
    <>
      <Avatar
        onClick={handleModal}
        className={cn(
          'transition-opacity hover:opacity-80',
          avatarUrl ? 'cursor-pointer' : '',
        )}
      >
        <AvatarImage src={avatarUrl} alt="avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl" aria-describedby="">
          <DialogHeader>
            <DialogTitle>User Avatar</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={avatarUrl}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const avatar = row.getValue('avatar') as string | undefined
      return <AvatarCell avatarUrl={avatar} />
    },
  },
  {
    accessorKey: 'creator',
    header: 'Created by',
    cell: ({ row }) => {
      const creator = row.getValue('creator') as { id: string; name: string } | null
      if (!creator) return 'None'
      const text = `${creator.id}-${creator.name}`
      return (
        <Badge variant="secondary" className="text-xs">
          {text}
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
    cell: (data) => {
      data.row.original.avatar = undefined
      return <RowActions {...data} />
    },
  },
]

export { columns }
