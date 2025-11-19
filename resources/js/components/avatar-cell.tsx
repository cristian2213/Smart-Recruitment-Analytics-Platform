import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AvatarCellProps {
  name: string
  avatar?: string
}

function AvatarCell({ avatar, name }: AvatarCellProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)

  const handleModal = () => {
    if (avatar) setShowImageDialog(true)
  }

  return (
    <>
      <Avatar
        onClick={handleModal}
        className={cn(
          'transition-opacity hover:opacity-80',
          avatar ? 'cursor-pointer' : '',
        )}
      >
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl" aria-describedby="">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { AvatarCell }
