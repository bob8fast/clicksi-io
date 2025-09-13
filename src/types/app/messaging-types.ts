// src/types/app/messaging-types.ts

export type ConversationType = 'team_to_team' | 'support';
export type ConversationStatus = 'active' | 'archived' | 'closed';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'edited' | 'deleted';
export type TeamType = 'creator' | 'brand' | 'retailer' | 'admin';

export interface Conversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  subject?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  
  // Participants
  participants: ConversationParticipant[];
  
  // Metadata
  created_by_user_id: string;
  created_by_team_id: string;
  
  // Computed properties
  unread_count?: number;
  is_support_conversation: boolean;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  team_id: string;
  user_id?: string;
  role: 'participant' | 'admin' | 'support';
  joined_at: string;
  last_read_at?: string;
  
  // Team info (populated)
  team?: {
    id: string;
    name: string;
    type: TeamType;
    avatar_url?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  content: string;
  
  // Threading
  parent_message_id?: string;
  thread_id?: string;
  
  // Status and timestamps
  status: MessageStatus;
  sent_at: string;
  edited_at?: string;
  deleted_at?: string;
  
  // Reactions
  reactions: MessageReaction[];
  reaction_count: number;
  
  // Sender info (populated)
  sender?: {
    id: string;
    name: string;
    avatar_url?: string;
    team_id: string;
    team_name: string;
  };
  
  // Thread info
  reply_count?: number;
  latest_reply_at?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  
  // User info (populated)
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

// Request/Response types
export interface CreateConversationRequest {
  target_team_id: string;
  subject?: string;
  initial_message: string;
}

export interface SendMessageRequest {
  content: string;
  parent_message_id?: string;
}

export interface CreateSupportRequest {
  subject: string;
  initial_message: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface AddReactionRequest {
  emoji: string;
}

// Filters and pagination
export interface ConversationFilters {
  type?: ConversationType;
  status?: ConversationStatus;
  team_id?: string;
  search?: string;
}

export interface MessageFilters {
  since?: string;
  until?: string;
  limit?: number;
  offset?: number;
}

// UI State types
export type ViewMode = 'conversations-only' | 'conversation-only' | 'info-only' | 'conversations-conversation' | 'conversation-info' | 'full-layout';

export interface MessagingState {
  activeConversationId?: string;
  showSidebar: boolean;
  showInfo: boolean;
  selectedMessages: string[];
  replyingTo?: Message;
  editingMessage?: Message;
}

// Component props interfaces
export interface MessagingDashboardProps {
  userRole?: string;
  teamId?: string;
  teamType?: TeamType;
  initialConversationId?: string;
  supportMode?: boolean;
}

export interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
  canCreateConversations: boolean;
  loading?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export interface ConversationViewProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string, parentId?: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
  loading?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  showMenuButton?: boolean;
  onMenu?: () => void;
  onToggleInfo?: () => void;
  isMobile?: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  onReaction: (emoji: string) => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isMobile?: boolean;
}

export interface MessageComposerProps {
  onSend: (content: string, parentId?: string) => void;
  placeholder?: string;
  replyToMessage?: Message;
  disabled?: boolean;
  isMobile?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Utility types
export interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface KeyboardState {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
}