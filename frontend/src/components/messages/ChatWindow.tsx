import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import type { ChatMessage, Conversation } from "@/types/message";

type Props = {
  conversation?: Conversation;
  messages: ChatMessage[];
  canReply: boolean;
  canDelete?: boolean;
  onSend: (message: string) => void;
  onDelete?: (id: number) => void;
};

export default function ChatWindow({ conversation, messages, canReply, canDelete, onSend, onDelete }: Props) {
  const title = conversation?.provider_name || conversation?.customer_name || "Open Chat";

  if (!conversation) {
    return <section className="border border-[#111111]/10 bg-white p-6 text-sm text-stone-600">Open a chat.</section>;
  }

  return (
    <section className="flex min-h-[520px] flex-col border border-[#111111]/10 bg-white p-4 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-[#111111]">{title}</h2>
      <div className="flex-1 space-y-3 overflow-y-auto bg-white pb-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            canDelete={canDelete}
            onDelete={onDelete}
          />
        ))}
      </div>
      {canReply && <MessageInput onSend={onSend} />}
    </section>
  );
}
