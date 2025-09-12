// src/components/features/messaging/index.ts

// Main components
export { MessagingDashboard } from './MessagingDashboard';
export { MessagingLayout } from './MessagingLayout';

// Conversation components
export { ConversationSidebar } from './ConversationSidebar';
export { ConversationView } from './ConversationView';
export { ConversationInfo } from './ConversationInfo';
export { ConversationHeader } from './ConversationHeader';
export { ConversationCard } from './ConversationCard';

// Message components
export { MessageBubble } from './MessageBubble';
export { MessageComposer } from './MessageComposer';
export { MessageReactions } from './MessageReactions';
export { ReplyPreview } from './ReplyPreview';

// UI components
export { EmptyConversationState } from './EmptyConversationState';
export { ConversationListSkeleton } from './ConversationListSkeleton';
export { MessageListSkeleton } from './MessageListSkeleton';

// Mobile-specific components
export { MobileConversationHeader } from './mobile/MobileConversationHeader';
export { MobileMessageComposer } from './mobile/MobileMessageComposer';
export { MobileEmojiPicker } from './mobile/MobileEmojiPicker';
export { SwipeGestureHandler } from './mobile/SwipeGestureHandler';
export { BottomSafeArea } from './mobile/BottomSafeArea';

// Modal components
export { NewConversationModal } from './NewConversationModal';
export { SupportRequestModal } from './SupportRequestModal';

// TODO: Add these components when implementing additional features
// export { EmojiPicker } from './EmojiPicker';
// export { ThreadIndicator } from './ThreadIndicator';