import type { ChatMessage as Message } from "@/types/ai";

type Props = {
  message: Message;
};

export default function AIMessage({ message }: Props) {
  const isUser = message.sender === "user";
  const bubble = isUser
    ? "ml-auto bg-[#111111] text-white"
    : "mr-auto border border-[#111111]/10 bg-event-paper text-stone-800";

  return (
    <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${bubble}`}>
      {message.message}
    </div>
  );
}
