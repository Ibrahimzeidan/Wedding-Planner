import type { Conversation } from "@/types/message";

type Props = {
  conversation: Conversation;
  role: "customer" | "service_provider" | "admin";
  active: boolean;
  onOpen: () => void;
};

export default function ConversationCard({ conversation, role, active, onOpen }: Props) {
  const name = role === "customer" ? conversation.provider_name : conversation.customer_name;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full border p-3 text-left text-sm transition ${
        active ? "border-[#111111] bg-[#111111] text-white" : "border-[#111111]/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{name || "Conversation"}</span>
        {conversation.unread_count > 0 && <span className="text-xs">{conversation.unread_count}</span>}
      </div>
      <p className="mt-1 line-clamp-1 text-xs opacity-75">{conversation.last_message || "No messages yet"}</p>
    </button>
  );
}
