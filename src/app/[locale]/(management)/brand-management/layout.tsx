// app/brand-management/layout.tsx
import { GenericManagementLayout } from '@/components/layout/management';
import { ReactNode } from 'react';

interface BrandManagementLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: BrandManagementLayoutProps) {
  return (
    <GenericManagementLayout entityType="brand">
      {children}
    </GenericManagementLayout>
  );
}