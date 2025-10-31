import { DataTablePagination } from '@/components/data-table-pagination';
import { DynamicForm } from '@/components/dynamic-form';
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
} from '@/components/ui/menubar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type HeaderActions, type TableData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
  flexRender,
  getCoreRowModel,
  Table as ITable,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface DataTableHeaderProps<TData, TFormSchema> {
  table: ITable<TData>;
  headerActions: HeaderActions<TFormSchema>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DataTableHeader<TData, TFormSchema extends z.ZodType<any>>({
  table,
  headerActions,
}: DataTableHeaderProps<TData, TFormSchema>) {
  const { actions } = headerActions;
  const page = usePage();
  const [showCreationForm, setCreationForm] = useState<boolean>(false);
  const [formDefValues, setFormDefValues] = useState<z.infer<TFormSchema>>(
    actions.create.defaultValues,
  );

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
        );
      });
  };

  const handleNewRecord = (data: z.infer<TFormSchema>, form: UseFormReturn) => {
    setFormDefValues(data);

    router.post(page.url, data, {
      preserveState: true,
      onSuccess: () => {
        toast.success('New record created', {
          description: 'The new record has been successfully created.',
        });
        form.reset();
        setCreationForm(false);
        setFormDefValues(actions.create.defaultValues);
      },
      onError: (errors) => {
        for (const [key, error] of Object.entries(errors)) {
          form.setError(key as never, {
            message: error,
          });
        }
      },
    });
  };

  return (
    <div className="mb-4 flex justify-start">
      {/* ****** BLOCK CODE TO ATTACH DIALOGS COMPONENTS ****** */}
      <Dialog open={showCreationForm} onOpenChange={setCreationForm} modal={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new Record</DialogTitle>
            <DialogDescription>
              Fill the details for the new record. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <DynamicForm<TFormSchema>
            inputs={actions.create.formInputs}
            schema={actions.create.schema}
            defaultValues={formDefValues}
            onSubmit={handleNewRecord}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="dynamic-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ****** END BLOCK CODE TO ATTACH DIALOGS COMPONENTS ****** */}

      <div>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Actions</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setCreationForm((preVal) => !preVal)}>
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
              <MenubarItem>
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
      <div>{/* filters */}</div>
    </div>
  );
}

interface DataTableProps<TData, TFormSchema> {
  tableData: TableData<TData>;
  headerActions: HeaderActions<TFormSchema>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<TData, TFormSchema extends z.ZodType<any>>({
  tableData,
  headerActions,
}: DataTableProps<TData, TFormSchema>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData.data,
    columns: tableData.columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-md">
        <DataTableHeader<TData, TFormSchema>
          table={table}
          headerActions={headerActions}
        />

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableData.columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4">
          <DataTablePagination links={tableData.links} />
        </div>
      </div>
    </>
  );
}
