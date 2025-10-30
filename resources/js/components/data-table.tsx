import { DataTablePagination } from '@/components/data-table-pagination';
import { DynamicForm, type DynamicFormInputProps } from '@/components/dynamic-form';
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
import { type Link } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
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
  email: z.email('Invalid email address.'),
  // 'nullable', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must contain at least one number.',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'Password must contain at least one special character.',
    }),
  role: z.string().min(1, 'Role is required.'),
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
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    htmlElement: 'input',
    type: 'password',
  },
  {
    name: 'role',
    label: 'Role',
    placeholder: 'Select role',
    htmlElement: 'select',
    type: 'email',
    options: [
      {
        value: 'admin',
        label: 'Admin',
      },
      {
        value: 'hr_manager',
        label: 'HR Manager',
      },
      {
        value: 'recruiter',
        label: 'Recruiter',
      },
      {
        value: 'applicant',
        label: 'Applicant',
      },
    ],
  },
];

enum ActionTypeEnum {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  UNDO = 'undo',
  REDO = 'redo',
}

interface DataTableHeaderProps {
  table: any;
}

function DataTableHeader({ table }: DataTableHeaderProps) {
  const page = usePage();
  const [showCreationForm, setCreationForm] = useState(false);
  const [formDefValues, setFormDefValues] = useState({
    name: 'Test User',
    last_name: 'Test Lastname',
    email: 'user-test@gmail.com',
    password: 'Admin123@#A',
    role: '',
  });

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

  const handleNewRecord = (data: z.infer<typeof formValidation>, form: UseFormReturn) => {
    setFormDefValues(data);

    router.post(page.url, data, {
      preserveState: true,
      onSuccess: () => {
        toast.success('New record created', {
          description: 'The new record has been successfully created.',
          // cancel: {
          //   label: 'Undo',
          //   onClick: () => console.log('Undo'),
          // },
        });
        form.reset();
        // setFormDefValues({});
      },
      onError: (errors) => {
        for (const [key, error] of Object.entries(errors)) {
          form.setError(key as keyof typeof formDefValues, { message: error });
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

          <DynamicForm
            inputs={formInputs}
            schema={formValidation}
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
            <MenubarTrigger>File</MenubarTrigger>
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  links: Link[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  links,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-md">
        <DataTableHeader table={table} />

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
