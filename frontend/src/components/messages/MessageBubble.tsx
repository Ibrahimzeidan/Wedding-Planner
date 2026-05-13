import type { ChatMessage } from "@/types/message";

type Props = {
  message: ChatMessage;
  canDelete?: boolean;
  onDelete?: (id: number) => void;
};

export default function MessageBubble({ message, canDelete, onDelete }: Props) {
  const isCustomer = message.sender_role === "customer";

  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] p-3 text-sm ${isCustomer ? "bg-[#111111] text-white" : "bg-event-paper"}`}>
        <p className="text-xs font-semibold opacity-70">{message.sender_name || message.sender_role}</p>
        <p className="mt-1 leading-6">{message.message}</p>
        {canDelete && (
          <button onClick={() => onDelete?.(message.id)} className="mt-2 text-xs font-semibold underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
