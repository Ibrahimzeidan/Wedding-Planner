"use client";

import { useRouter } from "next/navigation";
import { startBookingConversation } from "@/lib/messagesApi";

type Props = {
  conversationId?: number | null;
  bookingId: number;
  role: "customer" | "provider";
};

export default function BookingMessageButton({ conversationId, bookingId, role }: Props) {
  const router = useRouter();

  async function openChat() {
    const conversation = conversationId ? { id: conversationId } : await startBookingConversation(bookingId);
    router.push(`/dashboard/${role}/messages?conversation=${conversation.id}`);
  }

  return (
    <button
      type="button"
      onClick={openChat}
      className="rounded-md border px-4 py-2 text-sm font-semibold"
    >
      {role === "customer" ? "Message Provider" : "Message Customer"}
    </button>
  );
}
