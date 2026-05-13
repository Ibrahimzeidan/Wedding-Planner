import ConversationCard from "@/components/messages/ConversationCard";
import type { Conversation } from "@/types/message";

type Props = {
  conversations: Conversation[];
  selectedId?: number;
  role: "customer" | "service_provider" | "admin";
  onOpen: (conversation: Conversation) => void;
};

export default function ChatSidebar({ conversations, selectedId, role, onOpen }: Props) {
  return (
    <aside className="space-y-2">
      {conversations.length ? (
        conversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            role={role}
            active={conversation.id === selectedId}
            onOpen={() => onOpen(conversation)}
          />
        ))
      ) : (
        <div className="border border-[#111111]/10 bg-white p-4 text-sm text-stone-600">
          No conversations yet.
        </div>
      )}
    </aside>
  );
}
