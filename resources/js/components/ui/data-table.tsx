import { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { DataTablePagination } from '@/components/data-table-pagination';
import { type Link } from '@/types'
import { Button } from "@/components/ui/button"
import { DynamicForm, type DynamicFormInputProps } from '@/components/dynamic-form'
import * as z from 'zod';

const formValidation = z.object({
  name: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(32, 'name must be at most 32 characters.'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(32, 'Last name must be at most 32 characters.'),
  email: z.email('Invalid email address.')
});

// name, last_name, email
const formInputs: DynamicFormInputProps[] = [
  {
    name: 'name',
    label: 'First name',
    placeholder: 'Enter first name',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'last_name',
    label: 'Last name',
    placeholder: 'Enter last name',
    htmlElement: 'input',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    htmlElement: 'input',
    type: 'email',
  },
]

const formDefValues = {
  name: 'asdfasdf',
  last_name: 'asdfasdf',
  email: 'adsfasdfq@gmail.com',
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  links: Link[]
}

export function DataTable<TData, TValue>({ columns, data, links }: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    }
  });

  const getVisibleColumns = () => {
    return table.getAllColumns().filter(
      (column) => column.getCanHide()
    ).map((column) => {
      return (
        <DropdownMenuCheckboxItem
          key={column.id}
          className="capitalize"
          checked={column.getIsVisible()}
          onCheckedChange={(value) =>
            column.toggleVisibility(!!value)
          }
        >
          {column.id}
        </DropdownMenuCheckboxItem>
      )
    })
  }

  return (<>
    <DynamicForm inputs={formInputs} schema={formValidation} defaultValues={formDefValues}  />
    <div className="overflow-hidden rounded-md flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto mb-6">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {getVisibleColumns()}
        </DropdownMenuContent>
      </DropdownMenu>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4">
        <DataTablePagination links={links} />
      </div>
    </div>
    </>
  );
}
