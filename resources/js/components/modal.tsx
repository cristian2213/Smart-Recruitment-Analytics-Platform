import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formLink?: string; // to link the submit btn to react-hook-form
}

function Modal({
  children,
  formLink = 'dynamic-form',
  isOpen,
  onOpenChange,
}: React.PropsWithChildren<ModalProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Record</DialogTitle>
          <DialogDescription>
            Fill the details for the new record. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formLink}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MemoizedModal = React.memo(Modal);

export { MemoizedModal as Modal };
