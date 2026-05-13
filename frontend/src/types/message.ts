export type Conversation = {
  id: number;
  customer_id: number;
  provider_id: number;
  customer_name?: string | null;
  provider_name?: string | null;
  last_message?: string | null;
  unread_count: number;
  created_at: string;
};

export type ChatMessage = {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name?: string | null;
  sender_role?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};
