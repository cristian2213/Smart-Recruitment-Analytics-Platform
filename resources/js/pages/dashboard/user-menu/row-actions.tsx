import { ConfirmationAlert } from '@/components/confirmation-alert'
import { DynamicForm } from '@/components/dynamic-form'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { handleHttpErrors, handleHttpSuccess } from '@/lib/http'
import { addSubPathToUrl, getUrl } from '@/lib/url'
import { deleteEmptyProps } from '@/lib/utils'
import { RequestPayload, User } from '@/types'
import { router } from '@inertiajs/react'
import { type CellContext } from '@tanstack/react-table'
import { Ellipsis, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { updateFormInputs, updateUserValidation } from './form'

const editionModal = {
  title: 'Edit a Record',
  description: 'Modify the inputs as you wish. Click Edit when you&apos;re done.',
  done: 'Edit',
}

function RowActions(props: CellContext<User, unknown>) {
  // const page = usePage(); // development purpose
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [isCreateFormOpen, setCreateForm] = useState<boolean>(false)
  const { row } = props
  const id = row.original.uuid

  // ACTION HANDLES

  const onOpenConfAlert = () => {
    setIsAlertOpen((preVal) => {
      const newVal = !preVal
      return newVal
    })
  }

  const onEdit = () => setCreateForm(true)

  const onCopyID = () => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success('Record ID copied to clipboard')
    })
  }

  // HTTP METHODS

  const onHttpDelete = () => {
    const url = addSubPathToUrl(getUrl(), id)
    router.delete(url, {
      onSuccess: (res) => {
        handleHttpSuccess(res)
      },
      onError: (errors) => {
        handleHttpErrors(errors)
      },
    })
  }

  const onHttpEdit = (
    data: z.infer<typeof updateUserValidation>,
    form: UseFormReturn,
  ) => {
    const payload = deleteEmptyProps(data)
    const url = addSubPathToUrl(getUrl(), id)
    router.put(url, payload as RequestPayload, {
      onSuccess: (res) => {
        handleHttpSuccess(res)
        setCreateForm(false)
      },
      onError: (errors) => {
        handleHttpErrors(errors, (key, error) =>
          form.setError(key, {
            message: error,
          }),
        )
      },
    })
  }

  // development purpose
  // console.log('Row:', row.getValue('roles'));
  // console.log('Page:', page);

  return (
    <>
      <Modal
        text={editionModal}
        isOpen={isCreateFormOpen}
        isEdit={true}
        onOpenChange={setCreateForm}
      >
        <DynamicForm
          inputs={updateFormInputs}
          schema={updateUserValidation}
          defaultValues={row.original}
          onSubmit={onHttpEdit}
        />
      </Modal>

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
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenConfAlert}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyID}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            More <Ellipsis />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { RowActions }
