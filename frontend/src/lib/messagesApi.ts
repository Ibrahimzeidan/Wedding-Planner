import { requestJson, withAuth } from "@/lib/packageRequest";
import type { ChatMessage, Conversation } from "@/types/message";

export const getConversations = () =>
  requestJson<Conversation[]>("/messages/conversations", withAuth());

export const startConversation = (providerId: number) =>
  requestJson<Conversation>(`/messages/conversations/${providerId}`, {
    ...withAuth({ method: "POST" }),
  });

export const startBookingConversation = (bookingId: number) =>
  requestJson<Conversation>(`/messages/bookings/${bookingId}`, {
    ...withAuth({ method: "POST" }),
  });

export const getMessages = (conversationId: number) =>
  requestJson<ChatMessage[]>(`/messages/${conversationId}`, withAuth());

export function sendMessage(conversationId: number, message: string) {
  return requestJson<ChatMessage>(`/messages/${conversationId}`, {
    ...withAuth({ method: "POST" }),
    body: JSON.stringify({ message }),
  });
}

export const getAdminConversations = () =>
  requestJson<Conversation[]>("/admin/conversations", withAuth());

export const getAdminMessages = (conversationId: number) =>
  requestJson<ChatMessage[]>(`/admin/conversations/${conversationId}/messages`, withAuth());

export const deleteAdminMessage = (messageId: number) =>
  requestJson<{ message: string }>(`/admin/messages/${messageId}`, withAuth({ method: "DELETE" }));
