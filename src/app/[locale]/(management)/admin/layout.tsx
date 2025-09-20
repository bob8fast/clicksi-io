// app/(management)/admin/layout.tsx
import { GenericManagementLayout } from '@/components/layout/management';
import { ReactNode } from 'react';

interface AdminManagementLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: AdminManagementLayoutProps) {
  return (
    <GenericManagementLayout entityType="admin">
      {children}
    </GenericManagementLayout>
  );
}