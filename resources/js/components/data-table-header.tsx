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
import { DEBOUNCE_DELAY } from '@/constans/delays';
import { handleHttpErrors, handleHttpSuccess } from '@/lib/http';
import { addQueryToUrl, getUrl } from '@/lib/url';
import { type HeaderActions, type RequestPayload } from '@/types';
import { router } from '@inertiajs/react';
import { Table as ITable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Modal } from './modal';
import { Input } from './ui/input';

const creationModal = {
  title: 'Create a new Record',
  description: 'Fill the details for the new record. Click save when you&apos;re done.',
  done: 'Create',
};

interface SearchEngineProps {
  onFinish: (query: string) => void;
}

function SearchEngine({ onFinish }: SearchEngineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  useEffect(() => {
    if (searchQuery.trim() === '') return;

    const timeoutId = setTimeout(() => {
      onFinish(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onFinish]);

  return (
    <Input
      type="search"
      placeholder="Search"
      value={searchQuery}
      onChange={onSearch}
      maxLength={100}
    />
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

  const onHttpSearch = (query: string) => {
    const url = addQueryToUrl(getUrl(), `search=${query}`);

    console.log('onHttpSearch', 'Executing request...');
  };

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
      <div>
        <SearchEngine onFinish={onHttpSearch} />
      </div>
    </div>
  );
}

export { DataTableHeader };

export type { DataTableHeaderProps };
