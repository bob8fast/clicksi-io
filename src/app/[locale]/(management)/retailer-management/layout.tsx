// app/(management)/retailer-management/layout.tsx
import { GenericManagementLayout } from '@/components/layout/management';
import { ReactNode } from 'react';

interface RetailerManagementLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: RetailerManagementLayoutProps) {
  return (
    <GenericManagementLayout entityType="retailer">
      {children}
    </GenericManagementLayout>
  );
}