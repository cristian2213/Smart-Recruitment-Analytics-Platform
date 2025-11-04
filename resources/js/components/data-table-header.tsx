import { DynamicForm } from '@/components/dynamic-form';
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
import { handleHttpErrors, handleHttpSuccess } from '@/lib/http';
import { getUrl } from '@/lib/url';
import { type HeaderActions, type RequestPayload } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Table as ITable } from '@tanstack/react-table';
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Modal } from './modal';
import { Button } from './ui/button';
import { Input } from './ui/input';

const creationModal = {
  title: 'Create a new Record',
  description: 'Fill the details for the new record. Click save when you&apos;re done.',
  done: 'Create',
};

// interface SearchEngineProps {
//   // searchQuery: string;
//   // setSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   // onFinish: (query: string) => void;
// }

export function SearchEngine() {
  const { data, setData, get, processing, errors } = useForm({
    query: '',
  });

  const submit = (e: any) => {
    e.preventDefault();
    // const url = addQueryToUrl(getUrl(), `search=${data.query}`);

    get(getUrl().pathname, {
      preserveState: true,
    });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        type="search"
        value={data.query}
        onChange={(e) => setData('query', e.target.value)}
        placeholder="Search"
        maxLength={100}
      />

      <Button type="submit" disabled={processing}>
        {processing ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}

interface DataTableHeaderProps<TData, TFormSchema extends z.ZodType> {
  table: ITable<TData>;
  headerActions: HeaderActions<TFormSchema>;
}

function DataTableHeader<TData, TFormSchema extends z.ZodType>({
  table,
  headerActions,
}: DataTableHeaderProps<TData, TFormSchema>) {
  const { actions } = headerActions;
  const [showCreationForm, setCreationForm] = useState<boolean>(false);
  const [formDefValues, setFormDefValues] = useState<z.infer<TFormSchema>>(
    actions.create.defaultValues as z.infer<TFormSchema>,
  );
  // const [searchQuery, setSearchQuery] = useState('');

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

  // const onSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setSearchQuery(event.target.value);

  const onHttpCreate = (data: z.infer<TFormSchema>, form: UseFormReturn) => {
    setFormDefValues(data);

    router.post(getUrl().pathname, data as RequestPayload, {
      preserveState: true,
      onSuccess: (res) => {
        handleHttpSuccess(res);
        form.reset();
        setCreationForm(false);
        setFormDefValues(actions.create.defaultValues);
      },
      onError: (errors) => {
        handleHttpErrors(errors, (key, error) =>
          form.setError(key, {
            message: error,
          }),
        );
      },
    });
  };

  // const onHttpSearch = (query: any) => {
  //   // const url = addQueryToUrl(getUrl(), `search=${query}`);
  //   // console.log('url', url);

  //   router.get(
  //     '/dashboard/users',
  //     { search: searchQuery },
  //     {
  //       // preserveState: true,
  //       replace: true,
  //       preserveUrl: true,

  //       // onSuccess: (res) => {
  //       //   handleHttpSuccess(res);
  //       // },
  //       // onError: (errors) => {
  //       //   handleHttpErrors(errors);
  //       // },
  //     },
  //   );
  // };

  return (
    <div className="mb-4 flex justify-between">
      {/* ****** BLOCK CODE TO ATTACH MODAL COMPONENTS ****** */}
      <Modal
        text={creationModal}
        isOpen={showCreationForm}
        onOpenChange={setCreationForm}
      >
        <DynamicForm<TFormSchema>
          inputs={actions.create.userFormInputs}
          schema={actions.create.schema}
          defaultValues={formDefValues}
          onSubmit={onHttpCreate}
        />
      </Modal>
      {/* ****** END BLOCK CODE TO ATTACH MODAL COMPONENTS ****** */}

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
      <div>{/* <SearchEngine /> */}</div>
    </div>
  );
}

export { DataTableHeader };

export type { DataTableHeaderProps };
