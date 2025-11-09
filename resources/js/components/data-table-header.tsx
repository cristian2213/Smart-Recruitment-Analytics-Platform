import { DynamicForm } from '@/components/dynamic-form'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { DEBOUNCE_DELAY } from '@/constans/delays'
import { handleHttpErrors, handleHttpSuccess } from '@/lib/http'
import { toIsoWithOffset } from '@/lib/time'
import { getQueryParam, getUrl } from '@/lib/url'
import { type HeaderActions, type RequestPayload } from '@/types'
import { router, useForm } from '@inertiajs/react'
import { Table as ITable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useEffect, useReducer, useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { Modal } from './modal'
import { RangePicker } from './range-picker'
import { Button } from './ui/button'
import { Input } from './ui/input'

const creationModal = {
  title: 'Create a new Record',
  description: 'Fill the details for the new record. Click save when you&apos;re done.',
  done: 'Create',
}

const downloadRecordsModal = {
  title: 'Download a new Record',
  description: 'Select the date range',
  done: 'Download',
}

export function SearchEngine() {
  const { data, setData, get, processing } = useForm<{ query: string; page?: string }>({
    query: getQueryParam('query'),
  })

  useEffect(() => {
    if (data.query === '') return

    const timerKey = setTimeout(() => {
      get('', {
        preserveState: true,
        replace: true, // No browser history
      })
    }, DEBOUNCE_DELAY)

    return () => {
      clearTimeout(timerKey)
    }
  }, [data.page, data.query, get])

  const resetFilter = () => {
    const entity = getUrl().pathname.split('/dashboard/')[1]
    router.get(
      route(`dashboard.${entity}.index`, {
        _query: {
          page: 1,
        },
      }),
      undefined,
      {
        replace: true,
        preserveState: false,
      },
    )
  }
  const resetPage = () => setData('page', '1')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const queryValue = event.target.value.trim()
    if (queryValue === '') {
      resetFilter()
      return
    }
    setData('query', queryValue)
    resetPage()
  }

  const handleFilterReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (data.query === '') return
    resetFilter()
  }

  return (
    <form onSubmit={handleFilterReset} className="flex gap-2">
      <Input
        type="search"
        value={data.query}
        onChange={handleChange}
        placeholder="Search"
        maxLength={100}
        className="w-70"
      />

      <Button
        type="submit"
        disabled={processing}
        variant="secondary"
        className="cursor-pointer"
      >
        Reset
      </Button>
    </form>
  )
}

type ModalType = 'downloadRecords' | 'createRecord'
type ModalState = {
  [key in ModalType]: boolean
}
type Action =
  | { type: 'OPEN_MODAL'; modal: ModalType }
  | { type: 'CLOSE_MODAL'; modal: ModalType }
  | { type: 'TOGGLE_MODAL'; modal: ModalType }
  | { type: 'CLOSE_ALL' }
function modalReducer(state: ModalState, action: Action): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, [action.modal]: true }
    case 'CLOSE_MODAL':
      return { ...state, [action.modal]: false }
    case 'TOGGLE_MODAL':
      return { ...state, [action.modal]: !state[action.modal] }
    case 'CLOSE_ALL':
      return Object.keys(state).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as ModalState,
      )
    default:
      return state
  }
}

interface DataTableHeaderProps<TData, TFormSchema extends z.ZodType> {
  table: ITable<TData>
  headerActions: HeaderActions<TFormSchema>
}

function DataTableHeader<TData, TFormSchema extends z.ZodType>({
  table,
  headerActions,
}: DataTableHeaderProps<TData, TFormSchema>) {
  const { actions } = headerActions
  const [formDefValues, setFormDefValues] = useState<z.infer<TFormSchema>>(
    actions.create.defaultValues as z.infer<TFormSchema>,
  )
  const [state, dispatch] = useReducer(modalReducer, {
    downloadRecords: false,
    createRecord: false,
  })

  const getVisibleColumns = () => {
    return table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        return (
          <MenubarCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </MenubarCheckboxItem>
        )
      })
  }

  const handleCreateModal = () =>
    dispatch({ type: 'TOGGLE_MODAL', modal: 'createRecord' })

  const handleHttpCreate = (data: z.infer<TFormSchema>, form: UseFormReturn) => {
    const createdAt = toIsoWithOffset(new Date())

    const payload = { ...(data as Record<string, unknown>), created_at: createdAt }

    setFormDefValues(payload as z.infer<TFormSchema>)

    router.post(getUrl().pathname, payload as RequestPayload, {
      preserveState: true,
      onSuccess: (res) => {
        console.log('handleCreateModal-Res', res)
        handleHttpSuccess(res)
        form.reset()
        handleCreateModal()
        setFormDefValues(actions.create.defaultValues)
      },
      onError: (errors) => {
        console.log('handleCreateModal-onError', errors)
        handleHttpErrors(errors, (key, error) =>
          form.setError(key, {
            message: error,
          }),
        )
      },
    })
  }

  const handleDownloadModal = () =>
    dispatch({ type: 'TOGGLE_MODAL', modal: 'downloadRecords' })

  const handleHttpDownload = ({ from, to }: { from: Date; to: Date }) => {
    window.location.href = route('users.download', {
      _query: {
        from: format(from, 'yyyy-MM-dd'),
        to: format(to, 'yyyy-MM-dd'),
      },
    })
  }

  return (
    <div className="mb-4 flex justify-between">
      {/* ****** BLOCK CODE TO ATTACH MODAL COMPONENTS ****** */}
      <Modal
        text={creationModal}
        isOpen={state.createRecord}
        onOpenChange={handleCreateModal}
      >
        <DynamicForm<TFormSchema>
          inputs={actions.create.userFormInputs}
          schema={actions.create.schema}
          defaultValues={formDefValues}
          onSubmit={handleHttpCreate}
        />
      </Modal>
      <Modal
        text={downloadRecordsModal}
        isOpen={state.downloadRecords}
        onOpenChange={handleDownloadModal}
      >
        <RangePicker onSubmit={handleHttpDownload} />
      </Modal>
      {/* ****** END BLOCK CODE TO ATTACH MODAL COMPONENTS ****** */}

      <div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Actions</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleCreateModal}>
                Create <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              {/* <MenubarItem data-action={ActionTypeEnum.DELETE} onClick={handleActions}>
                  Delete <MenubarShortcut>⌘X</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem data-action={ActionTypeEnum.UNDO} onClick={handleActions}>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem data-action={ActionTypeEnum.REDO} onClick={handleActions}>
                  Redo <MenubarShortcut>⇧⌘Y</MenubarShortcut>
                </MenubarItem> */}

              {/* <MenubarSub>
                  <MenubarSubTrigger>Find</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Search the web</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Find...</MenubarItem>
                    <MenubarItem>Find Next</MenubarItem>
                    <MenubarItem>Find Previous</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub> */}
              {/* <MenubarSeparator /> */}
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Archivable</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleDownloadModal}>
                Export Data <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Share</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem disabled>Messages</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Columns</MenubarTrigger>
            <MenubarContent>{getVisibleColumns()}</MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div>
        <SearchEngine />
      </div>
    </div>
  )
}

export { DataTableHeader }

export type { DataTableHeaderProps }
