import { ConfirmationAlert } from '@/components/confirmation-alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleHttpErrors } from '@/lib/http';
import { addSubPathToUrl, getUrl } from '@/lib/url';
import { User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { type CellContext } from '@tanstack/react-table';
import { Ellipsis, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function RowActions(props: CellContext<User, unknown>) {
  const page = usePage(); // development purpose
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const { row } = props;
  const id = row.original.uuid;
  const onOpenConfAlert = () => setIsAlertOpen((preVal) => !preVal);

  const onCopyID = () => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success('Record ID copied to clipboard');
    });
  };

  const onHttpDelete = () => {
    const url = addSubPathToUrl(getUrl(), id);
    router.delete(url, {
      onSuccess: (res) => {
        toast.success((res?.props?.message as string) || 'Record deleted successfully');
      },
      onError: (errors) => {
        handleHttpErrors(errors);
      },
    });
  };

  const onHttpEdit = () => {
    const url = addSubPathToUrl(getUrl(), id);
  };

  // development purpose
  // console.log('Row:', row);
  // console.log('Page:', page);

  return (
    <>
      <ConfirmationAlert
        title="Confirm Deletion"
        description="Are you sure you want to delete this record?"
        isOpen={isAlertOpen}
        onOpen={onOpenConfAlert}
        onConfirm={onHttpDelete}
        onCancel={onOpenConfAlert}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenConfAlert}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyID}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            More <Ellipsis />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export { RowActions };
