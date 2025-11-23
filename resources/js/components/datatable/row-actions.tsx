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
import { useModal } from '@/hooks/useModal'
import { handleHttpErrors, handleHttpSuccess } from '@/lib/http'
import { addSubPathToUrl, getUrl } from '@/lib/url'
import { deleteEmptyProps } from '@/lib/utils'
import { DynamicFormInputProps, RequestPayload } from '@/types'
import { router } from '@inertiajs/react'
import { type CellContext } from '@tanstack/react-table'
import { Ellipsis, MoreHorizontal } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const editionModal = {
  title: 'Edit Record',
  description: 'Modify the inputs as you wish. Click Edit when you&apos;re done.',
  done: 'Edit',
}

type RecordIds = { id: number; uuid?: string }

interface RowActionsProps<TData> {
  cell: CellContext<TData, unknown>
  updateFormInputs: DynamicFormInputProps[]
  rowUpdateValidation: z.ZodObject
}

function RowActions<TData extends RecordIds>(props: RowActionsProps<TData>) {
  const {
    row: { original },
  } = props.cell
  const id = original.uuid || original.id.toString()

  const { state, dispatch } = useModal<'updateRecord' | 'deleteRecord'>({
    initialState: {
      updateRecord: false,
      deleteRecord: false,
    },
  })

  const handleAlertConf = () => dispatch({ type: 'TOGGLE_MODAL', modal: 'deleteRecord' })

  const handleCopyID = () =>
    navigator.clipboard.writeText(id).then(() => {
      toast.success('Record ID copied to clipboard')
    })

  const handleHttpDelete = () => {
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

  const handleEdit = () => dispatch({ type: 'TOGGLE_MODAL', modal: 'updateRecord' })

  const handleHttpEdit = (
    data: z.infer<typeof props.rowUpdateValidation>,
    form: UseFormReturn,
  ) => {
    const payload = deleteEmptyProps(data)
    const url = addSubPathToUrl(getUrl(), id)
    payload['_method'] = 'put'

    router.post(url, payload as RequestPayload, {
      onSuccess: (res) => {
        handleHttpSuccess(res)
        handleEdit()
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

  const handleShow = () => {
    const url = addSubPathToUrl(getUrl(), id + '/edit')
    console.log(url)
    router.get(url)
  }

  return (
    <>
      <Modal
        text={editionModal}
        isOpen={state.updateRecord}
        isEdit={true}
        onOpenChange={handleEdit}
      >
        <DynamicForm
          inputs={props.updateFormInputs}
          schema={props.rowUpdateValidation}
          defaultValues={original}
          onSubmit={handleHttpEdit}
        />
      </Modal>

      <ConfirmationAlert
        title="Confirm Deletion"
        description="Are you sure you want to delete this record?"
        isOpen={state.deleteRecord}
        onOpen={handleAlertConf}
        onConfirm={handleHttpDelete}
        onCancel={handleAlertConf}
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
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleShow}>Show</DropdownMenuItem>
          <DropdownMenuItem onClick={handleAlertConf}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyID}>Copy ID</DropdownMenuItem>
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
