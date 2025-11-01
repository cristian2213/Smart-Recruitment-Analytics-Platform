import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationAlertProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationAlert({
  title,
  description,
  isOpen,
  onOpen,
  onConfirm,
}: ConfirmationAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmationAlert };
