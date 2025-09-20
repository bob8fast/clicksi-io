// app/(management)/creator-management/layout.tsx
import { GenericManagementLayout } from '@/components/layout/management';
import { ReactNode } from 'react';

interface CreatorManagementLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: CreatorManagementLayoutProps) {
  return (
    <GenericManagementLayout entityType="creator">
      {children}
    </GenericManagementLayout>
  );
}