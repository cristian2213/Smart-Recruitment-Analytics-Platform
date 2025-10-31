import { ColumnDef } from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
  permissions: Permission[];
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Permission {
  id: number;
  name: string;
}

export interface Job {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Link {
  active: boolean;
  label: string;
  page: number;
  url: string;
}

// ***** START - DYNAMIC FORM INTERFACES *****
export interface DynamicFormInputProps {
  name: string;
  htmlElement: 'input' | 'textarea' | 'select';
  type: 'text' | 'password' | 'email';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}
// ***** END - DYNAMIC FORM INTERFACES *****

// ***** START - DATA TABLE INTERFACES *****
export interface TableData<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  links: Link[];
}

export interface HeaderActions<TFormSchema> {
  actions: {
    create: {
      formInputs: DynamicFormInputProps[];
      schema: TFormSchema;
      defaultValues: z.infer<TFormSchema>;
    };
  };
}
// ***** END - DATA TABLE INTERFACES *****
