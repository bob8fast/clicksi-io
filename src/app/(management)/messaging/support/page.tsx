import { MessagingDashboard } from '@/components/features/messaging';

export const dynamic = 'force-dynamic';

export default function SupportPage() {
  return (
    <div className="support-page h-full">
      <MessagingDashboard supportMode={true} />
    </div>
  );
}