"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/messages/ChatSidebar";
import ChatWindow from "@/components/messages/ChatWindow";
import { deleteAdminMessage, getAdminConversations, getAdminMessages } from "@/lib/messagesApi";
import { getConversations, getMessages, sendMessage } from "@/lib/messagesApi";
import type { ChatMessage, Conversation } from "@/types/message";

type Role = "customer" | "service_provider" | "admin";
type Props = { role: Role };

export default function MessagesDashboard({ role }: Props) {
  const params = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  async function loadConversations() {
    try {
      const data = role === "admin" ? await getAdminConversations() : await getConversations();
      setConversations(data);
      setSelected((current) => pickConversation(data, current?.id, Number(params.get("conversation"))));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Messages failed to load.");
    }
  }

  async function loadMessages(id: number) {
    const data = role === "admin" ? await getAdminMessages(id) : await getMessages(id);
    setMessages(data);
  }

  async function handleSend(message: string) {
    if (!selected) return;
    await sendMessage(selected.id, message);
    await loadMessages(selected.id);
    await loadConversations();
  }

  async function handleDelete(messageId: number) {
    if (!selected) return;
    await deleteAdminMessage(messageId);
    await loadMessages(selected.id);
  }

  useEffect(() => {
    loadConversations();
  }, [role]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected.id).catch(() => undefined);
    const timer = window.setInterval(() => loadMessages(selected.id).catch(() => undefined), 5000);
    return () => window.clearInterval(timer);
  }, [selected?.id]);

  return (
    <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {error && <p className="lg:col-span-2 text-sm font-semibold text-red-700">{error}</p>}
      <ChatSidebar
        conversations={conversations}
        selectedId={selected?.id}
        role={role}
        onOpen={setSelected}
      />
      <ChatWindow
        conversation={selected}
        messages={messages}
        canReply={role !== "admin"}
        canDelete={role === "admin"}
        onSend={handleSend}
        onDelete={handleDelete}
      />
    </section>
  );
}

function pickConversation(conversations: Conversation[], currentId?: number, queryId?: number) {
  return (
    conversations.find((item) => item.id === queryId) ||
    conversations.find((item) => item.id === currentId) ||
    conversations[0]
  );
}
