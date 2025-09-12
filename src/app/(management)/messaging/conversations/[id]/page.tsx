import { MessagingDashboard } from '@/components/features/messaging';

type Props = {
  params: Promise<{ id: string }>
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div className="conversation-page h-full">
      <MessagingDashboard initialConversationId={id} />
    </div>
  );
}