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
  text: {
    title: string;
    description: string;
    done: string;
    cancel?: string;
  };
  isOpen: boolean;
  isEdit?: boolean;
  formLink?: string; // to link the submit btn to react-hook-form
  onOpenChange: (open: boolean) => void;
}

function Modal({
  text: { title, description, done, cancel = 'Cancel' },
  children,
  formLink = 'dynamic-form',
  isOpen,
  onOpenChange,
}: React.PropsWithChildren<ModalProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancel}</Button>
          </DialogClose>
          <Button type="submit" form={formLink}>
            {done}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MemoizedModal = React.memo(Modal);

export { MemoizedModal as Modal };
