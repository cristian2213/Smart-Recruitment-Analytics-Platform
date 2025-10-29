import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { appearance } = useAppearance();
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster theme={appearance} />
    </AppLayoutTemplate>
  );
};
